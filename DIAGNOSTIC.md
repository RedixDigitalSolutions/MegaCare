# MegaCare Platform — Full Diagnostic Report

> Generated: April 17, 2026  
> Scope: Complete backend + frontend audit  
> Status: Development / Prototype stage

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [What Is Working](#3-what-is-working)
4. [What Is Not Working / Missing](#4-what-is-not-working--missing)
5. [Security Vulnerabilities](#5-security-vulnerabilities)
6. [Backend Diagnostic](#6-backend-diagnostic)
7. [Frontend Diagnostic](#7-frontend-diagnostic)
8. [Page-by-Page Status Matrix](#8-page-by-page-status-matrix)
9. [API Endpoint Inventory](#9-api-endpoint-inventory)
10. [Performance & Scalability Concerns](#10-performance--scalability-concerns)
11. [Optimization Opportunities](#11-optimization-opportunities)
12. [Recommended Action Plan](#12-recommended-action-plan)

---

## 1. Executive Summary

MegaCare is a healthcare platform with **83 frontend routes** across 7 dashboards (patient, doctor, admin, pharmacy, lab, medical service, paramedical), backed by an Express.js API with MongoDB.

### Key Findings

| Metric                          | Value         |
| ------------------------------- | ------------- |
| Total frontend pages            | ~80 files     |
| Pages with real API integration | **~44 (55%)** |
| Pages with hardcoded/mock data  | **~27 (34%)** |
| Pages with static content only  | **~9 (11%)**  |
| Orphan pages (no route)         | 0 (cleaned)   |
| Backend API endpoints           | 38            |
| Backend models                  | 11            |
| Critical security issues        | 2             |
| High-priority bugs              | 5 (10 fixed)  |

**Bottom line:** The platform has excellent UI/UX across all dashboards. The **core patient flow** (auth, appointments, messaging, live consultation, medical records, prescriptions, find doctor, consultations history, notifications, settings, medical history, dashboard) is now fully connected to real backend data. The **pharmacy dashboard** (4 pages), **lab dashboard** (3 pages), **medical service dashboard** (12 pages), and **paramedical dashboard** (13 pages) are now wired to backend APIs. The **admin stats page** is fully wired (real KPIs from `GET /api/admin/users`). The **admin settings page** is partially wired (profile + password persisted; notification/platform toggles are UI-only). Two previously critical security vulnerabilities in `users.js` (privilege escalation via PUT, PII exposure via GET) have been resolved. Pharmacy operates as a **reservation system** (no cart/checkout/e-commerce).

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Frontend                      │
│  React 19 + Vite + TypeScript + Tailwind CSS    │
│  Port: 5173 (dev) — Proxy /api → :5000          │
│  UI: Radix/shadcn components + Lucide icons     │
├─────────────────────────────────────────────────┤
│                   Backend                       │
│  Express.js 4.18 + Socket.IO 4.8.3              │
│  Port: 5000 (AirPlay Receiver disabled)          │
│  Auth: JWT (7-day expiry)                       │
├─────────────────────────────────────────────────┤
│                  Database                       │
│  MongoDB (localhost:27017/megacare)             │
│  8 Collections: User, Appointment, Message,     │
│  Dossier, Prescription, Product, Order, Doctor  │
└─────────────────────────────────────────────────┘
```

**Real-time:** Socket.IO for messaging (typing indicators, live messages) and WebRTC signaling (video consultations).

**WebRTC:** Peer-to-peer video/audio using Google STUN servers. No TURN server.

---

## 3. What Is Working

### ✅ Fully Functional (API-Connected)

| Feature                               | Frontend                                                        | Backend                                                                                          | Status     |
| ------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| **User Registration**                 | RegisterPage                                                    | `POST /api/auth/register`                                                                        | ✅ Working |
| **User Login**                        | LoginPage + LoginTestDataPage                                   | `POST /api/auth/login`                                                                           | ✅ Working |
| **Profile Management**                | ProfilePage                                                     | `GET/PATCH /api/auth/profile`                                                                    | ✅ Working |
| **Password Change**                   | ProfilePage                                                     | `POST /api/auth/change-password`                                                                 | ✅ Working |
| **Admin User Management**             | AdminPage, AdminUsersPage, AdminPendingPage, AdminSuspendedPage | `GET /api/admin/users`, `PATCH /api/admin/users/:id/:action`                                     | ✅ Working |
| **Patient Appointments**              | AppointmentsPage                                                | `GET /api/appointments`, `DELETE /api/appointments/:id`                                          | ✅ Working |
| **Doctor Dashboard**                  | DoctorDashboardPage                                             | `GET /api/appointments`, `PATCH /api/appointments/:id/status`                                    | ✅ Working |
| **Doctor Consultations List**         | DoctorConsultationsPage                                         | `GET /api/appointments`                                                                          | ✅ Working |
| **Live Video Consultation (Doctor)**  | LiveConsultationPage                                            | WebRTC + Socket.IO + Messages API + Dossier API                                                  | ✅ Working |
| **Live Video Consultation (Patient)** | PatientLiveConsultationPage                                     | WebRTC + Socket.IO + Messages API                                                                | ✅ Working |
| **Patient Messaging**                 | PatientMessagesPage                                             | Messages API + Socket.IO                                                                         | ✅ Working |
| **Doctor Messaging**                  | DoctorMessagingPage                                             | Messages API + Socket.IO                                                                         | ✅ Working |
| **Medical Records (Patient)**         | MedicalRecordsPage                                              | `GET/PUT /api/dossier`                                                                           | ✅ Working |
| **Patient Dossier (Doctor view)**     | PatientDossierPage                                              | `GET /api/dossier/:patientId`                                                                    | ✅ Working |
| **Doctor Patient List**               | DoctorPatientsPage                                              | `GET /api/users` + `GET /api/dossier/:id`                                                        | ✅ Working |
| **Consultation Completion**           | LiveConsultationPage                                            | `POST /api/dossier/:patientId/consultation` + `PATCH /api/appointments/:id/status` → `completed` | ✅ Working |
| **Join Sound Notifications**          | use-webrtc.ts                                                   | Sound plays for waiting user only                                                                | ✅ Working |
| **Database Seeding**                  | —                                                               | seed.js (11 users, 6 appointments, messages, dossiers, products)                                 | ✅ Working |

### ⚠️ Partially Working

| Feature                                                             | Issue |
| ------------------------------------------------------------------- | ----- |
| _(All previous issues in this section have been fixed — see below)_ |       |

### ✅ Recently Fixed (Previously Partially Working)

| Feature                      | Fix Applied                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Doctor Detail Page**           | `GET /api/doctors/:id` now queries User model (role=doctor) instead of empty Doctor collection — returns real data                       |
| **Doctor Settings**              | Replaced 3 hardcoded `http://localhost:5000` URLs with relative `/api/auth/profile` paths                                               |
| **Prescription Creation**        | Added `req.user.role !== "doctor"` guard on `POST /api/prescriptions` — returns 403 for non-doctors                                      |
| **OCR Prescription Scanner**     | Expanded from 10 to ~120+ medicine names across 15+ categories (antibiotics, cardiology, dermatology, etc.)                              |
| **Doctor Agenda**                | Now fetches real appointments; availability slots persisted via API                                                                      |
| **Doctor Prescriptions**         | Fetches from `/api/prescriptions`; new prescriptions created via `POST /api/prescriptions`                                               |
| **Doctor Revenue**               | Derives real revenue from completed appointments filtered by period                                                                      |
| **Doctor Reviews**               | Fetches and submits reviews via API                                                                                                      |
| **Pharmacy Catalog**             | Fetches 20 rich products from `GET /api/pharmacy/products`; Product model extended with 13 display fields; seed updated to 20 products   |
| **Pharmacy Chat**                | Wired to messages REST API with pharmacy user ID; loads history and sends new messages                                                   |
| **Pharmacy Medicine Detail**     | Fetches from `GET /api/pharmacy/products/:id`; shows usage, contraindications, side effects from DB                                      |
| **Pharmacy Prescriptions**       | Fetches real prescriptions with auth; resolves doctor names; computes expiry dates                                                       |
| **Pharmacy Prescription Scanner**| OCR extraction enriched with real DB product data (price, stock, category, description)                                                 |
| **Pharmacy Dashboard**           | All 4 pages wired: KPIs from products+orders, supplier orders CRUD, sales aggregated by period, stock from products API                 |
| **Lab Dashboard**                | All 3 pages wired: KPIs from LabTest+LabResult, lab tests CRUD (create/edit/complete), lab results list from new API                    |
| **Medical Service Dashboard**    | All 12 pages wired: KPIs, patients, equipment, team, schedule, billing, prescriptions, analytics, vitals, teleconsultation, settings, messaging |
| **Paramedical Dashboard**        | All 13 pages wired: KPIs, patients, appointments, supplies, vitals, care sessions, notifications, planning, reports, map, settings, teleconsultation, messaging |

---

## 4. What Is Not Working / Missing

### ❌ Pages With Only Mock/Hardcoded Data

These pages render beautiful UI but **all data is static arrays defined in the component** — nothing is persisted or fetched from the backend.

#### Patient Dashboard

> **All 7 patient dashboard pages below have been fixed and wired to real API data.**

| Page                                              | Previous Issue                 | Fix Applied                                                                  |
| ------------------------------------------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `/dashboard` (DashboardPage)                      | Static summary cards           | ✅ Fetches `/api/appointments` + `/api/prescriptions`, computes real KPIs    |
| `/dashboard/consultations` (ConsultationsPage)    | Static past consultations list | ✅ Fetches `/api/appointments`, filters completed/past, resolves doctor info |
| `/dashboard/find-doctor` (FindDoctorPage)         | `mockDoctors` array            | ✅ Fetches `/api/doctors`, removed mock array entirely                       |
| `/dashboard/medical-history` (MedicalHistoryPage) | 3 static consultation entries  | ✅ Fetches `/api/dossier`, shows real medical history + consultations        |
| `/dashboard/notifications` (NotificationsPage)    | Static notification items      | ✅ Derives notifications from real appointments + prescriptions data         |
| `/dashboard/prescriptions` (PrescriptionsPage)    | Static mock prescriptions      | ✅ Fetches `/api/prescriptions`, calculates expiry, resolves doctor names    |
| `/dashboard/settings` (SettingsPage)              | All fields `readOnly`, no save | ✅ Editable fields, save via `PATCH /api/auth/profile`, password change form |

#### Admin Dashboard

> **Admin stats and settings pages have been updated.**

| Page                                      | Previous Issue       | Fix Applied                                                                                                                                              |
| ----------------------------------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin/stats` (AdminStatsPage)           | Marked as 🔴 hardcoded | ✅ Already fetches `GET /api/admin/users`; computes real KPIs (total, approved, pending, rejected, suspended, per-role breakdown, approval rate)        |
| `/admin/settings` (AdminSettingsPage)     | Marked as 🔴 not wired | ✅ Profile save and password change wired to API; notification/platform toggles remain UI-only (no backend settings storage)                            |

#### Doctor Dashboard

> **All 4 doctor dashboard pages below have been fixed and wired to real API data.**

| Page                                                        | Previous Issue                         | Fix Applied                                                                         |
| ----------------------------------------------------------- | -------------------------------------- | ----------------------------------------------------------------------------------- |
| `/doctor-dashboard/agenda` (AgendaPage)                     | Static time slots — no API persistence | ✅ Fetches `/api/appointments`, persists availability slots via API                 |
| `/doctor-dashboard/prescriptions` (DoctorPrescriptionsPage) | Static prescriptions list              | ✅ Fetches `/api/prescriptions` with auth, creates via `POST /api/prescriptions`   |
| `/doctor-dashboard/revenue` (RevenuePage)                   | Static revenue by period               | ✅ Derives real revenue from `/api/appointments` (completed, filtered by period)    |
| `/doctor-dashboard/reviews` (ReviewsPage)                   | Static review entries                  | ✅ Fetches reviews via API, submit new reviews persisted to backend                 |

#### Pharmacy (5 Pages — Reservation Only)

> **All 5 pharmacy customer pages below have been fixed and wired to real API data.**

| Page                             | Previous Issue                              | Fix Applied                                                                                          |
| -------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `/pharmacy`                      | Static medicine catalog (reservation model) | ✅ Fetches all products from `GET /api/pharmacy/products`; dynamic category counts; loading skeleton |
| `/pharmacy/chat`                 | Static mock conversation                    | ✅ Loads thread via `GET /api/messages/thread/:id`, sends via `POST /api/messages`                  |
| `/pharmacy/medicine/:id`         | Static medicine detail                      | ✅ Fetches `GET /api/pharmacy/products/:id`, shows all rich fields (usage, contraindications, etc.)  |
| `/pharmacy/prescriptions`        | Static prescriptions list                   | ✅ Fetches `GET /api/prescriptions` with auth; resolves doctor names via `/api/users/:id`            |
| `/pharmacy/prescription-scanner` | Local OCR only                              | ✅ OCR output now enriched via `GET /api/pharmacy/products?search=` for each extracted medicine      |

> **Note:** Cart, checkout, orders, and order detail pages were removed — the pharmacy operates as a reservation system, not an e-commerce platform.

#### Pharmacy Dashboard (All 4 Pages)

> **All 4 pharmacy dashboard pages have been fixed and wired to real API data.**

| Page                         | Previous Issue     | Fix Applied                                                                                                         |
| ---------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `/pharmacy-dashboard`        | Static KPIs        | ✅ Fetches `/api/pharmacy/kpis`; real stock count, revenue, low-stock alerts, pending orders, top-selling medicines |
| `/pharmacy-dashboard/orders` | Static orders      | ✅ Fetches `/api/pharmacy/supplier-orders`; full CRUD (create, edit, status update)                                 |
| `/pharmacy-dashboard/sales`  | Static sales data  | ✅ Fetches `/api/pharmacy/sales?period=`; aggregated revenue, top medicines, per-period caching                     |
| `/pharmacy-dashboard/stock`  | Static stock items | ✅ Fetches `/api/pharmacy/products`; live stock quantities, low-stock warnings                                      |

#### Lab Dashboard (All 3 Pages)

> **All 3 lab dashboard pages have been fixed and wired to real API data.**

| Page                     | Previous Issue      | Fix Applied                                                                                           |
| ------------------------ | ------------------- | ----------------------------------------------------------------------------------------------------- |
| `/lab-dashboard`         | Static KPIs         | ✅ Fetches `/api/lab/kpis`; real exams today, completed, pending results, critical results            |
| `/lab-dashboard/tests`   | Static test entries | ✅ Fetches `/api/lab/tests`; full CRUD — create, edit, mark complete via API                         |
| `/lab-dashboard/results` | Static lab results  | ✅ Fetches `/api/lab/results`; live result list with Normal/Élevé/Critique status filter             |

#### Medical Service Dashboard (All 12 Pages)

> **All 12 medical service dashboard pages have been fixed and wired to real API data.**

| Page group                                | Fix Applied |
| ----------------------------------------- | ----------- |
| `/medical-service-dashboard/*` (12 pages) | ✅ Wired to `/api/medical-service/*` endpoints: KPIs, patients CRUD, equipment CRUD, team CRUD, schedule CRUD, billing invoices/payments, prescriptions CRUD, analytics, vitals read/write, teleconsultation, settings, messaging |

#### Paramedical Dashboard (All 13 Pages)

> **All 13 paramedical dashboard pages have been fixed and wired to real API data.**

| Page group                            | Fix Applied |
| ------------------------------------- | ----------- |
| `/paramedical-dashboard/*` (13 pages) | ✅ Wired to `/api/paramedical/*` endpoints: KPIs, patients CRUD, appointments CRUD, supplies + order flow, vitals read/write, care sessions, notifications, planning, reports, map visits, settings, teleconsultation, messaging |

#### Public Pages

> **All 4 public listing pages have been fixed and wired to real API data.**

| Page                     | Previous Issue                                                        | Fix Applied                                                                                                     |
| ------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `/doctors`               | `mockDoctors` array — not connected to API despite API existing       | ✅ Fetches `GET /api/doctors`, removed mock array, loading spinner                                              |
| `/paramedical`           | Hardcoded `products` array (~330 lines) + static categories           | ✅ Fetches `GET /api/public/paramedical-products`, dynamic category counts, loading spinner                     |
| `/services-medicaux`     | Hardcoded `establishments` array (~250 lines)                         | ✅ Fetches `GET /api/public/establishments`, loading spinner. New model: `MedicalEstablishment`                 |
| `/labos-radiologie`      | Hardcoded `labs` array (~180 lines)                                   | ✅ Fetches `GET /api/public/labs`, loading spinner. New model: `PublicLabCenter`                                |

**New backend additions:**
- `backend/src/models/ParamedicalProduct.js` — 20 products seeded
- `backend/src/models/MedicalEstablishment.js` — 9 establishments seeded
- `backend/src/models/PublicLabCenter.js` — 9 lab centers seeded
- `backend/src/routes/public.js` — `GET /api/public/paramedical-products`, `GET /api/public/establishments`, `GET /api/public/labs` (no auth required)

### ✅ Cleaned Up (Removed)

The following orphan and e-commerce pages were deleted:

| Removed Page                                      | Reason                                    |
| ------------------------------------------------- | ----------------------------------------- |
| `dashboard/tracking/TrackingPage.tsx`             | Orphan — no route, no transport feature   |
| `transport-dashboard/*` (3 files)                 | Orphan — transport feature not in scope   |
| `services/lab/LabServicePage.tsx`                 | Orphan — no route                         |
| `services/medical/MedicalServicePage.tsx`         | Orphan — no route                         |
| `services/paramedical/ParamedicalServicePage.tsx` | Orphan — no route                         |
| `how-it-works/HowItWorksPage.tsx`                 | Orphan — redirect wrapper, unused         |
| `pricing/PricingPage.tsx`                         | Orphan — redirect wrapper, unused         |
| `pharmacy/cart/CartPage.tsx`                      | Removed — no e-commerce, reservation only |
| `pharmacy/checkout/CheckoutPage.tsx`              | Removed — no e-commerce, reservation only |
| `pharmacy/orders/PharmacyOrdersPage.tsx`          | Removed — no e-commerce, reservation only |
| `pharmacy/order/[id]/OrderDetailPage.tsx`         | Removed — no e-commerce, reservation only |
| `dashboard/orders/OrdersPage.tsx`                 | Removed — no delivery/order tracking      |

### ✅ Previously Unused Endpoints — Now Connected

| Backend Capability                        | Fix Applied                                                                                               |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `GET /api/prescriptions`                  | Now used by PrescriptionsPage, DashboardPage, NotificationsPage                                           |
| `GET /api/doctors` + `/:id`               | Rewired to query User model (role=doctor) — used by FindDoctorPage                                        |
| `GET /api/dossier`                        | Now used by MedicalHistoryPage                                                                            |
| `GET /api/pharmacy/kpis`                  | New — used by PharmacyDashboardPage                                                                       |
| `GET/POST /api/pharmacy/supplier-orders`  | New — used by PharmacyDashboardOrdersPage                                                                 |
| `PUT /api/pharmacy/supplier-orders/:id`   | New — used by PharmacyDashboardOrdersPage                                                                 |
| `GET /api/pharmacy/sales`                 | New — used by SalesPage                                                                                   |
| `GET /api/lab/kpis`                       | New — used by LabDashboardPage                                                                            |
| `GET/POST /api/lab/tests`                 | New — used by LabTestsPage                                                                                |
| `PUT /api/lab/tests/:id`                  | New — used by LabTestsPage (edit + mark complete)                                                         |
| `GET/POST /api/lab/results`               | New — used by LabResultsPage                                                                              |
| `GET/POST/PUT/DELETE /api/medical-service/*` | New — used across all Medical Service dashboard pages (12/12 wired)                                      |
| `GET/POST/PUT /api/paramedical/*`            | New — used across all Paramedical dashboard pages (13/13 wired)                                          |

---

## 5. Security Vulnerabilities

### 🔴 CRITICAL

| #   | Vulnerability                                    | Location                  | Impact                                                                                                                                                                                                           |
| --- | ------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | ~~**Privilege escalation via PUT /api/users/:id**~~ | `routes/users.js`      | **FIXED** — `role` and `status` are now stripped from the request body alongside `password`, `id`, and `email`. Privilege escalation is no longer possible.                                                      |
| 2   | ~~**No role check on POST /api/prescriptions**~~ | `routes/prescriptions.js` | **FIXED** — Added `req.user.role !== "doctor"` guard. Returns 403 for non-doctors.                                                                                                                               |
| 3   | ~~**GET /api/users exposes all users**~~          | `routes/users.js`         | **FIXED** — `GET /api/users` now returns 403 for any role that is not `admin` or `doctor`. PII is no longer exposed to patients, pharmacists, etc.                                                               |
| 4   | **No async error handling in any route**         | All route files           | No `try/catch` on any async handler. An unhandled Mongoose error will crash the request (hang forever or return stack trace). Use `express-async-errors` or manual wrapping.                                     |

### 🟠 HIGH — ✅ All Fixed

| #   | Vulnerability                                                        | Fix Applied                                                                                                                                                         |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 5   | ~~**Hardcoded JWT secret fallback** `"megacare_secret_key"`~~        | ✅ Fallback removed from `auth.js`, `middleware/auth.js`, `admin.js`, `index.js`. App throws at startup if `JWT_SECRET` is unset. `.env` created with random secret. |
| 6   | ~~**No password policy on registration**~~                           | ✅ Added `password.length < 8` check on `POST /api/auth/register` — same policy as password change.                                                                |
| 7   | ~~**No rate limiting** on login or any endpoint~~                    | ✅ `express-rate-limit` installed. Auth routes limited to 15 requests per 15 min per IP via `authLimiter` in `index.js`.                                            |
| 8   | ~~**Self-registration allows any role**~~                            | ✅ Whitelist in `routes/auth.js`: only `patient`, `doctor`, `pharmacist`, `medical_service`, `paramedical` allowed. `admin` and `lab_radiology` silently default to `patient`. |
| 9   | ~~**PUT /api/appointments allows overwriting `doctorId` and `status`**~~ | ✅ `doctorId` stripped from PUT body. Non-doctors blocked from setting `confirmed`/`rejected`/`completed` status — returns 403.                                   |
| 10  | ~~**Doctor model accepts arbitrary data**~~                          | ✅ Removed `strict: false` from `Doctor.js` schema. `POST /api/doctors` no longer spreads `...rest` — only `name`, `specialty`, `governorate`, `userId` accepted.  |
| 11  | ~~**No role check on POST /api/doctors**~~                           | ✅ Added `req.user.role !== "doctor" && req.user.role !== "admin"` guard — returns 403 for other roles.                                                             |
| 12  | ~~**Regex injection in search filters**~~                            | ✅ Added `escapeRegex()` in `routes/pharmacy.js` (was already fixed in `routes/doctors.js` and `routes/public.js`). All search inputs are now escaped before `$regex`. |

### 🟡 MEDIUM — ✅ All Fixed

| #   | Issue                                                                                   | Fix Applied                                                                                                                                                               |
| --- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | ~~No `helmet` security headers~~                                                        | ✅ `helmet` installed and applied in `index.js` before all other middleware                                                                                               |
| 14  | ~~Socket events accept any userId as target (no validation)~~                           | ✅ `typeof to !== "string" \|\| !to` guard added on all `io.to()` targets (`typing:start/stop`, `message:sent`, `webrtc:*`) in `index.js`                                 |
| 15  | ~~Logout is a no-op — no token blacklist~~                                              | ✅ `middleware/tokenBlacklist.js` (Map + expiry); `POST /api/auth/logout` blacklists the token; `middleware/auth.js` rejects blacklisted tokens before `jwt.verify`       |
| 16  | ~~Admin auth middleware is fully duplicated~~                                           | ✅ Extracted to `middleware/adminAuth.js`; `routes/admin.js` now `require`s it instead of inlining                                                                        |
| 17  | ~~No CORS restriction — origin is hardcoded fallback~~                                  | ✅ `FRONTEND_URL` reads from env (`.env` has `FRONTEND_URL=http://localhost:5173`); comment added recommending removal of fallback for production deploys                  |

---

## 6. Backend Diagnostic

### 6.1 Models

| Model            | Status       | Issues                                                                                                                                                 |
| ---------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **User**         | ✅ Working   | `role` enum has both `"lab"` and `"lab_radiology"` (only `"lab_radiology"` used). No index on `role`/`status`.                                         |
| **Appointment**  | ✅ Working   | `date`/`time` stored as strings (not Date) — unreliable sorting. No compound index on `(doctorId, date)`.                                              |
| **Message**      | ✅ Working   | Denormalized names become stale on user name change. No index on `(senderId, receiverId)`.                                                             |
| **Dossier**      | ✅ Working   | Uses Mongoose ObjectId (inconsistent with other models using UUID strings).                                                                            |
| **Prescription** | ⚠️ Partially | `medicines` is `Schema.Types.Mixed` — no validation. `patientId` is optional.                                                                          |
| **Product**      | ⚠️ Partially | No `timestamps`. Seeded with simple string IDs (`"1"`, `"2"`) unlike UUIDs elsewhere.                                                                  |
| **Order**        | ⚠️ Partially | `items` is `Schema.Types.Mixed`. No stock validation or decrement on creation.                                                                         |
| **Doctor**       | ⚠️ Bypassed  | `GET /api/doctors` now queries User model directly. Doctor collection still exists but is bypassed for reads. `strict: false` on POST still a concern. |
| **LabTest**       | ✅ New       | Fields: patient, testType, doctor, status, priority, date, notes. String `_id`, timestamps enabled.                                                   |
| **LabResult**     | ✅ New       | Fields: patient, testType, value, unit, reference, status (Normal/Élevé/Critique), doctor, date. String `_id`, timestamps enabled.                    |
| **SupplierOrder** | ✅ New       | Fields: ref, supplier, date, expectedDate, items[], total, status (Livré/En transit/En attente). String `_id`, timestamps enabled.                    |

### 6.2 Routes

| Route File           | Status             | Critical Issues                                                                                                  |
| -------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **auth.js**          | ✅ Working         | No password policy on register. No try/catch.                                                                    |
| **admin.js**         | ✅ Working         | Duplicated auth middleware. No try/catch.                                                                        |
| **appointments.js**  | ✅ Working         | POST doesn't set `patientName`. PUT allows overwriting `doctorId`/`status`.                                      |
| **messages.js**      | ✅ Working         | Conversations loads ALL messages into memory for aggregation. No pagination.                                     |
| **dossier.js**       | ✅ Working         | Only doctors can view patient dossiers (not lab/pharmacy).                                                       |
| **users.js**         | ⚠️ Security risk   | GET exposes all users. PUT allows privilege escalation.                                                          |
| **prescriptions.js** | ✅ Fixed           | Role check added on POST — doctor only. GET filters by user role.                                                |
| **doctors.js**       | ⚠️ Partially fixed | GET routes rewritten to query User model. Regex injection fixed. POST still has no role check + `strict: false`. |
| **pharmacy.js**      | ✅ Extended        | Added `/kpis`, `/sales`, `/supplier-orders` routes with pharmacyGuard middleware. No stock decrement on order.   |
| **lab.js**           | ✅ New             | Full CRUD for tests and results; KPI aggregation endpoint; requires lab_radiology role.                          |
| **medical-service.js** | ✅ New           | Full API surface for Medical Service dashboard: KPIs, CRUD resources, analytics, vitals, teleconsultation, settings. |
| **paramedical.js**     | ✅ New           | Full API surface for Paramedical dashboard: KPIs, CRUD resources, vitals, care sessions, reports, planning, map, settings. |

### 6.3 Socket.IO Events

| Event                               | Direction         | Status     |
| ----------------------------------- | ----------------- | ---------- |
| `typing:start/stop`                 | bi-directional    | ✅ Working |
| `message:sent/receive`              | bi-directional    | ✅ Working |
| `user:online/offline`               | broadcast         | ✅ Working |
| `users:online`                      | to new connection | ✅ Working |
| `webrtc:offer/answer/ice-candidate` | relay             | ✅ Working |
| `webrtc:call/end`                   | relay             | ✅ Working |
| `webrtc:ready`                      | relay             | ✅ Working |

---

## 7. Frontend Diagnostic

### 7.1 Core Infrastructure

| Component          | Status | Issues                                                                                                                    |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------- |
| **AuthContext**    | ⚠️     | No token refresh. No server-side validation on reload. Split between context (user) and localStorage (token) is fragile.  |
| **ProtectedRoute** | ⚠️     | Only used on ~15 of 92 routes. No token validation — trusts localStorage.                                                 |
| **use-socket**     | ✅     | Fixed — uses `import.meta.env.VITE_SOCKET_URL ?? ""` (routes through Vite proxy). Doesn't reconnect on login/logout.             |
| **use-webrtc**     | ⚠️     | No TURN server (fails behind NAT). Patient re-emits `webrtc:ready` after connection. No error handling on SDP operations. |
| **use-toast**      | ✅     | Standard shadcn/ui boilerplate.                                                                                           |
| **use-mobile**     | ✅     | Standard responsive breakpoint hook.                                                                                      |
| **Vite config**    | ✅     | Proxy correctly configured but socket hook bypasses it.                                                                   |

### 7.2 Route Protection Status

| Dashboard                         | Protection Method                                        | Issue                                                             |
| --------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------- |
| **Admin** (6 routes)              | `useEffect` redirect only                                | Flashes content before redirect. Not wrapped in `ProtectedRoute`. |
| **Patient** (12 routes)           | `useEffect` redirect only                                | Same flash issue.                                                 |
| **Doctor** (11 routes)            | `useEffect` redirect only                                | Same flash issue.                                                 |
| **Pharmacy Dashboard** (4 routes) | `useEffect` redirect only                                | Same flash issue.                                                 |
| **Lab Dashboard**                 | Mixed                                                    | Dashboard uses `useEffect`, sub-pages use `ProtectedRoute`.       |
| **Paramedical** (13 routes)       | `ProtectedRoute`                                         | ✅ Properly protected.                                            |
| **Medical Service** (12 routes)   | `useEffect` redirect in dashboard, **NONE on sub-pages** | ❌ 11 sub-pages have zero protection.                             |
| **Public** (20 routes)            | None                                                     | Correct — public pages.                                           |

### 7.3 Known UI Bugs

| Bug                                 | Location                    | Description                                                                     |
| ----------------------------------- | --------------------------- | ------------------------------------------------------------------------------- |
| ~~Hardcoded localhost URL~~         | DoctorSettingsPage          | **FIXED** — Now uses relative `/api/auth/profile` paths                         |
| Broken link                         | WelcomePage                 | Links to `/dashboards-overview` which doesn't exist → 404                       |
| ~~Patient settings non-functional~~ | SettingsPage                | **FIXED** — All fields editable, save via PATCH API, password change form added |
| Duplicated mock data                | Paramedical, Services, Labs | Listing page and detail page each contain the full data array                   |

---

## 8. Page-by-Page Status Matrix

### Legend

- 🟢 = API-connected, fully working
- 🟡 = Partially working or has bugs
- 🔴 = Hardcoded/mock data only
- ⚫ = Static content (intentional)

### Public Pages

| Route                | Status | Data                              |
| -------------------- | ------ | --------------------------------- |
| `/`                  | ⚫     | Static landing                    |
| `/login`             | 🟢     | API                               |
| `/register`          | 🟢     | API                               |
| `/doctors`           | 🔴     | Hardcoded `mockDoctors`           |
| `/doctor/:id`        | �      | API (queries User model directly) |
| `/guide`             | ⚫     | Static                            |
| `/consultation`      | �      | API (role check added)            |
| `/profile`           | 🟢     | API                               |
| `/welcome`           | ⚫     | Static (broken link)              |
| `/paramedical`       | 🔴     | Hardcoded                         |
| `/services-medicaux` | 🔴     | Hardcoded                         |
| `/labos-radiologie`  | 🔴     | Hardcoded                         |

### Admin Dashboard

| Route              | Status | Data           |
| ------------------ | ------ | -------------- |
| `/admin`           | 🟢     | API            |
| `/admin/users`     | 🟢     | API            |
| `/admin/pending`   | 🟢     | API            |
| `/admin/suspended` | 🟢     | API            |
| `/admin/stats`     | 🟢     | API (`GET /api/admin/users` — real KPIs computed from user data) |
| `/admin/settings`  | 🟡     | Partially wired — profile (`PATCH /api/auth/profile`) + password (`POST /api/auth/change-password`); notification/platform toggles are UI-only |

### Patient Dashboard

| Route                          | Status | Data                                            |
| ------------------------------ | ------ | ----------------------------------------------- |
| `/dashboard`                   | �      | API (appointments + prescriptions)              |
| `/dashboard/appointments`      | 🟢     | API                                             |
| `/dashboard/consultations`     | 🟢     | API (past/completed appointments)               |
| `/dashboard/live-consultation` | 🟢     | API + WebRTC                                    |
| `/dashboard/find-doctor`       | 🟢     | API (doctors from User model)                   |
| `/dashboard/medical-history`   | 🟢     | API (dossier)                                   |
| `/dashboard/medical-records`   | 🟢     | API                                             |
| `/dashboard/messages`          | 🟢     | API + Socket.IO                                 |
| `/dashboard/notifications`     | 🟢     | API (derived from appointments + prescriptions) |
| `/dashboard/prescriptions`     | 🟢     | API                                             |
| `/dashboard/settings`          | 🟢     | API (editable + save + password change)         |

### Doctor Dashboard

| Route                                   | Status | Data                       |
| --------------------------------------- | ------ | -------------------------- |
| `/doctor-dashboard`                     | 🟢     | API                        |
| `/doctor-dashboard/agenda`              | �     | API (appointments + availability slots) |
| `/doctor-dashboard/consultations`       | 🟢     | API                                     |
| `/doctor-dashboard/live-consultation`   | 🟢     | API + WebRTC                            |
| `/doctor-dashboard/patients`            | 🟢     | API                                     |
| `/doctor-dashboard/patient-dossier/:id` | 🟢     | API                                     |
| `/doctor-dashboard/prescriptions`       | 🟢     | API                                     |
| `/doctor-dashboard/revenue`             | 🟢     | API (derived from appointments)         |
| `/doctor-dashboard/reviews`             | 🟢     | API                                     |
| `/doctor-dashboard/settings`            | �      | API (localhost URLs fixed) |
| `/doctor-dashboard/messaging`           | 🟢     | API + Socket.IO            |

### Pharmacy (Customer — Reservation Only)

| Route                            | Status | Data                                   |
| -------------------------------- | ------ | -------------------------------------- |
| `/pharmacy`                      | �     | API (`GET /api/pharmacy/products`)              |
| `/pharmacy/chat`                 | 🟢     | API (messages thread + send)                    |
| `/pharmacy/medicine/:id`         | 🟢     | API (`GET /api/pharmacy/products/:id`)           |
| `/pharmacy/prescriptions`        | 🟢     | API (`GET /api/prescriptions` + doctor lookup)  |
| `/pharmacy/prescription-scanner` | 🟢     | OCR + DB enrichment (`GET /api/pharmacy/products?search=`) |

### Pharmacy Dashboard

| Route                          | Status | Data                                                                      |
| ------------------------------ | ------ | ------------------------------------------------------------------------- |
| `/pharmacy-dashboard`          | 🟢     | API (`GET /api/pharmacy/kpis`)                                            |
| `/pharmacy-dashboard/orders`   | 🟢     | API (`GET/POST/PUT /api/pharmacy/supplier-orders`)                        |
| `/pharmacy-dashboard/sales`    | 🟢     | API (`GET /api/pharmacy/sales?period=`)                                   |
| `/pharmacy-dashboard/stock`    | 🟢     | API (`GET /api/pharmacy/products`)                                        |

### Lab Dashboard

| Route                    | Status | Data                                                  |
| ------------------------ | ------ | ----------------------------------------------------- |
| `/lab-dashboard`         | 🟢     | API (`GET /api/lab/kpis`)                             |
| `/lab-dashboard/tests`   | 🟢     | API (`GET/POST/PUT /api/lab/tests`)                   |
| `/lab-dashboard/results` | 🟢     | API (`GET /api/lab/results`)                          |

### Medical Service Dashboard

| Route        | Status |
| ------------ | ------ |
| All 12 pages | 🟢 API |

### Paramedical Dashboard

| Route        | Status |
| ------------ | ------ |
| All 13 pages | 🟢 API |

---

## 9. API Endpoint Inventory

### Endpoints Actually Used by Frontend

| Endpoint                               | Method    | Used By                                                                                                             |
| -------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------- |
| `/api/auth/register`                   | POST      | RegisterPage                                                                                                        |
| `/api/auth/login`                      | POST      | LoginPage, LoginTestDataPage                                                                                        |
| `/api/auth/profile`                    | GET/PATCH | ProfilePage, DoctorSettingsPage, SettingsPage                                                                       |
| `/api/auth/change-password`            | POST      | ProfilePage, SettingsPage                                                                                           |
| `/api/admin/users`                     | GET       | Admin pages (via adminConfig)                                                                                       |
| `/api/admin/users/:id/:action`         | PATCH     | Admin pages (via adminConfig)                                                                                       |
| `/api/appointments`                    | GET       | AppointmentsPage, DoctorDashboardPage, DoctorConsultationsPage, DashboardPage, ConsultationsPage, NotificationsPage |
| `/api/appointments/:id`                | DELETE    | AppointmentsPage                                                                                                    |
| `/api/appointments/:id/status`         | PATCH     | DoctorDashboardPage, LiveConsultationPage                                                                           |
| `/api/users`                           | GET       | DoctorPatientsPage                                                                                                  |
| `/api/users/:id`                       | GET       | AppointmentsPage, DashboardPage, ConsultationsPage, NotificationsPage, PrescriptionsPage (doctor name lookup)       |
| `/api/dossier`                         | GET/PUT   | MedicalRecordsPage, MedicalHistoryPage                                                                              |
| `/api/dossier/:patientId`              | GET       | PatientDossierPage, DoctorPatientsPage                                                                              |
| `/api/dossier/:patientId/consultation` | POST      | LiveConsultationPage                                                                                                |
| `/api/doctors`                         | GET       | FindDoctorPage, DoctorDetailPage                                                                                    |
| `/api/prescriptions`                   | GET       | PrescriptionsPage, DashboardPage, NotificationsPage                                                                 |
| `/api/prescriptions`                   | POST      | ConsultationPage (doctor-only)                                                                                      |
| `/api/messages/conversations`          | GET       | PatientMessagesPage, DoctorMessagingPage                                                                            |
| `/api/messages/contacts`               | GET       | PatientMessagesPage, DoctorMessagingPage                                                                            |
| `/api/messages/thread/:id`             | GET       | Messaging + Live consultation pages                                                                                 |
| `/api/messages`                        | POST      | Messaging + Live consultation pages                                                                                 |
| `/api/pharmacy/kpis`                   | GET       | PharmacyDashboardPage                                                                                               |
| `/api/pharmacy/sales`                  | GET       | SalesPage                                                                                                           |
| `/api/pharmacy/supplier-orders`        | GET/POST  | PharmacyDashboardOrdersPage                                                                                         |
| `/api/pharmacy/supplier-orders/:id`    | PUT       | PharmacyDashboardOrdersPage                                                                                         |
| `/api/lab/kpis`                        | GET       | LabDashboardPage                                                                                                    |
| `/api/lab/tests`                       | GET/POST  | LabTestsPage                                                                                                        |
| `/api/lab/tests/:id`                   | PUT       | LabTestsPage (edit + mark complete)                                                                                 |
| `/api/lab/results`                     | GET/POST  | LabResultsPage                                                                                                      |
| `/api/medical-service/*`               | Mixed     | All Medical Service dashboard pages (dashboard, analytics, billing, equipment, messaging, patients, prescriptions, schedule, settings, team, teleconsultation, vitals) |
| `/api/paramedical/*`                   | Mixed     | All Paramedical dashboard pages (dashboard, appointments, care record, map, messaging, notifications, patients, planning, reports, settings, supplies, teleconsultation, vitals) |

### Endpoints That Exist But Are NOT Used

| Endpoint                 | Method | Notes                                  |
| ------------------------ | ------ | -------------------------------------- |
| `/api/prescriptions/:id` | GET    | Not used                               |
| `/api/doctors`           | POST   | Not used meaningfully                  |
| `/api/users/:id`         | PUT    | Not used (settings pages don't use it) |
| `/api/auth/logout`       | POST   | Called but is a no-op                  |
| `/health`                | GET    | Not used by frontend                   |

---

## 10. Performance & Scalability Concerns

| #   | Issue                                                                                                                      | Severity | Location                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| 1   | **Conversations endpoint loads ALL messages into memory** and aggregates in JavaScript                                     | High     | `routes/messages.js` `GET /conversations`                 |
| 2   | **No pagination** on any list endpoint                                                                                     | Medium   | All GET list routes                                       |
| 3   | **No database indexes** on frequently queried fields (`role`, `status`, `senderId`, `receiverId`, `patientId`, `doctorId`) | Medium   | All models                                                |
| 4   | **Appointment dates stored as strings**                                                                                    | Medium   | Appointment model — prevents efficient date-range queries |
| 5   | **WebRTC `ready` signal re-emitted every 3 seconds** even after connection is established                                  | Low      | `use-webrtc.ts`                                           |
| 6   | **No connection pooling configuration** for MongoDB                                                                        | Low      | `config/db.js`                                            |
| 7   | **10MB JSON body limit**                                                                                                   | Low      | `index.js` — allows large payloads                        |

---

## 11. Optimization Opportunities

### Quick Wins (Low Effort, High Impact)

| #   | Optimization                                                                  | Files                              | Effort |
| --- | ----------------------------------------------------------------------------- | ---------------------------------- | ------ |
| 1   | **Add `express-async-errors`** — wrap all routes automatically                | `backend/package.json`, `index.js` | 5 min  |
| 2   | **Fix hardcoded localhost in socket hook** — use relative URL or env variable | `use-socket.ts`                    | 2 min  |
| 3   | ~~**Fix hardcoded localhost in DoctorSettingsPage**~~ — **DONE**              | `DoctorSettingsPage.tsx`           | Done   |
| 4   | **Add `helmet` middleware**                                                   | `index.js`                         | 2 min  |
| 5   | ~~**Strip `role` and `status` from PUT /api/users/:id body**~~ — **DONE**     | `routes/users.js`                  | Done   |
| 6   | ~~**Add role check to POST /api/prescriptions**~~ — **DONE**                  | `routes/prescriptions.js`          | Done   |
| 7   | ~~**Add rate limiting to login endpoint**~~ — **DONE**                       | `index.js` — `express-rate-limit`, 15 req/15 min per IP on all auth routes        |
| 8   | ~~**Stop re-emitting `webrtc:ready` after connection**~~                      | `use-webrtc.ts`                                                                    |
| 9   | ~~**Restrict GET /api/users to admin and doctor roles**~~ — **DONE**          | `routes/users.js`                                                                  |
| 10  | ~~**Set `patientName` on POST /api/appointments** by looking up the user~~ — **DONE** | `routes/appointments.js` — patientName set from User lookup                |

### Medium Effort (Backend API Connectivity)

| #   | Optimization                                                            | Impact                                     |
| --- | ----------------------------------------------------------------------- | ------------------------------------------ |
| 11  | ~~Wire Find Doctor to real API~~ — **DONE**                             | Uses `GET /api/doctors` (User model query) |
| 12  | ~~Wire patient prescriptions to real API~~ — **DONE**                   | Uses `GET /api/prescriptions`              |
| 13  | ~~Wire pharmacy pages to `GET /api/pharmacy/products` (reservation model)~~ — **DONE** | All 5 pharmacy pages wired; Product model extended with 13 fields; 20 rich products seeded |
| 14  | ~~Wire patient settings with save~~ — **DONE**                                          | PATCH profile + password change                                                            |
| 15  | ~~Wire doctor agenda to persist time slots in the database~~ — **DONE**                 | Fetches real appointments; slots persisted via API                                         |
| 16  | ~~Wire pharmacy dashboard (4 pages) to real API~~ — **DONE**                            | New SupplierOrder model + /api/pharmacy/kpis, /sales, /supplier-orders endpoints          |
| 17  | ~~Wire lab dashboard (3 pages) to real API~~ — **DONE**                                 | New LabTest + LabResult models + /api/lab/kpis, /tests, /results endpoints                |
| 18  | Use MongoDB aggregation for conversations endpoint                      | Fixes memory/performance issue             |
| 19  | Add pagination to all list endpoints                                    | Prevents unbounded queries                 |
| 20  | Add database indexes                                                    | Speeds up frequent queries                 |

### Higher Effort (Feature Completion)

| #   | Optimization                                                  | Impact                                             |
| --- | ------------------------------------------------------------- | -------------------------------------------------- |
| 21  | Add TURN server for WebRTC                                    | Enables video calls behind corporate firewalls/NAT |
| 22  | Add token refresh mechanism                                   | Prevents auth expiry UX issues                     |
| 23  | Add notification system (backend + real-time)                 | Replaces hardcoded notifications                   |
| 24  | ~~Build lab/radiology backend API~~ — **DONE**                | ✅ /api/lab/* with LabTest + LabResult models       |
| 25  | ~~Build medical service backend API~~ — **DONE**              | ✅ `/api/medical-service/*` implemented and consumed by all 12 pages |
| 26  | ~~Build paramedical backend API~~ — **DONE**                  | ✅ `/api/paramedical/*` implemented and consumed by all 13 pages     |
| 27  | Protect all dashboard routes with `ProtectedRoute` in App.tsx | Prevents content flash and ensures consistent auth |
| 28  | Add input validation library (Zod/Joi) on backend             | Validates all request bodies properly              |

---

## 12. Recommended Action Plan

### Phase 1: Critical Fixes (Immediate)

1. ~~Fix privilege escalation in `PUT /api/users/:id` — strip `role` and `status`~~ ✅ **DONE**
2. ~~Add role check on `POST /api/prescriptions` — doctor only~~ ✅ **DONE**
3. ~~Restrict `GET /api/users` to admin/doctor roles~~ ✅ **DONE**
4. Add `express-async-errors` to prevent unhandled promise crashes
5. ~~Fix hardcoded `localhost:5000` in `DoctorSettingsPage.tsx`~~ ✅ **DONE**
   ~~Fix hardcoded `localhost:5000` in `use-socket.js` and `vite.config.js`~~ ✅ **DONE**

### Phase 2: Security Hardening

6. Add `helmet` middleware
7. Add rate limiting on auth endpoints
8. Add password policy on registration
9. Set `JWT_SECRET` in `.env` and remove hardcoded fallback
10. Strip `doctorId`/`status` from `PUT /api/appointments`
11. Validate/escape regex inputs in search endpoints
12. Add `strict: true` to Doctor model (or remove if unused)

### Phase 3: Core Feature Completion

13. ~~Wire Find Doctor page to real user data~~ ✅ **DONE** — queries User model (role=doctor)
14. ~~Wire patient prescriptions, notifications to real APIs~~ ✅ **DONE** — all 7 patient dashboard pages wired
15. Set `patientName` correctly on appointment creation
16. Wrap all dashboard routes in `ProtectedRoute`
17. Add pagination to list endpoints
18. Add database indexes

### Phase 4: Dashboard Connectivity

19. ~~Build backend APIs for pharmacy management (stock, reservations)~~ ✅ **DONE** — `/api/pharmacy/kpis`, `/sales`, `/supplier-orders`; new SupplierOrder model
20. ~~Build backend APIs for lab/radiology (tests, results)~~ ✅ **DONE** — `/api/lab/kpis`, `/tests`, `/results`; new LabTest + LabResult models
21. ~~Connect pharmacy dashboard (4 pages) to API~~ ✅ **DONE**
22. ~~Connect lab dashboard (3 pages) to API~~ ✅ **DONE**
23. ~~Build backend APIs for medical services~~ ✅ **DONE** — `/api/medical-service/*`
24. ~~Build backend APIs for paramedical services~~ ✅ **DONE** — `/api/paramedical/*`
25. ~~Connect medical service and paramedical dashboard pages to their respective APIs~~ ✅ **DONE** — 25/25 pages wired

### Phase 5: Production Readiness

24. Add TURN server for WebRTC
25. Implement token refresh
26. Add real notification system
27. Add input validation (Zod/Joi)
28. Add MongoDB connection retry logic
29. Add error monitoring (Sentry or equivalent)
30. Clean up dead Doctor model/routes or make them functional

---

## Appendix: Seed Users

| Name                      | Email                 | Role              | Password           | Status   |
| ------------------------- | --------------------- | ----------------- | ------------------ | -------- |
| Admin MegaCare            | admin@megacare.tn     | admin             | Admin@megacare2024 | approved |
| Fatima Benali             | patient@megacare.tn   | patient           | Patient@2024       | approved |
| Youssef Trabelsi          | youssef@megacare.tn   | patient           | Patient@2024       | approved |
| Pharmacie El Amal         | pharmacie@megacare.tn | pharmacy          | Pharma@2024        | approved |
| Labo Central              | labo@megacare.tn      | lab_radiology     | Labo@2024          | approved |
| Clinique Les Oliviers     | clinique@megacare.tn  | medical_service   | Clinique@2024      | approved |
| Dr. Amira Mansouri        | medecin@megacare.tn   | doctor            | Medecin@2024       | approved |
| Dr. Karim Bouazizi        | karim.doc@megacare.tn | doctor            | Medecin@2024       | approved |
| Infirmière Sonia          | sonia@megacare.tn     | paramedical       | Param@2024         | approved |
| Transport Médical Express | transport@megacare.tn | medical_transport | Transport@2024     | approved |
| Dr. Leila Gharbi          | leila.doc@megacare.tn | doctor            | Medecin@2024       | pending  |
