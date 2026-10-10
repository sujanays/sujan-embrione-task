-- Embrione Member Platform Supabase Schema

-- 1. Create enum for member moderation status
create type member_status as enum ('pending', 'approved', 'rejected');

-- 2. Create members table
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  domain text not null,
  position text not null,
  srn text not null,
  email text not null,
  linkedin_url text,
  github_url text,
  branch text not null,
  semester int not null check (semester between 1 and 8),
  bio text not null check (char_length(bio) between 150 and 200),
  avatar_url text,
  status member_status not null default 'pending',
  created_at timestamptz default now()
);

-- 3. Create admins allow-list table
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- 4. Enable Row Level Security (RLS)
alter table members enable row level security;
alter table admins enable row level security;

-- 5. Members table policies
-- Public can read approved members only
create policy "read approved" on members
  for select
  using (status = 'approved');

-- Public can submit registration with status = 'pending' only
create policy "submit pending" on members
  for insert
  with check (status = 'pending');

-- Admins have full access (select, insert, update, delete)
create policy "admin all" on members
  for all
  using (exists (select 1 from admins a where a.user_id = auth.uid()))
  with check (exists (select 1 from admins a where a.user_id = auth.uid()));

-- 6. Admins table policy (allow authenticated users to read admins list)
create policy "admins read" on admins
  for select
  to authenticated
  using (true);

-- 7. Storage Bucket setup for profile pictures
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public can view/download avatars
create policy "avatars public select"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Anyone can upload .webp avatar with 5MB size limit
create policy "avatars anon insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' 
    and (storage.extension(name) = 'webp')
  );

-- Admins can update/delete avatars
create policy "avatars admin mutate"
  on storage.objects for all
  using (
    bucket_id = 'avatars'
    and exists (select 1 from admins a where a.user_id = auth.uid())
  );
