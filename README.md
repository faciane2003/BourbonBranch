# inventory management system using React + Vite (not completed yet !)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
the grey color for testing margins and paddings

## Backend (Express + Postgres)

The app now includes a persistent backend in `server/` using Express + Postgres.

Run it locally (requires a Postgres database and `DATABASE_URL`):

```bash
cd server
npm install
set DATABASE_URL=postgres://user:password@localhost:5432/bourbon_branch
npm run dev
```

Then start the frontend in another terminal:

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:5171` by default.

## Deploy on Render

This repo includes `render.yaml` with:
- A Node web service for the API (`server/`) using a managed Postgres database.
- A static site for the Vite frontend (`dist`) that points to the API.

Notes:
- If you rename the Render services, update `VITE_API_BASE_URL` in `render.yaml` or in the Render dashboard.
- The API expects `/api` routes (e.g., `/api/products`).

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
- ### react libraries used in this app
- #### react Material UI
- #### react Router
- #### react Data Grid
- #### react Apex Charts
- #### react Material Icons
- ### Screen
  - ## Home
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/2-home-part/src/assets/Home.PNG?raw=true)
  - ## Inventory
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/3-inventory-part/src/assets/Home.PNG?raw=true)
  - ## order 
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/4-order-part/src/assets/Home.PNG?raw=true)
  - ## order modal
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/4-order-part-2/src/assets/Home.PNG?raw=true)
  - ## Customer
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/5-customer-part/src/assets/Home.PNG?raw=true)
 - ## Revenue
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/6-revenue-part/src/assets/Home.PNG?raw=true)
  - ## Growth
  ![click me](https://github.com/IMDADMI/inventory-management-system/blob/7-growth-part/src/assets/Home.PNG?raw=true)
