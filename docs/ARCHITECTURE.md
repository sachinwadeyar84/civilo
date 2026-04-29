# Civilo — Architecture

## High-level

```
┌─────────────────┐     ┌─────────────────┐     ┌───────────────┐
│  Customer app   │     │   Vendor app    │     │  Admin web    │
│  (React Native) │     │  (React Native) │     │  (Next.js)    │
└────────┬────────┘     └────────┬────────┘     └──────┬────────┘
         │                       │                     │
         └───────────────────────┴─────────────────────┘
                                 │
                          HTTPS / JSON
                                 │
                    ┌────────────▼────────────┐
                    │    API Gateway / ALB    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Express API (Node 20) │
                    │   on EC2 (Auto Scaling) │
                    └─────┬───────────┬───────┘
                          │           │
                ┌─────────▼──┐    ┌───▼─────────┐
                │ PostgreSQL │    │   AWS S3    │
                │   (RDS)    │    │  (uploads)  │
                └────────────┘    └─────────────┘
                          │
                    ┌─────▼──────┐
                    │  Firebase  │
                    │    FCM     │
                    └────────────┘
```

## Components

### Mobile apps (Customer + Vendor)
- **Expo / React Native** — single codebase, Android + iOS.
- AsyncStorage for tokens.
- Axios for HTTP, with auth interceptor.
- React Navigation for screen flow.

### Admin web
- **Next.js 14** with App Router.
- Server components for dashboards.
- Same JWT auth as mobile.

### Backend API
- **Node.js + Express**.
- Stateless — JWT in headers, no sessions.
- All business logic in route handlers (small enough for MVP; extract to services if files >300 LOC).
- Validation via Joi.
- Postgres via `pg` directly; can migrate to Prisma when schema stabilizes.

### Database
- **PostgreSQL 16** on AWS RDS.
- Schema: 5 tables (users, vendor_profiles, services, bookings, reviews).
- UUIDs as primary keys (better for distributed IDs, harder to enumerate).
- JSONB for flexible fields (scope_photos, portfolio_urls).

### Storage
- **AWS S3** for portfolio + cover + scope photos.
- Pre-signed URLs for direct upload from mobile (skip API for binary data).

### Notifications
- **Firebase Cloud Messaging (FCM)** for push.
- Vendor receives push on new booking.
- Customer receives push on status changes.

## DevOps

### CI/CD (GitHub Actions)
1. On push to `main`:
   - Lint backend + frontend
   - Run backend tests (Jest + supertest)
   - Build Docker image, push to ECR
   - SSH deploy to EC2 (or use ECS in V2)
2. Mobile builds via **EAS Build** (Expo's cloud build) on tag.

### Environments
- **Local**: docker-compose (api + postgres).
- **Staging**: Single EC2 + RDS in same VPC.
- **Production**: Same as staging for MVP. Move to ECS + RDS Multi-AZ when scaling.

### Monitoring
- **Sentry** — frontend + backend errors.
- **CloudWatch** — backend logs + EC2 metrics.
- **Uptime Kuma** (free, self-hosted) — `/health` endpoint check every minute.

## Security checklist for V1

- [ ] All endpoints over HTTPS only (CloudFront + ACM).
- [ ] Passwords hashed with bcrypt (cost factor 10).
- [ ] JWT secrets in AWS Secrets Manager (or `.env` for MVP).
- [ ] Rate limit auth endpoints (5 req/min per IP).
- [ ] Helmet for security headers.
- [ ] CORS locked to known frontend origins in prod.
- [ ] SQL injection: parameterized queries everywhere (already enforced via `pg`).
- [ ] Input validation on every endpoint via Joi.
- [ ] No PII in logs.

## Scaling plan (post-MVP)

| Bottleneck | Solution |
|---|---|
| API CPU on single EC2 | Move to ECS Fargate, autoscale |
| Postgres connections | PgBouncer in front of RDS |
| Slow vendor search | Add PostGIS for proper geo queries; cache hot categories in Redis |
| Slow image loads | CloudFront in front of S3, image resize via Lambda@Edge |
| Mobile app size | Switch to bare RN if Expo restricts |
