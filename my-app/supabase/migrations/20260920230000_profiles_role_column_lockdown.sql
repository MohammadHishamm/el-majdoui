-- Stop staff users from changing their own role.
--
-- Found by the production authorization test on 2026-09-20: a signed-in
-- content_editor could PATCH profiles.role on their own row and become
-- super_admin. Two things combined to allow it:
--   * the UPDATE policy "users update own profile name" permits updating the
--     whole row where id = auth.uid(), with no column restriction, and
--   * the `authenticated` role held a table-wide UPDATE grant, `role` included.
--
-- A column-level REVOKE is ignored while a table-wide grant exists, so the
-- table-wide UPDATE is removed and only the columns a user may edit on their
-- own row are granted back. Role changes in the admin UI go through the
-- service role (app/admin/dashboard/users/actions.ts), which is unaffected.

revoke update on public.profiles from authenticated, anon;
grant update (full_name, updated_at) on public.profiles to authenticated;
