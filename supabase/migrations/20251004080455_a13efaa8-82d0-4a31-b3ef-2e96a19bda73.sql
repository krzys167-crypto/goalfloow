-- Create enum for expense type
create type public.expense_type as enum ('expense', 'income');

-- Create enum for expense status
create type public.expense_status as enum ('logged', 'reviewed', 'pending');

-- Create enum for category type
create type public.category_type as enum ('system', 'custom');

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Create function to handle new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create categories table
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade,
  name text not null,
  icon text not null,
  budget_amount numeric(10,2),
  type category_type not null default 'custom',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Users can view their own categories and system categories"
  on public.categories for select
  using (auth.uid() = user_id or type = 'system');

create policy "Users can insert their own custom categories"
  on public.categories for insert
  with check (auth.uid() = user_id and type = 'custom');

create policy "Users can update their own custom categories"
  on public.categories for update
  using (auth.uid() = user_id and type = 'custom');

create policy "Users can delete their own custom categories"
  on public.categories for delete
  using (auth.uid() = user_id and type = 'custom');

-- Insert default system categories
insert into public.categories (name, icon, type, user_id) values
  ('Needs', '🏠', 'system', null),
  ('Wants', '🎯', 'system', null),
  ('Savings', '💰', 'system', null),
  ('Health', '💪', 'system', null),
  ('Food & Dining', '🍔', 'system', null),
  ('Transportation', '🚗', 'system', null),
  ('Entertainment', '🎮', 'system', null),
  ('Business', '💼', 'system', null);

-- Create goals table
create table public.goals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text not null default '🎯',
  description text,
  target_amount numeric(10,2),
  target_date date,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.goals enable row level security;

create policy "Users can view their own goals"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "Users can insert their own goals"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own goals"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "Users can delete their own goals"
  on public.goals for delete
  using (auth.uid() = user_id);

-- Create expenses table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  goal_id uuid references public.goals on delete set null,
  name text not null,
  amount numeric(10,2) not null,
  type expense_type not null default 'expense',
  category text not null,
  date date not null default current_date,
  notes text,
  status expense_status not null default 'logged',
  receipt_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.expenses enable row level security;

create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- Create budget_settings table
create table public.budget_settings (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null unique,
  monthly_budget numeric(10,2),
  category_budgets jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.budget_settings enable row level security;

create policy "Users can view their own budget settings"
  on public.budget_settings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own budget settings"
  on public.budget_settings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own budget settings"
  on public.budget_settings for update
  using (auth.uid() = user_id);

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Trigger for budget_settings updated_at
create trigger update_budget_settings_updated_at
  before update on public.budget_settings
  for each row execute procedure public.update_updated_at_column();