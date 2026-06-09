
-- Products table: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated can delete products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated can update products" ON public.products;

CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Storage product-images bucket: restrict writes to admins
DROP POLICY IF EXISTS "Authenticated delete product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update product images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload product images" ON storage.objects;

CREATE POLICY "Admins delete product images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update product images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins upload product images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));
