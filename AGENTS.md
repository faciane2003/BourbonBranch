# AGENTS

This file is for new Codex agents joining the Bourbon & Branch project. It summarizes how the app is structured, what has been changed, and how to run/debug it.

## Project Overview
- Repo root: `C:\Users\Ames\Desktop\Projects\BourbonBranch\BourbonBranch`
- Frontend: Vite + React + MUI.
- Backend: Express + Postgres (Render, free tier `bb-db`).

## Current Behavior
- Inventory and other sections (Parties, Notes, Team, Tasks, Schedule) each have their own table data.
- Data is stored in a single `products` table with a `scope` column and a `data` JSONB column for non-Inventory tables.
- Tables are inline editable, with add popups and delete undo.
- Items table has a search bar and Stock column; other tables use custom columns.

## Key Files
- `src/components/bodyComponents/inventory/Products.jsx`: shared table logic, add/edit popup, inline editing, status pill, date/time formatting.
- `src/components/bodyComponents/shared/ItemTableCard.jsx`: shared wrapper used by sections.
- `server/src/index.js`: API routes, DB retry/health, scope filtering, JSON data support.
- `server/src/db.js`: migrations for `scope` and `data` columns.

## Sections & Columns
- Items: Search bar, Edit button, Item (name), Stock, Delete.
- Parties: Date, Time, How many?, Special Requests, Contact, Cell.
- Notes: Date, Info, Name, Type.
- Team: Name, Roles, Cell, Usual Shifts.
- Tasks: Objective, Notes, Status.
- Schedule Requests: Date, AM/PM (select), Role, Name, Cell, Notes.

## How Data Separation Works
- Each section passes a unique `scope` value to `Products`.
- Backend filters: `GET /api/products?scope=...`.
- Create/update writes `scope` and stores custom fields in `data`.

## UI Notes
- The B&B button (top left) is fixed in the navbar for mobile visibility.
- Left nav hides Admin + Settings.
- Add/Edit popups are anchored near click; date fields default to today but do not auto-open calendars.
- No word-wrap in table cells; text is clipped (no ellipsis).

## Run/Ports
- Backend: `node server/src/index.js` (default port 5171).
- Frontend: `npm run dev -- --host 0.0.0.0 --port <free port>`.
  - Common free port used: 5200.
- Backend health: `http://localhost:5171/health/db`.

## Custom Domain (Render)
- Web service: `bb86.biz` + `www.bb86.biz`.
- GoDaddy DNS:
  - CNAME `www` -> Render web hostname.
  - A record `@` -> Render A record IP (per Render UI).

