-- Reisų registravimo sistema: pradinė duomenų bazės schema
--
-- Kaip paleisti (kitame žingsnyje):
-- 1. Atidaryk Supabase projektą
-- 2. Kairėje pasirink SQL Editor
-- 3. Nukopijuok visą šį failą, įklijuok ir spausk Run
--
-- Supabase naujose lentelėse RLS įjungia automatiškai.
-- Kol nėra taisyklių, forma nematytų automobilių ir vairuotojų.
-- Rašymo taisykles (tik admin) pridėsime 3.0 etape.

-- Automobiliai
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  plate_number text not null,
  make text not null,
  company text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint vehicles_plate_number_not_empty check (char_length(trim(plate_number)) > 0)
);

comment on table public.vehicles is 'Automobiliai';
comment on column public.vehicles.plate_number is 'Valstybinis numeris';
comment on column public.vehicles.make is 'Markė';
comment on column public.vehicles.company is 'Įmonė, kuriai priklauso';
comment on column public.vehicles.is_active is 'Ar rodomas vairuotojo sąraše';

-- Vairuotojai
create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint drivers_name_not_empty check (char_length(trim(name)) > 0)
);

comment on table public.drivers is 'Vairuotojai';
comment on column public.drivers.name is 'Vardas ir pavardė';
comment on column public.drivers.is_active is 'Ar rodomas vairuotojo sąraše';

-- Reisai
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  trip_number text not null,
  driver_id uuid not null references public.drivers (id) on delete restrict,
  vehicle_id uuid not null references public.vehicles (id) on delete restrict,
  trip_date date not null,
  created_at timestamptz not null default now(),
  constraint trips_trip_number_unique unique (trip_number),
  constraint trips_trip_number_not_empty check (char_length(trim(trip_number)) > 0)
);

comment on table public.trips is 'Reisai';
comment on column public.trips.trip_number is 'Automatiškai sugeneruotas numeris, pvz. 2026090801';
comment on column public.trips.trip_date is 'Reiso data';

-- Sąskaitos (kiekvienas invoice_number unikalus visoje sistemoje)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips (id) on delete cascade,
  invoice_number text not null,
  created_at timestamptz not null default now(),
  constraint invoices_invoice_number_unique unique (invoice_number),
  constraint invoices_invoice_number_not_empty check (char_length(trim(invoice_number)) > 0)
);

comment on table public.invoices is 'Sąskaitų numeriai, susieti su reisais';
comment on column public.invoices.invoice_number is 'Sąskaitos numeris (unikalus visoje sistemoje)';

-- Indeksai greitesnei paieškai, filtravimui ir susiejimui
alter table public.vehicles enable row level security;
alter table public.drivers enable row level security;
alter table public.trips enable row level security;
alter table public.invoices enable row level security;

create policy vehicles_public_read
  on public.vehicles
  for select
  to anon, authenticated
  using (true);

create policy drivers_public_read
  on public.drivers
  for select
  to anon, authenticated
  using (true);

create index if not exists trips_trip_date_idx on public.trips (trip_date desc);
create index if not exists trips_driver_id_idx on public.trips (driver_id);
create index if not exists trips_vehicle_id_idx on public.trips (vehicle_id);
create index if not exists invoices_trip_id_idx on public.invoices (trip_id);

-- Reisą ir sąskaitas įrašo vienu kartu, kad vairuotojui nereikėtų skaityti visų reisų
create or replace function public.create_trip(
  p_driver_id uuid,
  p_vehicle_id uuid,
  p_trip_date date,
  p_invoice_numbers text[]
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sequence integer;
  v_trip_number text;
  v_trip_id uuid;
  v_duplicate text;
begin
  if p_invoice_numbers is null or coalesce(array_length(p_invoice_numbers, 1), 0) = 0 then
    raise exception 'Pridėkite bent vieną sąskaitą.';
  end if;

  if exists (
    select 1
    from unnest(p_invoice_numbers) as invoice_number
    group by trim(invoice_number)
    having count(*) > 1
  ) then
    raise exception 'Ta pati sąskaita pridėta daugiau nei vieną kartą.';
  end if;

  select invoice_number
  into v_duplicate
  from public.invoices
  where invoice_number in (
    select trim(invoice_number) from unnest(p_invoice_numbers) as invoice_number
  )
  limit 1;

  if v_duplicate is not null then
    raise exception 'Sąskaitos numeris % jau buvo naudotas kitame reise.', v_duplicate;
  end if;

  select count(*) + 1
  into v_sequence
  from public.trips
  where trip_date = p_trip_date;

  loop
    if v_sequence > 99 then
      raise exception 'Šiai dienai jau užregistruota 99 reisai.';
    end if;

    v_trip_number := to_char(p_trip_date, 'YYYYMMDD') || lpad(v_sequence::text, 2, '0');

    begin
      insert into public.trips (trip_number, driver_id, vehicle_id, trip_date)
      values (v_trip_number, p_driver_id, p_vehicle_id, p_trip_date)
      returning id into v_trip_id;
      exit;
    exception
      when unique_violation then
        v_sequence := v_sequence + 1;
    end;
  end loop;

  insert into public.invoices (trip_id, invoice_number)
  select v_trip_id, trim(invoice_number)
  from unnest(p_invoice_numbers) as invoice_number;

  return v_trip_number;
end;
$$;

revoke all on function public.create_trip(uuid, uuid, date, text[]) from public;
grant execute on function public.create_trip(uuid, uuid, date, text[]) to anon, authenticated;
