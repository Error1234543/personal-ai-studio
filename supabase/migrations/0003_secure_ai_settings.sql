-- Phase 3: encrypted, server-only AI provider configuration.
-- The service-role key must remain in server environment variables only.
create table if not exists public.ai_provider_settings (
  id integer primary key check (id = 1),
  provider text not null,
  base_url text not null check (base_url like 'https://%'),
  model text not null,
  encrypted_api_key text not null,
  updated_at timestamptz not null default now()
);
alter table public.ai_provider_settings enable row level security;
revoke all on public.ai_provider_settings from anon, authenticated;
grant all on public.ai_provider_settings to service_role;
