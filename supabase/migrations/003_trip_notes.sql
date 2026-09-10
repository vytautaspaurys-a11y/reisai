-- Administratoriaus pastabos prie reiso (neprivaloma).

alter table public.trips
  add column if not exists notes text;

comment on column public.trips.notes is 'Administratoriaus pastabos (neprivaloma)';
