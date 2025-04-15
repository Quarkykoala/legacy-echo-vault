# Monorepo Migration Plan & Structure

## Overview
This document outlines the migration plan and folder mapping for consolidating the legacy codebase into a unified, scalable monorepo for the AI-powered Mental Health Platform.

---

## Folder Structure

- `backend/` — Flask API endpoints, models, services, versioned `/api/v1/` routes
- `frontend/` — Next.js app (TypeScript, TailwindCSS, Shadcn/ui, i18n, accessibility)
- `shared/` — Canonical types/interfaces and utilities for cross-stack use
  - `shared/types/` — TypeScript types (e.g., Database, User, Vault, Memory)
  - `shared/utils/` — Utility functions (e.g., cn, Supabase client)
- `migrations/` — Alembic DB migration scripts
- `scripts/` — Utility scripts (e.g., create_hr_user.py)
- `tests/` — Pytest (backend), Playwright/Jest (frontend)
- `docs/` — Architecture, API versioning, setup, GDPR/data retention, accessibility

---

## Migration Steps

1. **Shared Types/Utilities**
   - All cross-stack types/interfaces moved to `shared/types/`
   - Common utilities moved to `shared/utils/`
2. **Backend Scaffold**
   - Flask app with versioned API, error handling, JWT auth
   - Models and endpoints to use shared types
3. **Frontend Scaffold**
   - Next.js app with TailwindCSS, Shadcn/ui, i18n, accessibility
   - Imports shared types/utilities
4. **Prepare Migrations, Scripts, and Tests**
   - Add starter files and structure for Alembic, scripts, and test coverage
5. **Documentation**
   - Update docs/ with architecture, conventions, and quarterly review notes

---

## Conventions & Compliance
- API versioning: `/api/vX/` prefix, breaking changes require new version
- Accessibility: WCAG 2.1 AA, ARIA, keyboard navigation
- Data privacy: GDPR, data retention ≤24 months, anonymization, deletion/export
- Test coverage: Backend ≥80%, Frontend ≥70%
- No credentials in code, use `.env` and `.gitignore`
- All public interfaces documented with JSDoc/docstrings

---

## Next Steps
- Continue incremental migration of frontend and backend logic
- Refactor and test each module as it is moved
- Enforce conventions and compliance at each stage 