# MegaCare — Remaining Issues & Fix List

> Generated: April 17, 2026
> Source: DIAGNOSTIC.md audit
> All items listed here are **not yet fixed**.

---

## 🔴 CRITICAL — Security

| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | **No async error handling** — no `try/catch` on any async route handler. An unhandled Mongoose error will hang the request or leak a stack trace. | All route files | Install `express-async-errors` and `require` it at the top of `index.js`, OR manually wrap every handler in try/catch. |

---

## 🔧 BACKEND



### Routes

| File | Issue |
|------|-------|
| `routes/messages.js` | `GET /conversations` loads **ALL messages into memory** then aggregates in JavaScript. Breaks at scale. Rewrite using MongoDB aggregation + `$group`. |
| `routes/pharmacy.js` | No stock decrement when an order is placed. Stock counts are stale after orders. |
| `routes/dossier.js` | Only `doctor` role can view patient dossiers — lab and pharmacy roles are blocked even when they legitimately need access. |
| `routes/doctors.js` | Doctor collection still exists with `strict: false` on POST. Either remove the collection or clean it up. |

---

## 🖥️ FRONTEND

### Infrastructure

| Component | Issue | Fix |
|-----------|-------|-----|
| `use-socket.ts` | **Hardcoded `http://localhost:5000`** — bypasses the Vite proxy and breaks in any non-local environment. Also doesn't reconnect on login/logout. | Use a relative URL (`window.location.origin`) or read from `import.meta.env.VITE_API_URL`. |
| `AuthContext.tsx` | No token refresh mechanism. No server-side validation on page reload — trusts whatever is in localStorage. Split state (user in context, token in localStorage) is fragile. | Add a `GET /api/auth/me` call on mount to validate the token server-side. Implement refresh tokens. |
| `ProtectedRoute.tsx` | Only applied to ~15 of 92 routes. Validates against localStorage only — does not verify the token server-side. | Wrap all authenticated routes. Add server-side validation inside `ProtectedRoute`. |
| `use-webrtc.ts` | No TURN server — video calls fail behind NAT/firewalls. Patient side re-emits `webrtc:ready` every 3 seconds even after connection is established. No error handling on SDP operations. | Add a TURN server. Stop re-emitting `webrtc:ready` once `peerConnection.connectionState === "connected"`. Wrap SDP calls in try/catch. |

### Route Protection — Content Flash

These dashboards use `useEffect` redirects instead of `ProtectedRoute`, causing a flash of content before redirect:

| Dashboard | Routes affected |
|-----------|----------------|
| Admin | 6 routes — `/admin/*` |
| Patient | 12 routes — `/dashboard/*` |
| Doctor | 11 routes — `/doctor-dashboard/*` |
| Pharmacy Dashboard | 4 routes — `/pharmacy-dashboard/*` |
| Lab Dashboard | Dashboard page only (sub-pages use `ProtectedRoute`) |
| **Medical Service** | ❌ Dashboard uses `useEffect` AND **11 sub-pages have zero protection** |

**Fix:** Wrap all routes in `App.tsx` with `<ProtectedRoute requiredRole="...">`.

### UI Bugs

| Bug | Location | Fix |
|-----|----------|-----|
| Broken link → 404 | `WelcomePage` — links to `/dashboards-overview` which doesn't exist | Remove the link or redirect to `/` or `/dashboard` |
| Duplicated data arrays | `ParamedicalPage`, `ServicesMedicauxPage`, `LabosRadiologiePage` — listing page AND detail page each embed the full data array | Move shared data to a single module and import it in both, or rely purely on API data |
| Admin settings — toggles not persisted | `AdminSettingsPage` — notification/platform toggles are local state only | Add a backend settings endpoint (e.g., `GET/PATCH /api/admin/settings`) to persist preferences |

---

## ⚡ PERFORMANCE & SCALABILITY

