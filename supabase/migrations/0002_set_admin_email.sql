-- Set the allowlisted admin email (must match ADMIN_EMAIL in .env).
create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'ashiqur.shohan@gmail.com';
$$;
