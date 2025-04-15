# Frontend (Next.js)

[![Coverage Status](https://img.shields.io/badge/coverage-pending-lightgrey)]()

This is the Next.js frontend for the AI-powered Mental Health Platform.

---

## Features
- TypeScript, TailwindCSS, Shadcn/ui
- Internationalization (i18n) with next-i18next
- Accessibility: ARIA roles, semantic HTML, keyboard navigation
- Error boundaries for robust error handling
- Shared types and utilities from `shared/`
- Monorepo-ready structure

---

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the development server:
   ```sh
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Testing

Run all tests and see coverage:
```sh
npm test -- --coverage
```

---

## Internationalization (i18n)
- Translations are in `public/locales/{lang}/common.json`.
- Add new languages by creating a folder and translation file.
- Use the `useTranslation` hook from `next-i18next` for localized text.

---

## Shared Types & Utilities
- Import canonical types from `shared/types/database.types.ts`:
  ```ts
  import { Database } from '../../../../../../shared/types/database.types';
  ```
- Use shared utilities from `shared/utils/` as needed.

---

## Accessibility & Compliance
- All components use ARIA roles and semantic HTML.
- Keyboard navigation and color contrast are enforced.
- No user-visible text is hardcoded; all text is externalized for i18n.
- Error boundaries are used for critical UI sections.

---

## Conventions
- File size per component ≤ 300 LOC
- Use TailwindCSS utility classes, no inline styles
- All public interfaces documented with JSDoc

---

## Next Steps
- Add more pages/components as needed
- Connect to backend API
- Expand i18n and accessibility coverage
