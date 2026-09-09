# PRD: Reisų registravimo sistema

---

## 1. Apžvalga

Web aplikacija įmonės vairuotojams registruoti atliekamus reisus ir susieti su jais sąskaitų numerius, skenuojant brūkšninius kodus. Vairuotojams nereikia prisijungimo — jie greitai užregistruoja reisą telefone (PWA su kamera) ar kompiuteryje (su išoriniu skaneriu). Administratorius tvarko automobilių ir vairuotojų sąrašus, peržiūri, redaguoja ir eksportuoja reisų duomenis.

---

## 2. Tikslai

- Vairuotojas užregistruoja reisą su bent viena sąskaita per mažiau nei 2 minutes.
- Sistema neleidžia pridėti sąskaitos numerio, kuris jau naudotas kitame reise, ir parodo aiškų lietuvišką pranešimą.
- Administratorius per 30 sekundžių randa reisą pagal datą, vairuotoją, automobilį arba sąskaitos/reiso numerį.
- Administratorius gali eksportuoti filtruotą reisų sąrašą į Excel arba CSV failą.
- Ta pati svetainė veikia kompiuteryje ir telefone (PWA), telefone — skenavimas kamera.

---

## 3. Vartotojo istorijos

1. **Kaip vairuotojas**, noriu pasirinkti automobilį, vairuotoją ir datą, kad užregistruočiau savo reisą be prisijungimo.
2. **Kaip vairuotojas**, noriu skenuoti sąskaitų brūkšninius kodus po vieną, kad greitai pridėčiau kelias sąskaitas prie vieno reiso.
3. **Kaip vairuotojas**, noriu prieš išsaugojimą pataisyti duomenis ar pašalinti sąskaitą, kad ištaisyčiau klaidas.
4. **Kaip vairuotojas**, noriu matyti aiškų pranešimą, jei sąskaitos numeris jau naudotas, kad neįrašyčiau dubliato.
5. **Kaip administratorius**, noriu tvarkyti automobilių ir vairuotojų sąrašus, kad vairuotojai matytų teisingus pasirinkimus.
6. **Kaip administratorius**, noriu filtruoti ir ieškoti reisų, kad greitai rastų ir redaguotų reikiamą įrašą.
7. **Kaip administratorius**, noriu eksportuoti filtruotą reisų sąrašą į Excel arba CSV, kad galėčiau naudoti duomenis ataskaitoms.

---

## 4. Funkciniai reikalavimai

### Vairuotojo dalis (be prisijungimo)

1. Sistema rodo formą naujam reisui registruoti.
2. Vartotojas gali pasirinkti automobilį iš administratoriaus sudaryto sąrašo (rodomas automobilio numeris).
3. Vartotojas gali pasirinkti vairuotoją iš administratoriaus sudaryto sąrašo.
4. Vartotojas gali pasirinkti bet kokią datą; pagal nutylėjimą siūloma rytdienos data.
5. Sistema automatiškai sugeneruoja reiso numerį pagal pasirinktą datą ir dienos eilės numerį (formatas: `YYYYMMDD` + 2 skaitmenų eilės numeris, be tarpų ir brūkšnelių, pvz. `2026090801`, `2026090802`).
6. Vartotojas gali pridėti sąskaitą skenuodamas brūkšninį kodą — telefone kamera (PWA), kompiuteryje prijungtu išoriniu skaneriu.
7. Sistema įrašo visą brūkšninio kodo tekstą kaip sąskaitos numerį.
8. Vartotojas gali pridėti kelias sąskaitas prie vieno reiso — skenuoja po vieną.
9. Vartotojas gali ranka pašalinti sąskaitą iš sąrašo prieš išsaugojimą.
10. Vartotojas gali pataisyti automobilį, vairuotoją ir datą prieš išsaugojimą.
11. Sistema neleidžia pridėti sąskaitos numerio, kuris jau naudotas kitame reise, ir rodo aiškų lietuvišką pranešimą.
12. Vartotojas gali išsaugoti reisą — po išsaugojimo redaguoti nebegali.
13. Sistema rodo patvirtinimą, kad reisas sėkmingai išsaugotas (su reiso numeriu).

### Administratoriaus dalis (su prisijungimu)

