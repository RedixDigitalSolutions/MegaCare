# MegaCare – Design System Reference

**For Designers · Version 1.0 · April 2026**

---

## 1. Brand Identity

| Property   | Value                     |
| ---------- | ------------------------- |
| Brand name | **MEGACARE**              |
| Tagline    | _Votre santé, connectée_  |
| Locale     | French (Tunisia)          |
| Domain     | megacare.tn               |
| Logo file  | `/public/images/logo.png` |
| Favicon    | `/public/favicon.svg`     |

---

## 2. Color System

All colors use the **OKLCH** color model for perceptual uniformity. **Every value has a light mode and a dark mode counterpart.**

### 2.1 Core Palette

| Token                | Role                        | Light Mode (OKLCH)      | Approx. Hex | Dark Mode (OKLCH)      | Approx. Hex |
| -------------------- | --------------------------- | ----------------------- | ----------- | ---------------------- | ----------- |
| `--primary`          | Main brand – Deep blue      | `oklch(0.42 0.2 240)`   | `#1A4DB5`   | `oklch(0.58 0.18 180)` | `#00BCD4`   |
| `--accent`           | Secondary brand – Turquoise | `oklch(0.58 0.18 180)`  | `#00BCD4`   | `oklch(0.42 0.2 240)`  | `#1A4DB5`   |
| `--background`       | Page background             | `oklch(0.99 0.005 220)` | `#FAFBFF`   | `oklch(0.08 0.02 240)` | `#0A0E1A`   |
| `--foreground`       | Body text                   | `oklch(0.12 0.03 240)`  | `#0F1826`   | `oklch(0.95 0 0)`      | `#F2F2F2`   |
| `--card`             | Card surface                | `oklch(1 0 0)`          | `#FFFFFF`   | `oklch(0.12 0.02 240)` | `#141826`   |
| `--card-foreground`  | Text on cards               | `oklch(0.12 0.03 240)`  | `#0F1826`   | `oklch(0.95 0 0)`      | `#F2F2F2`   |
| `--popover`          | Dropdown / tooltip surface  | `oklch(1 0 0)`          | `#FFFFFF`   | `oklch(0.12 0.02 240)` | `#141826`   |
| `--secondary`        | Subtle tinted fills         | `oklch(0.95 0.02 200)`  | `#EDF4F8`   | `oklch(0.18 0.03 200)` | `#1B2630`   |
| `--muted`            | Disabled / placeholder bg   | `oklch(0.96 0.01 200)`  | `#F0F5F8`   | `oklch(0.2 0.02 240)`  | `#1E2535`   |
| `--muted-foreground` | Placeholder / caption text  | `oklch(0.45 0.02 240)`  | `#5E6E85`   | `oklch(0.65 0.02 240)` | `#9AAABE`   |
| `--border`           | Default borders             | `oklch(0.92 0.015 220)` | `#DDE6EE`   | `oklch(0.22 0.02 240)` | `#232D40`   |
| `--input`            | Input field background      | `oklch(0.97 0.01 220)`  | `#F5F8FB`   | `oklch(0.15 0.02 240)` | `#18202E`   |
| `--ring`             | Focus ring                  | Same as primary         | `#1A4DB5`   | Same as accent         | `#00BCD4`   |
| `--destructive`      | Error / danger              | `oklch(0.55 0.22 25)`   | `#D94040`   | `oklch(0.55 0.2 25)`   | `#CC4040`   |

### 2.2 Sidebar Palette

The sidebar is always **dark** regardless of mode.

| Token                  | Value                 | Approx. Hex                        |
| ---------------------- | --------------------- | ---------------------------------- |
| `--sidebar`            | Deep navy background  | `oklch(0.1 0.03 240)` → `#0B1120`  |
| `--sidebar-foreground` | Off-white text        | `oklch(0.95 0 0)` → `#F2F2F2`      |
| `--sidebar-primary`    | Turquoise active item | `oklch(0.58 0.18 180)` → `#00BCD4` |
| `--sidebar-accent`     | Deep blue hover fill  | `oklch(0.42 0.2 240)` → `#1A4DB5`  |
| `--sidebar-border`     | Subtle nav dividers   | `oklch(0.2 0.02 240)` → `#1D2535`  |

### 2.3 Chart Palette

Used in `recharts` data visualizations.

