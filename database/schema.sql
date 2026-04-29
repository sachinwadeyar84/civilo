-- ============================================================
-- Civilo MVP — PostgreSQL schema
-- Run with: psql $DATABASE_URL -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── ENUMS ───────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vendor_category AS ENUM (
    'interior_designer', 'civil_engineer', 'contractor',
    'painter', 'renovation_expert', 'plumber', 'electrician'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE service_unit AS ENUM ('sqft', 'hour', 'lumpsum', 'visit');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM (
    'requested', 'accepted', 'rejected',
    'in_progress', 'completed', 'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── USERS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            VARCHAR(120) NOT NULL,
  phone           VARCHAR(20)  UNIQUE NOT NULL,
  email           VARCHAR(160) UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  role            user_role    NOT NULL DEFAULT 'customer',
  is_active       BOOLEAN      NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);


-- ── VENDOR_PROFILES ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  business_name     VARCHAR(120) NOT NULL,
  bio               TEXT,
  category          vendor_category NOT NULL,
  experience_years  SMALLINT NOT NULL DEFAULT 0,
  service_area_km   SMALLINT NOT NULL DEFAULT 10,
  lat               NUMERIC(10, 7),
  lng               NUMERIC(10, 7),
  cover_photo_url   VARCHAR(500),
  portfolio_urls    JSONB DEFAULT '[]'::jsonb,
  kyc_status        kyc_status NOT NULL DEFAULT 'pending',
  rating_avg        NUMERIC(2, 1),
  rating_count      INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_vendor_category ON vendor_profiles(category);
CREATE INDEX IF NOT EXISTS idx_vendor_kyc ON vendor_profiles(kyc_status);
CREATE INDEX IF NOT EXISTS idx_vendor_location ON vendor_profiles(lat, lng);


-- ── SERVICES (offered by vendors) ───────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id       UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  title           VARCHAR(120) NOT NULL,
  description     TEXT,
  unit            service_unit NOT NULL,
  price_per_unit  NUMERIC(10, 2) NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_vendor ON services(vendor_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);


-- ── BOOKINGS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookings (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         UUID NOT NULL REFERENCES users(id),
  vendor_id           UUID NOT NULL REFERENCES vendor_profiles(id),
  service_id          UUID NOT NULL REFERENCES services(id),

  scheduled_date      DATE NOT NULL,
  time_slot           VARCHAR(16) NOT NULL,    -- e.g. '9-12', '12-3'

  address             TEXT NOT NULL,
  lat                 NUMERIC(10, 7),
  lng                 NUMERIC(10, 7),

  scope_text          TEXT NOT NULL,
  scope_photos        JSONB DEFAULT '[]'::jsonb,

  status              booking_status NOT NULL DEFAULT 'requested',
  price_estimate_min  NUMERIC(10, 2),
  price_estimate_max  NUMERIC(10, 2),
  final_price         NUMERIC(10, 2),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(scheduled_date);


-- ── REVIEWS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id    UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id   UUID NOT NULL REFERENCES users(id),
  vendor_id     UUID NOT NULL REFERENCES vendor_profiles(id),
  rating        SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  photo_urls    JSONB DEFAULT '[]'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON reviews(vendor_id);


-- ── updated_at trigger ──────────────────────────────────────
CREATE OR REPLACE FUNCTION trg_set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();

DROP TRIGGER IF EXISTS vendor_profiles_updated_at ON vendor_profiles;
CREATE TRIGGER vendor_profiles_updated_at BEFORE UPDATE ON vendor_profiles
  FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
