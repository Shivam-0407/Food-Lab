# Foodie

Order management for a food delivery app — browse the menu, manage a cart, checkout, and track order status.

## Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, shadcn/ui, Zustand, React Hook Form + Zod
- **Backend:** Next.js Route Handlers (REST API)
- **Database:** MongoDB Atlas + Prisma (v6)
- **Package manager:** Bun
- **Tests:** Vitest + React Testing Library

## Features

1. **Menu** — list food items with image, description, and price (INR)
2. **Cart** — add items, change quantity, remove items (Zustand)
3. **Checkout** — delivery details form, place order
4. **Order tracking** — status progress (`RECEIVED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`)
5. **REST API** — menu + orders CRUD + status updates
6. **Tests** — API routes, Zod validation, cart store, FoodCard UI

Status updates are done manually via API/Postman, then click **Refresh** on the order page.

## Getting started

### Prerequisites

- [Bun](https://bun.sh) installed
- A MongoDB Atlas cluster (or local MongoDB)

### 1. Install dependencies

```bash
bun install
```

### 2. Environment

Copy the example env and set your connection string. The **database name** after the host is required (e.g. `foodie`):

```bash
cp .env.example .env
```

```env
DATABASE_URL="mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/foodie?retryWrites=true&w=majority"
```

### 3. Database setup

```bash
bun run db:push    # sync Prisma schema to MongoDB
bun run db:seed    # seed Indian menu items
```

Optional: browse data with `bun run db:studio`.

### 4. Run the app

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start Next.js (Turbopack) |
| `bun run build` | Prisma generate + production build |
| `bun run start` | Start production server |
| `bun run test` | Run Vitest once |
| `bun run test:watch` | Vitest watch mode |
| `bun run db:push` | Push schema to MongoDB |
| `bun run db:seed` | Seed menu items |
| `bun run db:studio` | Open Prisma Studio |
| `bun run lint` | ESLint |

## API

Base URL: `http://localhost:3000`

### Menu

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/menu` | List all menu items |

### Orders

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/orders` | List all orders |
| `POST` | `/api/orders` | Create order |
| `GET` | `/api/orders/:id` | Get order by id |
| `DELETE` | `/api/orders/:id` | Delete order |
| `PATCH` | `/api/orders/:id/status` | Update order status |

#### Create order body

```json
{
  "customerName": "Shiva",
  "customerPhone": "9876543210",
  "address": "221B Baker Street",
  "apartment": "Apt 2",
  "items": [
    {
      "menuItemId": "YOUR_MENU_ITEM_OBJECT_ID",
      "quantity": 1
    }
  ]
}
```

- `customerPhone` must be exactly **10 digits**
- Server looks up menu items, snapshots `name`/`price`, and computes `total` (client prices are not trusted)
- `status` defaults to `RECEIVED` on create

#### Update status body

```json
{
  "status": "PREPARING"
}
```

Allowed values: `RECEIVED` | `PREPARING` | `OUT_FOR_DELIVERY` | `DELIVERED`

## Postman / curl examples

### Prove secure order create (tamper prices / fake ids)

See **[docs/POSTMAN_SECURITY.md](docs/POSTMAN_SECURITY.md)** for full curl scripts.

Quick versions (replace `REAL_MENU_ITEM_ID` and host):

```bash
# 1) Fake price/name — ignored; response uses DB price/name
curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Hacker","customerPhone":"9876543210","address":"221B Baker Street","total":1,"items":[{"menuItemId":"REAL_MENU_ITEM_ID","quantity":1,"name":"FAKE","price":1}]}'

# 2) Unknown menu id — expect 400
curl -s -i -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Hacker","customerPhone":"9876543210","address":"221B Baker Street","items":[{"menuItemId":"507f1f77bcf86cd799439011","quantity":1}]}'
```

### Status updates

Replace `ORDER_ID` with an id from `/orders/...` after placing an order.

**Get order**

```bash
curl http://localhost:3000/api/orders/ORDER_ID
```

**Update status**

```bash
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"PREPARING"}'
```

```bash
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"OUT_FOR_DELIVERY"}'
```

```bash
curl -X PATCH http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"DELIVERED"}'
```

Then open `/orders/ORDER_ID` and click **Refresh**.

**Delete order**

```bash
curl -X DELETE http://localhost:3000/api/orders/ORDER_ID
```

## Testing

```bash
bun run test
```

Coverage includes:

- Zod input validation (`createOrderSchema`, status schema)
- Orders API: create, list, get by id, update status, delete (Prisma mocked)
- Menu API
- Cart store (add / qty / remove / subtotal)
- `FoodCard` add-to-cart UI

## Project structure

```
src/
  app/
    api/menu/              # GET menu
    api/orders/            # GET/POST orders
    api/orders/[id]/       # GET/DELETE order
    api/orders/[id]/status # PATCH status
    checkout/              # Checkout form
    orders/[id]/           # Order tracking page
  components/              # UI (FoodCard, CartSheet, etc.)
  lib/                     # Prisma, Zod schemas, order helpers
  store/                   # Zustand cart
  test/                    # Vitest setup
prisma/
  schema.prisma
  seed.ts
```

## Notes

- Use **Prisma 6** with MongoDB (Prisma 7 does not support Mongo yet).
- Keep `.env` out of git — only commit `.env.example`.
- Images load from Unsplash; `images.unsplash.com` is allowlisted in `next.config.ts`.
