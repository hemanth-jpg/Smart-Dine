# Smart Dine Pro

A full-stack restaurant ordering and hotel dining application with guest ordering, service calls, kitchen and waiter terminals, management tools, and persistent MongoDB storage.

## Features

- Browse and filter Indian, Chinese, and fitness menu items; customize dishes and keep a local cart.
- Submit orders and table service requests to the API. The server checks menu prices and creates unique order IDs.
- Kitchen, waiter, and management terminals authenticate with individual staff passwords.
- Staff sessions use random bearer tokens stored as SHA-256 hashes in MongoDB, expire after eight hours, and are revoked at logout. Login and guest submission endpoints are rate limited.
- Staff-only operational data and mutations require a valid session. Menu browsing and guest order/request creation remain public.
- Staff screens refresh shared menu, order, and service-request data every eight seconds.

## Requirements

- Node.js 20 or newer
- MongoDB Community Server or a MongoDB Atlas database

MongoDB Compass is optional; it is a database viewer, not the MongoDB server.

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env.local` and set `MONGODB_URI`. For a local MongoDB server, the example URI `mongodb://127.0.0.1:27017` is ready to use. For Atlas, use the URI from **Connect > Drivers**, create a database user, allow the server's IP address, and URL-encode special characters in the password.

3. Start MongoDB, then start the API and frontend:

   ```sh
   npm run dev:full
   ```

4. Open `http://localhost:3000`. Check the database connection at `http://localhost:3001/api/health`; a successful response includes `"ok":true` and `"connected":true`.

The API creates the `menu_items`, `orders`, `service_requests`, `staff_accounts`, and `staff_sessions` collections and their indexes. The app seeds its built-in menu when needed. Cart contents remain browser-local.

## Staff accounts

On first startup, the API creates the configured staff accounts without passwords. Set a unique password for each staff ID with:

```sh
npm run staff:password
```

Enter the staff ID and password in the hidden terminal prompt. The app stores salted scrypt password hashes, not plaintext passwords. Staff sessions are server-side and are not restored from browser storage. Demo staff IDs shown on the sign-in screen are identifiers only; a configured password is still required.

## API access model

- `GET /api/health` and `GET /api/menu` are public.
- `POST /api/orders` and `POST /api/service-requests` are public, rate limited, validated, and persist data server-side.
- `POST /api/auth/login` issues a time-limited staff token; `POST /api/auth/logout` revokes it.
- `GET /api/data` requires a staff token. Menu/catalog and whole-collection writes require an admin or management role.
- `PATCH /api/orders/:id/status` requires an authenticated kitchen, waiter, admin, or management role.
- `PATCH /api/service-requests/:id/status` requires an authenticated waiter, admin, or management role.

Keep `MONGODB_URI` server-side; do not prefix it with `VITE_`. The server loads `.env.local` (or `.env`) before connecting. Use HTTPS and restrict MongoDB network access when deploying publicly.

## Useful commands

```sh
npm run dev:frontend
npm run dev:backend
npm run lint
npm run build
```
