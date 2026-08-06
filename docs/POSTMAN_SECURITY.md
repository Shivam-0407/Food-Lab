# Postman / curl — secure POST `/api/orders`

Use these to prove the server **does not trust client prices** and **rejects unknown menu items**.

Replace:

- `BASE` → `http://localhost:3000` or `https://food-lab-chi.vercel.app`
- `REAL_MENU_ITEM_ID` → a real `_id` from `GET /api/menu`

```bash
# Copy a real id from the menu
curl -s "$BASE/api/menu" | head -c 500
```

---

## 1. Happy path (secure create)

Client sends **only** `menuItemId` + `quantity`. Server loads price from DB.

```bash
curl -s -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Shiva",
    "customerPhone": "9876543210",
    "address": "221B Baker Street",
    "apartment": "Apt 2",
    "items": [
      { "menuItemId": "REAL_MENU_ITEM_ID", "quantity": 2 }
    ]
  }' | jq .
```

**Expect:** `201`  
**Check response:** `total` and each item’s `price` / `name` match the **menu in the DB**, not anything invented by the client.

---

## 2. Attack: fake cheap price in the body (should be ignored)

Zod schema does **not** accept `price` / `total` on create. Extra fields are stripped. Even if you sneak them in, the server recomputes from Mongo.

```bash
curl -s -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Hacker",
    "customerPhone": "9876543210",
    "address": "221B Baker Street",
    "total": 1,
    "items": [
      {
        "menuItemId": "REAL_MENU_ITEM_ID",
        "quantity": 1,
        "name": "FAKE CHEAP ITEM",
        "price": 1
      }
    ]
  }' | jq '{ status: .status, total: .total, items: [.items[]? | {name, price, quantity}] }'
```

(If the response is wrapped only as the order JSON on success:)

```bash
curl -s -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Hacker",
    "customerPhone": "9876543210",
    "address": "221B Baker Street",
    "total": 1,
    "items": [
      {
        "menuItemId": "REAL_MENU_ITEM_ID",
        "quantity": 1,
        "name": "FAKE CHEAP ITEM",
        "price": 1
      }
    ]
  }' | jq '{ total, items: [.items[] | {name, price, quantity}] }'
```

**Expect:** `201` still, but:
- `items[0].price` = **real DB price** (e.g. 249), **not** `1`
- `items[0].name` = **real menu name**, **not** `"FAKE CHEAP ITEM"`
- `total` = DB price × quantity, **not** `1`

→ Proves price tampering does nothing.

---

## 3. Attack: fake / unknown `menuItemId` (should fail)

```bash
curl -s -i -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Hacker",
    "customerPhone": "9876543210",
    "address": "221B Baker Street",
    "items": [
      { "menuItemId": "507f1f77bcf86cd799439011", "quantity": 1 }
    ]
  }'
```

(Use any ObjectId that is **not** in your `MenuItem` collection.)

**Expect:** `400`  
**Body includes:** `"One or more menu items were not found"`

→ Proves server verifies items exist in DB.

---

## 4. Validation still works (bad phone)

```bash
curl -s -i -X POST "$BASE/api/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Shiva",
    "customerPhone": "123",
    "address": "221B Baker Street",
    "items": [
      { "menuItemId": "REAL_MENU_ITEM_ID", "quantity": 1 }
    ]
  }'
```

**Expect:** `400` — `"Validation failed"` (phone must be 10 digits).

---

## Postman setup

1. Method: **POST** → `{{baseUrl}}/api/orders`  
2. Headers: `Content-Type: application/json`  
3. Body → raw JSON — use the payloads above  
4. Run **#2** and compare response `price`/`total` to `GET {{baseUrl}}/api/menu`  
5. Run **#3** and confirm **400**

### Environment variables (optional)

| Variable | Example |
|----------|---------|
| `baseUrl` | `http://localhost:3000` |
| `menuItemId` | paste from GET `/api/menu` |
