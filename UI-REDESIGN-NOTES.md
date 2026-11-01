# Apex Coaching Management — UI Redesign Notes

## Design direction
The frontend has been redesigned around an evergreen, warm-ivory, muted-sage and champagne palette. The goal is a calmer, more distinctive academic-management interface instead of a generic purple dark dashboard.

## Updated files
- `frontend/src/styles.css` — complete visual system, palette, responsive layouts, component styling and interaction states.
- `frontend/src/App.jsx` — refined navigation shell, responsive sidebar, breadcrumb, account controls and toast feedback.
- `frontend/src/pages/Login.jsx` — redesigned sign-in experience, blank credential fields and show/hide password control.
- `frontend/src/pages/Dashboard.jsx` — improved dashboard hierarchy, statistic cards, revenue chart, recent payments and student list.
- `frontend/src/components/ResourcePage.jsx` — improved CRUD page toolbar, search, empty/loading states, table actions and save feedback.
- `frontend/src/components/Modal.jsx` — accessible dialog semantics and Escape-key close behavior.
- `frontend/src/components/Field.jsx` — consistent labels, placeholders and input controls.
- `frontend/src/pages/Reports.jsx` — refined report layout, loading state and CSV action.
- `frontend/src/pages/Settings.jsx` — improved profile/password forms and submission feedback.
- `backend/.env.example` — password changed to a placeholder; your local `backend/.env` is not included in this archive.

## Preserved
- Existing Express API endpoints.
- Oracle database schema and data.
- Existing authentication/token flow.
- Seven management modules and their field definitions.
- Existing dependency versions and `package-lock.json`.

## Apply the update
1. Stop the currently running app with `Ctrl + C`.
2. Keep a backup of your current project folder.
3. Extract this ZIP.
4. Copy your existing `backend/.env` into the extracted project's `backend` folder. The ZIP intentionally excludes `.env`.
5. Open a terminal in the extracted project root and run `npm install`.
6. Run `npm run build`.
7. If the build succeeds, run `npm run dev` and sign in using your existing administrator account.

Do not run the Oracle table-creation scripts again. The redesign does not require database changes.

## Validation note
All modified JavaScript/JSX files passed syntax parsing, and the stylesheet passed CSS parsing. A production Vite build could not be executed in the Linux review environment because the uploaded `node_modules` contains Windows-specific native Rollup binaries. Run `npm run build` on your Windows machine after applying the update to perform the final platform-native build check.

## Screenshot-review refinements
After reviewing the Windows desktop screenshots, the following refinements were added:
- Replaced the bright default sidebar scrollbar with a narrow evergreen/sage scrollbar.
- Reduced sidebar navigation row height and gaps so all ten navigation destinations fit more comfortably at common desktop viewport heights.
- Increased small table, form, subtitle, and metadata typography for readability at standard browser zoom.
- Added compact-height desktop adjustments and reduced-motion support.
