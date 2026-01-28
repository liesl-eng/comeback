-- Recreate the pallet_summary view with security_invoker to inherit RLS from base tables
DROP VIEW IF EXISTS public.pallet_summary;

CREATE VIEW public.pallet_summary
WITH (security_invoker=on) AS
SELECT 
  pi.pallet_id,
  COUNT(*)::integer as item_count,
  SUM(pi.original_price) as total_msrp,
  p.total_cost,
  p.brand,
  (SELECT primary_image FROM pallet_items pi2 
   WHERE pi2.pallet_id = pi.pallet_id 
   AND primary_image IS NOT NULL 
   AND primary_image LIKE 'https://%'
   LIMIT 1) as sample_image,
  (SELECT category_name FROM pallet_items pi3 WHERE pi3.pallet_id = pi.pallet_id LIMIT 1) as sample_category
FROM pallet_items pi
LEFT JOIN pallets p ON pi.pallet_id = p.pallet_id
GROUP BY pi.pallet_id, p.total_cost, p.brand
ORDER BY pi.pallet_id;