| # | Severity | Issue | Location | Fix |
|---|----------|-------|----------|-----|
| 1 | 🔴 High | `GET /conversations` loads all messages into memory for aggregation | `routes/messages.js` | Rewrite with MongoDB `$group` aggregation pipeline |
| 2 | 🟠 Medium | No pagination on any list endpoint | All GET list routes | Add `?page=` / `?limit=` and return `{ data, total, page, pages }` |
| 3 | 🟠 Medium | No database indexes on frequently queried fields | All models | Add indexes: `role`, `status` on User; `(senderId, receiverId)` on Message; `(patientId, doctorId)` on Appointment/Prescription |
| 4 | 🟠 Medium | Appointment `date`/`time` stored as strings | `models/Appointment.js` | Migrate to `Date` type for reliable sorting and range queries |
| 5 | 🟡 Low | WebRTC `ready` signal re-emitted every 3 seconds indefinitely | `use-webrtc.ts` | Stop re-emitting once `connectionState === "connected"` |
| 6 | 🟡 Low | No MongoDB connection pooling config | `config/db.js` | Set `maxPoolSize`, `serverSelectionTimeoutMS`, and retry logic |
| 7 | 🟡 Low | 10 MB JSON body limit allows unexpectedly large payloads | `index.js` | Reduce to `1mb` or `2mb` unless file uploads are expected |

---

## 🏗️ FEATURE GAPS

| Feature | Impact | Notes |
|---------|--------|-------|
| **TURN server** for WebRTC | High — video calls fail behind NAT/corporate firewalls | No TURN server configured. Google STUN only works on open networks. |
| **Token refresh** | Medium — 7-day JWT expires silently | Add a `POST /api/auth/refresh` endpoint and handle expiry in `AuthContext`. |
| **Real notification system** | Medium — notifications are derived client-side | Add a `Notification` model + `POST /api/notifications` from backend events. Push via Socket.IO. |
| **Input validation (Zod/Joi)** | Medium — all request bodies are unvalidated on the backend | Add a validation middleware layer on all POST/PUT/PATCH routes. |
| **MongoDB connection retry** | Low–Medium — no resilience on DB disconnect | Add retry logic and connection error handling in `config/db.js`. |
| **Error monitoring** | Low in dev, High in prod | Integrate Sentry or equivalent for unhandled exceptions + frontend errors. |

---

## 📋 QUICK-WIN CHECKLIST

Items under 10 minutes each:

- [ ] Install `express-async-errors` and add `require('express-async-errors')` in `index.js`
- [ ] Fix hardcoded `http://localhost:5000` in `use-socket.ts`
- [ ] Fix broken link in `WelcomePage` (`/dashboards-overview` → `/`)
- [ ] Stop `webrtc:ready` re-emit loop in `use-webrtc.ts` after connection established
- [ ] Remove duplicate `"lab"` from User model `role` enum
- [ ] Set `patientId` as required in `Prescription` model
- [ ] Add `timestamps: true` to `Product` model
- [ ] Reduce JSON body limit from `10mb` to `2mb` in `index.js`
- [ ] Remove or fix `strict: false` on Doctor model POST handler

---

## 🗂️ PHASE PRIORITIES

### Phase 1 — Do Now
1. `express-async-errors` — prevents silent crashes on every route
2. Fix `use-socket.ts` hardcoded URL

### Phase 2 — This Sprint
3. Wrap all dashboard routes in `ProtectedRoute` (especially Medical Service sub-pages)
4. Add pagination to all list endpoints
5. Add MongoDB indexes (`role`, `status`, `senderId`, `receiverId`, `patientId`, `doctorId`)
6. Rewrite conversations endpoint with aggregation pipeline
7. Fix stock decrement on pharmacy orders

### Phase 3 — Next Sprint
8. Server-side token validation in `AuthContext` (`GET /api/auth/me`)
9. Add input validation (Zod/Joi) on all backend routes
10. Persist admin settings toggles (notification/platform prefs)
11. Add real backend notification system

### Phase 4 — Production Readiness
12. Add TURN server for WebRTC
13. Implement token refresh (`POST /api/auth/refresh`)
14. Add error monitoring (Sentry)
15. MongoDB connection retry + pooling config
16. Migrate Appointment `date`/`time` to Date type
17. Clean up dead Doctor model/collection









