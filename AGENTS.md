# Projekto taisyklės (AGENTS.md)

Šį failą Cursor perskaito prieš kiekvieną užduotį. Jis guli projekto šaknyje, šalia `package.json`.
Pritaikyk jį savo projektui: pakeisk aprašymą, technologijas ir tai, ko nenori.

## Apie projektą

Tai pradedančiojo vibe coderio projektas. Kodą rašo AI, sprendimus priima žmogus.
Projekto aprašas yra faile `docs/projektas.md`. Prieš didesnį darbą jį perskaityk.

## Technologijos

- React su TypeScript, Vite
- Tailwind CSS stilizavimui (tik Tailwind klasės, be atskirų CSS failų, išskyrus `src/index.css`)
- Supabase duomenims ir prisijungimui
- Resend laiškams (per Supabase Edge Function, ne iš naršyklės)
- Vercel paleidimui internete
- Git ir GitHub versijoms

## Kalba

- Su manimi kalbėk lietuviškai.
- Visi tekstai, kuriuos mato vartotojas (mygtukai, etiketės, pranešimai, laukų užrašai), lietuviški, su lietuviškomis raidėmis.
- Kodas, kintamųjų ir failų pavadinimai angliški.
- Trumpi komentarai sudėtingesnėse vietose lietuviški.

## Kaip dirbti

- Prieš keisdamas kelis failus, dviem trimis sakiniais pasakyk planą ir tik tada daryk.
- Viena užduotis vienu metu. Kai baigi, trumpai pasakyk, kas padaryta ir ką patikrinti naršyklėje.
- Jei kas neaišku, paklausk prieš pradėdamas. Nespėliok.
- Nekeisk to, ko neprašiau. Taisydamas klaidą keisk tik tą vietą.
- Po kiekvieno veikiančio pakeitimo pasiūlyk išsaugoti (commit) su trumpu lietuvišku aprašymu.
- Prieš paleisdamas programą patikrink, ar ji jau nepaleista kitame terminale.

## Failų struktūra

```
src/
  components/   # React komponentai, kiekvienas savo faile
  pages/        # puslapiai
  hooks/        # pakartotinai naudojama logika
  lib/          # Supabase klientas ir pagalbinės funkcijos
  types/        # TypeScript tipai
supabase/functions/  # Edge Functions: laiškai ir kiti darbai su slaptais raktais
docs/           # projektas.md, PRD, užduočių sąrašai
```

## Saugumas

- Raktai gyvena tik `.env` faile. Į kodą jų nerašyk.
- `.env` privalo būti `.gitignore` faile. Patikrink tai, kai kuri projektą.
- Naršyklei skirti kintamieji prasideda `VITE_`. Slapti raktai (Resend, Supabase `service_role`) į naršyklės kodą nepatenka: jie gyvena Supabase → Edge Functions → Secrets ir naudojami tik Edge Functions.
- Kiekvienai Supabase lentelei įjunk RLS ir sukurk taisykles, kad vartotojas matytų tik savo įrašus.

## Kodo tvarka

- Failas iki 300 eilučių. Kai artėja prie ribos, pasiūlyk išskaidyti.
- Komponentai maži, kiekvienas daro vieną dalyką.
- Asinchroninės operacijos su `try/catch` ir aiškiu lietuvišku pranešimu vartotojui, kai nepavyksta.
- Nenaudok `any` tipo.
- Windows PowerShell terminale komandas jungk `;`, ne `&&`.