| Token       | Light Approx.          | Purpose          |
| ----------- | ---------------------- | ---------------- |
| `--chart-1` | `#1A4DB5` (deep blue)  | Primary series   |
| `--chart-2` | `#00BCD4` (turquoise)  | Secondary series |
| `--chart-3` | `#4DB890` (teal-green) | Tertiary         |
| `--chart-4` | `#2E7DB3` (mid blue)   | Quaternary       |
| `--chart-5` | `#4492C8` (sky blue)   | Quinary          |

### 2.4 Semantic Color Usage Guide

| Context                   | Token to use                            |
| ------------------------- | --------------------------------------- |
| Primary action button     | `primary` + `primary-foreground`        |
| Success / confirmed state | `accent` (turquoise)                    |
| Error / delete / reject   | `destructive`                           |
| Informational labels      | `secondary` bg + `secondary-foreground` |
| Disabled elements         | `muted` bg + `muted-foreground` text    |
| Form field backgrounds    | `input`                                 |
| Dividers                  | `border`                                |
| Overlay dropdowns         | `popover` + `popover-foreground`        |

---

## 3. Typography

### 3.1 Font Families

| Role            | Font       | Fallback              |
| --------------- | ---------- | --------------------- |
| **Body / UI**   | Geist Sans | system-ui, sans-serif |
| **Code / Mono** | Geist Mono | monospace             |

> **Note to designer:** Geist is a modern geometric sans-serif by Vercel. If not available in your design tool, substitute **Inter** as a perfect functional match.

### 3.2 Type Scale

The app uses Tailwind's default type scale. Key sizes in use:

| Class       | Size | Line Height | Use case                            |
| ----------- | ---- | ----------- | ----------------------------------- |
| `text-xs`   | 12px | 16px        | Labels, badges, captions            |
| `text-sm`   | 14px | 20px        | Body text, form labels, table cells |
| `text-base` | 16px | 24px        | Default body, inputs                |
| `text-lg`   | 18px | 28px        | Section sub-headings                |
| `text-xl`   | 20px | 28px        | Card headings                       |
| `text-2xl`  | 24px | 32px        | Page headings (dashboard)           |
| `text-3xl`  | 30px | 36px        | Hero sub-headings                   |
| `text-4xl`  | 36px | 40px        | Hero headings                       |
| `text-5xl`  | 48px | 48px        | Landing page hero (H1)              |
| `text-6xl`  | 60px | 60px        | Large hero numbers/stats            |
| `text-7xl`  | 72px | 72px        | Decorative hero display             |

### 3.3 Font Weights

| Class            | Weight | Use case                               |
| ---------------- | ------ | -------------------------------------- |
| `font-normal`    | 400    | Body text                              |
| `font-medium`    | 500    | Form labels, button text, nav items    |
| `font-semibold`  | 600    | Card titles, dashboard section headers |
| `font-bold`      | 700    | Brand name "MEGACARE", hero headings   |
| `font-extrabold` | 800    | Large stat numbers                     |

### 3.4 Special Text Treatments

**Gradient text (brand headings):**

```
background: linear-gradient(to right, var(--primary), var(--accent))
-webkit-background-clip: text
-webkit-text-fill-color: transparent
```

**Usage:** Main `MEGACARE` logo wordmark, hero H1, feature section headings.

---

## 4. Spacing & Layout

### 4.1 Spacing Scale (Tailwind base: 1 unit = 4px)

| Class             | px   | Common use                                   |
| ----------------- | ---- | -------------------------------------------- |
| `p-1` / `gap-1`   | 4px  | Tight icon padding                           |
| `p-2` / `gap-2`   | 8px  | Button inner gap, badge padding              |
| `p-3` / `gap-3`   | 12px | Small input padding                          |
| `p-4` / `gap-4`   | 16px | Card internal padding (default)              |
| `p-6` / `gap-6`   | 24px | Card section padding                         |
| `p-8` / `gap-8`   | 32px | Page section padding                         |
| `p-12` / `gap-12` | 48px | Large section gaps                           |
| `p-16` / `gap-16` | 64px | Hero vertical padding                        |
| `p-24`            | 96px | Page top padding (accounts for fixed header) |

### 4.2 Border Radius

