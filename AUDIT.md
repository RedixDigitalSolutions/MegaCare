# MegaCare — Tech Debt Audit Report

**Date:** April 19, 2026  
**Scope:** Full frontend + backend review — orphaned pages, dead routes, unused components, duplicate files  
**Status:** Report only — no files were deleted

---

## 1. Orphaned Page Files (file exists, no route in App.tsx)

These `.tsx` files cannot be navigated to under any circumstances. The URL will render `<NotFoundPage>`.

| File | Reason |
| --- | --- |
| `frontend/src/pages/dashboard/find-doctor/FindDoctorPage.tsx` | Linked from `DashboardPage.tsx` cards but **not registered in App.tsx**. Route `/dashboard/find-doctor` → 404. |
| `frontend/src/pages/doctor-dashboard/reviews/ReviewsPage.tsx` | Not in App.tsx, not linked from `DoctorDashboardSidebar`. Completely unreachable. |
| `frontend/src/pages/profile/ProfilePage.tsx` | No `/profile` route in App.tsx. `AccountReviewPage.tsx:250` has a `to="/profile"` link — **broken link**. Actual profile page lives at `/dashboard/profile`. |

---

## 2. Pages Registered in App.tsx but Missing from Their Sidebar

Routes exist and the page renders, but there is no navigation entry point — users can never discover them organically.

| Route | Page File | Problem |
| --- | --- | --- |
| `/dashboard/medical-history` | `dashboard/medical-history/MedicalHistoryPage.tsx` | Not in `DashboardSidebar.tsx`, no card link on `DashboardPage`. Hidden from patients. |
| `/pharmacy/chat/:pharmacyId?` | `pharmacy/chat/PharmacyChatPage.tsx` | No link in `PharmacyPage`, `Header`, or any sidebar. |
| `/pharmacy/medicine/:id` | `pharmacy/medicine/[id]/MedicineDetailPage.tsx` | No link navigates to it — `PharmacyPage` uses modals instead of detail pages. |
| `/pharmacy/prescriptions` | `pharmacy/prescriptions/PharmacyPrescriptionsPage.tsx` | No nav link anywhere in the app. |

---

## 3. Lab Dashboard — Sidebar Links With No Routes

`LabDashboardSidebar.tsx` renders 7 menu items that resolve to 404 because no route or page file exists for them.

| Sidebar Label | Broken `href` | Route in App.tsx | Page File |
| --- | --- | --- | --- |
| Imagerie | `/lab-dashboard/imaging` | ❌ | ❌ |
| Patients | `/lab-dashboard/patients` | ❌ | ❌ |
| Rendez-vous | `/lab-dashboard/appointments` | ❌ | ❌ |
| Facturation | `/lab-dashboard/billing` | ❌ | ❌ |
| Messagerie | `/lab-dashboard/messaging` | ❌ | ❌ |
| Analytics | `/lab-dashboard/analytics` | ❌ | ❌ |
| Paramètres | `/lab-dashboard/settings` | ❌ | ❌ |

Only `LabDashboardPage`, `LabResultsPage`, and `LabTestsPage` are actually implemented.

---

## 4. Paramedical Dashboard — Page Files With No Routes

11 page files were built but never registered in App.tsx or linked from `ParamedicalDashboardSidebar.tsx`.

| File | Missing Route |
| --- | --- |
| `paramedical-dashboard/appointments/ParamedicalAppointmentsPage.tsx` | `/paramedical-dashboard/appointments` |
| `paramedical-dashboard/care-record/CareRecordPage.tsx` | `/paramedical-dashboard/care-record` |
| `paramedical-dashboard/map/MapPage.tsx` | `/paramedical-dashboard/map` |
| `paramedical-dashboard/messaging/ParamedicalMessagingPage.tsx` | `/paramedical-dashboard/messaging` |
| `paramedical-dashboard/notifications/ParamedicalNotificationsPage.tsx` | `/paramedical-dashboard/notifications` |
| `paramedical-dashboard/patients/ParamedicalPatientsPage.tsx` | `/paramedical-dashboard/patients` |
| `paramedical-dashboard/planning/PlanningPage.tsx` | `/paramedical-dashboard/planning` |
| `paramedical-dashboard/reports/ReportsPage.tsx` | `/paramedical-dashboard/reports` |
| `paramedical-dashboard/supplies/SuppliesPage.tsx` | `/paramedical-dashboard/supplies` |
| `paramedical-dashboard/teleconsultation/ParamedicalTeleconsultationPage.tsx` | `/paramedical-dashboard/teleconsultation` |
| `paramedical-dashboard/vitals/ParamedicalVitalsPage.tsx` | `/paramedical-dashboard/vitals` |

---

## 5. Orphaned Components

4 components are never imported by any active page. They form an isolated cluster around the orphaned `PrescriptionScannerPage`.

