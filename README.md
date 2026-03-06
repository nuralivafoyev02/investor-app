# Investor App

Investor App is a Vue 3 + Pinia + Vue Router dashboard for managing investors, projects, cashboxes, expenses, reports, settings, and demo integrations. The project now includes a cleaner API layer, persistent theme/language settings, reactive i18n updates, and a production build that passes successfully.

## What was improved

The project was reviewed and stabilized in these areas:

- Global **theme persistence** fixed. Dark/light mode now applies immediately and stays after refresh.
- Global **language persistence** fixed. Locale changes now update reactive UI sections without requiring a refresh.
- Added a safer **settings store hydration flow** with default merging.
- Added a reusable **API client + service layer** for local, remote, or hybrid demo mode.
- Fixed missing finance store methods for expenses.
- Normalized project status handling to one consistent shape: `planning`, `inprogress`, `completed`.
- Cleaned up the main layout and responsive sidebar behavior.
- Improved dashboard seed data so translated content can react to locale changes.
- Reworked reports to use live app data from cashboxes and expenses.
- Added a cleaner 404 page and improved auth layout/footer.
- Removed unnecessary heavy dev dependencies and restored a successful production build.

## Main features

### Dashboard
- Overview stats
- Weekly progress chart
- Month progress widget
- Goals checklist
- Task cards with add/edit/delete/note actions
- Project summary cards
- Export/share demo report

### Investors
- Investor list
- Search and status filter
- Add/edit/delete investor modal
- Local persistence through the API service layer

### Projects
- Project cards with budget, deadline, progress, and status
- Search and status filter
- Add/edit/delete project modal
- Unified status mapping

### Finance
- Cashboxes list
- Add/delete cashboxes
- Expense list
- Add/delete expenses
- Cached local data with demo remote seeding support

### Reports
- Date-range report generation by month
- Summary totals
- Expense breakdown table
- Printable output

### Settings
- Profile settings
- Theme switcher
- Language switcher
- Persistent app settings in localStorage

### Integrations
Demo integration screens are included for:
- Click Uzbekistan
- Uyqur App
- Monetary

These pages are currently demonstration-style UI flows and local state simulations, not full production integrations.

## Tech stack

- Vue 3
- Pinia
- Vue Router
- Vite
- Chart.js / vue-chartjs

## Project structure

```text
src/
  app/
    layouts/
    router/
  composables/
  config/
  features/
    dashboard/
  locales/
  modules/
    auth/
    integrations/
    pages/
    settings/
    system/
  services/
  stores/
  ui/
    base/
    icons/
```

## Environment configuration

Create a `.env` file in the **project root**.

You can copy from:

```bash
cp .env.example .env
```

### Supported variables

```env
VITE_API_MODE=hybrid
VITE_API_BASE_URL=https://dummyjson.com
VITE_API_TIMEOUT_MS=10000
VITE_API_TOKEN=
VITE_API_KEY=
```

### What each variable does

- `VITE_API_MODE`
  - `local` → uses local cached data only
  - `remote` → tries to use remote API as main source
  - `hybrid` → best balance for demos; loads remote seed data first, then keeps local cache as source of truth

- `VITE_API_BASE_URL`
  - base URL for the demo/test API

- `VITE_API_TIMEOUT_MS`
  - request timeout in milliseconds

- `VITE_API_TOKEN`
  - bearer token path for APIs that require Authorization headers

- `VITE_API_KEY`
  - API key path for services using `x-api-key`

## Where API token paths are used

These variables are read from:

- `src/config/app.config.js`
- `src/services/api-client.service.js`

The request layer automatically injects:

- `Authorization: Bearer <VITE_API_TOKEN>`
- `x-api-key: <VITE_API_KEY>`

when those values are present.

## Local development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Demo login

Use the built-in demo account:

```text
Email: admin@example.com
Password: password
```

## Notes

- App data is intentionally friendly for demos and testing.
- Many modules use localStorage to keep the UI responsive.
- Remote test API writes are treated as best-effort; local cache stays the source of truth.

## Build status

Production build completed successfully after cleanup and refactor.