| Token          | Formula        | px equivalent | Use case                            |
| -------------- | -------------- | ------------- | ----------------------------------- |
| `--radius-sm`  | `radius - 4px` | **12px**      | Small elements (badges, checkboxes) |
| `--radius-md`  | `radius - 2px` | **14px**      | Buttons, inputs, tabs               |
| `--radius-lg`  | `1rem`         | **16px**      | Cards, modals, dropdowns            |
| `--radius-xl`  | `radius + 4px` | **20px**      | Large cards, hero panels            |
| `rounded-full` | 9999px         | Pill          | Avatar, tags, step indicators       |
| `rounded-2xl`  | 16px           | —             | Feature icons, image containers     |
| `rounded-3xl`  | 24px           | —             | Large hero blobs                    |

### 4.3 Container Widths

| Context                     | Max width                          | Class                      |
| --------------------------- | ---------------------------------- | -------------------------- |
| Default page content        | 1280px                             | `max-w-5xl` to `max-w-7xl` |
| Auth pages (login/register) | Full split                         | Two-column 50/50           |
| Dashboard                   | Sidebar (256px) + Content (flex-1) | —                          |
| Admin                       | 1024px centered                    | `max-w-5xl mx-auto`        |

### 4.4 Breakpoints

| Name  | Min width | Typical behavior                     |
| ----- | --------- | ------------------------------------ |
| `sm`  | 640px     | Single-column → multi-column begins  |
| `md`  | 768px     | Sidebar appears, header adapts       |
| `lg`  | 1024px    | Full desktop layout                  |
| `xl`  | 1280px    | Wide layouts with extra side columns |
| `2xl` | 1536px    | Max container unlocked               |

---

## 5. Elevation & Shadow

| Level    | CSS                           | Use case                             |
| -------- | ----------------------------- | ------------------------------------ |
| **None** | `shadow-none`                 | Flat elements on colored backgrounds |
| **XS**   | `shadow-xs`                   | Input fields, subtle surface lift    |
| **SM**   | `shadow-sm`                   | Cards, default surface               |
| **MD**   | `shadow-md`                   | Dropdowns, popovers                  |
| **LG**   | `shadow-lg`                   | Modals, dialogs                      |
| **XL**   | `shadow-xl`                   | Side sheets, drawers                 |
| **Glow** | Custom `pulse-glow` animation | Hero logo, CTA button focus          |

---

## 6. Component Library

Built on **shadcn/ui (New York style)** + **Radix UI** primitives. Icon library: **Lucide React**.

---

### 6.1 Button

**Variants:**

| Variant       | Visual                       | Token mapping                                  |
| ------------- | ---------------------------- | ---------------------------------------------- |
| `default`     | Solid primary blue fill      | `bg-primary` + `text-primary-foreground`       |
| `destructive` | Solid red fill               | `bg-destructive` + `text-white`                |
| `outline`     | Transparent + border         | `border` + `bg-background`, hover: `bg-accent` |
| `secondary`   | Soft secondary fill          | `bg-secondary` + `text-secondary-foreground`   |
| `ghost`       | Transparent, hover fill only | hover: `bg-accent`                             |
| `link`        | Text underline only          | `text-primary`                                 |

**Sizes:**

| Size      | Height  | Padding | Use case                       |
| --------- | ------- | ------- | ------------------------------ |
| `sm`      | 32px    | `px-3`  | Compact tables, inline actions |
| `default` | 36px    | `px-4`  | Standard usage                 |
| `lg`      | 40px    | `px-6`  | Primary CTAs, hero buttons     |
| `icon`    | 36×36px | —       | Single icon action             |
| `icon-sm` | 32×32px | —       | Compact icon action            |
| `icon-lg` | 40×40px | —       | Prominent icon action          |

**States:** default → hover (90% opacity/tint) → focus (ring `3px`) → disabled (50% opacity, no pointer events)

---

### 6.2 Badge

| Variant       | Background    | Text                   | Use case               |
| ------------- | ------------- | ---------------------- | ---------------------- |
| `default`     | `primary`     | `primary-foreground`   | Role pill, feature tag |
| `secondary`   | `secondary`   | `secondary-foreground` | Neutral info label     |
| `destructive` | `destructive` | white                  | Error / critical alert |
| `outline`     | transparent   | `foreground`           | Bordered label         |

**Dimensions:** height auto, `px-2 py-0.5`, `text-xs`, `rounded-md`

---

### 6.3 Card

