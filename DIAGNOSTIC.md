# MegaCare Platform — Full Diagnostic Report

> Generated: April 13, 2026  
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
| Pages with real API integration | **~28 (35%)** |
| Pages with hardcoded/mock data  | **~43 (54%)** |
| Pages with static content only  | **~9 (11%)**  |
| Orphan pages (no route)         | 0 (cleaned)   |
| Backend API endpoints           | 28            |
| Backend models                  | 8             |
| Critical security issues        | 4             |
| High-priority bugs              | 13            |

**Bottom line:** The platform has excellent UI/UX across all dashboards. The **core patient flow** (auth, appointments, messaging, live consultation, medical records, prescriptions, find doctor, consultations history, notifications, settings, medical history, dashboard) is now fully connected to real backend data. ~54% of pages (mostly secondary dashboards) still run on hardcoded mock data. Pharmacy operates as a **reservation system** (no cart/checkout/e-commerce).

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────┐
│                   Frontend                       │
│  React 19 + Vite + TypeScript + Tailwind CSS    │
│  Port: 5173 (dev) — Proxy /api → :5000          │
│  UI: Radix/shadcn components + Lucide icons     │
├─────────────────────────────────────────────────┤
│                   Backend                        │
│  Express.js 4.18 + Socket.IO 4.8.3             │
│  Port: 5000                                     │
│  Auth: JWT (7-day expiry)                       │
├─────────────────────────────────────────────────┤
│                  Database                        │
│  MongoDB (localhost:27017/megacare)              │
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
| **Doctor Detail Page**       | `GET /api/doctors/:id` now queries User model (role=doctor) instead of empty Doctor collection — returns real data |
| **Doctor Settings**          | Replaced 3 hardcoded `http://localhost:5000` URLs with relative `/api/auth/profile` paths                          |
| **Prescription Creation**    | Added `req.user.role !== "doctor"` guard on `POST /api/prescriptions` — returns 403 for non-doctors                |
| **OCR Prescription Scanner** | Expanded from 10 to ~120+ medicine names across 15+ categories (antibiotics, cardiology, dermatology, etc.)        |

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

#### Doctor Dashboard

| Page                                                        | Hardcoded Data                         |
| ----------------------------------------------------------- | -------------------------------------- |
| `/doctor-dashboard/agenda` (AgendaPage)                     | Static time slots — no API persistence |
| `/doctor-dashboard/prescriptions` (DoctorPrescriptionsPage) | Static prescriptions list              |
| `/doctor-dashboard/revenue` (RevenuePage)                   | Static revenue by period               |
| `/doctor-dashboard/reviews` (ReviewsPage)                   | Static review entries                  |

#### Pharmacy (5 Pages — Reservation Only)

| Page                             | Hardcoded Data                              |
| -------------------------------- | ------------------------------------------- |
| `/pharmacy`                      | Static medicine catalog (reservation model) |
| `/pharmacy/chat`                 | Static mock conversation                    |
| `/pharmacy/medicine/:id`         | Static medicine detail                      |
| `/pharmacy/prescriptions`        | Static prescriptions list                   |
| `/pharmacy/prescription-scanner` | Local OCR only                              |

> **Note:** Cart, checkout, orders, and order detail pages were removed — the pharmacy operates as a reservation system, not an e-commerce platform.

#### Pharmacy Dashboard (All 4 Pages)

| Page                         | Hardcoded Data     |
| ---------------------------- | ------------------ |
| `/pharmacy-dashboard`        | Static KPIs        |
| `/pharmacy-dashboard/orders` | Static orders      |
| `/pharmacy-dashboard/sales`  | Static sales data  |
| `/pharmacy-dashboard/stock`  | Static stock items |

#### Lab Dashboard (All 3 Pages)

| Page                     | Hardcoded Data      |
| ------------------------ | ------------------- |
| `/lab-dashboard`         | Static KPIs         |
| `/lab-dashboard/results` | Static lab results  |
| `/lab-dashboard/tests`   | Static test entries |

#### Medical Service Dashboard (All 12 Pages)

Every page under `/medical-service-dashboard/*` uses hardcoded data: dashboard, analytics, billing, equipment, messaging, patients, prescriptions, schedule, settings, team, teleconsultation, vitals.

#### Paramedical Dashboard (All 13 Pages)

Every page under `/paramedical-dashboard/*` uses hardcoded data: dashboard, appointments, care record, map, messaging, notifications, patients, planning, reports, settings, supplies, teleconsultation, vitals.

#### Public Pages

| Page                     | Issue                                                                |
| ------------------------ | -------------------------------------------------------------------- |
| `/doctors` (DoctorsPage) | Uses `mockDoctors` array — not connected to API despite API existing |
| `/paramedical`           | Hardcoded products                                                   |
| `/services-medicaux`     | Hardcoded establishments                                             |
| `/labos-radiologie`      | Hardcoded lab centers                                                |

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

### ❌ Backend Features Without Frontend

| Backend Capability           | Issue                                                             |
| ---------------------------- | ----------------------------------------------------------------- |
| `GET /api/pharmacy/products` | Exists but pharmacy catalog uses hardcoded `lib/pharmacy-data.ts` |

