-- 013 — The AI Readiness Map (map.envisioned.me)
--
-- The free self-running diagnostic writes here. Two tables, per the build spec
-- (03-OFFERS/The Integration Map/2026-08-19-map-diagnostic-spec.md §6):
-- one for sessions/transcripts, one for issued maps.
--
-- The transcript is the asset: a lead who has already itemised where their
-- business leaks is worth more than the artifact they walked away with. So the
-- session is the parent row and the map hangs off it — if artifact generation
-- ever changes, every map can be regenerated from what is kept here.
--
-- Written only by the Worker using the service role, which bypasses RLS. RLS is
-- enabled with NO permissive policy, so the anon key cannot read transcripts
-- even if it leaks. This is deliberate: these rows are the most sensitive
-- content in the project — a stranger's unguarded account of their own business.

create table if not exists public.map_sessions (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  transcript  text not null,
  turns       integer,
  lead_id     uuid references public.leads(id) on delete set null,
  created_at  timestamptz not null default now()
);

create table if not exists public.map_artifacts (
  id                     uuid primary key default gen_random_uuid(),
  session_id             uuid not null references public.map_sessions(id) on delete cascade,
  email                  text not null,
  map                    jsonb not null,
  markdown               text,
  memory_hours_per_week  numeric,
  stamps                 text[],
  created_at             timestamptz not null default now()
);

create index if not exists map_sessions_email_idx  on public.map_sessions (email);
create index if not exists map_sessions_created_idx on public.map_sessions (created_at desc);
create index if not exists map_artifacts_session_idx on public.map_artifacts (session_id);

alter table public.map_sessions  enable row level security;
alter table public.map_artifacts enable row level security;

-- No policies on purpose. Service role bypasses RLS; everyone else gets nothing.
