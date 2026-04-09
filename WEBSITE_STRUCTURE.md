# MegaCare – Website Structure & Dashboard Features

---

## Public Pages

| Page              | URL                          | Description                                                                                              |
| ----------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| Home              | `/`                          | Landing page: hero section, features overview, partner pharmacies, statistics counter, testimonials, CTA |
| Doctors           | `/doctors`                   | Browse and filter doctors by specialty, region, availability, price range, and video consultation        |
| Doctor Profile    | `/doctor/:id`                | Detailed doctor profile with bio, specialties, ratings, reviews, and appointment booking                 |
| Guide & Pricing   | `/guide`                     | Platform usage guide and pricing plans in a tabbed layout                                                |
| Live Consultation | `/consultation`              | Video consultation room (publicly accessible entry point)                                                |
| Login             | `/login`                     | Role-aware login with 8 user types                                                                       |
| Register          | `/register`                  | Multi-step registration form adapting to selected role                                                   |
| Welcome / Demo    | `/welcome`                   | Demo mode — quick access to any role's dashboard without a real account                                  |
| Account Review    | `/account-review`            | Shown to non-patient users after registration while their account is pending admin approval              |
| Profile           | `/profile`                   | Authenticated user profile view                                                                          |
| Terms of Use      | `/conditions-utilisation`    | Legal terms of service                                                                                   |
| Privacy Policy    | `/politique-confidentialite` | Data privacy policy                                                                                      |
| 404 Not Found     | `*`                          | Custom error page with navigation links                                                                  |

---

## Online Pharmacy (Public Storefront)

| Page                 | URL                              | Description                                                                                                       |
| -------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Catalogue            | `/pharmacy`                      | Browse 50+ medicines with category filters, price range, search, and sort. Authentication required to add to cart |
| Medicine Detail      | `/pharmacy/medicine/:id`         | Full product page with description, dosage, pharmacy availability, and delivery times                             |
| Cart                 | `/pharmacy/cart`                 | Review cart items, adjust quantities, choose delivery method (home delivery or pharmacy pickup)                   |
| Checkout             | `/pharmacy/checkout`             | 3-step wizard: delivery address → payment method → confirmation                                                   |
| Prescription Scanner | `/pharmacy/prescription-scanner` | 3-step flow: select nearby pharmacy → upload prescription image → OCR extracts medications → add to cart          |
| My Orders            | `/pharmacy/orders`               | Authenticated order history list with status tracking                                                             |
| Order Detail         | `/pharmacy/order/:id`            | Per-order detail view                                                                                             |
| Chat                 | `/pharmacy/chat`                 | Messaging with the selected pharmacy                                                                              |
| Prescriptions        | `/pharmacy/prescriptions`        | View prescriptions linked to pharmacy orders                                                                      |

---

## Admin

| Page            | URL      | Who               |
| --------------- | -------- | ----------------- |
| User Management | `/admin` | `admin` role only |

**Features:**

- View all registered users across all 7 role types
- Filter by status: All / Pending / Approved / Rejected
- Approve or reject user accounts with real-time UI update
- User cards show name, email, role, and registration date

---

## Dashboards

### 1. Patient Dashboard

**Access:** `role: patient` · Base route: `/dashboard`

| Section           | URL                          | Features                                                                                                                                                       |
| ----------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview          | `/dashboard`                 | KPI cards (upcoming appointments, active prescriptions, active orders, medical record completion); recent appointments and orders; quick links to all sections |
| Find a Doctor     | `/dashboard/find-doctor`     | Search and filter doctors by specialty, governorate, availability, price, and video support                                                                    |
| Appointments      | `/dashboard/appointments`    | Tabbed list: upcoming / past / cancelled; action buttons per appointment (join, cancel, reschedule, view report)                                               |
| Consultations     | `/dashboard/consultations`   | History of past video consultations with doctor notes, diagnosis, and download report button                                                                   |
| Medical Records   | `/dashboard/medical-records` | Collapsible accordion dossier: general info, allergies, chronic conditions, treatments, vaccinations; completion progress bar; shared-access management        |
| Medical History   | `/dashboard/medical-history` | Chronological visit log with PDF download per record                                                                                                           |
| Prescriptions     | `/dashboard/prescriptions`   | List of active prescriptions with medication details and doctor info                                                                                           |
| Orders            | `/dashboard/orders`          | Pharmacy order history with status badges (delivered, in transit, pending)                                                                                     |
| Delivery Tracking | `/dashboard/tracking`        | Step-by-step real-time progress timeline for active deliveries; estimated delivery window                                                                      |
| Notifications     | `/dashboard/notifications`   | Typed alerts (appointment reminders, delivery updates, prescription expiry); mark as read and dismiss actions                                                  |
| Settings          | `/dashboard/settings`        | Edit profile; change password; 2FA; notification preferences; data download                                                                                    |

