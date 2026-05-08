
UPDATE public.products SET category = 'Sofas' WHERE name ILIKE '%sectional%';
UPDATE public.products SET category = 'Beds' WHERE category = 'Large Furniture' AND (name ILIKE '%bed%' OR name ILIKE '%headboard%');
UPDATE public.products SET category = 'Small Furniture' WHERE category = 'Large Furniture';
