-- Drop and recreate the pallet_summary view with security_invoker
DROP VIEW IF EXISTS public.pallet_summary;

CREATE VIEW public.pallet_summary 
WITH (security_invoker = true)
AS
SELECT 
  p.pallet_id,
  COUNT(pi.id)::integer AS item_count,
  SUM(pi.original_price) AS total_msrp,
  p.total_cost,
  p.brand,
  (
    SELECT CASE 
      WHEN pi2.primary_image LIKE 'http://%' 
      THEN REPLACE(pi2.primary_image, 'http://', 'https://')
      ELSE pi2.primary_image 
    END
    FROM public.pallet_items pi2 
    WHERE pi2.pallet_id = p.pallet_id 
      AND pi2.primary_image IS NOT NULL 
      AND pi2.primary_image != ''
    LIMIT 1
  ) AS sample_image,
  (
    SELECT pi3.category_name 
    FROM public.pallet_items pi3 
    WHERE pi3.pallet_id = p.pallet_id 
      AND pi3.category_name IS NOT NULL 
    LIMIT 1
  ) AS sample_category
FROM public.pallets p
LEFT JOIN public.pallet_items pi ON p.pallet_id = pi.pallet_id
GROUP BY p.pallet_id, p.total_cost, p.brand;