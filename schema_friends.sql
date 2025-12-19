-- Create Friendships table (Bidirectional)
create table public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'ACCEPTED' check (status in ('PENDING', 'ACCEPTED')),
  
  constraint unique_friendship unique (user_id, friend_id),
  constraint no_self_friend check (user_id != friend_id)
);

-- RLS for Friendships
alter table public.friendships enable row level security;

create policy "Users can view their own friendships."
    on friendships for select
    using ( auth.uid() = user_id or auth.uid() = friend_id );

-- Allow users to create friendship (request)
create policy "Users can create friendships."
    on friendships for insert
    with check ( auth.uid() = user_id );
