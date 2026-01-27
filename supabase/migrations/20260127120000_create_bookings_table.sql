
create table public.bookings (
  id uuid not null default gen_random_uuid (),
  kindergarten_id text not null, -- Using text to match the static data IDs for now, or uuid if we were strictly relational
  user_id uuid references auth.users (id) on delete cascade not null,
  parent_name text not null,
  phone text not null,
  booking_date date not null,
  booking_time time not null,
  status text not null default 'pending', -- pending, confirmed, cancelled
  created_at timestamp with time zone not null default now(),
  constraint bookings_pkey primary key (id)
);

alter table public.bookings enable row level security;

create policy "Users can view their own bookings"
on public.bookings
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own bookings"
on public.bookings
for insert
to authenticated
with check (auth.uid() = user_id);
