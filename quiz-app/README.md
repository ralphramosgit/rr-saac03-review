# SAA-C03 Quiz App

Mobile-friendly interactive quiz for the AWS Solutions Architect Associate (SAA-C03) exam.

## Features

- **5 study modes** per topic: Mixed, Multiple choice (+ T/F), Matching, Flashcards, Review wrong
- **Immediate feedback** with explanations after every answer
- **Wrong-answer tracking** in `localStorage` → drill them in **Review** mode (retention loop)
- **Session reset** — exiting to the menu wipes session state; each session re-shuffles
- **Mobile-first**: responsive, tap-friendly, safe-area aware, theme color set
- **Works offline** after first load (Vite serves static assets)

## Run

```bash
cd quiz-app
npm install
npm run dev
```

Open the URL printed (default `http://localhost:5173`). Use `--host` is already enabled — open on phone via your machine's LAN IP.

## Build for static hosting

```bash
npm run build
npm run preview     # local check
```

Deploy the `dist/` folder anywhere (S3 + CloudFront, Netlify, GitHub Pages, etc.).

## Add / edit questions

Question banks live in [`src/data/`](src/data/) — one file per topic (`01_overview.ts` … `17_comparisons.ts`).
Use the helpers in [`_helpers.ts`](src/data/_helpers.ts):

```ts
mcq('id', 'prompt', ['A', 'B', 'C', 'D'], 2, 'explanation')   // index 2 = C correct
tf('id',  'prompt', true,  'explanation')
match('id', 'prompt', [{ left: 'X', right: 'Y' }, ...])
flash('id', 'front',  'back')
```

Then re-run `npm run dev` — hot reload picks it up.

## Reset progress

In the main menu, "Reset all progress" clears the flagged wrong answers across all topics.
Per-topic clear is available from inside each topic.
