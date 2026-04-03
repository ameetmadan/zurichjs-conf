-- Prevent new CFP submissions after close date unless inserted directly via SQL (no JWT context).

CREATE OR REPLACE FUNCTION public.block_closed_cfp_submission_creation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  close_at CONSTANT timestamptz := '2026-04-03T21:59:59Z'::timestamptz;
  jwt_role text := COALESCE(NULLIF(current_setting('request.jwt.claim.role', true), ''), '');
BEGIN
  IF now() < close_at THEN
    RETURN NEW;
  END IF;

  -- Allow manual SQL operations from Supabase SQL editor / direct SQL connections.
  IF jwt_role = '' THEN
    RETURN NEW;
  END IF;

  RAISE EXCEPTION 'CFP is closed. New submissions cannot be created.'
    USING ERRCODE = 'P0001';
END;
$$;

DROP TRIGGER IF EXISTS block_closed_cfp_submission_creation_trigger ON public.cfp_submissions;

CREATE TRIGGER block_closed_cfp_submission_creation_trigger
  BEFORE INSERT ON public.cfp_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.block_closed_cfp_submission_creation();

