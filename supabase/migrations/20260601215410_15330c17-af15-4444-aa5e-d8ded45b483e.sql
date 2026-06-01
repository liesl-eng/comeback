-- Import runs: one row per brand per sync invocation
CREATE TABLE public.product_import_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ,
  fetched_count INTEGER NOT NULL DEFAULT 0,
  new_count INTEGER NOT NULL DEFAULT 0,
  changed_count INTEGER NOT NULL DEFAULT 0,
  removed_count INTEGER NOT NULL DEFAULT 0,
  unchanged_count INTEGER NOT NULL DEFAULT 0,
  skipped_missing_price INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  applied_at TIMESTAMPTZ,
  applied_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_import_runs_status_check CHECK (
    status IN ('pending_review','approved','rejected','applied','failed')
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_import_runs TO authenticated;
GRANT ALL ON public.product_import_runs TO service_role;

ALTER TABLE public.product_import_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view import runs"
  ON public.product_import_runs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update import runs"
  ON public.product_import_runs FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete import runs"
  ON public.product_import_runs FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_product_import_runs_brand_status
  ON public.product_import_runs (brand, status, started_at DESC);
CREATE INDEX idx_product_import_runs_status
  ON public.product_import_runs (status, started_at DESC);

CREATE TRIGGER product_import_runs_set_updated_at
  BEFORE UPDATE ON public.product_import_runs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Staging rows: products fetched in a run, with diff classification
CREATE TABLE public.product_import_staging (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID NOT NULL REFERENCES public.product_import_runs(id) ON DELETE CASCADE,
  diff_type TEXT NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT,
  image_url TEXT,
  image_filename TEXT,
  price NUMERIC,
  msrp NUMERIC,
  units_available INTEGER NOT NULL DEFAULT 0,
  source_last_updated TIMESTAMPTZ,
  previous_price NUMERIC,
  previous_msrp NUMERIC,
  previous_units_available INTEGER,
  previous_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT product_import_staging_diff_check CHECK (
    diff_type IN ('new','changed','removed','unchanged')
  )
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_import_staging TO authenticated;
GRANT ALL ON public.product_import_staging TO service_role;

ALTER TABLE public.product_import_staging ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view staging"
  ON public.product_import_staging FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can modify staging"
  ON public.product_import_staging FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_product_import_staging_run
  ON public.product_import_staging (run_id, diff_type);