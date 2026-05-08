
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Authenticated can insert products" ON public.products
FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update products" ON public.products
FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete products" ON public.products
FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;

CREATE POLICY "Authenticated upload product images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Authenticated update product images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated delete product images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images');
