# Civilo — Civil & Construction Services MVP

> Swiggy/Zomato-style booking platform for civil and construction services.
> Customers find and book Interior Designers, Civil Engineers, Contractors, Painters, Renovation Experts, Plumbers & Electricians.

---

## 1. PRODUCT STRUCTURE

### Three Roles

| Role | Who | Primary App |
|---|---|---|
| **Customer** | Homeowner / property owner booking a service | Mobile (primary) + Web |
| **Vendor** | Service provider (engineer, contractor, etc.) | Mobile (primary) — partner app feel |
| **Admin** | Platform operator | Web dashboard only |

### Customer Journey (the critical path)

```
1. Open app
   └─ Detect location (or pick manually)

2. Home screen
   └─ See 6 service categories as big tappable cards

3. Tap category (e.g., "Painters")
   └─ Service listing screen — vendor cards with photo, rating, starting price, distance

4. Tap vendor card
   └─ Vendor profile — portfolio photos, full reviews, services offered, pricing

5. Tap "Book Now"
   └─ Booking screen — date, time slot, address, scope of work (text + photos), price estimate

6. Confirm booking
   └─ Order tracking screen — Requested → Accepted → In Progress → Completed

7. Job done
   └─ Rate & review (1-5 stars + text + optional photo)
```

### Vendor Journey

```
Sign up → Submit profile + KYC docs → Wait for admin approval →
Profile goes live → Receive booking notifications → Accept/reject →
Update status as work progresses → Get reviewed
```

### Admin Journey

```
Login to web dashboard → Review pending vendor approvals →
Monitor active bookings → Handle disputes → View platform metrics
```

---

## 2. UI/UX DESIGN

Design language: **Swiggy/Zomato simplicity** — large tap targets, lots of white space, one primary action per screen, image-heavy cards.

### 2.1 Home Screen

```
┌─────────────────────────────────────────┐
│ 📍 Koramangala, Bengaluru        ▼  🔔 │  ← Location picker + notifications
├─────────────────────────────────────────┤
│                                         │
│  🔍 Search "painter", "plumber"...      │  ← Search bar (full width, rounded)
│                                         │
├─────────────────────────────────────────┤
│  Hi Ravi 👋                             │
│  What do you need today?                │  ← Greeting
├─────────────────────────────────────────┤
│                                         │
│  ┌────────┐  ┌────────┐                 │
│  │  🎨    │  │  🏗️    │                 │
│  │Interior│  │ Civil  │                 │  ← 2-column grid of service cards
│  │Designer│  │Engineer│                 │     Each card: icon + label + subtle gradient bg
│  └────────┘  └────────┘                 │
│                                         │
│  ┌────────┐  ┌────────┐                 │
│  │  🔨    │  │  🖌️    │                 │
│  │Contract│  │Painter │                 │
│  └────────┘  └────────┘                 │
│                                         │
│  ┌────────┐  ┌────────┐                 │
│  │  🔧    │  │  ⚡    │                 │
│  │Plumber │  │Electric│                 │
│  └────────┘  └────────┘                 │
│                                         │
├─────────────────────────────────────────┤
│  ⭐ Top Rated Near You                  │  ← Horizontal scroll of vendor cards
│  ┌─────┐ ┌─────┐ ┌─────┐                │
│  │ ... │ │ ... │ │ ... │ →              │
│  └─────┘ └─────┘ └─────┘                │
├─────────────────────────────────────────┤
│  🏠   🔍   📋   👤                       │  ← Bottom nav: Home, Search, Bookings, Profile
└─────────────────────────────────────────┘
```

### 2.2 Service Listing Page (e.g., "Painters near you")

```
┌─────────────────────────────────────────┐
│ ←  Painters in Koramangala         🔍  │  ← Back, title, search
├─────────────────────────────────────────┤
│ [Sort: Rating ▼] [Filter ▼] [Price ▼]  │  ← Filter chips, horizontal scroll
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ [VENDOR PHOTO]                       │ │
│ │                                      │ │
│ │ Ramesh Painting Works         ⭐ 4.7 │ │
│ │ Interior + Exterior • 8 yrs exp     │ │  ← Vendor card
│ │ ₹15/sqft onwards • 2.3 km away      │ │
│ │ ✓ 142 jobs done                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [VENDOR PHOTO]                       │ │
│ │ Ravi Painters                  ⭐ 4.5 │ │
│ │ Interior specialist • 5 yrs exp     │ │
│ │ ₹12/sqft onwards • 3.1 km away      │ │
│ └─────────────────────────────────────┘ │
│ ...                                     │
└─────────────────────────────────────────┘
```