14. Administratorius prisijungia el. paštu ir slaptažodžiu per tą pačią svetainę.
15. Administratorius gali pridėti, redaguoti ir ištrinti automobilius (numeris, markė, įmonė).
16. Administratorius gali pridėti, redaguoti ir ištrinti vairuotojus.
17. Administratorius mato visų reisų sąrašą (naujausi viršuje).
18. Administratorius gali filtruoti reisus pagal datą, vairuotoją ir automobilį.
19. Administratorius gali ieškoti pagal reiso numerį arba sąskaitos numerį.
20. Administratorius gali eksportuoti filtruotą reisų sąrašą į Excel (`.xlsx`) failą.
21. Administratorius gali eksportuoti filtruotą reisų sąrašą į CSV failą.
22. Administratorius gali atidaryti reisą ir redaguoti jo duomenis (automobilį, vairuotoją, datą, pastabas, sąskaitas).
23. Administratorius gali ištrinti reisą.
23a. Administratorius gali pats užregistruoti naują reisą (kai vairuotojas to nepadaro).
23b. Administratorius gali prie esamo reiso pridėti sąskaitas, jei vairuotojas jas pamiršo.
23c. Reisas turi neprivalomą pastabų lauką, kurį mato ir pildo tik administratorius.

### PWA ir skenavimas

24. Svetainė veikia kaip PWA — galima pridėti į telefono pradžios ekraną.
25. Telefone brūkšninis kodas skenuojamas įrenginio kamera.
26. Kompiuteryje brūkšninis kodas skenuojamas prijungtu išoriniu skaneriu (veikia kaip klaviatūros įvestis).

---

## 5. Ne šios versijos dalykai

- Mokėjimai ir sąskaitų faktūrų generavimas
- Tikra programėlė iš App Store / Google Play
- Vairuotojų prisijungimas ir asmeninės paskyros
- Keli administratoriai (tik vienas)
- El. laiškų siuntimas (Resend) — nebūtina šioje versijoje
- Reisų istorijos peržiūra vairuotojui (tik registravimas)

---

## 6. Duomenų modelis

### Lentelė: `vehicles` (automobiliai)

