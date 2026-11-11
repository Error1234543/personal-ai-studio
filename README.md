# Personal AI Studio

A personal AI workspace for chatting with AI, managing projects, and building software with an AI coding assistant.

## Project goals

- AI chat with conversation history
- Long-term memory with user control
- Project and file management
- AI-assisted code creation and editing
- Code preview and safe testing
- GitHub integration with approval before pushing changes
- Vercel deployment with status monitoring

## Planned development phases

1. **Foundation:** Next.js, TypeScript, responsive UI, authentication, Supabase setup, and secure database policies.
2. **AI chat and memory:** provider settings, streaming chat, saved conversations, and memory controls.
3. **Projects and files:** project workspace, file management, and GitHub import.
4. **Coding agent:** planning, code tools, multi-file edits, and user approval.
5. **Editor and sandbox:** code editor, isolated execution, and live preview.
6. **Testing and fixes:** error reporting, diagnosis, and build verification.
7. **GitHub workflow:** repository connection, branches, diffs, commits, and approved pushes.
8. **Deployment:** Vercel deployment status, logs, and live URL.
9. **Hardening:** security, mobile usability, backups, and documentation.

## Safety and project rules

- Never commit API keys, passwords, tokens, or private user data.
- Keep secrets in environment variables, never in source files.
- Require user approval before pushing code or deploying.
- Use database Row Level Security (RLS) for private user data.
- Run generated code in an isolated environment with appropriate limits.
- Do not overwrite or delete project files without review.

## Planned technology

- Next.js and TypeScript
- Tailwind CSS
- Supabase Auth and Postgres
- Monaco Editor
- GitHub integration
- Vercel hosting

Technology choices may change after checking current free-tier limits and project requirements.

## Status

Project initialized. Phase 1 has not started yet.

## Development

See `.env.example` (when added) for the required environment variable names. Never publish real secret values.
