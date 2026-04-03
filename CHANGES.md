# Changes Applied

This file records the major changes made to the project during the cleanup, rebuild, and production-readiness pass.

## Frontend

- Removed the previous `apps/web/src` implementation and rebuilt the frontend from scratch.
- Added a new Next.js UI foundation with:
  - shared layout shell
  - reusable UI components
  - global design tokens and premium styling
  - animation utilities and reduced-motion support
- Rebuilt these pages:
  - `/`
  - `/login`
  - `/register`
  - `/farmer/dashboard`
  - `/buyer/dashboard`
- Added valid buyer and farmer sub-routes:
  - `farmer/products`
  - `farmer/orders`
  - `farmer/quality`
  - `farmer/analytics`
  - `buyer/search`
  - `buyer/suppliers`
  - `buyer/orders`
  - `buyer/analytics`
- Improved navigation so dashboard links point to real routes instead of placeholders.
- Added glassmorphism styling, ambient gradients, hover states, active navigation states, and page/card motion effects.

## Backend

- Hardened environment configuration in `apps/api/src/config/env.ts`.
- Added validated env parsing and safer JWT secret handling.
- Refactored authentication flow:
  - login now supports email or phone
  - email normalization added
  - duplicate email/phone checks improved
  - `/auth/me` now returns a real user profile
  - `/auth/profile` alias added
  - logout supports scoped refresh-token removal
- Updated search config to use centralized environment values.
- Removed insecure dead file:
  - `apps/api/src/users.json`

## AI Service

- Tightened CORS setup in `apps/ai-service/app/main.py`.
- Replaced wildcard-style setup with environment-driven origins.
- Removed generated Python cache folders from source.

## Repository Cleanup

- Updated root `.gitignore`.
- Removed generated build/cache artifacts after verification:
  - `apps/web/.next`
  - `apps/api/dist`
  - Python `__pycache__` folders

## Verification Performed

- `npm run lint --workspace=apps/web`
- `npm run build --workspace=apps/web`
- `npm run build --workspace=apps/api`
- `python -m compileall apps/ai-service/app`
- API smoke test:
  - `/health`
  - `/auth/register`
  - `/auth/login`
  - `/auth/me`

## Current Status

- Frontend shell is clean, styled, responsive, and buildable.
- Backend auth is safer and more consistent than before.
- AI service compiles and has improved config safety.
- The project is cleaner, but the frontend business modules still need full implementation and backend integration to reach full production readiness.

## Recommended Next Steps

1. Connect the rebuilt frontend auth pages to the backend auth API.
2. Implement real product, order, analytics, and verification modules on the new frontend shell.
3. Add automated test tooling for the API and frontend.
4. Move from SQLite hackathon defaults to production database/infrastructure configuration.
