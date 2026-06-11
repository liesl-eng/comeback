
-- Access codes table for buyer access approval
CREATE TABLE public.access_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  assigned_to_email text,
  status text NOT NULL DEFAULT 'unused' CHECK (status IN ('unused','used','revoked')),
  used_by_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_access_codes_used_by ON public.access_codes(used_by_user_id);
CREATE INDEX idx_access_codes_code ON public.access_codes(code);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.access_codes TO authenticated;
GRANT ALL ON public.access_codes TO service_role;

ALTER TABLE public.access_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage all codes
CREATE POLICY "Admins manage access codes"
  ON public.access_codes FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Authenticated users can read codes by exact code value (used for redemption lookup).
-- The redemption flow updates a row by code; allow update when code is currently unused.
CREATE POLICY "Users can read own redeemed code"
  ON public.access_codes FOR SELECT
  TO authenticated
  USING (used_by_user_id = auth.uid());

CREATE POLICY "Users can redeem an unused code"
  ON public.access_codes FOR UPDATE
  TO authenticated
  USING (status = 'unused' OR used_by_user_id = auth.uid())
  WITH CHECK (used_by_user_id = auth.uid());

CREATE TRIGGER trg_access_codes_updated_at
  BEFORE UPDATE ON public.access_codes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Security definer function for checking approval (avoids RLS recursion / lookup races)
CREATE OR REPLACE FUNCTION public.is_approved(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.access_codes
    WHERE used_by_user_id = _user_id AND status = 'used'
  );
$$;

-- Redemption RPC: atomically claim an unused code for the current user
CREATE OR REPLACE FUNCTION public.redeem_access_code(_code text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_rows int;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- If user already has an approved code, treat as success
  IF EXISTS (SELECT 1 FROM public.access_codes WHERE used_by_user_id = v_uid AND status = 'used') THEN
    RETURN true;
  END IF;

  UPDATE public.access_codes
     SET status = 'used',
         used_by_user_id = v_uid,
         used_at = now()
   WHERE upper(code) = upper(_code)
     AND status = 'unused';

  GET DIAGNOSTICS v_rows = ROW_COUNT;
  RETURN v_rows > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION public.is_approved(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.redeem_access_code(text) TO authenticated;