Structure with 4 sub-components:

```
Card (rounded-xl, border, shadow-sm, bg-card)
├── CardHeader (grid, px-6)
│   ├── CardTitle (font-semibold, leading-none)
│   ├── CardDescription (text-sm, text-muted-foreground)
│   └── CardAction (right-aligned)
├── CardContent (px-6)
└── CardFooter (px-6)
```

**Style:** `rounded-xl` (16px), `border` + `shadow-sm`, `bg-card`, internal gap of `24px` between sections.

---

### 6.4 Input

| State    | Visual                                                       |
| -------- | ------------------------------------------------------------ |
| Default  | `bg-input` (`#F5F8FB`), `border`, `rounded-md`, `h-9` (36px) |
| Focus    | Border changes to `ring` color, `ring-[3px]` glow            |
| Error    | Border + ring turn `destructive`                             |
| Disabled | 50% opacity, cursor not-allowed                              |

**Padding:** `px-3 py-1` · **Font:** `text-base` (desktop: `text-sm`)

---

### 6.5 Tabs

```
TabsList  (bg-muted, h-9, rounded-lg, p-[3px], inline-flex)
└── TabsTrigger  (rounded-md, text-sm, font-medium)
     ├── [inactive]  text-foreground on muted background
     └── [active]    bg-background, shadow-sm, text-foreground
```

Tab content area below has `gap-2` from the list.

---

### 6.6 Avatar

| Size (composable) | Default | Description                         |
| ----------------- | ------- | ----------------------------------- |
| `size-8`          | 32×32px | Default – used in sidebar, comments |
| `size-10`         | 40×40px | Standard – header profile           |
| `size-12`         | 48×48px | Profile page                        |
| `size-16`         | 64×64px | Doctor cards, large profile         |

Shape: `rounded-full`. Fallback: `bg-muted`, centered letters.

---

### 6.7 Alert

| Variant       | Color                          |
| ------------- | ------------------------------ |
| `default`     | `bg-card`, neutral             |
| `destructive` | Red tinted, `text-destructive` |

Layout: icon (16×16) + title + description in a grid. `rounded-lg`, `px-4 py-3`.

---

### 6.8 Separator

Thin rule: `1px` height (horizontal) or `1px` width (vertical). Color: `border`. Fully stretches to container width/height.

---

### 6.9 Skeleton

Animated placeholder: `bg-accent`, `animate-pulse`, `rounded-md`. Reshape with width/height utilities.

---

### 6.10 Spinner

Lucide `Loader2` icon, `size-4` (16px) default, `animate-spin`. Resizable with `size-*` classes.

---

## 7. Page Layouts

### 7.1 Public Pages (Landing, Doctors, Guide…)

```
┌─────────────────────────────────────┐
│  Header (fixed, 64px, glass effect) │
├─────────────────────────────────────┤
│  Hero Section  (100vh or auto)      │
│  Feature Sections (alternating)     │
│  CTA / Stats / Testimonials         │
├─────────────────────────────────────┤
│  Footer (dark bg, 5-column grid)    │
└─────────────────────────────────────┘
```

Header becomes glass (`bg-background/80 backdrop-blur-xl`) when user scrolls past 20px.

### 7.2 Auth Pages (Login / Register)

```
┌────────────────┬────────────────────┐
│  Left Panel    │  Right Panel       │
│  (gradient bg) │  (white form area) │
│  Logo          │  Progress steps    │
│  Promo text    │  Form fields       │
│  Feature pills │  Submit button     │
└────────────────┴────────────────────┘
```

Split 50/50. Left panel uses brand gradient (`primary → accent`). On mobile: left panel hidden, form full-width.

### 7.3 Dashboard Layout (Patient)

```
┌──────────┬──────────────────────────┐
│ Sidebar  │  Main Content            │
│ 256px    │  Sticky sub-header       │
│ dark bg  │  KPI cards (2×2 grid)    │
│ nav menu │  Content sections        │
│          │                          │
└──────────┴──────────────────────────┘
```

Sidebar collapses to bottom nav bar on mobile.

### 7.4 Doctor Dashboard Layout

Same sidebar structure but uses `DoctorDashboardSidebar` with doctor-specific menu items (Agenda, Patients, Consultations, Prescriptions, Revenue, Reviews, Settings).

---

## 8. Navigation – Header

### Structure