---

### 2. Doctor Dashboard

**Access:** `role: doctor` · Base route: `/doctor-dashboard`

| Section       | URL                               | Features                                                                                                                                            |
| ------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Overview      | `/doctor-dashboard`               | KPI cards (today's consultations, revenue, rating, pending appointments); today's slot grid; pending appointments list; next consultation countdown |
| Agenda        | `/doctor-dashboard/agenda`        | Navigable weekly calendar showing free and booked time slots; "Add Slot" button                                                                     |
| Consultations | `/doctor-dashboard/consultations` | Full consultation history per patient with status (completed, pending, cancelled)                                                                   |
| Patients      | `/doctor-dashboard/patients`      | Searchable patient list with last visit date, status, and quick link to patient file                                                                |
| Prescriptions | `/doctor-dashboard/prescriptions` | Issued prescriptions with validation status; create new prescription; download and view actions                                                     |
| Revenue       | `/doctor-dashboard/revenue`       | KPI cards (monthly revenue, consultation count); recent transactions table with consultation type and amount                                        |
| Reviews       | `/doctor-dashboard/reviews`       | Patient reviews with star ratings; average rating shown in header; "Helpful" thumbs-up per review                                                   |
| Settings      | `/doctor-dashboard/settings`      | Edit profile photo (URL or file upload), name, email, and specialty                                                                                 |

---

### 3. Pharmacy Dashboard

**Access:** `role: pharmacy` · Base route: `/pharmacy-dashboard`

| Section  | URL                          | Features                                                                                                                         |
| -------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Overview | `/pharmacy-dashboard`        | KPI cards (stock, pending orders, revenue, low-stock alerts); low-stock alert panel; pending orders list; top 5 selling products |
| Orders   | `/pharmacy-dashboard/orders` | Supplier order history with status badges (delivered, in transit, pending)                                                       |
| Sales    | `/pharmacy-dashboard/sales`  | KPI cards with growth percentages; top 5 best-selling medicines table (units sold + revenue)                                     |
| Stock    | `/pharmacy-dashboard/stock`  | Editable stock table with inline quantity editing, image upload per product, low-stock warnings; add new product                 |

---

### 4. Laboratory & Radiology Dashboard

**Access:** `role: lab_radiology` · Base route: `/lab-dashboard`

| Section  | URL                      | Features                                                                                                              |
| -------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Overview | `/lab-dashboard`         | KPI cards (exams today, pending results, partner doctors, revenue); quick links to all sub-modules                    |
| Tests    | `/lab-dashboard/tests`   | Manage analysis requests: patient, test type, status, priority (Normal/Urgent); mark as complete; new analysis button |
| Results  | `/lab-dashboard/results` | Searchable results list with normal/elevated status badges; download and share per result                             |

---

### 5. Medical Service Dashboard (Home Hospitalization / HAD)

**Access:** `role: medical_service` · Base route: `/medical-service-dashboard`

| Section          | URL                                           | Features                                                                                                                     |
| ---------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Overview         | `/medical-service-dashboard`                  | KPI cards (active patients, today's appointments, team size, revenue); 11-tile quick-action grid; recent activity feed       |
| Patients         | `/medical-service-dashboard/patients`         | Searchable patient list with hospitalization status; add, edit, delete patient                                               |
| Team             | `/medical-service-dashboard/team`             | Team member grid (nurses, aides, therapists) with status, patient count, contact and detail actions; add member              |
| Schedule         | `/medical-service-dashboard/schedule`         | Planned visit list with staff assignment, date, time, duration; modify and cancel per visit; daily/weekly stats              |
| Prescriptions    | `/medical-service-dashboard/prescriptions`    | Searchable prescription table by patient and status; create, modify prescriptions                                            |
| Teleconsultation | `/medical-service-dashboard/teleconsultation` | Tabbed view: upcoming / completed / history; KPI stats; start video call from upcoming cards                                 |
| Vitals           | `/medical-service-dashboard/vitals`           | Patient vital sign monitoring (BP, pulse, temperature, SpO2, glucose) with Normal/Warning/Critical classification and alerts |
| Equipment        | `/medical-service-dashboard/equipment`        | Equipment inventory with in-use/available filter; assignment to patients; maintenance date tracking; add equipment           |
| Billing          | `/medical-service-dashboard/billing`          | Invoices and payments tabs; KPI summary (monthly revenue, pending, overdue); create invoice                                  |
| Messaging        | `/medical-service-dashboard/messaging`        | Two-panel team chat with doctors, nurses, and groups; unread count badges                                                    |
| Analytics        | `/medical-service-dashboard/analytics`        | KPI cards; team performance table with scores and progress bars; top pathologies chart; monthly activity table               |
| Settings         | `/medical-service-dashboard/settings`         | Edit service info; notification toggles; security (password, 2FA, delete account)                                            |

---

### 6. Medical Transport Dashboard

**Access:** `role: medical_transport` · Base route: `/transport-dashboard`

| Section  | URL                             | Features                                                                                                                          |
| -------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Overview | `/transport-dashboard`          | KPI cards (active trips, fleet availability, active drivers, daily revenue); quick links to 6 sub-modules; recent activity feed   |
| Trips    | `/transport-dashboard/trips`    | Searchable trip list (patient, origin, destination, distance, status); GPS tracking and detail actions per trip; new trip button  |
| Vehicles | `/transport-dashboard/vehicles` | Fleet grid with plate number, status (active/maintenance), mileage, last maintenance; detail and maintenance actions; add vehicle |

---

### 7. Paramedical Dashboard

**Access:** `role: paramedical` · Base route: `/paramedical-dashboard`

| Section          | URL                                       | Features                                                                                                                             |
| ---------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Overview         | `/paramedical-dashboard`                  | KPI cards (followed patients, today's consultations, weekly hours, monthly revenue); 11-tile quick-action grid; recent activity feed |
| Appointments     | `/paramedical-dashboard/appointments`     | Appointment list by patient, care type, location (home/clinic), and status; add and modify appointments                              |
| Planning         | `/paramedical-dashboard/planning`         | Daily/Weekly view with chronological visit order; status per visit (done/in progress/to-do); daily mileage and time estimate         |
| Patients         | `/paramedical-dashboard/patients`         | Searchable patient card grid with condition, status, next appointment; open medical file or message patient                          |
| Care Record      | `/paramedical-dashboard/care-record`      | Care session form: patient, care type, clinical notes, photo upload, digital signature; submit to validate                           |
| Vitals           | `/paramedical-dashboard/vitals`           | Per-patient vitals entry form (BP, heart rate, temperature, SpO2, glucose) with inline abnormal-value alerts                         |
| Teleconsultation | `/paramedical-dashboard/teleconsultation` | Available doctors list; initiate video or audio call; active call screen with timer, image sharing, and chat                         |
| Messaging        | `/paramedical-dashboard/messaging`        | Two-panel chat with doctors and administration; unread badges; send on Enter                                                         |
| Notifications    | `/paramedical-dashboard/notifications`    | Typed alerts (urgent vitals, doctor messages, schedule changes, prescriptions); bulk mark-as-read; act button on urgent items        |
| Map              | `/paramedical-dashboard/map`              | Optimized visit route with numbered patient markers; visit order list with address and distance; total km calculation                |
| Supplies         | `/paramedical-dashboard/supplies`         | Medical supplies inventory with stock level bars; low-stock banner; delivery request button for low-stock items                      |
| Reports          | `/paramedical-dashboard/reports`          | Daily/weekly care summary reports with visit count and hours; downloadable PDF; care history log                                     |
| Settings         | `/paramedical-dashboard/settings`         | Edit profile (name, phone, specialization); notification toggles (email, SMS, push, daily report)                                    |

---

## User Roles Summary

| Role                | Dashboard                 | Approval Required |
| ------------------- | ------------------------- | ----------------- |
| `patient`           | Patient Dashboard         | No                |
| `doctor`            | Doctor Dashboard          | Yes               |
| `pharmacy`          | Pharmacy Dashboard        | Yes               |
| `lab_radiology`     | Lab & Radiology Dashboard | Yes               |
| `medical_service`   | Medical Service Dashboard | Yes               |
| `medical_transport` | Transport Dashboard       | Yes               |
| `paramedical`       | Paramedical Dashboard     | Yes               |
| `admin`             | Admin Panel               | —                 | 

Non-patient accounts are redirected to `/account-review` immediately after registration and gain dashboard access only after admin approval.
