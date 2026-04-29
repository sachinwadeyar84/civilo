# Civilo MVP — 30-Day Execution Plan

## Build first (in order)

1. **Auth** — phone + password (OTP comes V2)
2. **Customer discovery** — home → category → vendor list → vendor profile
3. **Booking flow** — create + view status
4. **Vendor app** — receive booking, accept/reject, update status
5. **Reviews** — rate + comment
6. **Admin dashboard** — approve vendors, monitor bookings

## Do NOT build now

| Skip this | Why | When to revisit |
|---|---|---|
| In-app chat | Replaceable with `tel:` call link | After 100 bookings |
| Payments / wallet | Compliance overhead, KYC complexity | Month 2-3 |
| Materials marketplace | Different product entirely | Phase 2 |
| Real-time vendor location | Logistics complexity, low MVP value | After PMF |
| Subscriptions / referrals | Not needed pre-PMF | After 1000 customers |
| AI / smart matching | Premature optimization | After data volume justifies |
| Customer web app | Mobile-first audience | After Android+iOS launch |
| Multi-language | Start English+Hindi later | After regional expansion |

## 30-day calendar

### Week 1 — Foundation
- **Mon-Tue**: Backend skeleton (Express + Postgres + auth). Run `schema.sql`.
- **Wed-Thu**: Vendor + service CRUD. Discovery endpoint with location filter.
- **Fri**: Postman collection, seed script with 20 fake vendors. **Demo to founder.**

### Week 2 — Customer mobile screens
- **Mon-Tue**: Expo project, navigation, login, home screen.
- **Wed**: Service list screen with real data.
- **Thu**: Vendor profile screen.
- **Fri**: Polish, **install on 3 phones for self-test.**

### Week 3 — Bookings end-to-end
- **Mon-Tue**: Booking create flow + booking screen.
- **Wed**: Order tracking screen with status polling.
- **Thu**: Vendor app screens (accept/reject, update status).
- **Fri**: Push notifications via FCM. **5 test bookings end-to-end.**

### Week 4 — Reviews + Admin + Launch
- **Mon**: Review submit + display.
- **Tue-Wed**: Admin web dashboard (Next.js): approve vendors, see stats.
- **Thu**: QA pass — 10 test bookings, fix bugs.
- **Fri**: **Soft launch in Koramangala with 10 hand-picked vendors.**

## Launch criteria (don't ship without these)

- [ ] At least 10 approved vendors per active category
- [ ] 5+ end-to-end booking flows tested manually (different devices)
- [ ] Crash-free rate > 99% in TestFlight / internal Android testing
- [ ] Vendor app pushes notifications work reliably
- [ ] Cancel & rebook flow tested
- [ ] One real customer, paid for a service, left a 5-star review

## Team needed

- 1 backend engineer (Node + Postgres)
- 1 mobile engineer (React Native)
- 1 designer (part-time, Figma)
- 1 founder doing customer/vendor outreach + onboarding

## Cost estimate (month 1)

| Item | INR/month |
|---|---|
| AWS EC2 t3.small + RDS db.t3.micro | ~₹3,500 |
| S3 + CloudFront | ~₹500 |
| Domain + SSL | ~₹100 |
| Sentry (free tier) | ₹0 |
| FCM | ₹0 |
| MSG91 (SMS, when added) | ~₹500 (per 1000 SMS) |
| **Total** | **~₹4,500** |

## After launch — first 90 days

- Week 5-8: Add OTP login, payments (Razorpay), in-app chat.
- Week 9-12: Expand to 2nd neighborhood, hire 1 more vendor success rep.
- Track: weekly active customers, booking-completion rate, vendor retention, NPS.
