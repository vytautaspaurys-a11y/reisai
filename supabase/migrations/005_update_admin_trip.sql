-- Administratoriaus reiso taisymas: laukai ir sąskaitų sąrašas įrašomi vienu kartu.

create or replace function public.update_admin_trip(
  p_trip_id uuid,
  p_driver_id uuid,
  p_vehicle_id uuid,
  p_trip_date date,
  p_notes text,
  p_invoice_numbers text[]
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duplicate text;
begin
  if auth.uid() is null then
    raise exception 'Tik administratorius gali taisyti reisą.';
  end if;

  if not exists (select 1 from public.trips where id = p_trip_id) then
    raise exception 'Reisas nerastas.';
  end if;

  if exists (
    select 1
    from unnest(coalesce(p_invoice_numbers, '{}')) as invoice_number
    where trim(invoice_number) <> ''
    group by trim(invoice_number)
    having count(*) > 1
  ) then
    raise exception 'Ta pati sąskaita pridėta daugiau nei vieną kartą.';
  end if;

  select invoice_number
  into v_duplicate
  from public.invoices
  where trip_id <> p_trip_id
    and invoice_number in (
      select trim(invoice_number)
      from unnest(coalesce(p_invoice_numbers, '{}')) as invoice_number
      where trim(invoice_number) <> ''
    )
  limit 1;

  if v_duplicate is not null then
    raise exception 'Sąskaitos numeris % jau buvo naudotas kitame reise.', v_duplicate;
  end if;

  update public.trips
  set
    driver_id = p_driver_id,
    vehicle_id = p_vehicle_id,
    trip_date = p_trip_date,
    notes = nullif(btrim(coalesce(p_notes, '')), '')
  where id = p_trip_id;

  delete from public.invoices
  where trip_id = p_trip_id;

  insert into public.invoices (trip_id, invoice_number)
  select p_trip_id, trim(invoice_number)
  from unnest(coalesce(p_invoice_numbers, '{}')) as invoice_number
  where trim(invoice_number) <> '';
end;
$$;

revoke all on function public.update_admin_trip(uuid, uuid, uuid, date, text, text[]) from public;
grant execute on function public.update_admin_trip(uuid, uuid, uuid, date, text, text[]) to authenticated;
