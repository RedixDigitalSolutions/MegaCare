# MegaCare — Hardcoded Data Audit

> Last updated: April 15, 2026 · All items resolved — see `TASKS.md` for full history

---

All previously identified hardcoded data issues have been fixed. No remaining items.

| ID | File | Issue | Status |
|----|------|-------|--------|
| H-1 | `routes/admin.js` | Added `PATCH /users/:id/suspend` + `/reactivate` | ✅ Done |
| H-2 | `hooks/use-socket.ts` | Replaced hardcoded URL with `VITE_SOCKET_URL` env var | ✅ Done |
| H-3 | `routes/public.js` | Added `GET /api/public/labs/:id` | ✅ Done |
| H-4 | `pages/labos-radiologie/[id]/LaboDetailPage.tsx` | Removed inline array; fetches from API | ✅ Done |
| H-5 | `routes/public.js` | Added `GET /api/public/establishments/:id` | ✅ Done |
| H-6 | `pages/services-medicaux/[id]/ServiceMedicalDetailPage.tsx` | Removed inline array; fetches from API | ✅ Done |
| H-7 | `models/ParamedicalProduct.js` | Added `description`, `usage`, `compatibility`, `features`, `images` fields | ✅ Done |
| H-8 | `seed.js` | Re-seeded `ParamedicalProduct` with full spec data | ✅ Done |
| H-9 | `routes/public.js` | Added `GET /api/public/paramedical-products/:id` | ✅ Done |
| H-10 | `pages/paramedical/product/ParamedicalProductPage.tsx` | Removed inline array; fetches from API | ✅ Done |
| H-11 | `pages/admin/settings/AdminSettingsPage.tsx` | Wired profile save to `PATCH /api/auth/profile` | ✅ Done |
| H-12 | `pages/admin/settings/AdminSettingsPage.tsx` | Wired password save to `POST /api/auth/change-password` | ✅ Done |
| M-1 | `pages/doctor-dashboard/revenue/RevenuePage.tsx` | Replaced `CONSULTATION_FEE = 80` with `appointment.fee` | ✅ Done |
| M-2 | `lib/config.ts` | Created shared constants file | ✅ Done |
| M-3 | `pages/labos-radiologie/LabosRadiologiePage.tsx` | Imports filter arrays from `lib/config.ts` | ✅ Done |
| M-4 | `pages/services-medicaux/ServicesMediauxPage.tsx` | Imports filter arrays from `lib/config.ts` | ✅ Done |
| L-1 | `WelcomePage.tsx` | Removed hardcoded test credentials | ✅ Done |
| L-2 | `vite.config.ts` | Proxy target uses `VITE_API_URL` env var | ✅ Done |
