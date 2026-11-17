-- Phase 2: private project and conversation persistence
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  title text not null default 'New chat' check (char_length(title) between 1 and 160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null check (char_length(content) <= 100000),
  created_at timestamptz not null default now()
);

create index if not exists conversations_owner_updated_idx
  on public.conversations(owner_id, updated_at desc);
create index if not exists messages_conversation_created_idx
  on public.messages(conversation_id, created_at asc);

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

drop policy if exists "Users manage own conversations" on public.conversations;
create policy "Users manage own conversations" on public.conversations
  for all to authenticated using (auth.uid() = owner_id)
  with check (
    auth.uid() = owner_id and
    (project_id is null or exists (
      select 1 from public.projects p
      where p.id = project_id and p.owner_id = auth.uid()
    ))
  );

drop policy if exists "Users manage own messages" on public.messages;
create policy "Users manage own messages" on public.messages
  for all to authenticated using (
    auth.uid() = owner_id and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.owner_id = auth.uid()
    )
  )
  with check (
    auth.uid() = owner_id and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and c.owner_id = auth.uid()
    )
  );

create or replace function public.touch_conversation_updated_at()
returns trigger language plpgsql set search_path = ''
as $$
begin
  update public.conversations set updated_at = now() where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists on_message_created on public.messages;
create trigger on_message_created
  after insert on public.messages
  for each row execute procedure public.touch_conversation_updated_at();