| Component File | Only Consumer |
| --- | --- |
| `components/PrescriptionOrderSummary.tsx` | `PrescriptionScannerPage` (itself orphaned) |
| `components/PharmacySelector.tsx` | `PrescriptionScannerPage` (itself orphaned) |
| `components/MedicineResults.tsx` | `PrescriptionScannerPage` (itself orphaned) |
| `components/PrescriptionUploader.tsx` | `PrescriptionScannerPage` (itself orphaned) |

The orphaned page that drives this cluster:

| Page File | Status |
| --- | --- |
| `src/pages/pharmacy/prescription-scanner/PrescriptionScannerPage.tsx` | Not registered in App.tsx, no nav link anywhere. |

---

## 6. Orphaned Library Files

| File | Status |
| --- | --- |
| `frontend/lib/ocr-utils.ts` | Only imported by `PrescriptionScannerPage` and `MedicineResults.tsx` — both orphaned. |
| `frontend/lib/pharmacy-data.ts` | Only imported by `PrescriptionScannerPage` and `PharmacySelector.tsx` — both orphaned. |
| `frontend/src/lib/config.ts` | **Exact duplicate** of `frontend/lib/config.ts` (identical, 69 lines). `src/lib/config.ts` is never imported. Safe to delete. |

---

## 7. Broken Internal Link

| Location | Broken Link | Correct Target |
| --- | --- | --- |
| `src/pages/account-review/AccountReviewPage.tsx:250` | `to="/profile"` → 404 | `to="/dashboard/profile"` |

---

## 8. Unused shadcn/ui Components

The following components were installed but are never imported by any page or custom component:

| Component | File |
| --- | --- |
| Breadcrumb | `components/ui/breadcrumb.tsx` |
| ButtonGroup | `components/ui/button-group.tsx` |
| Carousel | `components/ui/carousel.tsx` |
| ContextMenu | `components/ui/context-menu.tsx` |
| Empty | `components/ui/empty.tsx` |
| Field | `components/ui/field.tsx` |
| InputGroup | `components/ui/input-group.tsx` |
| InputOTP | `components/ui/input-otp.tsx` |
| Item | `components/ui/item.tsx` |
| Kbd | `components/ui/kbd.tsx` |
| Menubar | `components/ui/menubar.tsx` |
| NavigationMenu | `components/ui/navigation-menu.tsx` |
| Resizable | `components/ui/resizable.tsx` |
| use-mobile (ui copy) | `components/ui/use-mobile.tsx` — duplicate of `hooks/use-mobile.ts` |
| use-toast (ui copy) | `components/ui/use-toast.ts` — duplicate of `hooks/use-toast.ts` |

---

## 9. Duplicate `.js` Shadow Files 

Every `.tsx`/`.ts` source file has a sibling `.js` copy (e.g., `Header.tsx` + `Header.js`). These are manually synced copies, not build artifacts. The Vite build exclusively compiles from `.tsx`. This accounts for approximately **150 duplicate files** across `src/`, `components/`, `lib/`, `hooks/`, and `contexts/`.

> These are not dead code in isolation — the duplication strategy is intentional in this project. Only remove them if the project migrates fully to TypeScript-only.

---

## Summary

| Category | Count |
| --- | --- |
| Orphaned page files (no route) | 3 |
| Pages with routes but no sidebar navigation | 4 |
| Lab dashboard sidebar broken links (no page/route) | 7 |
| Paramedical dashboard pages with no routes | 11 |
| Orphaned components | 4 |
| Orphaned page (prescription scanner cluster root) | 1 |
| Orphaned library files | 3 |
| Duplicate `src/lib/config.ts` | 1 |
| Broken `to="/profile"` link | 1 |
| Unused shadcn/ui components | 15 |
| **Total items flagged** | **50** |

---

## Recommended Cleanup Order

1. **Fix broken link** — `AccountReviewPage.tsx:250`: change `to="/profile"` → `to="/dashboard/profile"` (1 line, zero risk)
2. **Delete prescription scanner cluster** — `PrescriptionScannerPage.tsx` + 4 components + `ocr-utils.ts` + `pharmacy-data.ts` (7 files, no active consumers)
3. **Delete true orphan pages** — `FindDoctorPage.tsx`, `ReviewsPage.tsx` (doctor), `profile/ProfilePage.tsx` (root) (3 files)
4. **Delete `src/lib/config.ts`** — exact duplicate of `lib/config.ts` (1 file)
5. **Decide on paramedical dashboard pages** — either register them as routes or delete (11 files, currently no impact)
6. **Fix lab dashboard sidebar** — either add placeholder routes or remove dead sidebar items (7 links)
7. **Remove unused shadcn/ui components** — low risk, reduces bundle (13–15 files)
