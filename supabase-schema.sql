-- ============================================================
-- FOOD RECIPES - SUPABASE SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. PROFILES TABLE (stores role per user)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    'user'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. RECIPES TABLE
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  ingredients text not null,
  description text not null,
  image_url text,
  image_path text,
  famous_restaurant text,
  avg_price text,
  zomato_link text,
  swiggy_link text,
  blinkit_link text,
  zepto_link text,
  instamart_link text,
  created_at timestamptz default now()
);


-- 3. FAVOURITES TABLE
create table public.favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  recipe_id uuid references public.recipes on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, recipe_id)
);


-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.recipes enable row level security;
alter table public.favourites enable row level security;

-- PROFILES: users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);


-- RECIPES: anyone logged in can read
create policy "Authenticated users can read recipes"
  on public.recipes for select
  to authenticated
  using (true);

-- Only admins can insert/update/delete recipes
create policy "Admins can insert recipes"
  on public.recipes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update recipes"
  on public.recipes for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can delete recipes"
  on public.recipes for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- FAVOURITES: users manage their own
create policy "Users can read own favourites"
  on public.favourites for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own favourites"
  on public.favourites for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete own favourites"
  on public.favourites for delete
  to authenticated
  using (auth.uid() = user_id);


-- ============================================================
-- STORAGE BUCKET FOR RECIPE IMAGES
-- ============================================================
-- Run this in SQL Editor too:

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true);

-- Allow authenticated users to upload
create policy "Authenticated users can upload images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'recipe-images');

-- Allow public read
create policy "Public can view images"
  on storage.objects for select
  using (bucket_id = 'recipe-images');

-- Allow admins to delete images
create policy "Authenticated users can delete images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'recipe-images');


-- ============================================================
-- MAKE A USER AN ADMIN
-- After registering your admin account, run:
-- (Replace the email with your admin's email)
-- ============================================================

-- update public.profiles
-- set role = 'admin'
-- where id = (
--   select id from auth.users where email = 'your-admin@email.com'
-- );
