# HANDOFF

## Summary of Work Completed
- Added scoped tables so each nav section has its own dataset.
- Implemented JSONB `data` storage for non-Items tables.
- Built shared table UI with inline edit, add popup, and delete undo.
- Added Schedule Requests table with AM/PM dropdown and Notes column.
- Enforced newest-first ordering for rows.
- Fixed mobile: B&B button pinned via fixed AppBar.
- Removed Admin section and Settings from nav.
- Added date/time formatting (dates render as `JAN 22 2026`, time renders as `7:30 PM`).
- Added edit button on left of every row.
- Added search bar to Items table (filters by item name).
- Removed Status and Need columns from Items table.
- Migrated database from `bourbon-branch-db` to free-tier `bb-db`.

## Current Challenges & Fixes
- If inline editing throws JSON circular errors: ensure `commitCellEdit` ignores raw event objects.
- If data appears shared across sections: check `scope` passed from each page and `GET /api/products?scope=...`.
- If mobile access fails: verify Vite is running on a free port with `--host 0.0.0.0` and check firewall.

## How to Run
- Backend:
  - `node server/src/index.js` (port 5171).
  - Health: `http://localhost:5171/health/db`.
- Frontend:
  - `npm run dev -- --host 0.0.0.0 --port 5200` (or another free port).

## Files to Know
- `src/components/bodyComponents/inventory/Products.jsx` (table logic).
- `src/components/bodyComponents/shared/ItemTableCard.jsx` (wrapper).
- `server/src/index.js` (API + DB retry/health).
- `server/src/db.js` (migrations for `scope` and `data`).
- `src/components/SideBarComponent.jsx` (nav).

## DNS / Render
- Custom domain: `bb86.biz` (Render Web service).
- GoDaddy:
  - CNAME `www` -> Render web hostname.
  - A record `@` -> Render A record IP shown in Render UI.

## Next Things Likely Needed
- Push any remaining changes to git after new UI tweaks.
- Validate certificate/HTTPS if DNS changes were recent.
- Consider field-specific validation per section if needed.

