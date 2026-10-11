<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

## Project layout

- `src/` contains the React frontend, UI components, app data, and browser-to-API client.
- `server/` contains the Express API and MongoDB driver integration.
- `database/` documents the MongoDB database and its collections.
- Root files (`package.json`, `vite.config.ts`, `tsconfig.json`, and `.env*`) configure the full application.

Run the full stack with `npm run dev:full`, or start only the frontend with `npm run dev:frontend` and the API with `npm run dev:backend`.

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/34c33410-dafa-4b51-84fb-f21811150f1e

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## MongoDB setup

1. Install Node.js 20 or newer and MongoDB Community Server. Compass is only the GUI; it is not the database server. Get the server at https://www.mongodb.com/try/download/community and Compass at https://www.mongodb.com/try/download/compass.
2. Start the MongoDB Server Windows service. In Compass, connect to `mongodb://127.0.0.1:27017` to view the local server.
3. Copy `.env.example` to `.env.local` in the project root. The example uses `MONGODB_URI=mongodb://127.0.0.1:27017`; keep it for a local server. For Atlas, replace it with the URI from Atlas **Connect > Drivers**, create a database user, and allow your IP under **Network Access**. URL-encode special characters in the database user's password.
4. Install dependencies with `npm install`, then run `npm run dev:full`.
5. Open `http://localhost:3000`. Confirm the API's MongoDB ping at `http://localhost:3001/api/health`; success returns `"ok":true` and `"connected":true`.
6. In Compass, refresh the connection and open the `smart_dine` database. The API creates `menu_items`, `orders`, `service_requests`, and `staff_accounts` automatically.

The API creates and indexes the app collections automatically. Menu/order/request records store an `id`, the app record in `data`, and an `updatedAt` timestamp. On first connection, existing browser menu, order, and service-request data is copied into empty collections. Cart contents remain browser-local.

Staff sign-in is verified against `staff_accounts`. Run `npm run staff:password` once per staff ID and enter a unique password in the hidden terminal prompt. MongoDB stores only salted scrypt hashes, never readable passwords. Staff credentials are not restored from browser storage. The API data routes still need server-side authorization before public deployment.

Keep `MONGODB_URI` server-side only; do not prefix it with `VITE_`, because Vite exposes `VITE_*` values to the browser. The server loads `.env.local` (or `.env`) before connecting.
