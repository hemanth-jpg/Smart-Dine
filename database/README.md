# MongoDB database

The Express API in `server/index.ts` connects to the database selected by `MONGODB_DATABASE` (default: `smart_dine`). Configure `MONGODB_URI` in the ignored root `.env` or `.env.local` file. For the local Windows MongoDB service, use `mongodb://127.0.0.1:27017`; Compass connects to that same URI to inspect the server.

The API creates these collections and unique `id` indexes at startup:

| Collection | Purpose | Stored fields |
| --- | --- | --- |
| `menu_items` | Food and fitness menu entries | `id`, `data`, `updatedAt` |
| `orders` | Customer and staff orders | `id`, `data`, `updatedAt` |
| `service_requests` | Guest service requests | `id`, `data`, `updatedAt` |
| `staff_accounts` | Staff login profiles | `id`, `name`, `role`, `label`, `passwordSalt`, `passwordHash`, `passwordConfigured`, `updatedAt` |

`data` contains the application record. The API seeds empty collections from the browser's existing local data on first successful app load. Open `http://localhost:3001/api/health` to verify the API can ping MongoDB.

Staff profiles are created from the demo account list at API startup. Run `npm run staff:password` once per staff ID and enter a unique password in the hidden terminal prompt. Passwords must be at least 12 characters. MongoDB stores a random salt and scrypt hash only, never the password text. Sign-in is checked by `POST /api/auth/login`.

Compass is a database client, not a MongoDB server. Keep the MongoDB connection string server-side. Staff password verification gates the UI, but the menu/order API routes still need server-side session authorization and rate limiting before public deployment.