### ✅ Previously Unused Endpoints — Now Connected

| Backend Capability          | Fix Applied                                                        |
| --------------------------- | ------------------------------------------------------------------ |
| `GET /api/prescriptions`    | Now used by PrescriptionsPage, DashboardPage, NotificationsPage    |
| `GET /api/doctors` + `/:id` | Rewired to query User model (role=doctor) — used by FindDoctorPage |
| `GET /api/dossier`          | Now used by MedicalHistoryPage                                     |

---

## 5. Security Vulnerabilities

### 🔴 CRITICAL

| #   | Vulnerability                                    | Location                  | Impact                                                                                                                                                                                                           |
| --- | ------------------------------------------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Privilege escalation via PUT /api/users/:id**  | `routes/users.js`         | Any authenticated user can set their own `role` to `"admin"` and `status` to `"approved"` by sending `{ role: "admin", status: "approved" }`. The route only strips `password`, `id`, and `email` from the body. |
| 2   | ~~**No role check on POST /api/prescriptions**~~ | `routes/prescriptions.js` | **FIXED** — Added `req.user.role !== "doctor"` guard. Returns 403 for non-doctors.                                                                                                                               |
| 3   | **GET /api/users exposes all users**             | `routes/users.js`         | Any authenticated user can list every user in the system (emails, phones, roles, addresses). Passwords are excluded but all PII is exposed.                                                                      |
| 4   | **No async error handling in any route**         | All route files           | No `try/catch` on any async handler. An unhandled Mongoose error will crash the request (hang forever or return stack trace). Use `express-async-errors` or manual wrapping.                                     |

### 🟠 HIGH

| #   | Vulnerability                                                        | Location                                                                                                      |
| --- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| 5   | **Hardcoded JWT secret fallback** `"megacare_secret_key"`            | `index.js`, `auth.js`, `admin.js` — if `JWT_SECRET` env var is unset, tokens use a publicly known key         |
| 6   | **No password policy on registration**                               | `routes/auth.js` — password change requires ≥8 chars, but registration allows single-char passwords           |
| 7   | **No rate limiting** on login or any endpoint                        | `index.js` — brute-force attacks are trivial                                                                  |
| 8   | **Self-registration allows any role**                                | `routes/auth.js` — a user can register with `role: "admin"` (gets `status: "pending"`, but the record exists) |
| 9   | **PUT /api/appointments allows overwriting `doctorId` and `status`** | `routes/appointments.js` — patient can change the doctor or mark their own appointment as `completed`         |
| 10  | **Doctor model accepts arbitrary data**                              | `routes/doctors.js` — `strict: false` + `...rest` spread = any fields stored in MongoDB                       |
| 11  | **No role check on POST /api/doctors**                               | `routes/doctors.js` — any authenticated user can create doctor records                                        |
| 12  | **Regex injection in search filters**                                | `routes/doctors.js`, `routes/pharmacy.js` — user input passed directly to `new RegExp()`                      |

### 🟡 MEDIUM

| #   | Issue                                                                                | Location          |
| --- | ------------------------------------------------------------------------------------ | ----------------- |
| 13  | No `helmet` security headers                                                         | `index.js`        |
| 14  | Socket events accept any userId as target (no validation)                            | `index.js`        |
| 15  | Logout is a no-op — no token blacklist                                               | `routes/auth.js`  |
| 16  | Admin auth middleware is fully duplicated                                            | `routes/admin.js` |
| 17  | No CORS restriction on API (accepts configured origin only, but origin is hardcoded) | `index.js`        |

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
| **pharmacy.js**      | ⚠️ Incomplete      | No stock validation/decrement. No GET orders list. No order status management.                                   |

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
| **use-socket**     | ⚠️     | **Hardcoded `http://localhost:5000`** bypasses Vite proxy. Doesn't reconnect on login/logout.                             |
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
| `/admin/stats`     | 🔴     | Hardcoded KPIs |
| `/admin/settings`  | 🔴     | Not wired      |

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
| `/doctor-dashboard/agenda`              | 🔴     | Hardcoded time slots       |
| `/doctor-dashboard/consultations`       | 🟢     | API                        |
| `/doctor-dashboard/live-consultation`   | 🟢     | API + WebRTC               |
| `/doctor-dashboard/patients`            | 🟢     | API                        |
| `/doctor-dashboard/patient-dossier/:id` | 🟢     | API                        |
| `/doctor-dashboard/prescriptions`       | 🔴     | Hardcoded                  |
| `/doctor-dashboard/revenue`             | 🔴     | Hardcoded                  |
| `/doctor-dashboard/reviews`             | 🔴     | Hardcoded                  |
| `/doctor-dashboard/settings`            | �      | API (localhost URLs fixed) |
| `/doctor-dashboard/messaging`           | 🟢     | API + Socket.IO            |

### Pharmacy (Customer — Reservation Only)

