# Civilo API

Base URL (dev): `http://localhost:4000/api`
All requests/responses are JSON. Auth uses `Authorization: Bearer <accessToken>`.

---

## Auth

### POST /auth/register
Create a customer or vendor account.

**Request**
```json
{
  "name": "Ravi Kumar",
  "phone": "9876543210",
  "email": "ravi@example.com",
  "password": "secret12345",
  "role": "customer"
}
```

**Response 201**
```json
{
  "user": {
    "id": "f7c3a1...",
    "name": "Ravi Kumar",
    "phone": "9876543210",
    "role": "customer"
  },
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

### POST /auth/login
```json
{ "phone": "9876543210", "password": "secret12345" }
```
Returns the same shape as register.

### POST /auth/refresh
```json
{ "refreshToken": "..." }
```
Returns `{ "accessToken": "..." }`.

---

## Discovery

### GET /services/categories
Public. Returns the 6 service categories.

```json
{
  "categories": [
    { "key": "interior_designer", "label": "Interior Designer", "icon": "🎨" },
    { "key": "painter",           "label": "Painter",           "icon": "🖌️" }
  ]
}
```

### GET /vendors?category=painter&lat=12.93&lng=77.62&radius=10&sort=rating
Public. Lists approved vendors in the given category, near the given coordinates.

Query params:
- `category` (optional) — one of the 6 keys
- `lat`, `lng` (optional) — for distance sort/filter
- `radius` (default 10) — km
- `sort` — `rating` (default), `price`, or `distance`

**Response**
```json
{
  "vendors": [
    {
      "id": "abc...",
      "business_name": "Ramesh Painting Works",
      "category": "painter",
      "experience_years": 8,
      "rating_avg": 4.7,
      "rating_count": 142,
      "min_price": 15.00,
      "distance_km": 2.3
    }
  ]
}
```

### GET /vendors/:id
Public. Full vendor profile.

**Response**
```json
{
  "vendor": { "id": "...", "business_name": "...", "bio": "...", "kyc_status": "approved" },
  "services": [
    { "id": "...", "title": "Interior wall painting", "unit": "sqft", "price_per_unit": 15.00 }
  ],
  "reviews": [
    { "id": "...", "rating": 5, "comment": "Great work", "customer_name": "Priya S." }
  ]
}
```

---

## Bookings

### POST /bookings
Auth: customer.

**Request**
```json
{
  "vendorId": "abc-uuid",
  "serviceId": "xyz-uuid",
  "scheduledDate": "2026-05-04",
  "timeSlot": "9-12",
  "address": "#42, 5th Cross, Koramangala, Bengaluru",
  "lat": 12.9352,
  "lng": 77.6245,
  "scopeText": "2 BHK interior, ~800 sqft, Asian Paints",
  "scopePhotos": []
}
```

**Response 201**
```json
{
  "booking": {
    "id": "...", "status": "requested",
    "scheduled_date": "2026-05-04", "time_slot": "9-12",
    "price_estimate_min": 1125, "price_estimate_max": 1875
  }
}
```

### GET /bookings/me
Auth: customer or vendor. Returns own bookings, scoped by role.

### GET /bookings/:id
Auth: must be customer of booking, vendor of booking, or admin.

### PATCH /bookings/:id/status
Auth: vendor (most transitions) or customer (cancel only) or admin.

**Request**
```json
{ "status": "accepted" }
```
Optional `finalPrice` when transitioning to `completed`.

**Valid transitions**
- `requested` → `accepted` | `rejected` | `cancelled`
- `accepted` → `in_progress` | `cancelled`
- `in_progress` → `completed`

---

## Reviews

### POST /reviews
Auth: customer who owns the booking. Booking must be `completed`.

**Request**
```json
{
  "bookingId": "...",
  "rating": 5,
  "comment": "Clean work, finished on time",
  "photoUrls": []
}
```

Response: `{ "review": { ... } }` (201).

---

## Vendor management

### POST /vendors/profile
Auth: vendor. Creates or updates vendor profile.

```json
{
  "businessName": "Ramesh Painting Works",
  "bio": "8 years experience, Asian Paints certified",
  "category": "painter",
  "experienceYears": 8,
  "serviceAreaKm": 10,
  "lat": 12.9352, "lng": 77.6245,
  "coverPhotoUrl": "https://s3.../cover.jpg"
}
```

After creation, profile is `kyc_status: pending` and won't appear in discovery until admin approves.

### POST /vendors/services
Auth: vendor. Adds a service to own profile.

```json
{
  "title": "Interior wall painting",
  "description": "Includes priming + 2 coats",
  "unit": "sqft",
  "pricePerUnit": 15
}
```

---

## Admin

All admin routes require `role: admin`.

### GET /admin/vendors/pending
Lists vendor profiles awaiting approval.

### PATCH /admin/vendors/:id/approve
Approves vendor (becomes visible in discovery).

### PATCH /admin/vendors/:id/reject
Rejects vendor.

### GET /admin/stats
```json
{
  "customers": 342,
  "activeVendors": 58,
  "totalBookings": 1204,
  "completedBookings": 891
}
```

---

## Error format

All errors return JSON:
```json
{ "error": "Human-readable message" }
```
With validation errors:
```json
{ "error": "Validation failed", "details": [ ... ] }
```

Common status codes: 400 (bad input), 401 (no/bad token), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server).
