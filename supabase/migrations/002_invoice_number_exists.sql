-- Tikrina, ar sąskaitos numeris jau naudotas, neparodant visų sąskaitų vairuotojui.

create or replace function public.invoice_number_exists(p_invoice_number text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.invoices
    where invoice_number = trim(p_invoice_number)
  );
$$;

revoke all on function public.invoice_number_exists(text) from public;
grant execute on function public.invoice_number_exists(text) to anon, authenticated;
