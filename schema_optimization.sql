-- Optimize basic Profile RLS
drop policy "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile."
  on profiles for insert
  with check ( (select auth.uid()) = id );

drop policy "Users can update own profile." on public.profiles;
create policy "Users can update own profile."
  on profiles for update
  using ( (select auth.uid()) = id );

-- Optimize Wishlist Items RLS
drop policy "Users can insert their own wishlist items." on public.wishlist_items;
create policy "Users can insert their own wishlist items."
  on wishlist_items for insert
  with check ( (select auth.uid()) = user_id );

drop policy "Users can update their own wishlist items." on public.wishlist_items;
create policy "Users can update their own wishlist items."
  on wishlist_items for update
  using ( (select auth.uid()) = user_id );

drop policy "Users can delete their own wishlist items." on public.wishlist_items;
create policy "Users can delete their own wishlist items."
  on wishlist_items for delete
  using ( (select auth.uid()) = user_id );

-- Optimize Friendships RLS
drop policy "Users can view their own friendships." on public.friendships;
create policy "Users can view their own friendships."
    on friendships for select
    using ( (select auth.uid()) = user_id or (select auth.uid()) = friend_id );


drop policy "Users can create friendships." on public.friendships;
create policy "Users can create friendships."
    on friendships for insert
    with check ( (select auth.uid()) = user_id );
