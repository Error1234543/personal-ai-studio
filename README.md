# Personal AI Studio

A mobile-first personal AI development workspace. The repository is public; never commit credentials, tokens, private data, or `.env.local`.

## AI Chat configuration

### Vercel Environment Variables

Add these in Vercel Project → Settings → Environment Variables. Mark `AI_API_KEY` as **Sensitive/Secret**. All variables must remain server-only; do not use a `NEXT_PUBLIC_` prefix.

- `AI_API_KEY` — provider API key (Secret)
- `AI_BASE_URL` — OpenAI-compatible API base URL, e.g. `https://api.openai.com/v1`
- `AI_PROVIDER` — display label, e.g. `OpenAI-compatible`

The model is not an environment variable. An authorized administrator changes it from Dashboard → AI Settings.

After changing Vercel environment variables, create a new deployment for the changes to take effect.

### Supabase setup

Run migrations in order if not already applied:
1. `0001_phase1_foundation.sql`
2. `0002_projects_and_chat_history.sql`
3. `0003_secure_ai_settings.sql`
4. `0004_model_only_admin_setting.sql`

Set the intended administrator's trusted `app_metadata.role` claim to `admin` (never use user-editable `user_metadata`). Example SQL:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'ADMIN_EMAIL';
```

Then sign out and sign in again. Supabase stores only the model identifier; provider API credentials remain in Vercel environment variables and are read only by server code.

## Run locally

1. Install Node.js 20.9+ in a supported development environment.
2. Copy `.env.example` to `.env.local`.
3. Set the Supabase public URL and anon/publishable key, plus the three server-only AI environment variables above.
4. Install dependencies and run `npm run dev`.

## Security and release

- AI API keys are never sent to browser code or responses.
- Only trusted admins can change the model; signed-in users can read the model identifier for chat requests.
- Chat requests verify authentication and conversation ownership. Existing user-specific RLS protects chat history and projects.
- Do not commit secrets. Do not deploy until lint and build checks pass.
- GitHub integration is a later phase.
