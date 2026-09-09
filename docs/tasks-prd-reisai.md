# Užduotys: Reisų registravimo sistema

PRD: docs/prd-reisai.md

## Failai

- `src/pages/TripFormPage.tsx` – vairuotojo reiso registravimo forma
- `src/pages/DriverApp.tsx` – vairuotojo reiso registravimo eiga
- `src/pages/admin/LoginPage.tsx` – administratoriaus prisijungimas
- `src/pages/admin/AdminLayout.tsx` – admin navigacija (Automobiliai, Vairuotojai, Reisai, Sąskaitos)
- `src/pages/admin/VehiclesPage.tsx` – automobilių sąrašas ir forma
- `src/pages/admin/DriversPage.tsx` – vairuotojų sąrašas ir forma
- `src/pages/admin/TripsPage.tsx` – reisų sąrašas su filtrais ir eksportu
- `src/pages/admin/TripTable.tsx` – reisų lentelė
- `src/pages/admin/InvoicesPage.tsx` – sąskaitų sąrašas
- `src/pages/admin/TripEditPage.tsx` – vieno reiso redagavimas
- `src/pages/admin/AdminTripFormPage.tsx` – administratoriaus naujas reisas
- `src/components/InvoiceList.tsx` – pridėtų sąskaitų sąrašas su pašalinimu
- `src/components/BarcodeScanner.tsx` – brūkšninio kodo skenavimas (kamera / skaneris)
- `src/components/TripSuccessMessage.tsx` – patvirtinimas po sėkmingo išsaugojimo
- `src/lib/saveTrip.ts` – reiso ir sąskaitų išsaugojimas
- `src/lib/invoiceExists.ts` – ar sąskaitos numeris jau naudotas
- `src/lib/supabase.ts` – Supabase klientas
- `src/lib/tripNumber.ts` – reiso numerio generavimo logika
- `src/lib/exportFile.ts` – bendras failo atsisiuntimas
- `src/lib/exportTrips.ts` – reisų Excel ir CSV eksportas
- `src/lib/exportInvoices.ts` – sąskaitų Excel ir CSV eksportas
- `src/pages/admin/InvoiceTable.tsx` – sąskaitų lentelė
- `src/types/database.ts` – TypeScript tipai lentelėms
- `src/hooks/useActiveLists.ts` – aktyvių automobilių ir vairuotojų sąrašas iš Supabase
- `src/hooks/useAuth.ts` – administratoriaus sesijos valdymas
- `src/App.tsx` – maršrutai (vairuotojo forma, admin sritis)
- `supabase/migrations/001_initial_schema.sql` – lentelių ir RLS SQL (įklijuosi į Supabase SQL Editor)
- `supabase/migrations/002_invoice_number_exists.sql` – sąskaitos numerio patikrinimo funkcija
- `public/manifest.webmanifest` – PWA manifestas
- `.env` – Supabase raktai (necommitinama)

## Užduotys

- [x] 1.0 Vairuotojo reiso forma su laikinais duomenimis
  - [x] 1.1 Sukurti `TripFormPage`: dropdown automobiliui (laikinas sąrašas), dropdown vairuotojui, datos laukas (pagal nutylėjimą rytdiena)
  - [x] 1.2 Rodyti automatiškai sugeneruotą reiso numerį (laikina logika: data + `01`)
  - [x] 1.3 Pridėti sąskaitų sąrašą: atskiras skenavimo langas, automatinis pridėjimas po skenavimo, pašalinimas iš sąrašo
  - [x] 1.4 Mygtukas „Išsaugoti reisą" rodo patvirtinimą su reiso numeriu (kol kas be duomenų bazės)
  - [x] 1.5 Patikrinti naršyklėje: forma veikia, sąskaitas galima pridėti ir pašalinti, patvirtinimas rodomas

