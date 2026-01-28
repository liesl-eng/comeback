-- Create pallet_items table to store inventory data from CSV uploads
CREATE TABLE public.pallet_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pallet_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  primary_image TEXT,
  category_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.pallet_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (since this is product catalog data)
CREATE POLICY "Anyone can view pallet items" 
ON public.pallet_items 
FOR SELECT 
USING (true);

-- Create index on pallet_id for faster lookups
CREATE INDEX idx_pallet_items_pallet_id ON public.pallet_items(pallet_id);