Card anatomy: photo (16:9 ratio) on top, name + rating same line, 1-line tagline, price + distance, trust badges.

### 2.3 Vendor Profile Page

```
┌─────────────────────────────────────────┐
│ ←  Ramesh Painting Works          ⋯    │
├─────────────────────────────────────────┤
│ [   COVER PHOTO / PORTFOLIO HERO   ]   │
│                                         │
│  Ramesh Painting Works           ⭐4.7 │
│  Interior + Exterior Painting   (142)  │  ← Header with name, rating, review count
│  📍 2.3 km away • Open now             │
│                                         │
│  [ Book Now ]  [ Chat ]  [ Call ]      │  ← Primary CTA + secondary actions
├─────────────────────────────────────────┤
│  About                                  │
│  8 years of experience. Specializes in │
│  Asian Paints and Berger products...   │
├─────────────────────────────────────────┤
│  Services & Pricing                     │
│  • Interior wall painting   ₹15/sqft   │
│  • Exterior painting        ₹22/sqft   │
│  • Texture / accent walls   ₹40/sqft   │
├─────────────────────────────────────────┤
│  Portfolio                              │
│  [img] [img] [img]  →                   │  ← Horizontal scroll of work photos
├─────────────────────────────────────────┤
│  Reviews (142)                          │
│  ┌─────────────────────────────────┐   │
│  │ Priya S.            ⭐⭐⭐⭐⭐ │   │
│  │ "Clean work, finished on time" │   │
│  │ 2 weeks ago                     │   │
│  └─────────────────────────────────┘   │
│  [ See all reviews ]                    │
└─────────────────────────────────────────┘
```

### 2.4 Booking Screen

```
┌─────────────────────────────────────────┐
│ ←  Book Ramesh Painting Works           │
├─────────────────────────────────────────┤
│  1. When do you need it?                │
│  ┌──────┐ ┌──────┐ ┌──────┐             │
│  │ Today│ │ Tom. │ │ Pick │             │  ← Date chips
│  └──────┘ └──────┘ └──────┘             │
│                                         │
│  Time slot                              │
│  ◉ 9–12 AM   ○ 12–3 PM   ○ 3–6 PM       │
├─────────────────────────────────────────┤
│  2. Where?                              │
│  📍 #42, 5th Cross, Koramangala  [Edit] │
├─────────────────────────────────────────┤
│  3. What needs to be done?              │
│  ┌─────────────────────────────────┐   │
│  │ e.g., 2 BHK interior, 800 sqft  │   │  ← Multi-line text
│  └─────────────────────────────────┘   │
│  [ + Add photos ]                       │
├─────────────────────────────────────────┤
│  Estimate: ₹12,000 – ₹18,000            │  ← Range, not exact
│  Final price after on-site visit        │
├─────────────────────────────────────────┤
│       [  Confirm Booking  ]             │  ← Sticky bottom CTA
└─────────────────────────────────────────┘
```

### 2.5 Order Tracking Screen

```
┌─────────────────────────────────────────┐
│ ←  Booking #CIV-2041                    │
├─────────────────────────────────────────┤
│   ●━━━━━●━━━━━○━━━━━○                   │  ← Progress bar
│ Requested Accepted In Prog. Completed  │
├─────────────────────────────────────────┤
│  ✓ Requested          Today, 10:42 AM   │
│  ✓ Accepted by vendor Today, 11:15 AM   │
│  ⏳ In progress       —                 │
│  ○ Completed          —                 │
├─────────────────────────────────────────┤
│  Vendor                                 │
│  [photo] Ramesh Painting Works          │
│         📞 Call    💬 Chat              │
├─────────────────────────────────────────┤
│  Job details                            │
│  Date:     Tomorrow, 9–12 AM            │
│  Address:  #42, 5th Cross, Koramangala  │
│  Scope:    2 BHK interior painting      │
│  Estimate: ₹12,000 – ₹18,000            │
├─────────────────────────────────────────┤
│  [ Cancel booking ]  (text-only link)   │
└─────────────────────────────────────────┘
```