```
Header (fixed, z-50, full-width)
├── Desktop Nav
│   ├── Logo (left)
│   ├── Nav Links: Accueil / Services▾ / Médecins / Pharmacie / Tarifs
│   │             └── Services Dropdown: 6 items
│   └── Auth area (right): Login | Register  OR  ProfileMenuButton
└── Mobile Nav
    ├── Hamburger icon
    └── Drawer: same links + accordion for Services
```

### Header States

| State          | Visual                                                 |
| -------------- | ------------------------------------------------------ |
| Top of page    | Transparent / invisible                                |
| Scrolled >20px | `bg-background/80 backdrop-blur-xl border-b shadow-sm` |

---

## 9. Sidebar Navigation

### Patient Sidebar (`DashboardSidebar`)

| Icon            | Label                      | Route                            |
| --------------- | -------------------------- | -------------------------------- |
| LayoutDashboard | Tableau de bord            | `/dashboard`                     |
| Search          | Trouver un médecin         | `/dashboard/find-doctor`         |
| Calendar        | Mes rendez-vous            | `/dashboard/appointments`        |
| Video           | Mes consultations          | `/dashboard/consultations`       |
| FileText        | Mon dossier médical        | `/dashboard/medical-records`     |
| Pill            | Mes ordonnances            | `/dashboard/prescriptions`       |
| Camera          | Pharmacie en ligne _(NEW)_ | `/pharmacy/prescription-scanner` |
| ShoppingBag     | Mes commandes              | `/dashboard/orders`              |
| Package         | Suivi livraison            | `/dashboard/tracking`            |
| Bell            | Notifications _(badge: 3)_ | `/dashboard/notifications`       |
| Settings        | Paramètres                 | `/dashboard/settings`            |
| LogOut          | Déconnexion                | → logout + `/login`              |

### Doctor Sidebar (`DoctorDashboardSidebar`)

| Icon            | Label           | Route                             |
| --------------- | --------------- | --------------------------------- |
| LayoutDashboard | Tableau de bord | `/doctor-dashboard`               |
| Calendar        | Mon agenda      | `/doctor-dashboard/agenda`        |
| Users           | Mes patients    | `/doctor-dashboard/patients`      |
| Video           | Consultations   | `/doctor-dashboard/consultations` |
| FileText        | Ordonnances     | `/doctor-dashboard/prescriptions` |
| TrendingUp      | Mes revenus     | `/doctor-dashboard/revenue`       |
| Star            | Avis patients   | `/doctor-dashboard/reviews`       |
| Settings        | Paramètres      | `/doctor-dashboard/settings`      |

**Active state:** `bg-sidebar-accent text-sidebar-primary-foreground rounded-lg`
**Hover state:** `bg-sidebar-accent/50`

---

## 10. Animation Library

All animations are defined as CSS `@keyframes` in `globals.css` and exposed as Tailwind `animate-*` utilities.

| Animation       | Class                     | Duration           | Use case                       |
| --------------- | ------------------------- | ------------------ | ------------------------------ |
| Float up/down   | `animate-float`           | 6s ease-in-out ∞   | Hero logo, decorative elements |
| Float reverse   | `animate-float-reverse`   | 8s ease-in-out ∞   | Secondary floating blobs       |
| Float slow      | `animate-float-slow`      | 12s ease-in-out ∞  | Background blobs               |
| Pulse glow      | `animate-pulse-glow`      | 3s ease-in-out ∞   | CTA buttons, hero image        |
| Pulse ring      | `animate-pulse-ring`      | 2s ease-out ∞      | Avatar online indicator        |
| Gradient shift  | `animate-gradient-shift`  | 8s ease ∞          | Hero gradient backgrounds      |
| Gradient X      | `animate-gradient-x`      | 6s ease ∞          | Gradient text                  |
| Blob morph      | `animate-blob`            | 8s ease-in-out ∞   | Background organic shapes      |
| Slide up        | `animate-slide-up`        | 0.6s ease-out 1    | Section entrance               |
| Slide down      | `animate-slide-down`      | 0.6s ease-out 1    | Dropdown entrance              |
| Slide left      | `animate-slide-left`      | 0.6s ease-out 1    | Right panel entrance           |
| Slide right     | `animate-slide-right`     | 0.6s ease-out 1    | Left panel entrance            |
| Fade in         | `animate-fade-in`         | 0.4s ease-out 1    | General reveal                 |
| Fade in blur    | `animate-fade-in-blur`    | 0.6s ease-out 1    | Hero text entrance             |
| Scale in        | `animate-scale-in`        | 0.3s ease-out 1    | Modal/card appearance          |
| Scale in bounce | `animate-scale-in-bounce` | 0.5s ease-out 1    | Success states                 |
| Shimmer         | `animate-shimmer`         | 2s linear ∞        | Loading skeleton gradient      |
| Spin slow       | `animate-spin-slow`       | 8s linear ∞        | Decorative ring elements       |
| Spin reverse    | `animate-spin-reverse`    | 6s linear ∞        | Concentric ring layers         |
| Ripple          | `animate-ripple`          | 0.6s ease-out 1    | Button click feedback          |
| Text reveal     | `animate-text-reveal`     | 0.8s ease-in-out 1 | Headline entrance              |
| Typewriter      | `animate-typewriter`      | varies             | Code/terminal text             |
| Spin (default)  | `animate-spin`            | 1s linear ∞        | Loading spinner                |
| Pulse (default) | `animate-pulse`           | 2s cubic-bezier ∞  | Skeleton placeholders          |

