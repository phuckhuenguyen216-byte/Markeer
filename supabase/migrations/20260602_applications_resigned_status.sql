-- Allow tracking employees who have left after being accepted.

ALTER TABLE public.applications
  DROP CONSTRAINT IF EXISTS applications_status_check;

ALTER TABLE public.applications
  ADD CONSTRAINT applications_status_check
  CHECK (status IN ('new', 'reviewing', 'interviewed', 'accepted', 'rejected', 'resigned'));
