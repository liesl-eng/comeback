
UPDATE public.products
SET price = ROUND((msrp * 0.45)::numeric, 2)
WHERE msrp IS NOT NULL AND price IS NOT NULL AND (msrp * 0.45) > price;

UPDATE public.products
SET price = ROUND((price * 1.20)::numeric, 2)
WHERE msrp IS NOT NULL AND price IS NOT NULL AND (msrp * 0.45) <= price;
