-- Add RLS policy for admin insert (using service role key)
CREATE POLICY "Service role can insert pallet items"
ON public.pallet_items
FOR INSERT
WITH CHECK (true);