| Laukas | Aprašymas |
|--------|-----------|
| `id` | Unikalus identifikatorius |
| `plate_number` | Automobilio numeris (valstybinis numeris, pvz. „ABC 123") |
| `make` | Automobilio markė (pvz. „Volvo", „Mercedes") |
| `company` | Kuriai įmonei priklauso (pvz. „UAB Transa") |
| `is_active` | Ar rodomas sąraše (true/false) |
| `created_at` | Sukūrimo data |

### Lentelė: `drivers` (vairuotojai)

| Laukas | Aprašymas |
|--------|-----------|
| `id` | Unikalus identifikatorius |
| `name` | Vairuotojo vardas ir pavardė |
| `is_active` | Ar rodomas sąraše (true/false) |
| `created_at` | Sukūrimo data |

### Lentelė: `trips` (reisai)

| Laukas | Aprašymas |
|--------|-----------|
| `id` | Unikalus identifikatorius |
| `trip_number` | Automatiškai sugeneruotas numeris (pvz. `2026090801`) |
| `driver_id` | Nuoroda į vairuotoją |
| `vehicle_id` | Nuoroda į automobilį |
| `trip_date` | Reiso data |
| `notes` | Administratoriaus pastabos (neprivaloma) |
| `created_at` | Išsaugojimo data ir laikas |

### Lentelė: `invoices` (sąskaitos)

| Laukas | Aprašymas |
|--------|-----------|
| `id` | Unikalus identifikatorius |
| `trip_id` | Nuoroda į reisą |
| `invoice_number` | Sąskaitos numeris (unikalus visoje sistemoje) |
| `created_at` | Pridėjimo data |

**Svarbu:** `invoice_number` turi unikalų apribojimą — negali kartotis skirtinguose reisuose.

**Reiso numerio formatas:** `YYYYMMDD` + 2 skaitmenų eilės numeris tos dienos reisams (01, 02, … 99). Pvz.: pirmas 2026-09-08 dienos reisas — `2026090801`.

---

## 7. Ekranai

### Vairuotojo ekranai

**1. Pagrindinis / Naujo reiso forma**
- Įmonės logotipas viršuje (įkeliamas vėliau)
- Reiso numeris (automatiškai, tik skaitymui)
- Pasirinkimas: automobilis (iš dropdown — rodomas automobilio numeris)
- Pasirinkimas: vairuotojas (iš dropdown)
- Pasirinkimas: data (kalendorius, pagal nutylėjimą rytdiena)
- Sąskaitų sąrašas (pridėtos sąskaitos su galimybe pašalinti)
- Mygtukas „Skenuoti sąskaitą" (atidaro kamerą telefone / laukia skanerio kompiuteryje)
- Mygtukas „Išsaugoti reisą"

**2. Skenavimo ekranas (telefonas)**
- Kamera su brūkšninio kodo nuskaitymu
- Po sėkmingo skenavimo — grįžta į formą, sąskaita pridėta

**3. Patvirtinimo pranešimas**
- „Reisas [numeris] sėkmingai išsaugotas"
- Mygtukas „Registruoti naują reisą"

### Administratoriaus ekranai

**4. Prisijungimas**
- El. paštas, slaptažodis
- Mygtukas „Prisijungti"

**5. Admin skydelis (navigacija)**
- Automobiliai
- Vairuotojai
- Reisai
- Atsijungti

**6. Automobilių sąrašas**
- Lentelė: automobilio numeris, markė, įmonė
- Pridėjimo, redagavimo, ištrynimo mygtukai
- Formoje laukai: automobilio numeris, markė, kuriai įmonei priklauso

**7. Vairuotojų sąrašas**
- Sąrašas su pridėjimo, redagavimo, ištrynimo mygtukais

**8. Reisų sąrašas**
- Filtrai: data (nuo–iki), vairuotojas, automobilis
- Paieška: reiso numeris arba sąskaitos numeris
- Lentelė: reiso numeris, data, vairuotojas, automobilis, sąskaitų skaičius
- Mygtukai „Eksportuoti į Excel" ir „Eksportuoti į CSV" (eksportuoja tik filtruotą sąrašą)
- Paspaudus eilutę — reiso redagavimas

**9. Reiso redagavimas**
- Tie patys laukai kaip vairuotojo formoje
- Galimybė pridėti/pašalinti sąskaitas
- Mygtukai „Išsaugoti", „Ištrinti", „Atgal"

---

## 8. Techninės pastabos

- **Technologijos:** React + TypeScript, Vite, Tailwind CSS, Supabase (duomenys + autentifikacija), Vercel (hostingas)
- **PWA:** Service worker, manifest — galimybė pridėti į pradžios ekraną
- **Brūkšninių kodų skenavimas:** Telefone — biblioteka su kamera (pvz. `@zxing/browser` arba panaši); kompiuteryje — input laukas, kuris priima skanerio įvestį
- **Eksportas:** Excel generavimui — biblioteka (pvz. `xlsx` arba `exceljs`); CSV — paprastas tekstinis failas su lietuviškomis antraštėmis
- **Autentifikacija:** Tik administratoriui per Supabase Auth (el. paštas + slaptažodis); vairuotojams nereikia
- **RLS (Row Level Security):** `vehicles`, `drivers` — viešas skaitymas (vairuotojams), rašymas tik prisijungusiam administratoriui; `trips`, `invoices` — viešas kūrimas (vairuotojų forma), skaitymas ir redagavimas tik administratoriui
- **Reiso numerio generavimas:** Pagal `trip_date` skaičiuoja dienos eilės numerį (01–99) ir sujungia su data (`YYYYMMDD` + 2 skaitmenys)
- **Kalba:** Visi vartotojo matomi tekstai lietuviški
- **Išvaizda:** Paprasta, švari, su įmonės logotipu (failas bus įkeltas vėliau, pvz. `public/logo.png`)

---

## 9. Kaip suprasim, kad pavyko

1. Vairuotojas telefone (PWA) ir kompiuteryje gali užregistruoti reisą su sąskaitomis per skenavimą; dubliuotas sąskaitos numeris atmetamas su aiškiu pranešimu.
2. Administratorius prisijungia, tvarko automobilius (numeris, markė, įmonė) ir vairuotojus, randa reisą per filtrus/paiešką, gali jį redaguoti ir eksportuoti filtruotą sąrašą į Excel arba CSV.
3. Svetainė veikia internete (Vercel), telefone galima pridėti į pradžios ekraną ir skenuoti kamera.

---

## 10. Atviri klausimai

- Įmonės logotipo failas bus įkeltas vėliau — kur tiksliai rodyti (tik vairuotojo formoje, ar ir admin skydelyje)?
- Jei per dieną reisų daugiau nei 99 — kaip elgtis su eilės numeriu? (Dabar numatyta iki 99 per dieną.)
