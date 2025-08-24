“Wedding Site (Next.js + Supabase + Resend, Pix via QR/Link — no Stripe)”
Role: You are a senior Next.js engineer generating a production-ready repo.
Goal: Build a wedding website with gift reservations, RSVP, photo carousel, and map, plus a minimal password-protected admin. No payment gateway. After starting a reservation, ask if the guest prefers Pix; if yes, show Pix QR/link and still mark the gift reserved. Always email guest + admin.

Tech / Constraints
Framework: Next.js 14+ (App Router, TypeScript).

Styling: Tailwind CSS (minimal, semantic).

Components: Headless/native; avoid heavy UI kits.

Data: Supabase (Postgres) with RLS; include SQL in /supabase/schema.sql.

Email: Resend.

Payments: None. Display Pix QR/link from DB (global or per-gift).

Images: Public URLs (e.g., Supabase Storage). No uploads in v1.

Carousel: embla-carousel-react.

Map: Google Maps <iframe>.

Deploy: Vercel. Include a README with exact setup steps.

Environment variables (document and reference, don’t hardcode)
makefile
Copy
Edit
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NEXT_PUBLIC_SITE_URL=   # e.g. https://mywedding.com
ADMIN_PASS=             # simple admin gate for now
File structure (generate)
bash
Copy
Edit
/README.md
/supabase/schema.sql                      # tables + RLS policies
/src/lib/supabase-client.ts
/src/lib/supabase-server.ts
/src/lib/email.ts
/src/components/Carousel.tsx
/src/components/MapEmbed.tsx
/src/components/GiftCard.tsx
/src/app/layout.tsx
/src/app/page.tsx                         # home: hero, carousel, map, CTAs
/src/app/gifts/page.tsx                   # gift list + 2-step reserve (Pix optional)
/src/app/rsvp/page.tsx                    # RSVP form
/src/app/admin/page.tsx                   # protected admin: CRUD gifts/photos/settings, view RSVPs
/src/app/api/reserve-gift/route.ts
/src/app/api/rsvp/route.ts
/src/app/api/admin-login/route.ts         # sets cookie if ADMIN_PASS matches
/src/middleware.ts                        # guards /admin
/tailwind.config.ts
/postcss.config.js
/next.config.mjs
/package.json
Database schema (put this exact SQL in /supabase/schema.sql)
sql
Copy
Edit
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
Core libs (generate implementations)
supabase-client.ts → anon client.

supabase-server.ts → service-role client (no session persistence).

email.ts → Resend helpers:

sendGiftReservedEmail(to, giftName, opts?: { pixLink?: string; pixQrUrl?: string; instructions?: string })

notifyOwner(subject, html)

Middleware (simple admin gate)
POST /api/admin-login { password } → set secure httpOnly admin=1 cookie if matches ADMIN_PASS.

middleware.ts → protect /admin; if no cookie, render login UI in /admin/page.tsx.

Reservation UX (must implement exactly)
For each available gift:

Show “Reservar” button.

On click, reveal:

Inputs: Nome, E-mail (required).

A “Confirmar” button.

Text “Prefere doar via Pix?” and a “Sim, via Pix” button.

If guest clicks “Sim, via Pix”:

Reserve the gift (atomic write) and immediately display Pix QR/link section:

Use gift.pix_qr_url/pix_link_url if present; otherwise fall back to site_settings.pix_qr_url/pix_link_url and pix_instructions.

Send email to guest with gift name + Pix info; send email to admin: “{name} ({email}) reservou {gift} (via Pix)”.

If guest clicks “Confirmar” (no Pix):

Reserve the gift (atomic write) and show success message.

Send email to guest (reservation details) and email to admin: “{name} ({email}) reservou {gift}”.

Non-available states:

reserved: badge “Reservado”.

paid: “Pago ✔”.

API routes (implement)
POST /api/reserve-gift
Input JSON: { giftId, name, email, viaPix?: boolean }

Logic:

Using supabaseServer (service role), atomically set:

status='reserved', reserved_by_name, reserved_by_email, updated_at=now()

only if current status='available' (use eq('status','available') in the update and select('*') to return the updated row).

Determine effective Pix data (gift-level first, else global).

Emails:

Guest: reservation confirmation; include Pix fields only if viaPix===true.

Admin: notify with “(via Pix)” suffix when applicable.

Response:

yaml
Copy
Edit
{ ok: true, state: 'reserved',
  gift: { id, name, status, reserved_by_name, reserved_by_email },
  pix: viaPix ? { qrUrl?, linkUrl?, instructions? } : null
}
If already reserved/not found → 409.

POST /api/rsvp
Input: { name, email, attending: boolean, message } → insert row in rsvps.

POST /api/admin-login
Input: { password } → set cookie if matches ADMIN_PASS.

Pages
/
Load site_settings: show cover_title, cover_subtitle.

Carousel from photos sorted by sort_order.

Map iframe from maps_embed_url.

Buttons to /gifts and /rsvp.

/gifts
Server component: list gifts.

Each gift renders a card with the two-step reservation UI above and, when viaPix selected, an inline Pix box (QR image if URL provided + link + instructions).

/rsvp
Simple form → POST /api/rsvp → thank-you state.

/admin
If not authenticated: login form (posts to /api/admin-login).

If authenticated:

Gifts: list/create/edit (name, desc, image_url, status, set/clear paid_at, per-gift pix_qr_url, pix_link_url).

Photos: list & edit image_url, caption, sort_order.

Settings: edit location_address, maps_embed_url, cover_title, cover_subtitle, pix_qr_url, pix_link_url, pix_instructions.

RSVPs: list recent rows.

Components
Carousel.tsx using embla-carousel-react (loop).

MapEmbed.tsx (rounded iframe).

GiftCard.tsx (presentation + two-step reserve controls; parent page handles API calls).

README (must include)
Create Supabase project → run /supabase/schema.sql.

Create Resend key and verified from domain → set RESEND_API_KEY.

Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.

Set ADMIN_PASS, NEXT_PUBLIC_SITE_URL (optional).

Local dev: npm i && npm run dev.

Deploy on Vercel; add env vars; connect domain.

How to configure Pix:

Global defaults in Site Settings (pix_qr_url, pix_link_url, pix_instructions).

Per-gift overrides in Gifts (pix_qr_url, pix_link_url).

How to mark a gift as Pago in Admin (set status='paid' and/or paid_at).

Deliver a single, runnable repo. No TODOs. Keep code small, clear, and production-ready.
