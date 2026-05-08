ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS cost numeric,
  ADD COLUMN IF NOT EXISTS pricing_rule text;