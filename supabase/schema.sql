-- StudyPlan AI — run this in the Supabase SQL editor (Dashboard > SQL Editor > New query)

create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  title text not null,
  plan_json jsonb not null,
  created_at timestamptz default now() not null
);

alter table public.plans enable row level security;

create policy "Users can view their own plans"
  on public.plans for select
  using (auth.uid() = user_id);

create policy "Users can insert their own plans"
  on public.plans for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own plans"
  on public.plans for delete
  using (auth.uid() = user_id);
