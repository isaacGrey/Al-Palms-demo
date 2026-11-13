# Al-Palms · Portfolio Demo

Public, isolated demonstration of the **Al-Palms** student-management dashboard. This repo has no production database connection and stores fictional browser-local data only.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@alpalms.demo` | `Demo123!` |
| Registrar | `registrar@alpalms.demo` | `Demo123!` |
| Viewer (read-only) | `viewer@alpalms.demo` | `Demo123!` |

Choose an account on the sign-in screen. Demo authentication is client-side only; never use it for real accounts or sensitive student information.

Features include enrollment metrics, student search and filters, application review, campus and event management, calendar, analytics, audit activity, CSV export, and a restore-sample-data control. All sample records are fictional. Changes persist only in your current browser.

## Deploy to Vercel

1. Import `isaacGrey/Al-Palms-demo` and select the repo root.
2. Choose **Vite** with build command `npm run build` and output directory `dist`.
3. No environment variables, API keys, or database are required.
4. Deploy. `vercel.json` rewrites deep links to `index.html` so direct visits to `/students` and `/admissions` render correctly.

Run locally with `npm install && npm run dev`. GitHub Actions checks the Vite production build after commits.

Production source: https://github.com/isaacGrey/Al-Palms

No “View source code” button is displayed in the application.