---

## 11. User Roles & Dashboard Mapping

| Role                | Default Dashboard Route      | Sidebar Component            |
| ------------------- | ---------------------------- | ---------------------------- |
| `patient`           | `/dashboard`                 | `DashboardSidebar`           |
| `doctor`            | `/doctor-dashboard`          | `DoctorDashboardSidebar`     |
| `pharmacy`          | `/pharmacy-dashboard`        | Custom (inline)              |
| `medical_service`   | `/medical-service-dashboard` | Custom (inline)              |
| `lab_radiology`     | `/lab-dashboard`             | Custom (inline)              |
| `medical_transport` | `/transport-dashboard`       | Custom (inline)              |
| `paramedical`       | `/paramedical-dashboard`     | Custom (inline)              |
| `admin`             | `/admin`                     | No sidebar (full page table) |

**Account approval flow:** Non-patient roles show `/account-review` page until status = `approved`.

---

## 12. Status Indicators

| Status                       | Visual                                                                |
| ---------------------------- | --------------------------------------------------------------------- |
| `pending`                    | Orange / amber badge                                                  |
| `approved`                   | Green / accent badge                                                  |
| `rejected`                   | Red / destructive badge                                               |
| `en_livraison` (in delivery) | Blue badge                                                            |
| `confirmée` (confirmed)      | Green badge                                                           |
| `annulée` (cancelled)        | Red badge                                                             |
| Online indicator             | `animate-pulse-ring` green dot, `absolute bottom-0 right-0` on avatar |

---

## 13. Iconography

Library: **Lucide React** (`lucide-react` v0.564+)

Default sizes in use:

| Context                       | Size class         | px   |
| ----------------------------- | ------------------ | ---- |
| Navigation menu icons         | `size-5`           | 20px |
| Button leading icon           | `size-4` (auto)    | 16px |
| Card KPI icons                | `size-6`           | 24px |
| Feature section icons         | `size-8`           | 32px |
| Empty state illustration icon | `size-16`          | 64px |
| Alert icon                    | `size-4`           | 16px |
| Spinner                       | `size-4` (default) | 16px |

Frequently used icon sets:

- **Navigation:** `LayoutDashboard`, `Calendar`, `Video`, `FileText`, `Pill`, `Settings`, `Bell`, `LogOut`, `Search`, `Users`
- **Healthcare:** `Stethoscope`, `Heart`, `Brain`, `Eye`, `Baby`, `Bone`, `Activity`, `Syringe`
- **Actions:** `Plus`, `ArrowRight`, `ChevronLeft`, `ChevronRight`, `Download`, `Upload`, `Trash`, `Edit`
- **Status:** `CheckCircle`, `XCircle`, `AlertCircle`, `Clock`, `Star`
- **Commerce:** `ShoppingCart`, `Package`, `Truck`, `MapPin`, `CreditCard`

---

## 14. Forms

### Input field anatomy

```
label (text-sm font-medium text-foreground, mb-1.5)
└── input (h-9, border, rounded-md, bg-input, px-3)
     └── error message (text-sm text-destructive, mt-1)
```

### Form states

