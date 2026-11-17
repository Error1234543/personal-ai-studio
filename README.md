# Personal AI Studio

A mobile-first personal AI development workspace. The repository is intentionally public; **never commit credentials, tokens, private data, or `.env.local`**.

## Phase 1 foundation
- Next.js App Router + TypeScript + Tailwind CSS
- Supabase email/password registration and login
- Google OAuth flow
- Server-side session lookup and protected dashboard
- Initial `profiles` and `projects` schema with Row Level Security
- Responsive landing, auth and dashboard screens

## Run locally
1. Install Node.js 20.9+ on a computer or use a supported cloud development environment.
2. Copy `.env.example` to `.env.local`.
3. Add your Supabase Project URL and publishable/anon key.
4. In Supabase SQL Editor, run `supabase/migrations/0001_phase1_foundation.sql`.
5. In Supabase Authentication settings, enable Email and Google providers and configure the callback URL: `http://localhost:3000/auth/callback` (also add your production callback later).
6. Install and run:

```bash
npm install
npm run dev
```

## Environment
Only these public browser-safe values are used:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Never add a Supabase service-role key to frontend code. Never commit `.env.local`.

## Current limitations
- Supabase credentials and Google OAuth provider credentials must be configured by the owner.
- Password reset, account deletion, profile editing and provider management are not implemented yet.
- AI chat, memory, coding agent, editor, terminal, GitHub write integration and Vercel deployment belong to later phases.
- Build and live auth cannot be truthfully verified until dependencies and valid Supabase settings are supplied.

## Branch and release safety
Work only on `phase-1-foundation`. Do not merge into `main`, push, or deploy without the owner's explicit approval.

## Secure AI chat setup (Phase 2)

1. Run `supabase/migrations/0003_secure_ai_settings.sql` in the Supabase SQL Editor.
2. In Supabase Auth, grant the intended administrator the trusted `app_metadata` claim `role=admin`. Do not use user-editable `user_metadata`. For example, from the SQL Editor, update only the intended account:
   `update auth.users set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb where email = 'ADMIN_EMAIL';`
   Then sign out and sign in again so the refreshed session contains the claim.
3. Add these server-only environment variables to the hosting environment and local `.env.local`: `SUPABASE_SERVICE_ROLE_KEY` and `AI_CONFIG_ENCRYPTION_KEY`. Generate the latter with `openssl rand -base64 32`. Never expose either variable with a `NEXT_PUBLIC_` prefix or commit real values.
4. Sign in as the administrator and open Dashboard → AI Settings. Save an HTTPS OpenAI-compatible API base URL, model, provider label and API key.
5. Create a conversation and send a test message.

The API key is encrypted with AES-256-GCM before storage. The encryption key and Supabase service-role key are used only by server code. The settings table denies direct access to anon/authenticated roles. The chat API verifies the signed-in user and conversation owner before reading or writing messages.

The app does not deploy itself. Run `npm run lint` and `npm run build` before any deployment.
