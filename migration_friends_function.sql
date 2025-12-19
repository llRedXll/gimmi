-- 1. Create table only if it doesn't exist
create table if not exists public.friendships (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  friend_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'ACCEPTED' check (status in ('PENDING', 'ACCEPTED')),
  
  constraint unique_friendship unique (user_id, friend_id),
  constraint no_self_friend check (user_id != friend_id)
);

-- 2. Enable RLS (safe to re-run)
alter table public.friendships enable row level security;

-- 3. Create policies (DO block to avoid "policy already exists" error)
do $$
begin
    if not exists (select 1 from pg_policies where policyname = 'Users can view their own friendships.' and tablename = 'friendships') then
        create policy "Users can view their own friendships."
            on friendships for select
            using ( auth.uid() = user_id or auth.uid() = friend_id );
    end if;

    if not exists (select 1 from pg_policies where policyname = 'Users can create friendships.' and tablename = 'friendships') then
        create policy "Users can create friendships."
            on friendships for insert
            with check ( auth.uid() = user_id );
    end if;
end
$$;

-- 4. Create or Replace the helper function (Always safe to run)
create or replace function public.add_friend_by_username(friend_username text)
returns json
language plpgsql
security definer
as $$
declare
  target_user_id uuid;
  friendship_id uuid;
begin
  -- Find the user by username
  select id into target_user_id
  from public.profiles
  where username = friend_username
  limit 1;

  if target_user_id is null then
    return json_build_object('success', false, 'message', 'User not found');
  end if;

  if target_user_id = auth.uid() then
    return json_build_object('success', false, 'message', 'You cannot add yourself');
  end if;

  -- Insert friendship (Directly ACCEPTED for MVP)
  insert into public.friendships (user_id, friend_id, status)
  values (auth.uid(), target_user_id, 'ACCEPTED')
  returning id into friendship_id;

  return json_build_object('success', true, 'friend_id', target_user_id, 'message', 'Friend added successfully');

exception 
  when unique_violation then
    return json_build_object('success', false, 'message', 'You are already friends with this user');
  when others then
    return json_build_object('success', false, 'message', SQLERRM);
end;
$$;
