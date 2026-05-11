// Rehost Mercana product images that are blocked by hotlink protection
// when loaded from a browser. Downloads each image server-side and re-uploads
// it to the public `product-images` bucket, then updates the product row.
//
// Usage: POST with optional { limit?: number, dryRun?: boolean }.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let body: { limit?: number; dryRun?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // body optional
  }
  const limit = Math.max(1, Math.min(body.limit ?? 1000, 2000));
  const dryRun = !!body.dryRun;

  const { data: rows, error } = await supabase
    .from("products")
    .select("id, image_url")
    .eq("brand", "Mercana")
    .like("image_url", "%marketplace.mercana.com%")
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const results = { total: rows?.length ?? 0, ok: 0, failed: 0, errors: [] as string[] };
  if (dryRun || !rows) {
    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const folder = "mercana-rehost";

  for (const row of rows) {
    try {
      const url = row.image_url as string;
      const filename = url.split("/").pop()!.split("?")[0];
      const path = `${folder}/${filename}`;

      // Skip download if file already in bucket
      const { data: existing } = supabase.storage.from("product-images").getPublicUrl(path);
      let publicUrl = existing.publicUrl;
      const head = await fetch(publicUrl, { method: "HEAD" });
      if (!head.ok) {
        const res = await fetch(url, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": "https://marketplace.mercana.com/",
          },
        });
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const buf = new Uint8Array(await res.arrayBuffer());
        const contentType = res.headers.get("content-type") ?? "image/jpeg";
        const { error: upErr } = await supabase.storage
          .from("product-images")
          .upload(path, buf, { contentType, upsert: true });
        if (upErr) throw upErr;
      }

      const { error: updErr } = await supabase
        .from("products")
        .update({ image_url: publicUrl })
        .eq("id", row.id);
      if (updErr) throw updErr;
      results.ok++;
    } catch (e) {
      results.failed++;
      if (results.errors.length < 10) results.errors.push(`${row.id}: ${(e as Error).message}`);
    }
  }

  return new Response(JSON.stringify(results), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
