-- Drop and recreate view with security_invoker to fix security warning
DROP VIEW IF EXISTS public.pallet_summary;

CREATE VIEW public.pallet_summary
WITH (security_invoker=on) AS
SELECT 
  pallet_id,
  COUNT(*)::integer as item_count,
  SUM(original_price) as total_msrp,
  (SELECT primary_image FROM pallet_items pi2 WHERE pi2.pallet_id = pallet_items.pallet_id AND primary_image IS NOT NULL LIMIT 1) as sample_image,
  (SELECT category_name FROM pallet_items pi3 WHERE pi3.pallet_id = pallet_items.pallet_id LIMIT 1) as sample_category
FROM pallet_items
GROUP BY pallet_id
ORDER BY pallet_id;