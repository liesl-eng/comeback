import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to parse CSV with quoted fields
function parseCSVLine(line: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  
  return parts;
}

// Helper function to parse price strings
function parsePrice(priceStr: string): number {
  if (!priceStr) return 0;
  return parseFloat(priceStr.replace(/[$,\s]/g, '')) || 0;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { csvData } = await req.json();
    
    if (!csvData) {
      return new Response(
        JSON.stringify({ error: 'No CSV data provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const lines = csvData.trim().split('\n');
    const items: any[] = [];
    
    // Skip header row
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parts = parseCSVLine(line);
      
      // CSV columns: Client Id, Bulk Recommerce Short Id (Pallet ID), Product SKU, Product Name, Original Price (MSRP), Primary Image, Category Name
      if (parts.length < 7) continue;
      
      const palletId = parts[1]; // Bulk Recommerce Short Id is the pallet ID
      const productSku = parts[2];
      const productName = parts[3];
      const originalPrice = parsePrice(parts[4]);
      const primaryImage = parts[5] || null;
      const categoryName = parts[6] || null;
      
      // Skip if essential fields are missing
      if (!palletId || !productSku || !productName || originalPrice === 0) continue;
      
      items.push({
        pallet_id: palletId,
        product_sku: productSku,
        product_name: productName,
        original_price: originalPrice,
        primary_image: primaryImage,
        category_name: categoryName,
      });
    }

    if (items.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid items found in CSV' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert in batches of 500
    const batchSize = 500;
    let insertedCount = 0;
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('pallet_items')
        .insert(batch);
      
      if (error) {
        console.error('Insert error:', error);
        return new Response(
          JSON.stringify({ error: `Insert failed: ${error.message}`, insertedSoFar: insertedCount }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      insertedCount += batch.length;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully imported ${insertedCount} items`,
        totalItems: insertedCount 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error: unknown) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
