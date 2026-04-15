# MegaCare — Remaining Work

> Updated: April 15, 2026

No remaining items. All paginated API response call sites have been updated.


> Generated: April 15, 2026

---

## Root Cause

The PAG-1 through PAG-6 backend changes made all list endpoints return a paginated envelope:

```json
{ "data": [...], "total": 42, "page": 1, "limit": 20, "pages": 3 }
```

Every frontend page that calls these endpoints still expects a **flat array** and was never updated. This breaks rendering across the whole app. The fix for each page is the same one-liner: change `await res.json()` to `(await res.json()).data ?? []`.

---

## Affected Pages

### PAG-1 — `GET /api/appointments`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/doctor-dashboard/revenue/RevenuePage.tsx` | 78 | `data.filter(...)` — `data` is an object, not array → runtime crash |
| `pages/dashboard/DashboardPage.tsx` | 70 | `appts.map(...)` — same crash |
| `pages/dashboard/appointments/AppointmentsPage.tsx` | 38 | `setAppointments(data)` typed as `Appointment[]` — wrong value in state |
| `pages/doctor-dashboard/DoctorDashboardPage.tsx` | 32 | `setAllAppointments(data)` typed as `Appointment[]` — wrong value |
| `pages/doctor-dashboard/consultations/DoctorConsultationsPage.tsx` | 99 | `Array.isArray(data)` guard → state stays empty (silent failure) |
| `pages/doctor-dashboard/agenda/AgendaPage.tsx` | ~100 | `for (const a of appts)` — iterates over object keys, not appointments |
| `pages/dashboard/notifications/NotificationsPage.tsx` | 46 | `appts.map(...)` — crash |
| `pages/dashboard/consultations/ConsultationsPage.tsx` | 34 | `.then(data => {...})` used as array — crash |

### PAG-2 — `GET /api/messages/thread/:id`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/doctor-dashboard/messaging/DoctorMessagingPage.tsx` | 104 | `setThread(await res.json())` — thread state set to paginated object, not array |
| `pages/medical-service-dashboard/messaging/MessagingPage.tsx` | 67 | `!Array.isArray(d)` guard → silently empty |
| `pages/doctor-dashboard/consultations/LiveConsultationPage.tsx` | 120 | `Array.isArray(data)` guard → chat history always empty |

### PAG-4 — `GET /api/prescriptions`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/doctor-dashboard/prescriptions/DoctorPrescriptionsPage.tsx` | 63 | `data.map(...)` — crash |
| `pages/dashboard/prescriptions/PrescriptionsPage.tsx` | 70 | `rxs.map(...)` — crash |
| `pages/dashboard/DashboardPage.tsx` | 71 | `rxs.map(...)` — crash |
| `pages/dashboard/notifications/NotificationsPage.tsx` | 49 | `rxs.map(...)` — crash |
| `pages/pharmacy/prescriptions/PharmacyPrescriptionsPage.tsx` | 29 | `data.map(...)` — crash |
| `pages/consultation/ConsultationPage.tsx` | 98 | result used as array — crash |

### PAG-3 — `GET /api/users`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/doctor-dashboard/patients/DoctorPatientsPage.tsx` | 152 | `allUsers.filter(...)` — `allUsers` is paginated object → crash |
| `pages/doctor-dashboard/prescriptions/DoctorPrescriptionsPage.tsx` | 111 | `data.filter(u => u.role === "patient")` — crash |

### PAG-5 — `GET /api/pharmacy/products`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/pharmacy/PharmacyPage.tsx` | 31 | `data.map(...)` — crash |
| `pages/pharmacy-dashboard/stock/StockPage.tsx` | 169 | `Array.isArray(data)` guard → stock always empty |
| `pages/pharmacy/prescription-scanner/PrescriptionScannerPage.tsx` | 61 | `results[0]` where `results` is a paginated object, not array → wrong data |

### PAG-6 — `GET /api/lab/tests` and `GET /api/lab/results`

| File | Line | How it breaks |
|------|------|---------------|
| `pages/lab-dashboard/tests/LabTestsPage.tsx` | 62 | `Array.isArray(data)` guard → tests always empty |
| `pages/lab-dashboard/results/LabResultsPage.tsx` | 58 | `Array.isArray(data)` guard → results always empty |

---

## Fix Pattern

For each location above, replace:

```ts
const data = await res.json();
```

with:

```ts
const json = await res.json();
const data = Array.isArray(json) ? json : (json.data ?? []);
```

Or for the `.then()` chain pattern:

```ts
fetch(url, { headers }).then(r => r.ok ? r.json() : [])
```

becomes:

```ts
fetch(url, { headers }).then(r => r.ok ? r.json().then(j => j.data ?? j) : [])
```

---

## Count

| Endpoint | Pages broken |
|----------|-------------|
| `/api/appointments` | 8 |
| `/api/messages/thread/:id` | 3 |
| `/api/prescriptions` | 6 |
| `/api/users` | 2 |
| `/api/pharmacy/products` | 3 |
| `/api/lab/tests` + `/api/lab/results` | 2 |
| **Total** | **24 call sites across 20 files** |
