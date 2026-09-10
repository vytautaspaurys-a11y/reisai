-- Administratorius gali įrašyti pastabą ir išsaugoti reisą be sąskaitų.
-- Vairuotojas (be prisijungimo) vis dar privalo pridėti bent vieną sąskaitą.

drop function if exists public.create_trip(uuid, uuid, date, text[]);

create function public.create_trip(
  p_driver_id uuid,
  p_vehicle_id uuid,
  p_trip_date date,
  p_invoice_numbers text[],
  p_notes text default null
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
  v_invoice_count integer;
begin
  v_invoice_count := coalesce(array_length(p_invoice_numbers, 1), 0);

  if v_invoice_count = 0 and auth.uid() is null then
    raise exception 'Pridėkite bent vieną sąskaitą.';
  end if;

  if v_invoice_count > 0 then
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
      insert into public.trips (trip_number, driver_id, vehicle_id, trip_date, notes)
      values (
        v_trip_number,
        p_driver_id,
        p_vehicle_id,
        p_trip_date,
        nullif(btrim(coalesce(p_notes, '')), '')
      )
      returning id into v_trip_id;
      exit;
    exception
      when unique_violation then
        v_sequence := v_sequence + 1;
    end;
  end loop;

  if v_invoice_count > 0 then
    insert into public.invoices (trip_id, invoice_number)
    select v_trip_id, trim(invoice_number)
    from unnest(p_invoice_numbers) as invoice_number;
  end if;

  return v_trip_number;
end;
$$;

revoke all on function public.create_trip(uuid, uuid, date, text[], text) from public;
grant execute on function public.create_trip(uuid, uuid, date, text[], text) to anon, authenticated;
