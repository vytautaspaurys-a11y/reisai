-- Vairuotojams pridedamas įmonės stulpelis, kaip automobilių lentelėje.

alter table public.drivers
  add column if not exists company text not null default '';

comment on column public.drivers.company is 'Įmonė, kuriai priklauso vairuotojas';
