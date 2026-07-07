# Codex Guide

## Project Shape

This repository contains a React/Vite/Tailwind UI review gallery under `ui-review/`.

The project is a design-review prototype, not production CT software. It does not contain a backend and should not imply real device control, diagnosis, treatment, dose commitment, or safety assurance.

Read these files first:

- `ui-review/README.md`: project purpose, UI rules, screen-registration rules, UTF-8 note.
- `ui-review/package.json`: scripts and dependencies.
- `ui-review/src/Gallery.tsx`: screen registry.
- `ui-review/src/App.tsx`: app entry; keep it simple.
- `ui-review/src/screens/`: independent screen components.
- `ui-review/src/lib/protocolDb.ts`: local mock protocol data when protocol behavior is relevant.

Do not read generated or bulky files by default:

- `ui-review/node_modules/`
- `ui-review/dist/`
- `ui-review/public/dicom/`
- `ui-review/public/dicom-4d/`
- `ui-review/public/**/*.dcm`
- old comparison/debug files such as `*_orig.txt`, `*_full.txt`, and `compile_errors.txt`

Open DICOM/image assets only when the task is specifically about viewer data, visual QA, or asset rendering.

## Common Commands

Install dependencies:

```bash
cd ui-review
npm install
```

Run locally:

```bash
cd ui-review
npm run dev
```

Quality checks:

```bash
cd ui-review
npm run lint
npm run build
```

## Change Rules

- Keep every UI page as an independent component in `ui-review/src/screens/`.
- Register new screens in `ui-review/src/Gallery.tsx`.
- Do not add real API calls, backend dependencies, React Router, Redux/Zustand, or a new UI framework unless the user explicitly asks.
- Use mock data and local state for interactions.
- Preserve the 1024 x 768 review-canvas expectation unless the task is explicitly responsive/mobile work.
- Use Tailwind and `lucide-react` to match existing patterns.
- Preserve UTF-8 Chinese text. From PowerShell, run `ui-review/scripts/Enable-Utf8Terminal.ps1` before heavy Chinese inspection or editing.
- Use cautious prototype language for CT concepts: "simulation", "reference", "estimated", and "requires confirmation" are preferred.

## Token Budget Notes

- Start with this file, then `ui-review/README.md`.
- For adding a screen, read only `ui-review/src/Gallery.tsx`, a nearby screen in `ui-review/src/screens/`, and any directly reused mock helper.
- For style consistency, inspect `ui-review/src/index.css` and one or two similar screens instead of scanning all screens.
- Avoid searching public DICOM/image folders unless the task is about those assets.
