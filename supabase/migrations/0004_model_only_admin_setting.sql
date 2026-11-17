-- Provider credentials are now stored only in Vercel server environment variables.
-- The database stores only the active model identifier.
alter table public.ai_provider_settings
  drop column if exists encrypted_api_key,
  drop column if exists base_url,
  drop column if exists provider;

alter table public.ai_provider_settings
  alter column model set not null;

alter table public.ai_provider_settings enable row level security;

drop policy if exists "Authenticated users can read AI model" on public.ai_provider_settings;
drop policy if exists "Admins can manage AI model" on public.ai_provider_settings;

revoke all on public.ai_provider_settings from anon, authenticated;
grant select, insert, update on public.ai_provider_settings to authenticated;

create policy "Authenticated users can read AI model"
on public.ai_provider_settings
for select
to authenticated
using (true);

create policy "Admins can manage AI model"
on public.ai_provider_settings
for all
to authenticated
using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
