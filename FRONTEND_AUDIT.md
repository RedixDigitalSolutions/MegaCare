# MegaCare Frontend — Comprehensive Audit Report

**Date:** Generated from full codebase read  
**Scope:** All 101 page files, all components, hooks, lib, contexts, and configuration  
**TypeScript errors:** 0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Critical Issues](#3-critical-issues)
4. [Public Pages](#4-public-pages)
5. [Admin Dashboard](#5-admin-dashboard)
6. [Patient Dashboard](#6-patient-dashboard)
7. [Doctor Dashboard](#7-doctor-dashboard)
8. [Pharmacy (Public)](#8-pharmacy-public)
9. [Pharmacy Dashboard](#9-pharmacy-dashboard)
10. [Lab Dashboard](#10-lab-dashboard)
11. [Medical Service Dashboard](#11-medical-service-dashboard)
12. [Paramedical Dashboard](#12-paramedical-dashboard)
13. [Transport Dashboard](#13-transport-dashboard)
14. [Orphan Pages](#14-orphan-pages)
15. [Cross-Cutting Concerns](#15-cross-cutting-concerns)

---

## 1. Executive Summary

| Metric                                       | Count                                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------------- |
| Total page files on disk                     | 101                                                                             |
| Routes defined in App.tsx                    | ~90                                                                             |
| Pages using REAL API calls                   | ~16                                                                             |
| Pages with ALL HARDCODED data                | ~75+                                                                            |
| Pages with ProtectedRoute wrapper            | 5 routes (lab-dashboard/results, lab-dashboard/tests, paramedical-dashboard/\*) |
| Orphan files (exist but no route in App.tsx) | 9 files (transport-dashboard/_, services/_, dashboard/tracking)                 |
| Broken internal links                        | 2+                                                                              |

**Bottom line:** The frontend is a large UI prototype. Most dashboards render beautiful, polished hardcoded mockups with no API integration. Only auth (login/register), patient messaging, doctor messaging, appointments, medical records/dossier, admin user management, and live consultations connect to the real backend. Almost no dashboard is protected by `ProtectedRoute` in the router — they rely on per-page `useEffect` redirects that flash content before redirecting.

---

## 2. Architecture Overview

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Framework | React 19.2.4 + TypeScript 5.7.3             |
| Build     | Vite 6.3.1                                  |
| Routing   | react-router-dom 6.30.0 (BrowserRouter)     |
| State     | React Context (AuthContext), local useState |
| UI        | Radix UI (extensive), Tailwind CSS 4.2.0    |
| Charts    | Recharts                                    |
| Real-time | socket.io-client 4.8.3                      |
| Video     | Custom WebRTC (useWebRTC hook)              |
| OCR       | tesseract.js 7.0.0                          |
| Forms     | react-hook-form + zod                       |
| Toasts    | sonner                                      |

**Entry point:** `main.tsx` → `BrowserRouter` → `AuthProvider` → `App`  
**Auth persistence:** localStorage keys `megacare_user` + `megacare_token`

---

## 3. Critical Issues

### 3.1 AUTH PROTECTION GAPS (HIGH SEVERITY)

Almost no dashboard route is protected in `App.tsx` via `<ProtectedRoute>`. The only protected routes are:

```
/lab-dashboard/results → ProtectedRoute role="lab_radiology"
/lab-dashboard/tests   → ProtectedRoute role="lab_radiology"
/paramedical-dashboard/* → ProtectedRoute role="paramedical"  (all sub-routes)
```

**ALL of these are UNPROTECTED in the router:**

- `/admin`, `/admin/*` — No ProtectedRoute
- `/dashboard`, `/dashboard/*` — No ProtectedRoute (patient)
- `/doctor-dashboard`, `/doctor-dashboard/*` — No ProtectedRoute
- `/pharmacy-dashboard`, `/pharmacy-dashboard/*` — No ProtectedRoute
- `/medical-service-dashboard`, `/medical-service-dashboard/*` — No ProtectedRoute
- `/lab-dashboard` (main page) — No ProtectedRoute (only sub-pages protected)

These pages use `useEffect` + `useNavigate` inside the component to redirect, which means:

- The page component renders briefly before the redirect fires
- There is no server-side validation (client-side only)
- If JS is slow or fails, the page is visible

### 3.2 BROKEN LINKS

| Page            | Broken Link            | Issue                                                       |
| --------------- | ---------------------- | ----------------------------------------------------------- |
| WelcomePage.tsx | `/dashboards-overview` | Route does not exist in App.tsx. Clicking this gives a 404. |

### 3.3 NO TOKEN REFRESH

`AuthContext.tsx` has no token refresh mechanism. The token is stored in localStorage and sent as-is. If it expires, the user silently fails API calls with no re-auth flow.

### 3.4 NO SESSION VALIDATION ON LOAD

When the app loads, AuthContext reads the user from localStorage but does NOT validate the token against the server. A user with an expired/revoked token will appear "logged in" until their first API call fails.

---

## 4. Public Pages

### 4.1 HomePage.tsx

- **Route:** `/`
- **Purpose:** Marketing landing page with animated sections, parallax, counters
- **API:** None — ALL hardcoded
- **Issues:** None functional. Pure marketing page.

### 4.2 LoginPage.tsx

- **Route:** `/login`
- **Purpose:** Multi-step login (role selection → credentials)
- **API:** `POST /api/auth/login` ✅ REAL
- **Error handling:** Yes — displays API error messages
- **Notes:** Stores JWT token and user to localStorage via AuthContext

### 4.3 RegisterPage.tsx

- **Route:** `/register`
- **Purpose:** Multi-step registration form
- **API:** `POST /api/auth/register` ✅ REAL
- **Error handling:** Yes — validation + API errors displayed
- **Notes:** Redirects to account-review for pending accounts

### 4.4 LoginTestDataPage.tsx

- **Route:** `/login-test`
- **Purpose:** Quick-login with 11 predefined test accounts
- **API:** `POST /api/auth/login` ✅ REAL
- **Notes:** Development/demo convenience. Should be removed in production.

### 4.5 DoctorsPage.tsx

- **Route:** `/doctors`
- **Purpose:** Doctor listing with filters
- **API:** None — ALL HARDCODED (8 mock doctors)
- **Issues:** Should fetch from `GET /api/doctors`

### 4.6 DoctorDetailPage.tsx

- **Route:** `/doctors/:id`
- **Purpose:** Doctor profile, schedule, booking
- **API:** `GET /api/doctors/:id` ✅ REAL
- **Issues:** Reviews section is hardcoded. Booking doesn't create a real appointment.

### 4.7 GuidePage.tsx

- **Route:** `/guide`
- **Purpose:** Static guide with how-it-works, pricing, FAQ tabs
- **API:** None — all hardcoded content

### 4.8 ConsultationPage.tsx

- **Route:** `/consultation`
- **Purpose:** Video consultation UI mockup
- **API:** `POST /api/prescriptions` ✅ REAL (for prescription creation)
- **Issues:** Chat messages are hardcoded. This page appears to be a standalone mockup, not integrated with the real consultation flow.

### 4.9 ProfilePage.tsx

- **Route:** `/profile`
- **Purpose:** User profile editing
- **API:** `PATCH /api/auth/profile` ✅ REAL
- **Auth:** useEffect redirect (not ProtectedRoute)
- **Issues:** Avatar upload is local-only (base64 in context), not uploaded to server

### 4.10 WelcomePage.tsx

- **Route:** `/welcome`
- **Purpose:** Welcome/landing page
- **API:** None
- **Issues:** Links to `/dashboards-overview` which DOES NOT EXIST → broken link

### 4.11 AccountReviewPage.tsx

- **Route:** `/account-review`
- **Purpose:** Shows pending/rejected account status
- **Auth:** useEffect redirect for approved users

### 4.12 ConditionsPage.tsx

- **Route:** `/conditions`
- **Purpose:** Static terms of service — no issues

### 4.13 PolitiquePage.tsx

- **Route:** `/politique-confidentialite`
- **Purpose:** Static privacy policy — no issues

### 4.14 ParamedicalPage.tsx

- **Route:** `/paramedical`
- **Purpose:** Paramedical services/products catalog
- **API:** None — ALL HARDCODED (16+ products)

### 4.15 ParamedicalProductPage.tsx

- **Route:** `/paramedical/:id`
- **Purpose:** Product detail
- **API:** None — HARDCODED (duplicates data from ParamedicalPage)
- **Issues:** Same product array duplicated across two files

### 4.16 ServicesMediauxPage.tsx

- **Route:** `/services-medicaux`
- **Purpose:** Medical services listing
- **API:** None — ALL HARDCODED (9 establishments)

### 4.17 ServiceMedicalDetailPage.tsx

- **Route:** `/services-medicaux/:id`
- **Purpose:** Service detail
- **API:** None — HARDCODED (duplicates data from listing page)

### 4.18 LabosRadiologiePage.tsx

- **Route:** `/labos-radiologie`
- **Purpose:** Labs/radiology listing
- **API:** None — ALL HARDCODED

### 4.19 LaboDetailPage.tsx

- **Route:** `/labos-radiologie/:id`
- **Purpose:** Lab detail
- **API:** None — HARDCODED

### 4.20 NotFoundPage.tsx

- **Route:** `*` (catch-all)
- **Purpose:** 404 page with navigation links

---

## 5. Admin Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect in each page.

### 5.1 AdminPage.tsx

- **Route:** `/admin`
- **Purpose:** Main admin dashboard with user management
- **API:** ✅ REAL via adminConfig.tsx helpers (fetches users, approve/reject/suspend)
- **Notes:** Imports heavy admin helper file with API functions

### 5.2 AdminUsersPage.tsx

- **Route:** `/admin/users`
- **API:** ✅ REAL — fetches all users, approve/reject/suspend actions

### 5.3 AdminPendingPage.tsx

- **Route:** `/admin/pending`
- **API:** ✅ REAL — fetches pending users

### 5.4 AdminSuspendedPage.tsx

- **Route:** `/admin/suspended`
- **API:** ✅ REAL — fetches suspended users

### 5.5 AdminStatsPage.tsx

- **Route:** `/admin/stats`
- **API:** ✅ REAL (derives stats from user data)

### 5.6 AdminSettingsPage.tsx

- **Route:** `/admin/settings`
- **API:** ❌ HARDCODED — comments say "In a real app, call PATCH /api/admin/profile" but no actual API calls

---

## 6. Patient Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect.

### 6.1 DashboardPage.tsx

- **Route:** `/dashboard`
- **Purpose:** Main patient dashboard
- **API:** ❌ HARDCODED — upcoming appointments, stats all mock data

### 6.2 AppointmentsPage.tsx

- **Route:** `/dashboard/appointments`
- **API:** ✅ REAL — `GET /api/appointments` + `GET /api/users/:id` for doctor names

### 6.3 ConsultationsPage.tsx

- **Route:** `/dashboard/consultations`
- **API:** ❌ HARDCODED consultation history

### 6.4 PatientLiveConsultationPage.tsx

- **Route:** `/dashboard/consultation/:id`
- **API:** ✅ REAL — WebRTC + Socket.IO + chat messages API
- **Notes:** Full working live video consultation with camera/mic toggle, chat

### 6.5 FindDoctorPage.tsx

- **Route:** `/dashboard/find-doctor`
- **API:** ❌ HARDCODED (duplicates DoctorsPage mock data)
- **Issues:** Same 8 hardcoded doctors as public DoctorsPage

### 6.6 MedicalHistoryPage.tsx

- **Route:** `/dashboard/history`
- **API:** ❌ HARDCODED
- **Issues:** Uses custom header instead of DashboardSidebar (inconsistent layout)

### 6.7 MedicalRecordsPage.tsx

- **Route:** `/dashboard/records`
- **API:** ✅ REAL — `GET /api/dossier` + `PATCH /api/dossier`
- **Notes:** Full CRUD for medical records

### 6.8 NotificationsPage.tsx

- **Route:** `/dashboard/notifications`
- **API:** ❌ HARDCODED notifications

### 6.9 OrdersPage.tsx

- **Route:** `/dashboard/orders`
- **API:** ❌ HARDCODED orders

### 6.10 PrescriptionsPage.tsx

- **Route:** `/dashboard/prescriptions`
- **API:** ❌ HARDCODED prescriptions

### 6.11 SettingsPage.tsx

- **Route:** `/dashboard/settings`
- **API:** ❌ HARDCODED
- **Issues:** All fields are `readOnly`. No save button. Completely non-functional.

### 6.12 PatientMessagesPage.tsx

- **Route:** `/dashboard/messages`
- **API:** ✅ REAL — `GET /api/messages/conversations`, real-time Socket.IO with typing indicators, online status

---

## 7. Doctor Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect.

### 7.1 DoctorDashboardPage.tsx

- **Route:** `/doctor-dashboard`
- **API:** ✅ REAL — `GET /api/appointments`. Checks approved status.

### 7.2 AgendaPage.tsx

- **Route:** `/doctor-dashboard/agenda`
- **API:** ❌ HARDCODED initial agenda + localStorage persistence
- **Issues:** No sync with server appointments

### 7.3 DoctorConsultationsPage.tsx

- **Route:** `/doctor-dashboard/consultations`
- **API:** ✅ REAL — fetches appointments, maps status

### 7.4 LiveConsultationPage.tsx

- **Route:** `/doctor-dashboard/consultation/:id`
- **API:** ✅ REAL — WebRTC + chat + prescription creation + appointment completion
- **Notes:** Full working live consultation with `POST /api/prescriptions`

### 7.5 DoctorPatientsPage.tsx

- **Route:** `/doctor-dashboard/patients`
- **API:** ✅ Partially REAL — fetches patients but enriches with HARDCODED extra data (PATIENT_EXTRA object)

### 7.6 DoctorPrescriptionsPage.tsx

- **Route:** `/doctor-dashboard/prescriptions`
- **API:** ❌ HARDCODED prescription data

### 7.7 RevenuePage.tsx

- **Route:** `/doctor-dashboard/revenue`
- **API:** ❌ HARDCODED revenue/transaction data

### 7.8 ReviewsPage.tsx

- **Route:** `/doctor-dashboard/reviews`
- **API:** ❌ HARDCODED reviews (7 mock reviews)

### 7.9 DoctorSettingsPage.tsx

- **Route:** `/doctor-dashboard/settings`
- **API:** ✅ Partially REAL — profile update via PATCH. Notification prefs stored in localStorage only.

### 7.10 DoctorMessagingPage.tsx

- **Route:** `/doctor-dashboard/messages`
- **API:** ✅ REAL — API + Socket.IO real-time messaging

### 7.11 PatientDossierPage.tsx

- **Route:** `/doctor-dashboard/patient/:patientId/dossier`
- **API:** ✅ REAL — `GET /api/dossier/:patientId`

---

## 8. Pharmacy (Public)

### 8.1 PharmacyPage.tsx

- **Route:** `/pharmacy`
- **API:** ❌ HARDCODED medicine catalog. Local-state-only cart.
- **Issues:** Cart counter is component-local state, lost on navigation.

### 8.2 MedicineDetailPage.tsx

- **Route:** `/pharmacy/medicine/:id`
- **API:** ❌ HARDCODED (medicine object defined inline per ID)

### 8.3 CartPage.tsx

- **Route:** `/pharmacy/cart`
- **API:** ❌ HARDCODED cart items (not connected to PharmacyPage cart)

### 8.4 CheckoutPage.tsx

- **Route:** `/pharmacy/checkout`
- **API:** ❌ HARDCODED checkout form. No real payment processing.

### 8.5 PharmacyOrdersPage.tsx

- **Route:** `/pharmacy/orders`
- **API:** ❌ HARDCODED orders list

### 8.6 OrderDetailPage.tsx

- **Route:** `/pharmacy/order/:id`
- **API:** ❌ HARDCODED order details with timeline

### 8.7 PharmacyPrescriptionsPage.tsx

- **Route:** `/pharmacy/prescriptions`
- **API:** ❌ HARDCODED prescriptions list

### 8.8 PrescriptionScannerPage.tsx

- **Route:** `/pharmacy/prescription-scanner`
- **API:** ❌ Uses local OCR (tesseract.js) + local pharmacy-data.ts mock data
- **Notes:** The OCR actually works (tesseract.js) but uses mock pharmacy data for results

### 8.9 PharmacyChatPage.tsx

- **Route:** `/pharmacy/chat`
- **API:** ❌ HARDCODED static chat messages. No real pharmacist connection.

---

## 9. Pharmacy Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect.

### 9.1 PharmacyDashboardPage.tsx

- **Route:** `/pharmacy-dashboard`
- **API:** ❌ HARDCODED KPIs and stats

### 9.2 PharmacyDashboardOrdersPage.tsx

- **Route:** `/pharmacy-dashboard/orders`
- **API:** ❌ HARDCODED supplier orders

### 9.3 SalesPage.tsx

- **Route:** `/pharmacy-dashboard/sales`
- **API:** ❌ HARDCODED sales data (revenue, orders, chart data per period)

### 9.4 StockPage.tsx

- **Route:** `/pharmacy-dashboard/stock`
- **API:** ❌ HARDCODED stock inventory with image editor
- **Notes:** Has image URL/upload feature for products (local only)

---

## 10. Lab Dashboard

**Auth protection:** Main page — no ProtectedRoute. Sub-pages (`/results`, `/tests`) — ProtectedRoute ✅

### 10.1 LabDashboardPage.tsx

- **Route:** `/lab-dashboard`
- **API:** ❌ HARDCODED KPIs, quick links, activities

### 10.2 LabTestsPage.tsx

- **Route:** `/lab-dashboard/tests` — ProtectedRoute ✅
- **API:** ❌ HARDCODED test data. Local CRUD (add/edit tests in state only)

### 10.3 LabResultsPage.tsx

- **Route:** `/lab-dashboard/results` — ProtectedRoute ✅
- **API:** ❌ HARDCODED results data

---

## 11. Medical Service Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect.

**ALL 12 pages in this dashboard are FULLY HARDCODED with zero API calls.**

| Page                            | Route                                         | Purpose                                            |
| ------------------------------- | --------------------------------------------- | -------------------------------------------------- |
| MedicalServiceDashboardPage     | `/medical-service-dashboard`                  | Main dashboard with KPIs, activities               |
| AnalyticsPage                   | `/medical-service-dashboard/analytics`        | Statistics with bar charts (hardcoded)             |
| BillingPage                     | `/medical-service-dashboard/billing`          | Invoices and payments (local CRUD)                 |
| EquipmentPage                   | `/medical-service-dashboard/equipment`        | Equipment inventory (local CRUD)                   |
| MessagingPage                   | `/medical-service-dashboard/messaging`        | Chat interface (hardcoded messages, no socket/API) |
| MedicalServicePatientsPage      | `/medical-service-dashboard/patients`         | Patient management (local CRUD)                    |
| MedicalServicePrescriptionsPage | `/medical-service-dashboard/prescriptions`    | Prescriptions (local CRUD)                         |
| SchedulePage                    | `/medical-service-dashboard/schedule`         | Visit scheduling (local CRUD)                      |
| MedicalServiceSettingsPage      | `/medical-service-dashboard/settings`         | Service settings (local state only)                |
| TeamPage                        | `/medical-service-dashboard/team`             | Team management (local CRUD)                       |
| TeleconsultationPage            | `/medical-service-dashboard/teleconsultation` | Teleconsultation listing (no real video)           |
| VitalsPage                      | `/medical-service-dashboard/vitals`           | Vital signs monitoring (hardcoded data)            |

---

## 12. Paramedical Dashboard

**Auth protection:** ProtectedRoute ✅ (all sub-routes via `paramedical-dashboard/*`)

**ALL 13 pages in this dashboard are FULLY HARDCODED with zero API calls.**

| Page                            | Route                                     | Purpose                                      |
| ------------------------------- | ----------------------------------------- | -------------------------------------------- |
| ParamedicalDashboardPage        | `/paramedical-dashboard`                  | Main dashboard with KPIs                     |
| ParamedicalAppointmentsPage     | `/paramedical-dashboard/appointments`     | Appointments (local CRUD)                    |
| CareRecordPage                  | `/paramedical-dashboard/care-record`      | Care session recording (local state)         |
| MapPage                         | `/paramedical-dashboard/map`              | Visit route/itinerary (hardcoded stops)      |
| ParamedicalMessagingPage        | `/paramedical-dashboard/messaging`        | Chat (hardcoded, no socket/API)              |
| ParamedicalNotificationsPage    | `/paramedical-dashboard/notifications`    | Notifications (hardcoded)                    |
| ParamedicalPatientsPage         | `/paramedical-dashboard/patients`         | Patient listing (hardcoded)                  |
| PlanningPage                    | `/paramedical-dashboard/planning`         | Weekly planning (hardcoded)                  |
| ReportsPage                     | `/paramedical-dashboard/reports`          | Reports (hardcoded)                          |
| ParamedicalSettingsPage         | `/paramedical-dashboard/settings`         | Settings (local state, no API save)          |
| SuppliesPage                    | `/paramedical-dashboard/supplies`         | Supply/stock management (local state)        |
| ParamedicalTeleconsultationPage | `/paramedical-dashboard/teleconsultation` | Video call mockup (no real WebRTC)           |
| ParamedicalVitalsPage           | `/paramedical-dashboard/vitals`           | Vital signs with thresholds (hardcoded data) |

---

## 13. Transport Dashboard

**Auth protection:** None via ProtectedRoute. Uses `useEffect` redirect.

**ALL 3 pages are FULLY HARDCODED with zero API calls.**

| Page                   | Route                                             | Purpose                  |
| ---------------------- | ------------------------------------------------- | ------------------------ |
| TransportDashboardPage | `/transport-dashboard` (NOT IN App.tsx!)          | Main dashboard           |
| VehiclesPage           | `/transport-dashboard/vehicles` (NOT IN App.tsx!) | Vehicle fleet management |
| TripsPage              | `/transport-dashboard/trips` (NOT IN App.tsx!)    | Trip management          |

**CRITICAL:** These 3 pages exist as files but have NO routes in App.tsx. They are completely unreachable.

---

## 14. Orphan Pages

These files exist on disk but have **no route defined in App.tsx**:

| File                       | Path                            | Notes                                                                |
| -------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| TransportDashboardPage.tsx | `transport-dashboard/`          | No route. Has auth guard inside.                                     |
| VehiclesPage.tsx           | `transport-dashboard/vehicles/` | No route                                                             |
| TripsPage.tsx              | `transport-dashboard/trips/`    | No route                                                             |
| ParamedicalServicePage.tsx | `services/paramedical/`         | No route. Full marketing page.                                       |
| MedicalServicePage.tsx     | `services/medical/`             | No route. Full marketing page.                                       |
| LabServicePage.tsx         | `services/lab/`                 | No route. Full marketing page.                                       |
| TrackingPage.tsx           | `dashboard/tracking/`           | No route. Delivery tracking page.                                    |
| HowItWorksPage.tsx         | `how-it-works/`                 | Redirect to /guide — but App.tsx does this inline, so file is unused |
| PricingPage.tsx            | `pricing/`                      | Redirect to /guide — but App.tsx does this inline, so file is unused |

---

## 15. Cross-Cutting Concerns

### 15.1 Data Duplication

Multiple pages contain **duplicate hardcoded data arrays**:

- `DoctorsPage.tsx` and `FindDoctorPage.tsx` — same 8 mock doctors
- `ParamedicalPage.tsx` and `ParamedicalProductPage.tsx` — same product catalog
- `ServicesMediauxPage.tsx` and `ServiceMedicalDetailPage.tsx` — same establishments
- `LabosRadiologiePage.tsx` and `LaboDetailPage.tsx` — same lab data

These should be centralized into shared data files or (ideally) fetched from the API.

### 15.2 Inconsistent Auth Patterns

Three different auth patterns are used:

1. **ProtectedRoute wrapper** (correct way) — only used for lab-dashboard sub-pages and paramedical-dashboard
2. **useEffect redirect** — most dashboard pages; causes flicker
3. **No protection at all** — some public pages that probably should require auth

### 15.3 Inconsistent Layout

- Most dashboard pages use their respective `*DashboardSidebar` component
- `MedicalHistoryPage.tsx` (patient dashboard) does NOT use `DashboardSidebar` — uses a custom header instead
- Transport dashboard pages have no sidebar component at all; they use inline header/layout

### 15.4 No Global State for Cart

The pharmacy cart is local component state in `PharmacyPage.tsx`. It's:

- Lost on navigation
- Not connected to `CartPage.tsx` (which has its own hardcoded items)
- Not connected to `CheckoutPage.tsx`
- There is no shared cart context or store

### 15.5 Real API Coverage Summary

| Feature                     | API Status                                                  |
| --------------------------- | ----------------------------------------------------------- |
| Login/Register              | ✅ Real                                                     |
| Profile Update              | ✅ Real                                                     |
| Admin User Management       | ✅ Real                                                     |
| Patient Appointments        | ✅ Real                                                     |
| Patient Medical Records     | ✅ Real                                                     |
| Patient Messages            | ✅ Real (Socket.IO)                                         |
| Patient Live Consultation   | ✅ Real (WebRTC)                                            |
| Doctor Dashboard (overview) | ✅ Real (appointments)                                      |
| Doctor Consultations        | ✅ Real                                                     |
| Doctor Live Consultation    | ✅ Real (WebRTC)                                            |
| Doctor Messages             | ✅ Real (Socket.IO)                                         |
| Doctor Patients             | ⚠️ Partially real (enriched with hardcoded data)            |
| Doctor Settings             | ⚠️ Partially real (profile yes, notifications localStorage) |
| Patient Dossier             | ✅ Real                                                     |
| Prescription Creation       | ✅ Real (from live consultation)                            |
| Everything else             | ❌ Hardcoded                                                |

### 15.6 Security Concerns

1. **No CSRF protection** visible in API calls
2. **Token stored in localStorage** — vulnerable to XSS
3. **No input sanitization** on frontend forms (relies on backend)
4. **Test login page** (`/login-test`) should be disabled in production
5. **Admin routes unprotected** — a direct URL visit will briefly render admin UI

### 15.7 Missing Features (Referenced in UI but Not Implemented)

- Payment processing (CheckoutPage is a static form)
- Delivery tracking (TrackingPage exists but is orphaned)
- Real pharmacy integration (all pharmacy data is mock)
- Notification system (hardcoded everywhere)
- Doctor reviews (hardcoded on detail page)
- Revenue/analytics for doctors (hardcoded)
- All medical-service-dashboard CRUD operations (local state only, no persistence)

---

## Summary By Priority

### P0 — Must Fix (Security/Functionality)

1. Wrap ALL dashboard routes in `<ProtectedRoute>` with appropriate roles
2. Remove or gate `/login-test` for production
3. Fix broken link in WelcomePage (`/dashboards-overview`)
4. Add routes for transport-dashboard pages or remove the files

### P1 — Should Fix (Major Gaps)

1. Connect `DoctorsPage` and `FindDoctorPage` to `GET /api/doctors`
2. Implement real cart state management (Context or store)
3. Fix patient `SettingsPage` — currently completely non-functional (readOnly fields, no save)
4. Add token refresh / session validation on app load
5. Connect patient dashboard overview to real data

### P2 — Nice to Have (Polish)

1. Centralize duplicated hardcoded data into shared files
2. Standardize layout (DashboardSidebar) across all patient dashboard pages
3. Connect remaining hardcoded pages to APIs as backend endpoints are built
4. Clean up orphan page files (services/\*, HowItWorksPage, PricingPage)
