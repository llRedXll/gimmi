

-- Create a table for public profiles (linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  birthday date,
  sizes jsonb default '[]'::jsonb,
  interests text[] default '{}',
  dislikes text[] default '{}',

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for wishlist items
create table public.wishlist_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  price_range text,
  priority text check (priority in ('Low', 'Medium', 'High')),
  status text default 'AVAILABLE' check (status in ('AVAILABLE', 'CLAIMED', 'PURCHASED')),
  claimed_by uuid references public.profiles(id),
  image_url text,
  link text,
  notes text
);

-- RLS for Wishlist Items
alter table public.wishlist_items enable row level security;

create policy "Wishlist items are viewable by everyone."
  on wishlist_items for select
  using ( true );

create policy "Users can insert their own wishlist items."
  on wishlist_items for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own wishlist items."
  on wishlist_items for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own wishlist items."
  on wishlist_items for delete
  using ( auth.uid() = user_id );

create policy "Anyone can claim an item (update status/claimed_by)"
  on wishlist_items for update
  using ( true )
  with check ( status in ('CLAIMED', 'AVAILABLE') );

-- Function to handle new user signup (Trigger)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create Storage Bucket for Images (optional, for later)
insert into storage.buckets (id, name)
values ('avatars', 'avatars')
on conflict do nothing;

create policy "Avatar images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'avatars' );

create policy "Anyone can upload an avatar."
  on storage.objects for insert
  with check ( bucket_id = 'avatars' );
