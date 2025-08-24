-- Extensions
create extension if not exists pgcrypto;

-- GIFTS
create table if not exists public.gifts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  status text not null default 'available' check (status in ('available','reserved','paid')),
  reserved_by_name text,
  reserved_by_email text,
  -- Optional per-gift Pix data (overrides global settings if present)
  pix_qr_url text,
  pix_link_url text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists gifts_touch on public.gifts;
create trigger gifts_touch before update on public.gifts for each row execute function public.touch_updated_at();

-- PHOTOS (carousel)
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

-- RSVPS
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  attending boolean not null,
  message text,
  created_at timestamptz not null default now()
);

-- SETTINGS (global site + global Pix defaults)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  location_address text,
  maps_embed_url text,
  cover_title text,
  cover_subtitle text,
  pix_qr_url text,
  pix_link_url text,
  pix_instructions text,  -- short text displayed near the QR/link
  created_at timestamptz not null default now()
);

-- RLS
alter table public.gifts enable row level security;
alter table public.photos enable row level security;
alter table public.rsvps enable row level security;
alter table public.site_settings enable row level security;

-- Public reads
create policy if not exists "Public read gifts" on public.gifts for select using (true);
create policy if not exists "Public read photos" on public.photos for select using (true);
create policy if not exists "Public read settings" on public.site_settings for select using (true);

-- Public RSVP insert + read (admin filters on server)
create policy if not exists "Public insert rsvps" on public.rsvps for insert with check (true);
create policy if not exists "Public read rsvps" on public.rsvps for select using (true);
