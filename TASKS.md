# MegaCare — Task List

> Last updated: April 15, 2026  
> Sources: HARDCODED_AUDIT.md · FULL_DIAGNOSTIC_V2.md

Legend: 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low

---

## 🔴 CRITICAL — Security (do first)

- [x] **SEC-1** `routes/users.js` — strip `role` and `status` from `PUT /api/users/:id` body to prevent privilege escalation  
  _1 line: add `role, status` to the destructure exclusion_

- [x] **SEC-2** `routes/users.js` — restrict `GET /api/users` to admin and doctor roles only  
  _3 lines: add role check; return 403 for patients / others_

---

## 🟠 HIGH — Backend fixes

- [x] **BE-1** `routes/admin.js` — add `PATCH /api/admin/users/:id/suspend` endpoint (sets `status: "suspended"`)

- [x] **BE-2** `routes/admin.js` — add `PATCH /api/admin/users/:id/reactivate` endpoint (sets `status: "approved"`) — currently frontend maps this to approve path

- [x] **BE-3** `routes/public.js` — add `GET /api/public/labs/:id` returning full lab document from DB

- [x] **BE-4** `routes/public.js` — add `GET /api/public/establishments/:id` returning full establishment document from DB

- [x] **BE-5** `routes/public.js` — add `GET /api/public/paramedical-products/:id` returning full product document from DB

- [x] **BE-6** `models/ParamedicalProduct.js` — add fields: `description`, `usage`, `compatibility`, `features: [String]`, `images: [String]`

- [x] **BE-7** `seed.js` — re-seed `ParamedicalProduct` with the rich spec data currently hardcoded in `ParamedicalProductPage.tsx` (5 products, full fields)

- [x] **BE-8** `index.js` — add `require("express-async-errors")` at the top to auto-catch unhandled promise rejections in all routes

---

## 🟠 HIGH — Frontend fixes

- [x] **FE-1** `hooks/use-socket.ts` — replace `"http://localhost:5000"` with `import.meta.env.VITE_SOCKET_URL ?? ""`

- [x] **FE-2** `frontend/.env` — add `VITE_SOCKET_URL=http://localhost:5000`

- [x] **FE-3** `pages/labos-radiologie/[id]/LaboDetailPage.tsx` — remove `const labs = [...]` inline array; fetch from `GET /api/public/labs/:id` using `useParams()` + `useEffect`

- [x] **FE-4** `pages/services-medicaux/[id]/ServiceMedicalDetailPage.tsx` — remove `const establishments = [...]` inline array; fetch from `GET /api/public/establishments/:id` using `useParams()` + `useEffect`

- [x] **FE-5** `pages/paramedical/product/ParamedicalProductPage.tsx` — remove `const products = [...]` inline array; fetch from `GET /api/public/paramedical-products/:id` using `useParams()` + `useEffect`

- [x] **FE-6** `pages/admin/settings/AdminSettingsPage.tsx` — wire profile save to `PATCH /api/auth/profile` (endpoint already exists)

- [x] **FE-7** `pages/admin/settings/AdminSettingsPage.tsx` — wire password save to `POST /api/auth/change-password` (endpoint already exists)

- [x] **FE-8** `pages/welcome/WelcomePage.tsx` — fix broken link to `/dashboards-overview` (route doesn't exist → 404)

---

## 🟠 HIGH — Route Protection (~35 unprotected routes)

All items below are changes to `frontend/src/App.tsx` only — wrap each route in `<ProtectedRoute requiredRole="...">`.

- [x] **RP-1** Wrap all 6 admin routes (`/admin`, `/admin/users`, `/admin/pending`, `/admin/suspended`, `/admin/stats`, `/admin/settings`) with `requiredRole="admin"`

- [x] **RP-2** Wrap all 11 patient dashboard routes (`/dashboard` and sub-routes) with `requiredRole="patient"`

- [x] **RP-3** Wrap all 11 doctor dashboard routes (`/doctor-dashboard` and sub-routes) with `requiredRole="doctor"`

- [x] **RP-4** Wrap all 4 pharmacy dashboard routes (`/pharmacy-dashboard` and sub-routes) with `requiredRole="pharmacy"`

- [x] **RP-5** Wrap `/lab-dashboard` with `requiredRole="lab_radiology"` (sub-routes already protected)

- [x] **RP-6** Wrap all 12 medical service dashboard routes with `requiredRole="medical_service"`

- [x] **RP-7** `contexts/AuthContext.tsx` — on mount, if token exists call `GET /api/auth/profile`; on 401 clear token + user state

---

## 🟡 MEDIUM — Data quality

- [x] **DQ-1** `pages/doctor-dashboard/revenue/RevenuePage.tsx` — replace `CONSULTATION_FEE = 80` constant with `appointment.fee` field (requires DQ-2)

- [x] **DQ-2** `models/Appointment.js` — add `fee: { type: Number, default: 80 }` field; set it on POST creation

- [x] **DQ-3** `models/Appointment.js` — change `date` field from `String` to `Date` type for proper sorting and range queries

- [x] **DQ-4** `lib/config.ts` (new file) — extract shared filter arrays (`tunisianGovernorates`, `examTypeOptions`, `allServices`, `labTypes`, `establishmentTypes`) from `LabosRadiologiePage.tsx` and `ServicesMediauxPage.tsx` into one shared constant file

- [x] **DQ-5** `routes/messages.js` — replace in-memory JavaScript aggregation in `GET /conversations` with a MongoDB `$group` pipeline

- [x] **DQ-6** All models — add `schema.index(...)` for: `User.role`, `User.status`, `Appointment.doctorId`, `Appointment.patientId`, `Message.senderId`, `Message.receiverId`

- [x] **DQ-7** `models/Product.js` — add `timestamps: true` to schema options

---

## 🟡 MEDIUM — Pagination

Each task = add `?page=1&limit=20` support to one endpoint:

- [x] **PAG-1** `GET /api/appointments`
- [x] **PAG-2** `GET /api/messages` / `GET /api/messages/thread/:id`
- [x] **PAG-3** `GET /api/users`
- [x] **PAG-4** `GET /api/prescriptions`
- [x] **PAG-5** `GET /api/pharmacy/products`
- [x] **PAG-6** `GET /api/lab/tests` and `GET /api/lab/results`

---

## 🟢 LOW — Polish

- [x] **POL-1** `vite.config.ts` — use `process.env.VITE_API_URL ?? "http://localhost:5000"` for the proxy target instead of the hardcoded string

- [x] **POL-2** `middleware/tokenBlacklist.js` — note in comments: replace Map with Redis for multi-instance / production deployments

- [x] **POL-3** `use-webrtc.ts` — stop re-emitting `webrtc:ready` after connection is already established (interval fires every 3s indefinitely)

- [x] **POL-4** Production: configure a TURN server in `use-webrtc.ts` ICE config (currently only STUN — fails behind symmetric NAT)

- [x] **POL-5** `WelcomePage.tsx` — remove hardcoded test credentials before going to production

---

## Task Count Summary

| Group | Count | Status |
|-------|-------|--------|
| 🔴 Critical — Security | 2 | ⬜ Open |
| 🟠 High — Backend | 8 | ⬜ Open |
| 🟠 High — Frontend | 8 | ⬜ Open |
| 🟠 High — Route Protection | 7 | ⬜ Open |
| 🟡 Medium — Data Quality | 7 | ⬜ Open |
| 🟡 Medium — Pagination | 6 | ⬜ Open |
| 🟢 Low — Polish | 5 | ⬜ Open |
| **Total** | **43** | |
