-- Create pallets table for pallet-level metadata
CREATE TABLE public.pallets (
  pallet_id TEXT PRIMARY KEY,
  brand TEXT NOT NULL,
  total_cost NUMERIC NOT NULL
);

-- Enable RLS
ALTER TABLE public.pallets ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read
CREATE POLICY "Anyone can view pallets" ON public.pallets FOR SELECT USING (true);

-- Insert cost data from CSV
INSERT INTO public.pallets (pallet_id, brand, total_cost) VALUES
  ('BR-B326246J', 'Karat Home', 19000.00),
  ('BR-5PVR7VR9', 'Karat Home', 17000.00),
  ('BR-5WNHJPLX', 'Karat Home', 17000.00),
  ('BR-89E2TCAZ', 'Karat Home', 10000.00),
  ('BR-DS9J3P2L', 'inspired_home', 7285.60),
  ('BR-92Y9GU4C', 'modus_furniture', 30064.10),
  ('BR-DECP55XH', 'westin_outdoor', 13380.00),
  ('BR-7P6B6CA5', 'westin_outdoor', 10500.00),
  ('BR-DLR97C8X', 'westin_outdoor', 11018.24),
  ('BR-8788F6FJ', 'westin_outdoor', 10778.43),
  ('BR-3XH9EJGG', 'westin_outdoor', 13331.65),
  ('BR-8LJ6749Y', 'westin_outdoor', 9883.02),
  ('BR-A46SXP42', 'westin_outdoor', 9494.54),
  ('BR-344NWBEY', 'westin_outdoor', 9329.16);

-- Update pallet_summary view to include cost
DROP VIEW IF EXISTS public.pallet_summary;

CREATE VIEW public.pallet_summary
WITH (security_invoker=on) AS
SELECT 
  pi.pallet_id,
  COUNT(*)::integer as item_count,
  SUM(pi.original_price) as total_msrp,
  p.total_cost,
  p.brand,
  (SELECT primary_image FROM pallet_items pi2 WHERE pi2.pallet_id = pi.pallet_id AND primary_image IS NOT NULL LIMIT 1) as sample_image,
  (SELECT category_name FROM pallet_items pi3 WHERE pi3.pallet_id = pi.pallet_id LIMIT 1) as sample_category
FROM pallet_items pi
LEFT JOIN pallets p ON pi.pallet_id = p.pallet_id
GROUP BY pi.pallet_id, p.total_cost, p.brand
ORDER BY pi.pallet_id;