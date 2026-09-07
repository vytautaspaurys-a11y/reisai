# Užduotys: Reisų registravimo sistema

PRD: docs/prd-reisai.md

## Failai

- `src/pages/TripFormPage.tsx` – vairuotojo reiso registravimo forma
- `src/pages/admin/LoginPage.tsx` – administratoriaus prisijungimas
- `src/pages/admin/AdminLayout.tsx` – admin navigacija (Automobiliai, Vairuotojai, Reisai)
- `src/pages/admin/VehiclesPage.tsx` – automobilių sąrašas ir forma
- `src/pages/admin/DriversPage.tsx` – vairuotojų sąrašas ir forma
- `src/pages/admin/TripsPage.tsx` – reisų sąrašas su filtrais ir eksportu
- `src/pages/admin/TripEditPage.tsx` – vieno reiso redagavimas
- `src/components/InvoiceList.tsx` – pridėtų sąskaitų sąrašas su pašalinimu
- `src/components/BarcodeScanner.tsx` – brūkšninio kodo skenavimas (kamera / skaneris)
- `src/components/TripSuccessMessage.tsx` – patvirtinimas po sėkmingo išsaugojimo
- `src/lib/supabase.ts` – Supabase klientas
- `src/lib/tripNumber.ts` – reiso numerio generavimo logika
- `src/lib/exportTrips.ts` – Excel ir CSV eksportas
- `src/types/database.ts` – TypeScript tipai lentelėms
- `src/hooks/useAuth.ts` – administratoriaus sesijos valdymas
- `src/App.tsx` – maršrutai (vairuotojo forma, admin sritis)
- `supabase/migrations/001_initial_schema.sql` – lentelių ir RLS SQL (įklijuosi į Supabase SQL Editor)
- `public/manifest.webmanifest` – PWA manifestas
- `.env` – Supabase raktai (necommitinama)

## Užduotys

- [ ] 1.0 Vairuotojo reiso forma su laikinais duomenimis
  - [x] 1.1 Sukurti `TripFormPage`: dropdown automobiliui (laikinas sąrašas), dropdown vairuotojui, datos laukas (pagal nutylėjimą rytdiena)
  - [x] 1.2 Rodyti automatiškai sugeneruotą reiso numerį (laikina logika: data + `01`)
  - [x] 1.3 Pridėti sąskaitų sąrašą: atskiras skenavimo langas, automatinis pridėjimas po skenavimo, pašalinimas iš sąrašo
  - [ ] 1.4 Mygtukas „Išsaugoti reisą" rodo patvirtinimą su reiso numeriu (kol kas be duomenų bazės)
  - [ ] 1.5 Patikrinti naršyklėje: forma veikia, sąskaitas galima pridėti ir pašalinti, patvirtinimas rodomas

- [ ] 2.0 Supabase lentelės ir prijungimas
  - [ ] 2.1 Parašyti SQL migraciją: lentelės `vehicles`, `drivers`, `trips`, `invoices` su unikaliu `invoice_number` ir `trip_number`
  - [ ] 2.2 Vartotojas įklijuoja SQL į Supabase SQL Editor ir paleidžia; pridėti kelis testinius automobilius ir vairuotojus per Table Editor
  - [ ] 2.3 Sukurti `src/lib/supabase.ts` ir `.env` su `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - [ ] 2.4 Formoje automobilius ir vairuotojus skaityti iš Supabase (tik aktyvūs, `is_active = true`)
  - [ ] 2.5 Išsaugant reisą: sukurti `trips` įrašą su automatiškai sugeneruotu `trip_number` ir `invoices` įrašus
  - [ ] 2.6 Patikrinti naršyklėje: reisas išsaugomas; Supabase Table Editor matosi `trips` ir `invoices` įrašai

- [ ] 3.0 Administratoriaus prisijungimas ir sąrašų valdymas
  - [ ] 3.1 Sukurti admin paskyrą Supabase Auth (el. paštas + slaptažodis)
  - [ ] 3.2 Pridėti RLS taisykles: `vehicles` ir `drivers` – visi skaito, rašo tik prisijungęs admin; `trips`/`invoices` – kurti gali visi, skaityti/redaguoti tik admin
  - [ ] 3.3 Sukurti `LoginPage` ir `useAuth`: prisijungimas, apsaugoti admin maršrutai
  - [ ] 3.4 Sukurti `VehiclesPage`: lentelė (numeris, markė, įmonė), pridėti, redaguoti, ištrinti
  - [ ] 3.5 Sukurti `DriversPage`: lentelė (vardas), pridėti, redaguoti, ištrinti
  - [ ] 3.6 Patikrinti naršyklėje: prisijungus admin mato ir tvarko automobilius bei vairuotojus; vairuotojo formoje matosi atnaujinti sąrašai

- [ ] 4.0 Brūkšninių kodų skenavimas
  - [ ] 4.1 Kompiuteryje: paslėptas input laukas, kuris priima skanerio įvestį ir prideda sąskaitą
  - [ ] 4.2 Telefone: `BarcodeScanner` komponentas su kamera (`@zxing/browser` arba panaši biblioteka)
  - [ ] 4.3 Prieš pridėjimą tikrinti, ar sąskaitos numeris jau egzistuoja `invoices` lentelėje; jei taip – rodyti aiškų lietuvišką pranešimą
  - [ ] 4.4 Patikrinti naršyklėje: kompiuteryje galima „įvesti" numerį kaip skanerį; telefone atsidaro kamera; dubliuotas numeris atmetamas

- [ ] 5.0 Administratoriaus reisų valdymas
  - [ ] 5.1 Sukurti `TripsPage`: reisų lentelė (numeris, data, vairuotojas, automobilis, sąskaitų skaičius), naujausi viršuje
  - [ ] 5.2 Pridėti filtrus: data (nuo–iki), vairuotojas, automobilis
  - [ ] 5.3 Pridėti paiešką pagal reiso numerį arba sąskaitos numerį
  - [ ] 5.4 Sukurti `TripEditPage`: redaguoti reisą ir sąskaitas, ištrinti reisą
  - [ ] 5.5 Pridėti mygtukus „Eksportuoti į Excel" ir „Eksportuoti į CSV" (eksportuoja tik filtruotą sąrašą)
  - [ ] 5.6 Patikrinti naršyklėje: filtrai ir paieška veikia, reisą galima redaguoti, Excel/CSV failas atsisiunčiamas

- [ ] 6.0 PWA ir paleidimas internete
  - [ ] 6.1 Pridėti PWA manifestą ir service worker (Vite PWA plugin arba rankiniu būdu)
  - [ ] 6.2 Paruošti vietą logotipui (`public/logo.png`) – rodyti viršuje vairuotojo formoje ir admin skydelyje
  - [ ] 6.3 Sujungti projektą su Vercel, nustatyti aplinkos kintamuosius (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - [ ] 6.4 Patikrinti: svetainė veikia internete; telefone galima pridėti į pradžios ekraną ir skenuoti kamera
