-- Update pallet_summary view to prefer reliable image sources
-- Priority: storage.googleapis.com > salsify with full path > netsuite > other https
DROP VIEW IF EXISTS public.pallet_summary;

CREATE VIEW public.pallet_summary
WITH (security_invoker=on) AS
SELECT 
  pi.pallet_id,
  COUNT(*)::integer as item_count,
  SUM(pi.original_price) as total_msrp,
  p.total_cost,
  p.brand,
  COALESCE(
    -- First priority: Google Cloud Storage images (most reliable)
    (SELECT primary_image FROM pallet_items pi2 
     WHERE pi2.pallet_id = pi.pallet_id 
     AND primary_image LIKE 'https://storage.googleapis.com/%'
     LIMIT 1),
    -- Second priority: Salsify images with full paths (not the broken short ones)
    (SELECT primary_image FROM pallet_items pi3 
     WHERE pi3.pallet_id = pi.pallet_id 
     AND primary_image LIKE 'https://images.salsify.com/images/%'
     LIMIT 1),
    -- Third priority: NetSuite images
    (SELECT primary_image FROM pallet_items pi4 
     WHERE pi4.pallet_id = pi.pallet_id 
     AND primary_image LIKE 'https://%netsuite.com/%'
     LIMIT 1),
    -- Fourth priority: Any other HTTPS image that's not the broken salsify one
    (SELECT primary_image FROM pallet_items pi5 
     WHERE pi5.pallet_id = pi.pallet_id 
     AND primary_image LIKE 'https://%'
     AND primary_image NOT LIKE 'https://images.salsify.com/image/upload/s--%'
     LIMIT 1),
    -- Last resort: any HTTPS image
    (SELECT primary_image FROM pallet_items pi6 
     WHERE pi6.pallet_id = pi.pallet_id 
     AND primary_image LIKE 'https://%'
     LIMIT 1)
  ) as sample_image,
  (SELECT category_name FROM pallet_items pi7 WHERE pi7.pallet_id = pi.pallet_id LIMIT 1) as sample_category
FROM pallet_items pi
LEFT JOIN pallets p ON pi.pallet_id = p.pallet_id
GROUP BY pi.pallet_id, p.total_cost, p.brand
ORDER BY pi.pallet_id;