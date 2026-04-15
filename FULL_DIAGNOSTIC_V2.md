# MegaCare Platform — Full Diagnostic Report (v2)

> Generated: April 15, 2026  
> Scope: Complete backend + frontend audit — all open issues, bugs, missing features, security gaps  
> Previous diagnostic: DIAGNOSTIC.md (v1, April 14 2026)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What Is Now Working](#2-what-is-now-working)
3. [Open Issues — Frontend](#3-open-issues--frontend)
4. [Open Issues — Backend](#4-open-issues--backend)
5. [Security Vulnerabilities (Remaining)](#5-security-vulnerabilities-remaining)
6. [Hardcoded Data Still to Fix](#6-hardcoded-data-still-to-fix)
7. [Route Protection Status](#7-route-protection-status)
8. [Page-by-Page Status Matrix](#8-page-by-page-status-matrix)
9. [API Endpoint Inventory](#9-api-endpoint-inventory)
10. [Performance & Scalability](#10-performance--scalability)
11. [Recommended Action Plan](#11-recommended-action-plan)

---

## 1. Executive Summary

| Metric | Value |
|--------|-------|
| Total frontend routes | ~90 |
| Pages fully API-connected | ~75 (83%) |
| Pages with hardcoded/static data | **~8 (9%)** |
| Pages that are intentionally static | ~7 (8%) |
| Backend routes | 60+ |
| Remaining security issues | **5** (2 critical, 3 medium) |
| Remaining hardcoded issues | **8** |
| Unprotected dashboard routes | **~35** |

**Bottom line:** The core platform (auth, appointments, messaging, WebRTC, medical records, prescriptions, pharmacy, lab, medical service, paramedical) is fully functional and API-connected. The remaining work falls into four buckets:

1. **3 detail pages** still serve fake data (lab detail, medical service detail, paramedical product detail)
2. **2 admin pages** have no-op save buttons (settings) and missing suspend endpoint
3. **~35 dashboard routes** lack `ProtectedRoute` wrappers (content flash, no role enforcement)
4. **2 critical security holes** in backend still open (`PUT /api/users/:id` privilege escalation, `GET /api/users` PII exposure)

---

## 2. What Is Now Working

### ✅ Fully Functional

| Area | Pages / Endpoints | Status |
|------|------------------|--------|
| Authentication | Register, Login, Logout (blacklist), Profile, Change Password | ✅ |
| Patient Dashboard | Dashboard, Appointments, Consultations, Find Doctor, Medical History, Medical Records, Messages, Notifications, Prescriptions, Settings | ✅ |
| Doctor Dashboard | Dashboard, Agenda, Consultations, Live Consultation, Patients, Patient Dossier, Prescriptions, Revenue, Reviews, Settings, Messaging | ✅ |
| Pharmacy (customer) | Catalogue, Medicine Detail, Chat, Prescriptions, Prescription Scanner | ✅ |
| Pharmacy Dashboard | KPIs, Supplier Orders, Sales, Stock | ✅ |
| Lab Dashboard | KPIs, Tests CRUD, Results CRUD | ✅ |
| Medical Service Dashboard | KPIs, Patients, Equipment, Team, Schedule, Billing, Prescriptions, Analytics, Vitals, Teleconsultation, Messaging, Settings | ✅ |
| Paramedical Dashboard | KPIs, Patients, Appointments, Supplies, Vitals, Care Sessions, Notifications, Planning, Reports, Map, Messaging, Settings, Teleconsultation | ✅ |
| Admin | User list, Pending approvals, Suspended users, Stats | ✅ |
| Public listings | Doctors, Labs & Radiology (list), Services Médicaux (list), Paramedical (list) | ✅ |
| Security (MEDIUM) | Helmet, Socket validation, Token blacklist, Admin middleware dedup, CORS | ✅ |
| Security (HIGH) | JWT secret, Password policy, Rate limiting, Role registration, Appointments guard, Doctor model, Regex injection | ✅ |

---

## 3. Open Issues — Frontend

### 3.1 Hardcoded Detail Pages

#### 🔴 `LaboDetailPage.tsx` — `/labos-radiologie/:id`

The listing page (`LabosRadiologiePage.tsx`) correctly fetches from `GET /api/public/labs`. But the detail page has a `const labs: LabCenter[]` array defined **inline in the file** containing 1-2 mock records with fake gallery images, schedules, team members, patient reviews, and exam catalogs. It finds the record by matching `id === params.id` against that mock array — so only IDs `"1"` and `"2"` produce any content.

- **Missing backend endpoint:** `GET /api/public/labs/:id`
- **Missing backend endpoint:** `POST /api/public/labs/:id/book` (booking modal is a no-op)
- **Fix:** Add `/:id` route to `routes/public.js`, fetch in `useEffect` with `useParams()`, remove `const labs = [...]`

---

#### 🔴 `ServiceMedicalDetailPage.tsx` — `/services-medicaux/:id`

Same pattern: listing page fetches from `GET /api/public/establishments`, but detail page has `const establishments: MedicalEstablishment[]` inline with 2 mock records (Clinique Hannibal, Hôpital Aziza Othmana). Booking modal generates slots but never saves.

- **Missing backend endpoint:** `GET /api/public/establishments/:id`
- **Missing backend endpoint:** Booking flow
- **Fix:** Add `/:id` route to `routes/public.js`, remove mock array, fetch by dynamic ID

---

#### 🔴 `ParamedicalProductPage.tsx` — `/paramedical/product/:id`

5 products hardcoded inline with full specs (description, usage, compatibility, feature list, image URLs). Listing page `ParamedicalPage.tsx` fetches from API, but detail page is completely disconnected.

- **Missing backend endpoint:** `GET /api/public/paramedical-products/:id`
- **Model gap:** `ParamedicalProduct` model needs `description`, `usage`, `compatibility`, `features: [String]`, `images: [String]` fields
- **Fix:** Extend model + seed, add `/:id` route, replace mock array with fetch

---

### 3.2 No-Op Save Buttons

#### 🔴 `AdminSettingsPage.tsx` — `/admin/settings`

Both save handlers are no-ops with comments "In a real app, call PATCH /api/...":

```tsx
const handleProfileSave = () => {
  // "In a real app, call PATCH /api/admin/profile"
  setProfileSaved(true);  // fake success toast only
};
const handlePasswordSave = () => {
  // "In a real app, call PATCH /api/admin/password"
  setPwdSaved(true);  // fake success toast only
};
```

Notification toggles (`notifNewUser`, `notifPending`, `maintenanceMode`, etc.) are local React state — never persisted across page reloads.

- **Fix profile save:** Call `PATCH /api/auth/profile` (already exists)
- **Fix password save:** Call `POST /api/auth/change-password` (already exists)
- **Fix preferences:** Either accept they are UI-only (document it) or add `PATCH /api/admin/preferences`

---

### 3.3 Socket URL Hardcoded

#### 🔴 `hooks/use-socket.ts` (and `use-socket.js`)

```ts
const s = io("http://localhost:5000", { auth: { token } });
```

Hard-coded to `localhost:5000`. This bypasses the Vite dev proxy and **will break in any environment other than local development**.

- **Fix:** Use `import.meta.env.VITE_SOCKET_URL ?? ""` (empty string = same-origin auto-detect)
- **Action:** Create `frontend/.env` entry `VITE_SOCKET_URL=http://localhost:5000` and `frontend/.env.production` with the production URL

---

### 3.4 Broken Link

#### 🟡 `WelcomePage.tsx` — `/welcome`

Contains a `<Link to="/dashboards-overview">` which does not exist as a route in `App.tsx` → 404.

- **Fix:** Remove or redirect this link

---

### 3.5 Route Protection — Content Flash & Role Bypass

See full table in [Section 7](#7-route-protection-status). In summary:

- **Admin** (6 routes), **Patient** (12), **Doctor** (11), **Pharmacy Dashboard** (4), **Medical Service Dashboard** (12), **Lab Dashboard** (1) — all use `useEffect` redirect which fires **after** the page renders, causing a visible flash of protected content to unauthenticated users
- **Medical Service Dashboard sub-pages** (11/12) have **zero protection** — no `ProtectedRoute`, no `useEffect` redirect
- **Fix:** Wrap all dashboard routes in `<ProtectedRoute requiredRole="...">` in `App.tsx`

---

### 3.6 AuthContext — No Token Validation on Reload

`AuthContext` reads the user from localStorage on mount. It does **not** call `GET /api/auth/profile` to validate the token is still valid/not expired. A user with a deleted account could still be "logged in" from the client's perspective.

- **Fix:** On mount, if a token is present, call `GET /api/auth/profile`. If it returns 401, clear the token and user.

---

### 3.7 WebRTC — No TURN Server

`use-webrtc.ts` uses only Google STUN servers (`stun:stun.l.google.com`). WebRTC peer-to-peer connections will **fail for users behind symmetric NAT** (corporate firewalls, some mobile networks).

- **Fix:** Configure a TURN server (e.g., Coturn, Twilio TURN)

---

### 3.8 `RevenuePage.tsx` — Fixed Consultation Fee

```tsx
const CONSULTATION_FEE = 80; // TND — applied to all completed appointments
```

Revenue = `completedAppointments.length × 80`. This ignores any actual fee variation per appointment type or doctor.

- **Fix:** Add a `fee` field to `Appointment` model. Set it on creation. Sum `appointment.fee` instead.

---

## 4. Open Issues — Backend

### 4.1 Missing Routes

| Endpoint | Needed By | Status |
|----------|-----------|--------|
| `GET /api/public/labs/:id` | `LaboDetailPage.tsx` | ❌ Missing |
| `GET /api/public/establishments/:id` | `ServiceMedicalDetailPage.tsx` | ❌ Missing |
| `GET /api/public/paramedical-products/:id` | `ParamedicalProductPage.tsx` | ❌ Missing |
| `PATCH /api/admin/users/:id/suspend` | `AdminSuspendedPage.tsx`, `AdminUsersPage.tsx` | ❌ Missing — frontend calls it, gets 404 |
| `PATCH /api/admin/users/:id/reactivate` | `AdminSuspendedPage.tsx` | ⚠️ Frontend maps `reactivate` → `approve` path (works but non-semantic) |

---

### 4.2 No Async Error Handling

Every route file uses `async` handlers without `try/catch`. An unhandled Mongoose error (network issue, validation failure, query timeout) will **crash the request** and either hang or leak a stack trace to the client.

Affected files: **all 14 route files** (`auth.js`, `admin.js`, `users.js`, `doctors.js`, `appointments.js`, `prescriptions.js`, `pharmacy.js`, `lab.js`, `medical-service.js`, `paramedical.js`, `messages.js`, `dossier.js`, `reviews.js`, `public.js`)

- **Fix (1 line):** Install `express-async-errors` and `require("express-async-errors")` at the top of `index.js`. Unhandled promise rejections will become 500 responses automatically.

---

### 4.3 `PUT /api/users/:id` — Privilege Escalation

Any logged-in user can send:
```json
PUT /api/users/:id
{ "role": "admin", "status": "approved" }
```
Only `password`, `id`, and `email` are stripped — `role` and `status` pass through to MongoDB `findByIdAndUpdate`.

- **Fix:** Also strip `role` and `status` from `updates`:
  ```js
  const { password, id, email, role, status, ...updates } = req.body;
  ```

---

### 4.4 `GET /api/users` — PII Exposure

Returns every user's name, email, phone, address, role, and status to **any authenticated user**. A patient can enumerate all doctor emails and phone numbers.

- **Fix:** Restrict to `admin` and `doctor` roles:
  ```js
  if (!["admin", "doctor"].includes(req.user.role)) {
    return res.status(403).json({ message: "Accès refusé" });
  }
  ```

---

### 4.5 No Pagination on List Endpoints

All `GET` list routes return the full collection. At scale (thousands of appointments, messages, products), this will be slow and memory-intensive.

Affected: `GET /api/appointments`, `GET /api/messages`, `GET /api/users`, `GET /api/prescriptions`, `GET /api/pharmacy/products`, `GET /api/lab/tests`, `GET /api/lab/results`, and all medical-service / paramedical list routes.

- **Fix:** Add `?page=&limit=` query params with `Model.find().skip(skip).limit(limit)`

---

### 4.6 Conversations Endpoint — Memory Aggregation

`GET /api/messages/conversations` loads **all messages** into a JavaScript `Map` to compute the last message per conversation partner. On a production system with thousands of messages this will OOM.

- **Fix:** Use MongoDB aggregation (`$group`, `$sort`, `$limit`) to compute conversations server-side.

---

### 4.7 No Database Indexes

Frequently queried fields have no indexes:

| Field | Model | Impact |
|-------|-------|--------|
| `role`, `status` | User | Admin queries, login role checks |
| `doctorId`, `patientId` | Appointment | Dashboard queries |
| `senderId`, `receiverId` | Message | Conversation queries |
| `patientId`, `doctorId` | Prescription, Dossier | Patient/doctor views |

- **Fix:** Add `schema.index({ field: 1 })` in each model file

---

### 4.8 `Appointment` Model — Dates Stored as Strings

`date` and `time` fields are `String` type. This prevents:
- Efficient date-range queries
- Correct chronological sorting
- Atlas/query optimisation

- **Fix:** Change `date` to `Date` type, store ISO timestamps. Add a migration script to convert existing strings.

---

### 4.9 `Product` Model — No Timestamps

`Product` model has no `timestamps: true`. Created-at / updated-at tracking is unavailable for stock management.

---

### 4.10 Admin Route — No `suspend` Endpoint

`PATCH /api/admin/users/:id/suspend` does not exist. The frontend calls it; it returns 404. Suspending a user does nothing.

---

## 5. Security Vulnerabilities (Remaining)

### 🔴 CRITICAL

| # | Vulnerability | Location | Impact |
|---|--------------|----------|--------|
| C1 | **Privilege escalation via `PUT /api/users/:id`** | `routes/users.js` | Any authenticated user can set their own `role: "admin"` and `status: "approved"` |
| C2 | **`GET /api/users` exposes all user PII** | `routes/users.js` | Any logged-in user can list every email, phone, address, role in the system |

### 🟠 HIGH

| # | Vulnerability | Location | Impact |
|---|--------------|----------|--------|
| H1 | **No async error handling** | All 14 route files | Unhandled Mongoose errors crash requests or leak stack traces |

### 🟡 MEDIUM

| # | Vulnerability | Location | Impact |
|---|--------------|----------|--------|
| M1 | **Socket URL hardcoded to localhost** | `hooks/use-socket.ts` | Not a security issue per se — production breakage |
| M2 | **AuthContext trusts localStorage without server validation** | `contexts/AuthContext.tsx` | Stale/deleted users remain "logged in" client-side |
| M3 | **No input validation library** | All backend routes | Business logic relies on Mongoose model validation only — no pre-validation of request shape |

### ✅ Previously Fixed

| # | Issue | Fixed |
|---|-------|-------|
| 1–4 | Critical: JWT secret, privilege escalation guards (prescriptions), role whitelist, appointments guard | ✅ |
| 5–12 | High: Password policy, rate limiting, regex injection, doctor model, admin dedup | ✅ |
| 13–17 | Medium: Helmet, socket target validation, token blacklist, admin middleware dedup, CORS | ✅ |

---

## 6. Hardcoded Data Still to Fix

See [HARDCODED_AUDIT.md](HARDCODED_AUDIT.md) for full details. Summary:

| # | File | Issue | Estimated Effort |
|---|------|-------|-----------------|
| 1 | `LaboDetailPage.tsx` | Full lab records hardcoded inline | Medium — need `GET /api/public/labs/:id` |
| 2 | `ServiceMedicalDetailPage.tsx` | Full establishment records hardcoded inline | Medium — need `GET /api/public/establishments/:id` |
| 3 | `ParamedicalProductPage.tsx` | Full product specs hardcoded inline | Medium — need model extension + `GET /api/public/paramedical-products/:id` |
| 4 | `AdminSettingsPage.tsx` | Profile & password saves are no-ops | Low — endpoints exist, just need to be called |
| 5 | `use-socket.ts` | `localhost:5000` hardcoded | Low — env variable |
| 6 | `routes/admin.js` | No `suspend` endpoint | Low — add one route |
| 7 | `LabosRadiologiePage.tsx`, `ServicesMediauxPage.tsx` | Filter lists hardcoded | Low — move to shared config file |
| 8 | `RevenuePage.tsx` | `CONSULTATION_FEE = 80` constant | Medium — requires Appointment model change |

---

## 7. Route Protection Status

### Legend
- ✅ `ProtectedRoute` — server-validated role check, no flash
- ⚠️ `useEffect` redirect — renders first, then redirects (content flash)
- ❌ None — completely unprotected

| Dashboard | Route | Protection | Issue |
|-----------|-------|-----------|-------|
| **Admin** | `/admin` | ⚠️ useEffect | Flash |
| **Admin** | `/admin/users` | ⚠️ useEffect | Flash |
| **Admin** | `/admin/pending` | ⚠️ useEffect | Flash |
| **Admin** | `/admin/suspended` | ⚠️ useEffect | Flash |
| **Admin** | `/admin/stats` | ⚠️ useEffect | Flash |
| **Admin** | `/admin/settings` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/appointments` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/consultations` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/live-consultation` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/find-doctor` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/medical-history` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/medical-records` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/messages` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/notifications` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/prescriptions` | ⚠️ useEffect | Flash |
| **Patient** | `/dashboard/settings` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/agenda` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/consultations` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/live-consultation` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/patients` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/patient-dossier/:id` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/prescriptions` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/revenue` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/reviews` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/settings` | ⚠️ useEffect | Flash |
| **Doctor** | `/doctor-dashboard/messaging` | ⚠️ useEffect | Flash |
| **Pharmacy Dashboard** | `/pharmacy-dashboard` | ⚠️ useEffect | Flash |
| **Pharmacy Dashboard** | `/pharmacy-dashboard/orders` | ⚠️ useEffect | Flash |
| **Pharmacy Dashboard** | `/pharmacy-dashboard/sales` | ⚠️ useEffect | Flash |
| **Pharmacy Dashboard** | `/pharmacy-dashboard/stock` | ⚠️ useEffect | Flash |
| **Lab Dashboard** | `/lab-dashboard` | ⚠️ useEffect | Flash |
| **Lab Dashboard** | `/lab-dashboard/results` | ✅ ProtectedRoute | OK |
| **Lab Dashboard** | `/lab-dashboard/tests` | ✅ ProtectedRoute | OK |
| **Medical Service** | `/medical-service-dashboard` | ⚠️ useEffect | Flash |
| **Medical Service** | All 11 sub-pages | ❌ **None** | No protection |
| **Paramedical** | All 13 routes | ✅ ProtectedRoute | OK |

**Recommended fix for App.tsx:**
```tsx
// Replace unprotected admin routes with:
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin"><AdminPage /></ProtectedRoute>
} />
// ... repeat for all admin, patient, doctor, pharmacy dashboard routes
```

---

## 8. Page-by-Page Status Matrix

### Legend
- 🟢 = API-connected, fully working
- 🟡 = Partially working or has bugs
- 🔴 = Hardcoded/mock data only
- ⚫ = Static content (intentional)

### Public Pages

| Route | Status | Notes |
|-------|--------|-------|
| `/` | ⚫ | Static landing |
| `/login` | 🟢 | API |
| `/register` | 🟢 | API |
| `/doctors` | 🟢 | `GET /api/doctors` |
| `/doctor/:id` | 🟢 | `GET /api/doctors/:id` |
| `/guide` | ⚫ | Static |
| `/consultation` | 🟢 | API |
| `/profile` | 🟢 | API |
| `/welcome` | 🟡 | Static OK but has broken link to `/dashboards-overview` |
| `/paramedical` | 🟢 | `GET /api/public/paramedical-products` |
| `/paramedical/product/:id` | 🔴 | Hardcoded inline products array |
| `/services-medicaux` | 🟢 | `GET /api/public/establishments` |
| `/services-medicaux/:id` | 🔴 | Hardcoded inline establishments array |
| `/labos-radiologie` | 🟢 | `GET /api/public/labs` |
| `/labos-radiologie/:id` | 🔴 | Hardcoded inline labs array |
| `/conditions-utilisation` | ⚫ | Static |
| `/politique-confidentialite` | ⚫ | Static |

### Admin Dashboard

| Route | Status | Notes |
|-------|--------|-------|
| `/admin` | 🟢 | `GET /api/admin/users` |
| `/admin/users` | 🟢 | `GET /api/admin/users` + actions |
| `/admin/pending` | 🟢 | `GET /api/admin/users` filtered |
| `/admin/suspended` | 🟡 | suspend action calls missing `PATCH /.../suspend` endpoint (404) |
| `/admin/stats` | 🟢 | Derived from real user data |
| `/admin/settings` | 🟡 | Profile/password saves are no-ops |

### Patient Dashboard

| Route | Status | Notes |
|-------|--------|-------|
| `/dashboard` | 🟢 | API |
| `/dashboard/appointments` | 🟢 | API |
| `/dashboard/consultations` | 🟢 | API |
| `/dashboard/live-consultation` | 🟢 | API + WebRTC |
| `/dashboard/find-doctor` | 🟢 | API |
| `/dashboard/medical-history` | 🟢 | API |
| `/dashboard/medical-records` | 🟢 | API |
| `/dashboard/messages` | 🟢 | API + Socket.IO |
| `/dashboard/notifications` | 🟢 | API |
| `/dashboard/prescriptions` | 🟢 | API |
| `/dashboard/settings` | 🟢 | API |

### Doctor Dashboard

| Route | Status | Notes |
|-------|--------|-------|
| `/doctor-dashboard` | 🟢 | API |
| `/doctor-dashboard/agenda` | 🟢 | API |
| `/doctor-dashboard/consultations` | 🟢 | API |
| `/doctor-dashboard/live-consultation` | 🟢 | API + WebRTC |
| `/doctor-dashboard/patients` | 🟢 | API |
| `/doctor-dashboard/patient-dossier/:id` | 🟢 | API |
| `/doctor-dashboard/prescriptions` | 🟢 | API |
| `/doctor-dashboard/revenue` | 🟡 | API-connected but uses hardcoded `CONSULTATION_FEE = 80` |
| `/doctor-dashboard/reviews` | 🟢 | API |
| `/doctor-dashboard/settings` | 🟢 | API |
| `/doctor-dashboard/messaging` | 🟢 | API + Socket.IO |

### Pharmacy (Customer)

| Route | Status | Notes |
|-------|--------|-------|
| `/pharmacy` | 🟢 | `GET /api/pharmacy/products` |
| `/pharmacy/chat` | 🟢 | API + Socket.IO |
| `/pharmacy/medicine/:id` | 🟢 | `GET /api/pharmacy/products/:id` |
| `/pharmacy/prescriptions` | 🟢 | API |
| `/pharmacy/prescription-scanner` | 🟢 | OCR + DB enrichment |

### Pharmacy Dashboard

| Route | Status |
|-------|--------|
| `/pharmacy-dashboard` | 🟢 |
| `/pharmacy-dashboard/orders` | 🟢 |
| `/pharmacy-dashboard/sales` | 🟢 |
| `/pharmacy-dashboard/stock` | 🟢 |

### Lab Dashboard

| Route | Status |
|-------|--------|
| `/lab-dashboard` | 🟢 |
| `/lab-dashboard/tests` | 🟢 |
| `/lab-dashboard/results` | 🟢 |

### Medical Service Dashboard

| Route | Status |
|-------|--------|
| All 12 pages | 🟢 |

### Paramedical Dashboard

| Route | Status |
|-------|--------|
| All 13 pages | 🟢 |

---

## 9. API Endpoint Inventory

### Existing & Used

| Endpoint | Method | Used By |
|----------|--------|---------|
| `/api/auth/register` | POST | RegisterPage |
| `/api/auth/login` | POST | LoginPage |
| `/api/auth/logout` | POST | All dashboards (token blacklisted) |
| `/api/auth/profile` | GET/PATCH | ProfilePage, SettingsPage, DoctorSettingsPage, ParamedicalSettingsPage, MedicalServiceSettingsPage |
| `/api/auth/change-password` | POST | ProfilePage, SettingsPage, all dashboard settings pages |
| `/api/admin/users` | GET | All admin pages |
| `/api/admin/users/:id/approve` | PATCH | AdminPendingPage, AdminUsersPage |
| `/api/admin/users/:id/reject` | PATCH | AdminPendingPage, AdminUsersPage |
| `/api/appointments` | GET/POST/DELETE | Patient + Doctor dashboards |
| `/api/appointments/:id/status` | PATCH | DoctorDashboardPage, LiveConsultationPage |
| `/api/users` | GET | DoctorPatientsPage |
| `/api/users/:id` | GET | Multiple pages (name resolution) |
| `/api/dossier` | GET/PUT | MedicalRecordsPage, MedicalHistoryPage |
| `/api/dossier/:patientId` | GET | PatientDossierPage |
| `/api/dossier/:patientId/consultation` | POST | LiveConsultationPage |
| `/api/doctors` | GET | FindDoctorPage, DoctorsPage |
| `/api/doctors/:id` | GET | DoctorDetailPage |
| `/api/prescriptions` | GET/POST | PrescriptionsPage, DashboardPage, DoctorPrescriptionsPage |
| `/api/messages/conversations` | GET | Messaging pages |
| `/api/messages/contacts` | GET | Messaging pages |
| `/api/messages/thread/:partnerId` | GET | Messaging + Live consultation |
| `/api/messages` | POST | Messaging + Live consultation |
| `/api/pharmacy/products` | GET | PharmacyPage, StockPage |
| `/api/pharmacy/products/:id` | GET | MedicineDetailPage |
| `/api/pharmacy/kpis` | GET | PharmacyDashboardPage |
| `/api/pharmacy/sales` | GET | SalesPage |
| `/api/pharmacy/supplier-orders` | GET/POST/PUT | PharmacyDashboardOrdersPage |
| `/api/lab/kpis` | GET | LabDashboardPage |
| `/api/lab/tests` | GET/POST/PUT | LabTestsPage |
| `/api/lab/results` | GET/POST | LabResultsPage |
| `/api/medical-service/*` | Mixed | All Medical Service pages (12) |
| `/api/paramedical/*` | Mixed | All Paramedical pages (13) |
| `/api/reviews` | GET/POST/PATCH | ReviewsPage |
| `/api/public/paramedical-products` | GET | ParamedicalPage |
| `/api/public/establishments` | GET | ServicesMediauxPage |
| `/api/public/labs` | GET | LabosRadiologiePage |

### Missing Endpoints (Needed)

| Endpoint | Needed By | Priority |
|----------|-----------|----------|
| `GET /api/public/labs/:id` | `LaboDetailPage.tsx` | 🔴 High |
| `GET /api/public/establishments/:id` | `ServiceMedicalDetailPage.tsx` | 🔴 High |
| `GET /api/public/paramedical-products/:id` | `ParamedicalProductPage.tsx` | 🔴 High |
| `PATCH /api/admin/users/:id/suspend` | `AdminSuspendedPage.tsx`, `AdminUsersPage.tsx` | 🔴 High |

### Existing But Unused

| Endpoint | Method | Notes |
|----------|--------|-------|
| `/api/users/:id` | PUT | Settings pages use `PATCH /api/auth/profile` instead |
| `/api/pharmacy/orders` | POST/GET | No longer in scope (reservation model) |
| `/health` | GET | Health check, not used by frontend |

---

## 10. Performance & Scalability

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| 1 | Conversations loads ALL messages into JS for aggregation | High | `routes/messages.js` |
| 2 | No pagination on any list endpoint | Medium | All GET list routes |
| 3 | No database indexes on queried fields | Medium | All models |
| 4 | Appointment dates stored as strings | Medium | `Appointment` model |
| 5 | `webrtc:ready` re-emitted every 3s after connection | Low | `use-webrtc.ts` |
| 6 | No MongoDB connection pool config | Low | `config/db.js` |
| 7 | 10MB JSON body limit | Low | `index.js` |
| 8 | Token blacklist is in-memory Map (lost on restart) | Low | `middleware/tokenBlacklist.js` — replace with Redis for production |

---

## 11. Recommended Action Plan

### Phase 1 — Quick Fixes (< 2 hours total)

| Priority | Task | File(s) | Effort |
|----------|------|---------|--------|
| 🔴 | Fix privilege escalation: strip `role` and `status` from `PUT /api/users/:id` | `routes/users.js` | 1 line |
| 🔴 | Restrict `GET /api/users` to admin/doctor roles | `routes/users.js` | 3 lines |
| 🔴 | Add `PATCH /api/admin/users/:id/suspend` endpoint | `routes/admin.js` | ~10 lines |
| 🔴 | Wire `AdminSettingsPage` profile save to `PATCH /api/auth/profile` | `AdminSettingsPage.tsx` | ~15 lines |
| 🔴 | Wire `AdminSettingsPage` password save to `POST /api/auth/change-password` | `AdminSettingsPage.tsx` | ~10 lines |
| 🔴 | Fix socket URL — use `import.meta.env.VITE_SOCKET_URL` | `hooks/use-socket.ts` | 1 line |
| 🟠 | Install `express-async-errors` — one-line fix for all route crashes | `index.js` | 2 lines |
| 🟡 | Fix broken link to `/dashboards-overview` in `WelcomePage.tsx` | `WelcomePage.tsx` | 1 line |

### Phase 2 — Detail Pages (1–2 days)

| Task | Files | Effort |
|------|-------|--------|
| Add `GET /api/public/labs/:id` — return full lab document from DB | `routes/public.js` | Small |
| Wire `LaboDetailPage.tsx` to fetch by route param | `LaboDetailPage.tsx` | Medium |
| Add `GET /api/public/establishments/:id` | `routes/public.js` | Small |
| Wire `ServiceMedicalDetailPage.tsx` to fetch by route param | `ServiceMedicalDetailPage.tsx` | Medium |
| Extend `ParamedicalProduct` model with spec fields, re-seed | `models/ParamedicalProduct.js`, `seed.js` | Medium |
| Add `GET /api/public/paramedical-products/:id` | `routes/public.js` | Small |
| Wire `ParamedicalProductPage.tsx` to fetch by route param | `ParamedicalProductPage.tsx` | Medium |

### Phase 3 — Route Protection (2–3 hours)

| Task | Files | Effort |
|------|-------|--------|
| Wrap all admin routes in `<ProtectedRoute requiredRole="admin">` | `App.tsx` | Medium |
| Wrap all patient dashboard routes in `<ProtectedRoute requiredRole="patient">` | `App.tsx` | Medium |
| Wrap all doctor dashboard routes in `<ProtectedRoute requiredRole="doctor">` | `App.tsx` | Medium |
| Wrap all pharmacy dashboard routes in `<ProtectedRoute requiredRole="pharmacy">` | `App.tsx` | Small |
| Wrap all medical service dashboard routes in `<ProtectedRoute requiredRole="medical_service">` | `App.tsx` | Small |
| Validate token on AuthContext mount (`GET /api/auth/profile`) | `contexts/AuthContext.tsx` | Small |

### Phase 4 — Performance / Data Quality (1–2 days)

| Task | Effort |
|------|--------|
| Add MongoDB indexes to User, Appointment, Message, Prescription models | Small |
| Convert `Appointment.date` from String to Date type + migration script | Medium |
| Add pagination params to all list endpoints | Medium |
| Replace conversation aggregation with MongoDB `$group` pipeline | Medium |
| Add `fee` field to `Appointment` model; use it in `RevenuePage.tsx` | Small |
| Replace in-memory token blacklist with Redis (production only) | Large |
| Add TURN server for WebRTC (production only) | Large |