| State                  | Visual                                         |
| ---------------------- | ---------------------------------------------- |
| Default                | `border: --border`, `bg: --input`              |
| Focus                  | `border: --ring`, `ring-[3px] ring-ring/50`    |
| Error (`aria-invalid`) | `border: --destructive`, `ring-destructive/20` |
| Disabled               | 50% opacity, `cursor-not-allowed`              |
| Loading submit         | Button shows `Spinner` + disabled              |

### Field types used in app

- Text, Email, Password (with show/hide toggle), Phone, Select dropdown, Textarea, Checkbox + label, Radio group, OTP input (6-digit), Date picker (react-day-picker)

---

## 15. Data Visualization

Library: **Recharts 2.x**

Chart colors map directly to CSS `--chart-1` through `--chart-5` tokens.

| Chart type               | Used in                   |
| ------------------------ | ------------------------- |
| `AreaChart`              | Doctor revenue over time  |
| `BarChart`               | Pharmacy sales by product |
| `LineChart`              | Medical service analytics |
| `PieChart` / `RadialBar` | KPI completion indicators |

---

## 16. Page Inventory (Complete Route Map)

| Path                                        | Page                            | Auth                      |
| ------------------------------------------- | ------------------------------- | ------------------------- |
| `/`                                         | Landing – Homepage              | Public                    |
| `/login`                                    | Login (role selector → form)    | Public                    |
| `/register`                                 | Register (role selector → form) | Public                    |
| `/doctors`                                  | Doctor listing + filters        | Public                    |
| `/doctor/:id`                               | Doctor detail + booking         | Public                    |
| `/guide`                                    | Guide & Pricing (tabs)          | Public                    |
| `/how-it-works`                             | → redirect `/guide`             | —                         |
| `/pricing`                                  | → redirect `/guide`             | —                         |
| `/consultation`                             | Video consultation room         | Public                    |
| `/profile`                                  | User profile                    | Authenticated             |
| `/welcome`                                  | Demo account selector           | Public                    |
| `/account-review`                           | Approval pending page           | Authenticated             |
| `/conditions-utilisation`                   | Terms of service                | Public                    |
| `/politique-confidentialite`                | Privacy policy                  | Public                    |
| `/admin`                                    | Admin user management           | `role: admin`             |
| `/dashboard` + 10 sub-pages                 | Patient dashboard               | `role: patient`           |
| `/doctor-dashboard` + 7 sub-pages           | Doctor dashboard                | `role: doctor`            |
| `/pharmacy` + 8 sub-pages                   | Pharmacy storefront             | Public                    |
| `/pharmacy-dashboard` + 3 sub-pages         | Pharmacy management             | `role: pharmacy`          |
| `/lab-dashboard` + 2 sub-pages              | Lab dashboard                   | `role: lab_radiology`     |
| `/medical-service-dashboard` + 11 sub-pages | Medical service dashboard       | `role: medical_service`   |
| `/transport-dashboard` + 2 sub-pages        | Transport dashboard             | `role: medical_transport` |
| `/paramedical-dashboard` + 12 sub-pages     | Paramedical dashboard           | `role: paramedical`       |

---

## 17. Footer Structure

```
Footer (dark bg, animated blobs)
└── Grid: 5 columns (lg) / 2 columns (md) / 1 column (sm)
    ├── Col 1-2 (brand): Logo · Tagline · Social icons
    ├── Col 3 (platform links): Services, Doctors, Pharmacy, Consultation, Dashboard
    ├── Col 4 (legal): CGU, Privacy policy, Accessibility, Cookie policy
    └── Col 5 (contact): Email, Phone, Address, Newsletter form
└── Bottom bar: © MegaCare · Développé par Redix Digital Solutions · Back-to-top button
```

Social icons: Facebook, Instagram, LinkedIn, Twitter/X, YouTube

---

## 18. Accessibility Notes

- Focus rings: `ring-[3px] ring-ring/50` on all interactive elements
- ARIA roles: `role="alert"` on Alert, `role="status"` on Spinner
- Disabled states: `pointer-events-none opacity-50` consistently applied
- Color contrast: Primary `#1A4DB5` on white meets WCAG AA (4.8:1)
- All form fields use `<label>` associations
- `suppressHydrationWarning` on `<html>` and `<body>` for theme switching

---

_End of MegaCare Design System Reference_
