-- Drop existing permissive policies on pallet_items
DROP POLICY IF EXISTS "Anyone can view pallet items" ON public.pallet_items;
DROP POLICY IF EXISTS "Service role can insert pallet items" ON public.pallet_items;

-- Create new restrictive policies for authenticated users only
CREATE POLICY "Authenticated users can view pallet items" 
ON public.pallet_items 
FOR SELECT 
TO authenticated
USING (true);

-- Service role insert policy (for admin imports)
CREATE POLICY "Service role can insert pallet items" 
ON public.pallet_items 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Drop existing policy on pallets table
DROP POLICY IF EXISTS "Anyone can view pallets" ON public.pallets;

-- Create new restrictive policy for authenticated users only
CREATE POLICY "Authenticated users can view pallets" 
ON public.pallets 
FOR SELECT 
TO authenticated
USING (true);