// Applies a previously-staged product import to the live `products` table.
// Caller must be an authenticated admin. The operation is "replace mode" for
// the run's brand: live rows for that brand are deleted, then non-removed
// staging rows are inserted.

import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface ApplyBody { run_id?: string; action?: "approve" | "reject" }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const token = authHeader.replace(/^Bearer\s+/i, "");
  const { data: claimsData, error: claimsErr } = await userClient.auth.getClaims(token);
  if (claimsErr || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const userId = claimsData.claims.sub as string;

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data: roleOk, error: roleErr } = await admin.rpc("has_role", {
    _user_id: userId, _role: "admin",
  });
  if (roleErr || !roleOk) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: ApplyBody;
  try { body = await req.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), {
    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }); }

  const runId = body.run_id;
  const action = body.action ?? "approve";
  if (!runId || (action !== "approve" && action !== "reject")) {
    return new Response(JSON.stringify({ error: "Missing run_id or invalid action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { data: run, error: runErr } = await admin
    .from("product_import_runs").select("*").eq("id", runId).single();
  if (runErr || !run) {
    return new Response(JSON.stringify({ error: "Run not found" }), {
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (action === "reject") {
    if (!["pending_review", "approved", "failed"].includes(run.status)) {
      return new Response(JSON.stringify({ error: `Cannot reject run in status ${run.status}` }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { error: updErr } = await admin.from("product_import_runs")
      .update({ status: "rejected", applied_by: userId }).eq("id", runId);
    if (updErr) return new Response(JSON.stringify({ error: updErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    return new Response(JSON.stringify({ ok: true, status: "rejected" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // approve & apply
  if (!["pending_review", "approved", "failed"].includes(run.status)) {
    return new Response(JSON.stringify({ error: `Cannot apply run in status ${run.status}` }), {
      status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Mark approved before applying so concurrent attempts see it
  await admin.from("product_import_runs")
    .update({ status: "approved", applied_by: userId }).eq("id", runId);

  try {
    // Pull all non-removed staging rows for this run
    const { data: stagingRows, error: stagingErr } = await admin
      .from("product_import_staging")
      .select("name, brand, category, image_url, image_filename, price, msrp, units_available, source_last_updated, diff_type")
      .eq("run_id", runId)
      .neq("diff_type", "removed");
    if (stagingErr) throw new Error(`staging load failed: ${stagingErr.message}`);

    // Wipe live rows for this brand
    const { error: delErr } = await admin
      .from("products").delete().eq("brand", run.brand);
    if (delErr) throw new Error(`delete failed: ${delErr.message}`);

    // Insert staging rows (chunked)
    const records = (stagingRows ?? []).map((r) => ({
      name: r.name,
      brand: r.brand,
      category: r.category,
      image_url: r.image_url,
      image_filename: r.image_filename,
      price: r.price,
      msrp: r.msrp,
      units_available: r.units_available ?? 0,
      source_last_updated: r.source_last_updated,
    }));

    let inserted = 0;
    const chunkSize = 200;
    for (let i = 0; i < records.length; i += chunkSize) {
      const chunk = records.slice(i, i + chunkSize);
      const { error } = await admin.from("products").insert(chunk);
      if (error) throw new Error(`insert failed: ${error.message}`);
      inserted += chunk.length;
    }

    await admin.from("product_import_runs").update({
      status: "applied",
      applied_at: new Date().toISOString(),
      applied_by: userId,
    }).eq("id", runId);

    return new Response(JSON.stringify({ ok: true, status: "applied", inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await admin.from("product_import_runs").update({
      status: "failed", error_message: msg,
    }).eq("id", runId);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