### 2.6 Reviews & Ratings Screen (post-job)

```
┌─────────────────────────────────────────┐
│ ←  Rate Ramesh Painting Works           │
├─────────────────────────────────────────┤
│   How was the work?                     │
│                                         │
│      ⭐  ⭐  ⭐  ⭐  ⭐                  │  ← Big tappable stars
│                                         │
│   Tap a star                            │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │ Tell others about your          │   │
│  │ experience (optional)           │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│  [ + Add photo of finished work ]      │
├─────────────────────────────────────────┤
│       [   Submit Review   ]             │
└─────────────────────────────────────────┘
```

**Design rules across all screens:**
- One primary CTA per screen, always sticky-bottom on mobile
- Cards have rounded corners (12-16px), subtle shadow, no harsh borders
- Color: one brand primary (e.g., a confident blue or orange) + neutral grays
- Typography: one sans-serif family, 3 sizes max (heading / body / caption)
- Icons: outline style (Lucide or Phosphor)

---

## 3. CORE MVP FEATURES

### Customer
- Browse 6 service categories
- Search by service name + location
- View vendor profiles
- Book a service (date, time, address, scope, photos)
- Track booking status
- Rate & review after completion

### Vendor
- Sign up + create profile (with portfolio upload)
- List services offered + pricing
- Receive booking requests (push notification)
- Accept / reject bookings
- Update job status: Accepted → In Progress → Completed

### Admin
- View / approve / reject vendor applications
- View all bookings with filters
- Suspend users or vendors
- Basic dashboard (counts: users, vendors, bookings, revenue)

---

## 4. TECH STACK

| Layer | Choice | Why |
|---|---|---|
| Mobile app | **React Native (Expo)** | Single codebase iOS + Android, fastest to ship |
| Web (admin + customer fallback) | **Next.js 14** | SSR, easy deployment, shared TS types with backend |
| Backend | **Node.js + Express** | Simple, well-known, fast iteration. (NestJS only if team prefers structure) |
| Database | **PostgreSQL** | Relational data fits perfectly; mature ecosystem |
| ORM | **Prisma** | Type-safe, great DX, easy migrations |
| Auth | **JWT (access + refresh tokens)** + OAuth (Google) | Standard, mobile-friendly |
| File storage | **AWS S3** | Portfolio images, review photos |
| Push notifications | **Firebase Cloud Messaging** | Free, works on RN out of the box |
| Maps / location | **Google Maps SDK** | Address autocomplete + distance calc |
| Payments (post-MVP) | **Razorpay** | India-first, UPI support |

### DevOps
- **GitHub Actions** — CI/CD on push: lint → test → build → deploy
- **Docker** — `Dockerfile` for backend, `docker-compose.yml` for local dev (api + postgres + redis)
- **AWS deployment** —
  - **EC2** (t3.small to start) for backend
  - **RDS Postgres** (db.t3.micro)
  - **S3** for static assets + uploads
  - **CloudFront** in front of S3 + Next.js
  - **Route 53** for DNS
- **Monitoring** — start with **Sentry** (errors) + **CloudWatch** (logs). Add Grafana later.

---

## 5. DATABASE DESIGN

Full schema in `database/schema.sql`. Quick reference:

**users** — every account starts here
- `id` (uuid, pk), `phone`, `email`, `name`, `role` (customer/vendor/admin), `password_hash`, `created_at`

**vendor_profiles** — extends users where role=vendor
- `id`, `user_id` (fk → users), `business_name`, `bio`, `experience_years`, `category` (enum), `service_area_km`, `kyc_status` (pending/approved/rejected), `rating_avg`, `rating_count`, `cover_photo_url`

**services** — what a vendor offers + pricing
- `id`, `vendor_id` (fk → vendor_profiles), `title`, `description`, `unit` (sqft/hour/lumpsum), `price_per_unit`, `is_active`

**bookings** — the core transaction
- `id`, `customer_id` (fk → users), `vendor_id` (fk → vendor_profiles), `service_id` (fk → services), `scheduled_date`, `time_slot`, `address`, `lat`, `lng`, `scope_text`, `scope_photos` (jsonb), `status` (requested/accepted/rejected/in_progress/completed/cancelled), `price_estimate_min`, `price_estimate_max`, `final_price`, `created_at`, `updated_at`