- [x] 2.0 Supabase lentelės ir prijungimas
  - [x] 2.1 Parašyti SQL migraciją: lentelės `vehicles`, `drivers`, `trips`, `invoices` su unikaliu `invoice_number` ir `trip_number`
  - [x] 2.2 Vartotojas įklijuoja SQL į Supabase SQL Editor ir paleidžia; pridėti kelis testinius automobilius ir vairuotojus per Table Editor
  - [x] 2.3 Sukurti `src/lib/supabase.ts` ir `.env` su `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - [x] 2.4 Formoje automobilius ir vairuotojus skaityti iš Supabase (tik aktyvūs, `is_active = true`)
  - [x] 2.5 Išsaugant reisą: sukurti `trips` įrašą su automatiškai sugeneruotu `trip_number` ir `invoices` įrašus
  - [x] 2.6 Patikrinti naršyklėje: reisas išsaugomas; Supabase Table Editor matosi `trips` ir `invoices` įrašai

- [x] 3.0 Administratoriaus prisijungimas ir sąrašų valdymas
  - [x] 3.1 Sukurti admin paskyrą Supabase Auth (el. paštas + slaptažodis)
  - [x] 3.2 Pridėti RLS taisykles: `vehicles` ir `drivers` – visi skaito, rašo tik prisijungęs admin; `trips`/`invoices` – kurti gali visi, skaityti/redaguoti tik admin
  - [x] 3.3 Sukurti `LoginPage` ir `useAuth`: prisijungimas, apsaugoti admin maršrutai
  - [x] 3.4 Sukurti `VehiclesPage`: lentelė (numeris, markė, įmonė), pridėti, redaguoti, ištrinti
  - [x] 3.5 Sukurti `DriversPage`: lentelė (vardas), pridėti, redaguoti, ištrinti
  - [x] 3.6 Patikrinti naršyklėje: prisijungus admin mato ir tvarko automobilius bei vairuotojus; vairuotojo formoje matosi atnaujinti sąrašai

- [x] 4.0 Brūkšninių kodų skenavimas
  - [x] 4.1 Kompiuteryje: paslėptas input laukas, kuris priima skanerio įvestį ir prideda sąskaitą
  - [x] 4.2 Telefone: `BarcodeScanner` komponentas su kamera (`@zxing/browser` arba panaši biblioteka)
  - [x] 4.3 Prieš pridėjimą tikrinti, ar sąskaitos numeris jau egzistuoja `invoices` lentelėje; jei taip – rodyti aiškų lietuvišką pranešimą
  - [x] 4.4 Patikrinti naršyklėje: kompiuteryje galima „įvesti" numerį kaip skanerį; telefone atsidaro kamera; dubliuotas numeris atmetamas

- [x] 5.0 Administratoriaus reisų valdymas
  - [x] 5.1 Sukurti `TripsPage`: reisų lentelė (numeris, data, vairuotojas, automobilis, sąskaitų skaičius), naujausi viršuje
  - [x] 5.15 Sukurti `InvoicesPage`: sąskaitų lentelė (reiso numeris, data, automobilis, vairuotojas, sąskaitos numeris)
  - [x] 5.2 Pridėti filtrus: data (nuo–iki), vairuotojas, automobilis
  - [x] 5.25 Pridėti filtrus Sąskaitų skiltyje: data (nuo–iki), vairuotojas, automobilis
  - [x] 5.3 Pridėti paiešką pagal reiso numerį arba sąskaitos numerį
  - [x] 5.35 Pridėti paiešką Sąskaitų skiltyje pagal reiso arba sąskaitos numerį
  - [x] 5.5 Pridėti mygtukus „Eksportuoti į Excel" ir „Eksportuoti į CSV" (eksportuoja tik filtruotą sąrašą)
  - [x] 5.55 Pridėti sąskaitų eksportą į Excel ir CSV (eksportuoja tik filtruotą sąrašą)
  - [x] 5.6 Patikrinti naršyklėje: filtrai ir paieška veikia, Excel/CSV failas atsisiunčiamas

- [ ] 6.0 PWA ir paleidimas internete
  - [ ] 6.1 Pridėti PWA manifestą ir service worker (Vite PWA plugin arba rankiniu būdu)
  - [ ] 6.2 Paruošti vietą logotipui (`public/logo.png`) – rodyti viršuje vairuotojo formoje ir admin skydelyje
  - [ ] 6.3 Sujungti projektą su Vercel, nustatyti aplinkos kintamuosius (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
  - [ ] 6.4 Patikrinti: svetainė veikia internete; telefone galima pridėti į pradžios ekraną ir skenuoti kamera

- [ ] 7.0 Administratoriaus reisų redagavimas
  - [ ] 7.1 Pridėti reiso lauką `notes` (pastabos) per SQL; rodyti jį Reisų ir Sąskaitų lentelėse
  - [ ] 7.2 Meniu grupė „Redagavimas“: nuoroda „Tvarkyti reisus“
  - [ ] 7.3 Administratoriaus forma naujam reisui: automobilis, vairuotojas, data, pastabos, sąskaitos (galima išsaugoti ir be sąskaitų)
  - [ ] 7.4 Esamo reiso tvarkymas: taisyti automobilį, vairuotoją, datą ir pastabas; pridėti arba pašalinti sąskaitas; ištrinti reisą
  - [ ] 7.5 Patikrinti naršyklėje: galima sukurti reisą, pridėti pamirštą sąskaitą, įrašyti pastabą ir ištrinti reisą

- [x] 8.0 Pasirinktos dienos paaiškinimas reiso formoje
  - [x] 8.1 Prie „Pasirinkta diena“ rodyti savaitės dieną ir pridėti „Šiandien“ arba „Rytoj“, jei pasirinkta ta data; kitoms datoms papildomo žodžio nerašyti
  - [x] 8.2 Patikrinti naršyklėje: šiandienos data rodo „Šiandien“, rytdiena – „Rytoj“, kita data – tik savaitės dieną