| Route                            | Status | Data                                   |
| -------------------------------- | ------ | -------------------------------------- |
| `/pharmacy`                      | 🔴     | Hardcoded catalog (reservation)        |
| `/pharmacy/chat`                 | 🔴     | Hardcoded                              |
| `/pharmacy/medicine/:id`         | 🔴     | Hardcoded                              |
| `/pharmacy/prescriptions`        | 🔴     | Hardcoded                              |
| `/pharmacy/prescription-scanner` | 🟡     | Local OCR (expanded to 120+ medicines) |

### Pharmacy Dashboard

| Route       | Status       |
| ----------- | ------------ |
| All 4 pages | 🔴 Hardcoded |

### Lab Dashboard

| Route       | Status       |
| ----------- | ------------ |
| All 3 pages | 🔴 Hardcoded |

### Medical Service Dashboard

| Route        | Status       |
| ------------ | ------------ |
| All 12 pages | 🔴 Hardcoded |

### Paramedical Dashboard

| Route        | Status       |
| ------------ | ------------ |
| All 13 pages | 🔴 Hardcoded |

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

### Endpoints That Exist But Are NOT Used

| Endpoint                     | Method | Notes                                  |
| ---------------------------- | ------ | -------------------------------------- |
| `/api/pharmacy/products`     | GET    | Pharmacy pages use hardcoded data      |
| `/api/pharmacy/products/:id` | GET    | Not used                               |
| `/api/prescriptions/:id`     | GET    | Not used                               |
| `/api/doctors`               | POST   | Not used meaningfully                  |
| `/api/users/:id`             | PUT    | Not used (settings pages don't use it) |
| `/api/auth/logout`           | POST   | Called but is a no-op                  |
| `/health`                    | GET    | Not used by frontend                   |

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
| 5   | **Strip `role` and `status` from PUT /api/users/:id body**                    | `routes/users.js`                  | 1 min  |
| 6   | ~~**Add role check to POST /api/prescriptions**~~ — **DONE**                  | `routes/prescriptions.js`          | Done   |
| 7   | **Add rate limiting to login endpoint**                                       | `routes/auth.js` or `index.js`     | 5 min  |
| 8   | **Stop re-emitting `webrtc:ready` after connection**                          | `use-webrtc.ts`                    | 2 min  |
| 9   | **Restrict GET /api/users to admin and doctor roles**                         | `routes/users.js`                  | 2 min  |
| 10  | **Set `patientName` on POST /api/appointments** by looking up the user        | `routes/appointments.js`           | 5 min  |

### Medium Effort (Backend API Connectivity)

| #   | Optimization                                                            | Impact                                     |
| --- | ----------------------------------------------------------------------- | ------------------------------------------ |
| 11  | ~~Wire Find Doctor to real API~~ — **DONE**                             | Uses `GET /api/doctors` (User model query) |
| 12  | ~~Wire patient prescriptions to real API~~ — **DONE**                   | Uses `GET /api/prescriptions`              |
| 13  | Wire pharmacy pages to `GET /api/pharmacy/products` (reservation model) | Enables real medicine catalog              |
| 14  | ~~Wire patient settings with save~~ — **DONE**                          | PATCH profile + password change            |
| 15  | Wire doctor agenda to persist time slots in the database                | Currently resets on page reload            |
| 16  | Use MongoDB aggregation for conversations endpoint                      | Fixes memory/performance issue             |
| 17  | Add pagination to all list endpoints                                    | Prevents unbounded queries                 |
| 18  | Add database indexes                                                    | Speeds up frequent queries                 |

### Higher Effort (Feature Completion)

| #   | Optimization                                                  | Impact                                             |
| --- | ------------------------------------------------------------- | -------------------------------------------------- |
| 19  | Add TURN server for WebRTC                                    | Enables video calls behind corporate firewalls/NAT |
| 20  | Add token refresh mechanism                                   | Prevents auth expiry UX issues                     |
| 21  | Add notification system (backend + real-time)                 | Replaces hardcoded notifications                   |
| 22  | Build lab/radiology backend API                               | Connects lab dashboard to real data                |
| 23  | Build medical service backend API                             | Connects medical service dashboard to real data    |
| 24  | Build paramedical backend API                                 | Connects paramedical dashboard to real data        |
| 25  | Protect all dashboard routes with `ProtectedRoute` in App.tsx | Prevents content flash and ensures consistent auth |
| 26  | Add input validation library (Zod/Joi) on backend             | Validates all request bodies properly              |

---

## 12. Recommended Action Plan

### Phase 1: Critical Fixes (Immediate)

1. Fix privilege escalation in `PUT /api/users/:id` — strip `role` and `status`
2. ~~Add role check on `POST /api/prescriptions` — doctor only~~ ✅ **DONE**
3. Restrict `GET /api/users` to admin/doctor roles
4. Add `express-async-errors` to prevent unhandled promise crashes
5. ~~Fix hardcoded `localhost:5000` in `DoctorSettingsPage.tsx`~~ ✅ **DONE** (socket hook still uses hardcoded URL)

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

19. Build backend APIs for pharmacy management (stock, reservations)
20. Build backend APIs for lab/radiology (tests, results)
21. Build backend APIs for medical services
22. Build backend APIs for paramedical services
23. Connect all dashboard pages to their respective APIs

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