**reviews** — one per completed booking
- `id`, `booking_id` (fk → bookings, unique), `customer_id`, `vendor_id`, `rating` (1-5), `comment`, `photo_urls` (jsonb), `created_at`

**Relationships:**
```
users (1) ──< vendor_profiles (1) ──< services (N)
users (1) ──< bookings (N) >── vendor_profiles
bookings (1) ── reviews (1)
```

---

## 6. API DESIGN (REST)

Full spec in `docs/API.md`. Highlights:

### Auth
- `POST /api/auth/register` — { phone, email, password, role } → { user, accessToken, refreshToken }
- `POST /api/auth/login` — { phone, password } → tokens
- `POST /api/auth/refresh` — { refreshToken } → new accessToken

### Services / Discovery
- `GET /api/services/categories` — list 6 categories
- `GET /api/vendors?category=painter&lat=12.93&lng=77.62&radius=5` — list vendors near user
- `GET /api/vendors/:id` — full vendor profile + services + recent reviews

### Bookings
- `POST /api/bookings` — create booking (customer)
- `GET /api/bookings/me` — list own bookings (customer or vendor, scoped by role)
- `GET /api/bookings/:id` — single booking detail
- `PATCH /api/bookings/:id/status` — vendor updates status

### Reviews
- `POST /api/reviews` — submit review for completed booking

### Vendor management
- `POST /api/vendors/profile` — create/update vendor profile
- `POST /api/vendors/services` — add service offering

### Admin
- `GET /api/admin/vendors/pending` — vendors awaiting approval
- `PATCH /api/admin/vendors/:id/approve`

---

## 7. MVP PLAN (30 DAYS, STRICT)

### Build first
1. Auth (phone + OTP, or password to start)
2. Customer: home → category → vendor list → vendor profile
3. Booking flow (create + view status)
4. Vendor: receive bookings, accept/reject, update status
5. Reviews
6. Admin: approve vendors

### Do NOT build now
- ❌ In-app chat (use phone call link instead — `tel:` URI)
- ❌ Payments (cash on completion for MVP)
- ❌ Materials marketplace
- ❌ Real-time location tracking of vendor
- ❌ Subscription / wallet / referral system
- ❌ AI features
- ❌ Web app for customers (mobile-only for V1)

### 30-day timeline

| Week | Deliverable |
|---|---|
| **Week 1** | Backend skeleton, DB schema, auth APIs, vendor + service APIs. Postman collection for QA. |
| **Week 2** | Mobile app: home, category list, vendor profile screens. Wired to real API. |
| **Week 3** | Booking flow end-to-end. Vendor app screens (accept/reject, status update). Push notifications. |
| **Week 4** | Reviews, admin dashboard (web), QA, soft launch in 1 city/area with 10 hand-picked vendors. |

### Launch criteria
- 10+ approved vendors per category in 1 pilot area
- Booking → completion → review tested 5 times manually
- Crash-free rate > 99% in TestFlight / internal testing

---

## 8. INITIAL CODE

See:
- `frontend/` — React Native (Expo) starter
- `backend/` — Node.js + Express + Prisma starter
- `database/schema.sql` — full PostgreSQL schema
- `docs/API.md` — full API spec with examples

---

## 9. STARTUP MINDSET

- **Ship in 30 days, not 90.** Cut anything not on the critical path.
- **Hand-pick the first 50 vendors** — don't rely on self-onboarding for V1.
- **One city, one neighborhood first.** Bengaluru Koramangala is a great test bed.
- **Cash on completion** — payments add weeks of compliance work, defer them.
- **Talk to 5 customers and 5 vendors per week.** The product roadmap lives in their words.

---

## Folder structure

```
civilo/
├── README.md                  ← this file
├── frontend/                  ← React Native (Expo) starter
│   ├── package.json
│   ├── App.jsx
│   └── src/
│       ├── components/
│       ├── screens/
│       └── services/
├── backend/                   ← Node.js + Express
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── Dockerfile
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── middleware/
│       └── config/
├── database/
│   └── schema.sql
└── docs/
    ├── API.md
    ├── MVP-PLAN.md
    └── ARCHITECTURE.md
```
