# Cursor starter kit pradedantiesiems

Paruoštų taisyklių rinkinys Cursor redaktoriui. Naudojamas seminare "Vibe Coding pradedantiesiems" (ponasobuolys.lt).

## Kas viduje

| Failas | Kur dėti | Paskirtis |
|---|---|---|
| `AGENTS.md` | Projekto šaknyje, šalia `package.json` | Projekto taisyklės: technologijos, kalba, kaip AI turi dirbti |
| `USER-RULES.md` | Tekstą įklijuoti į Cursor Settings → Rules → User Rules | Asmeninės taisyklės visiems projektams |
| `.cursor/rules/create-prd.mdc` | Projekto šaknyje (aplankas `.cursor/rules/`) | Reikalavimų dokumentas iš idėjos |
| `.cursor/rules/generate-tasks.mdc` | Ten pat | Užduočių sąrašas iš PRD |
| `.cursor/rules/process-task-list.mdc` | Ten pat | Užduočių vykdymas po vieną |
| `docs/projektas.md` | Projekto aplanke `docs/` | Šeši klausimai apie tavo projektą |

## Kaip įsidiegti (5 minutės)

1. Sukurk projekto aplanką ir atidaryk jį Cursor (File → Open Folder).
2. Nukopijuok į projekto šaknį `AGENTS.md`, aplanką `.cursor` ir aplanką `docs`.
   Aplankas `.cursor` prasideda tašku, todėl Finder ir Explorer jį gali slėpti. Cursor lange jis matosi.
3. Atidaryk `USER-RULES.md`, nukopijuok tekstą ir įklijuok į Cursor Settings → Rules → User Rules. Tai daroma vieną kartą.
4. Užpildyk `docs/projektas.md`.

## Darbo eiga

```
Idėja → docs/projektas.md → @create-prd → @generate-tasks → @process-task-list → GitHub → Vercel
```

Cursor agento lange (Cmd+I arba Ctrl+I) rašai:

1. `@create-prd Sukurk PRD pagal docs/projektas.md`
   Agentas užduos klausimus, atsakai, gauni `docs/prd-[pavadinimas].md`.
2. `@generate-tasks Sukurk užduočių sąrašą iš @docs/prd-[pavadinimas].md`
   Agentas parodo pagrindines užduotis, rašai "Go", gauni `docs/tasks-prd-[pavadinimas].md`.
3. `@process-task-list Pradėk vykdyti @docs/tasks-prd-[pavadinimas].md`
   Agentas daro po vieną žingsnį ir laukia tavo "taip".

Mažam projektui (viena diena) galima ir be PRD: užpildai `docs/projektas.md` ir rašai agentui tiesiai. PRD ir užduočių sąrašas atsiperka, kai projektas turi daugiau nei 3–4 ekranus.

## Pradinis lygis ir pilnas paketas

Šios trys taisyklės yra pradinio lygio: jos moko dirbti planingai, po vieną žingsnį, su patikra. Pilnas **Ponas Obuolys Workflow** paketas veikia Claude Code ir Cursor aplinkose ir turi daugiau:

- rizikos vertinimą kuriant PRD ir Definition of Done vartus prieš pažymint užduotį atlikta;
- užbaigtumo auditą, kuris atskiria tikrai veikiančią funkciją nuo tariamai veikiančios;
- saugumo, duomenų bazės migracijų ir failų dydžio apsaugas;
- gyvą projekto wiki, kuri auga kartu su kodu.

https://ponasobuolys.lt/irankiai/ponas-obuolys-workflow

## Naujo projekto pradžia

Paprasčiausia: paprašyk agento.

```
Sukurk naują React projektą su Vite, TypeScript ir Tailwind CSS šiame aplanke.
Laikykis AGENTS.md. Kai baigsi, paleisk ir pasakyk adresą.
```

Jei nori pats terminale:

```bash
npm create vite@latest . -- --template react-ts
npm install
npm install tailwindcss @tailwindcss/vite
npm run dev
```

## Nuorodos

- Cursor: https://cursor.com/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Resend: https://resend.com/docs
- Bendruomenė: Telegram grupė, nuorodą gausi seminare
