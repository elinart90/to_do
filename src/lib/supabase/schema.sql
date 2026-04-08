-- ============================================================
-- POWER OS — Supabase Schema
-- Run this in your Supabase SQL editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  millionaire_goal bigint default 1000000,
  current_net_worth bigint default 0,
  discipline_score int default 0,
  longest_streak int default 0,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
create policy "Users can manage own profile" on public.profiles
  for all using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TASKS
-- ============================================================
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  priority text check (priority in ('critical', 'high', 'medium', 'low')) default 'medium',
  category text check (category in ('millionaire', 'class', 'health', 'hustle', 'personal')) default 'personal',
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  due_date date,
  completed_at timestamptz,
  is_recurring boolean default false,
  parent_task_id uuid references public.tasks(id),
  sort_order int default 0,
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;
create policy "Users can manage own tasks" on public.tasks
  for all using (auth.uid() = user_id);

create index tasks_user_id_idx on public.tasks(user_id);
create index tasks_due_date_idx on public.tasks(due_date);

-- ============================================================
-- GOALS (Millionaire Milestones)
-- ============================================================
create table public.goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  target_amount bigint,
  current_amount bigint default 0,
  target_date date,
  category text check (category in ('financial', 'skill', 'network', 'health', 'education')) default 'financial',
  status text check (status in ('active', 'completed', 'paused')) default 'active',
  created_at timestamptz default now()
);

alter table public.goals enable row level security;
create policy "Users can manage own goals" on public.goals
  for all using (auth.uid() = user_id);

-- ============================================================
-- HABITS
-- ============================================================
create table public.habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  description text,
  frequency text check (frequency in ('daily', 'weekdays', 'weekends', 'weekly')) default 'daily',
  category text check (category in ('morning', 'evening', 'anytime')) default 'anytime',
  current_streak int default 0,
  longest_streak int default 0,
  total_completions int default 0,
  color text default '#6366f1',
  icon text default '⚡',
  created_at timestamptz default now()
);

alter table public.habits enable row level security;
create policy "Users can manage own habits" on public.habits
  for all using (auth.uid() = user_id);

-- ============================================================
-- HABIT LOGS
-- ============================================================
create table public.habit_logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  completed_date date not null,
  created_at timestamptz default now(),
  unique(habit_id, completed_date)
);

alter table public.habit_logs enable row level security;
create policy "Users can manage own habit logs" on public.habit_logs
  for all using (auth.uid() = user_id);

-- ============================================================
-- ROUTINES
-- ============================================================
create table public.routines (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  type text check (type in ('morning', 'night')) not null,
  title text not null,
  duration_minutes int default 5,
  sort_order int default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.routines enable row level security;
create policy "Users can manage own routines" on public.routines
  for all using (auth.uid() = user_id);

-- ============================================================
-- ROUTINE LOGS
-- ============================================================
create table public.routine_logs (
  id uuid default uuid_generate_v4() primary key,
  routine_id uuid references public.routines on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  completed_date date not null,
  created_at timestamptz default now(),
  unique(routine_id, completed_date)
);

alter table public.routine_logs enable row level security;
create policy "Users can manage own routine logs" on public.routine_logs
  for all using (auth.uid() = user_id);

-- ============================================================
-- FOCUS SESSIONS (Pomodoro)
-- ============================================================
create table public.focus_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  task_id uuid references public.tasks(id),
  duration_minutes int not null,
  completed boolean default false,
  session_date date default current_date,
  created_at timestamptz default now()
);

alter table public.focus_sessions enable row level security;
create policy "Users can manage own focus sessions" on public.focus_sessions
  for all using (auth.uid() = user_id);

-- ============================================================
-- DEFAULT ROUTINES INSERT (called via app on first login)
-- ============================================================
-- Morning routine items (6am battle station)
-- Night routine items (before 2am wind-down)
-- These are seeded by the app on first login


-- ============================================================
-- PUSH SUBSCRIPTIONS (Web Push Notifications)
-- ============================================================
create table if not exists push_subscriptions (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references profiles(id) on delete cascade unique,
  subscription jsonb not null,
  updated_at  timestamp with time zone default now()
);

alter table push_subscriptions enable row level security;

create policy "Users manage own push subscription"
  on push_subscriptions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
