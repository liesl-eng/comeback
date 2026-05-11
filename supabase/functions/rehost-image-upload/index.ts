// Accepts an image payload (binary body) plus product id + filename via headers,
// uploads to the public `product-images` bucket and updates the product row.
// Used to rehost images that block Edge Function IPs but work from other clients.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  // Shared-secret guard (set via env): only callers with the right token can rehost.
  const expected = Deno.env.get("REHOST_TOKEN");
  if (!expected || req.headers.get("x-rehost-token") !== expected) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const id = req.headers.get("x-product-id");
  const filename = req.headers.get("x-filename");
  const contentType = req.headers.get("x-content-type") ?? "image/jpeg";
  if (!id || !filename) {
    return new Response(JSON.stringify({ error: "missing headers" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const path = `mercana-rehost/${filename}`;
  const buf = new Uint8Array(await req.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from("product-images")
    .upload(path, buf, { contentType, upsert: true });
  if (upErr) {
    return new Response(JSON.stringify({ error: upErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);

  const { error: updErr } = await supabase
    .from("products")
    .update({ image_url: pub.publicUrl })
    .eq("id", id);
  if (updErr) {
    return new Response(JSON.stringify({ error: updErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, url: pub.publicUrl }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
