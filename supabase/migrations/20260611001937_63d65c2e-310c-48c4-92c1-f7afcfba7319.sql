CREATE OR REPLACE FUNCTION public.last_inventory_refreshed_at()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT MAX(applied_at) FROM public.product_import_runs WHERE status = 'applied';
$$;

GRANT EXECUTE ON FUNCTION public.last_inventory_refreshed_at() TO anon, authenticated;