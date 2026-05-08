-- Remove 20% markup from product prices and round per catalog convention
-- ($5 under $100, $10 between $100-$500, $25 over $500)
UPDATE public.products
SET price = CASE
  WHEN price IS NULL THEN NULL
  WHEN (price / 1.2) < 100 THEN GREATEST(5, ROUND((price / 1.2) / 5) * 5)
  WHEN (price / 1.2) <= 500 THEN ROUND((price / 1.2) / 10) * 10
  ELSE ROUND((price / 1.2) / 25) * 25
END
WHERE price IS NOT NULL;