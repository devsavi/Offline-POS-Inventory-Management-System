# Offline POS & Inventory Management System — Project Specification

> **Status:** Active Development · Offline-first · Cafe / Restaurant POS
> **Version:** 0.1.0 — Phase 1 Complete

---

## 1. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Desktop Shell | **Electron 30** | Cross-platform desktop wrapper (Windows primary target) |
| UI Framework | **React 18** + **TypeScript 5** | Renderer process, component tree |
| Styling | **Tailwind CSS 3** | Utility-first styling, `darkMode: 'class'` |
| State Management | **Zustand 5** | Client-side app state (active module, theme, current user, search) |
| Local Database | **better-sqlite3 13** | Embedded SQLite — fully offline, no cloud dependency |
| Charts | **Recharts 3** | Sales trends, KPI sparklines, category breakdowns |
| Excel Export | **SheetJS (xlsx)** | Generate `.xlsx` reports for sales & inventory |
| PDF Export | **pdfmake** | Print-ready receipts and summary reports |
| Auth Hashing | **bcryptjs** | Staff PIN / password hashing (client-side, Node context) |
| Icons | **lucide-react** | Consistent icon library throughout the UI |
| Build Tool | **Vite 5** + `vite-plugin-electron` | Fast HMR dev, production bundling |
| Packager | **electron-builder** | Creates `.exe` installer (NSIS target) |

---

## 2. Folder Structure

```
Offline-POS-Inventory-Management-System/
│
├── electron/                   # Electron Main Process (Node.js context)
│   ├── main.ts                 # BrowserWindow setup, app lifecycle
│   ├── preload.ts              # contextBridge — exposes ipcRenderer to renderer
│   ├── electron-env.d.ts       # Type declarations for Electron env variables
│   │
│   ├── db/                     # SQLite / better-sqlite3 layer
│   │   ├── database.ts         # DB initialisation, connection singleton
│   │   ├── schema.sql          # Table definitions (DDL)
│   │   └── repositories/       # One file per domain entity (CRUD helpers)
│   │
│   └── ipc/                    # IPC handler registrations
│       └── (handlers per module, e.g. billing.ipc.ts, inventory.ipc.ts …)
│
├── src/                        # Vite Renderer Process (React/TS)
│   ├── main.tsx                # ReactDOM.createRoot entry
│   ├── App.tsx                 # Root component — module router
│   ├── index.css               # Tailwind directives + base styles + scrollbar
│   ├── vite-env.d.ts           # Vite/TS shims
│   │
│   ├── types/                  # Shared TypeScript interfaces
│   │   └── index.ts            # AppModule, UserProfile, TableColumn, CardProps …
│   │
│   ├── store/                  # Zustand stores
│   │   └── useAppStore.ts      # Theme, activeModule, currentUser, searchQuery
│   │
│   ├── lib/                    # Pure utilities / helpers (no React)
│   │   └── (formatCurrency.ts, formatDate.ts, ipc.ts bridge helper …)
│   │
│   ├── components/
│   │   ├── ui/                 # Shared design-system components
│   │   │   ├── Card.tsx        # White rounded card with optional header/action
│   │   │   ├── KpiCard.tsx     # Metric card with icon, change badge
│   │   │   ├── PillButton.tsx  # Rounded filter/toggle pill (active = green)
│   │   │   ├── PrimaryButton.tsx # Rounded button: primary/secondary/outline/danger/ghost
│   │   │   ├── DataTable.tsx   # Generic typed table with empty + loading states
│   │   │   └── index.ts        # Barrel export
│   │   │
│   │   └── layout/             # App-shell layout components
│   │       ├── AppLayout.tsx   # Sidebar + TopBar + <main> scroll area
│   │       ├── Sidebar.tsx     # Nav pills, active module, theme toggle, SQLite status
│   │       └── TopBar.tsx      # Search bar, live clock, user avatar, theme toggle
│   │
│   ├── pages/                  # One file per module page
│   │   ├── DashboardPage.tsx   # KPIs, recent orders, quick actions, top items
│   │   ├── BillingPage.tsx     # POS register, cart, payment processing
│   │   ├── InventoryPage.tsx   # Product catalog, stock levels, reorders
│   │   ├── CustomersPage.tsx   # CRM — customer list, loyalty, purchase history
│   │   ├── ReportsPage.tsx     # Sales / inventory / financial charts & export
│   │   ├── UsersPage.tsx       # Staff directory, roles, shift management
│   │   ├── AssetsPage.tsx      # Equipment register, depreciation, maintenance
│   │   ├── SettingsPage.tsx    # Store info, printers, DB backup, appearance
│   │   └── AdminPage.tsx       # Audit log, permissions matrix, system diagnostics
│   │
│   └── assets/                 # Static assets (logo, images)
│
├── public/                     # Vite public dir (copied as-is to dist)
├── build/                      # Electron-builder resource files (icons, etc.)
├── dist/                       # Vite renderer build output
├── dist-electron/              # Electron compiled output (main.js, preload.mjs)
│
├── index.html                  # Vite entry HTML (loads src/main.tsx, Inter font)
├── tailwind.config.js          # darkMode: 'class', brand green palette, Inter font
├── postcss.config.js           # autoprefixer
├── vite.config.ts              # Vite + electron plugin config
├── tsconfig.json               # TS config for renderer
├── tsconfig.node.json          # TS config for Electron main/preload
├── electron-builder.yml        # Packaging config (NSIS installer, appId, etc.)
└── package.json                # npm scripts, all dependencies
```

---

## 3. Design System

### Theme

| Token | Light | Dark |
|---|---|---|
| Page background | `#F3F4F6` (`gray-100`) | `#0F172A` (`slate-900`) |
| Card background | `#FFFFFF` white | `#1E293B` (`slate-800/90`) |
| Card border | `gray-100` | `slate-700/60` |
| Primary accent | `#16A34A` (`emerald-600`) | `#16A34A` (`emerald-600`) |
| Active nav pill bg | `emerald-50` | `emerald-950/60` |
| Active nav text/icon | `emerald-700` | `emerald-300` |
| Body text | `gray-950` | `white` |
| Secondary text | `gray-500` | `slate-400` |
| Font | `Inter` (Google Fonts, 300–800) | same |
| Card radius | `rounded-xl` = 16 px | same |
| Card shadow | `shadow-soft` (custom utility) | same |

### Theme Toggle
- Toggle button lives in **both** the Sidebar footer and the TopBar (sun/moon icon)
- Adds/removes the `dark` class on `<html>` — Tailwind `dark:` variants activate
- Persists choice to `localStorage` key `pos_theme`
- Initialised on store creation before first render (no flash)

### Reusable Components

| Component | File | Description |
|---|---|---|
| `<Card>` | `ui/Card.tsx` | White/dark card; optional `title`, `subtitle`, `action` header; `padding` prop |
| `<KpiCard>` | `ui/KpiCard.tsx` | Metric card with icon, trend arrow badge (positive/negative/neutral) |
| `<PillButton>` | `ui/PillButton.tsx` | Rounded pill toggle/filter; `active` = green background + border |
| `<PrimaryButton>` | `ui/PrimaryButton.tsx` | Rounded action button; variants: `primary | secondary | outline | danger | ghost` |
| `<DataTable<T>>` | `ui/DataTable.tsx` | Generic typed table; loading spinner; empty-state with icon; custom cell renderers |
| `<Sidebar>` | `layout/Sidebar.tsx` | Vertical nav for all 9 modules + SQLite status indicator + theme toggle |
| `<TopBar>` | `layout/TopBar.tsx` | Search input + live date/time + user avatar + theme icon |
| `<AppLayout>` | `layout/AppLayout.tsx` | Wraps Sidebar + TopBar + scrollable `<main>` |

---

## 4. Application Modules (9 Modules)

| # | Module | Route Key | Description |
|---|---|---|---|
| 1 | **Dashboard** | `dashboard` | Operational overview — KPIs, recent orders, low-stock alerts, quick POS launch |
| 2 | **Billing / POS** | `billing` | Cash register, barcode scan, cart, payment (cash/card/split), receipt print |
| 3 | **Inventory** | `inventory` | Products, categories, stock levels, barcode management, purchase orders |
| 4 | **Customers** | `customers` | CRM — customer profiles, loyalty points, account balances, purchase history |
| 5 | **Reports** | `reports` | Sales trends (Recharts), daily/weekly/monthly summaries, Excel & PDF export |
| 6 | **Users** | `users` | Staff accounts, roles (Admin / Manager / Cashier), shifts, PIN login |
| 7 | **Assets** | `assets` | Equipment register, depreciation schedules, maintenance reminders |
| 8 | **Settings** | `settings` | Store info, receipt templates, thermal printer config, DB backup/restore |
| 9 | **Admin** | `admin` | Audit log, permissions matrix, system diagnostics, SQLite maintenance |

---

## 5. IPC Architecture (Electron ↔ React)

```
Renderer (React)              Preload                 Main (Node)
─────────────────             ───────────             ────────────────────
window.ipcRenderer            contextBridge           ipcMain.handle()
  .invoke('billing:create',   exposeInMainWorld       → db/repositories/
   { items, payment })        ipcRenderer.invoke      → better-sqlite3
                                                      → returns result
```

- All DB access happens **only** in the main process — renderer never touches SQLite directly
- Each module gets its own IPC handler file in `electron/ipc/`
- Channel naming convention: `module:action` (e.g. `inventory:getAll`, `billing:createInvoice`)

---

## 6. Data Storage

- **Engine:** SQLite via `better-sqlite3` (synchronous, zero network, file-based)
- **Location:** Electron `app.getPath('userData')` — OS user data directory
- **Schema:** Defined in `electron/db/schema.sql` (DDL applied at startup via `database.ts`)
- **Repositories:** One file per domain entity with typed CRUD methods

---

## 7. Build & Distribution

```bash
# Development (HMR + Electron)
npm run dev

# Production build + NSIS installer
npm run build
```

- Output: `dist-electron/` (Electron) + `dist/` (Vite renderer) → packaged by electron-builder
- Target: Windows NSIS `.exe` installer (configured in `electron-builder.yml`)
- Native module: `better-sqlite3` rebuilt for Electron via `@electron/rebuild` (`postinstall`)

---

## 8. Progress Log

### ✅ Phase 1 — Design System & App Shell *(Complete — 2026-09-01)*

**Deliverables:**
- [x] `PROJECT_SPEC.md` — this document
- [x] `tailwind.config.js` — `darkMode: 'class'`, brand green palette (`brand-600 = #16A34A`), Inter font, `rounded-xl`, `shadow-soft`
- [x] `index.html` — Inter font from Google Fonts, base `dark:bg-slate-900` classes
- [x] `src/index.css` — Tailwind directives, base border color, custom scrollbar
- [x] `src/types/index.ts` — All shared TypeScript interfaces (AppModule, CardProps, KpiCardProps, DataTableProps, PillButtonProps, PrimaryButtonProps, UserProfile …)
- [x] `src/store/useAppStore.ts` — Zustand store: `activeModule`, `theme` (localStorage-persisted, no flash), `currentUser`, `searchQuery`
- [x] `src/components/ui/Card.tsx` — Reusable card with optional header/action/padding variants
- [x] `src/components/ui/KpiCard.tsx` — KPI metric card with trend arrow badges
- [x] `src/components/ui/PillButton.tsx` — Rounded pill filter/toggle button
- [x] `src/components/ui/PrimaryButton.tsx` — Full primary button (5 variants, 3 sizes, loading state)
- [x] `src/components/ui/DataTable.tsx` — Generic typed table with loading/empty states
- [x] `src/components/layout/Sidebar.tsx` — Vertical nav (9 modules), active green pill, SQLite status, theme toggle
- [x] `src/components/layout/TopBar.tsx` — Search input, live clock, user avatar/role, theme toggle
- [x] `src/components/layout/AppLayout.tsx` — App shell assembling Sidebar + TopBar + main
- [x] `src/App.tsx` — Module router (Zustand `activeModule` → page component map)
- [x] 9× placeholder pages: `DashboardPage`, `BillingPage`, `InventoryPage`, `CustomersPage`, `ReportsPage`, `UsersPage`, `AssetsPage`, `SettingsPage`, `AdminPage`

---

### ✅ Phase 2 — Database Schema & IPC Layer *(Complete — 2026-09-01)*

**Deliverables:**
- [x] `electron/db/schema.sql` — full DDL for 7 tables (`products`, `customers`, `users`, `sales`, `sale_items`, `assets`, `settings`); idempotent `CREATE TABLE IF NOT EXISTS`; single-row `settings` seeded via `INSERT OR IGNORE`
- [x] `electron/db/database.ts` — singleton `getDatabase()` that opens `offline-pos.db` in `app.getPath('userData')`, runs `schema.sql` on first launch, and exposes `closeDatabase()` for graceful shutdown
- [x] `electron/db/repositories/products.repository.ts` — CRUD + barcode lookup + low-stock aggregate + category count + search
- [x] `electron/db/repositories/customers.repository.ts` — CRUD + search + customer purchase history aggregate
- [x] `electron/db/repositories/users.repository.ts` — CRUD + per-cashier sales summary aggregate
- [x] `electron/db/repositories/sales.repository.ts` — atomic `createSale` transaction (inserts header + items + decrements stock) + daily revenue + top products + date-range revenue aggregates
- [x] `electron/db/repositories/saleItems.repository.ts` — CRUD for individual line items
- [x] `electron/db/repositories/assets.repository.ts` — CRUD + warranty-expiry alert aggregate + status filter
- [x] `electron/db/repositories/settings.repository.ts` — single-row get/update + admin password hash setter
- [x] `electron/ipc/inventory.ipc.ts` — IPC handlers for `products:*` channels
- [x] `electron/ipc/billing.ipc.ts` — IPC handlers for `billing:*` channels (sales + aggregates)
- [x] `electron/ipc/customers.ipc.ts` — IPC handlers for `customers:*` channels
- [x] `electron/ipc/users.ipc.ts` — IPC handlers for `users:*` channels
- [x] `electron/ipc/assets.ipc.ts` — IPC handlers for `assets:*` channels
- [x] `electron/ipc/settings.ipc.ts` — IPC handlers for `settings:*` channels
- [x] `electron/preload.ts` — restructured: exposes typed `window.api` namespace object (products / billing / customers / users / assets / settings) via `contextBridge`; raw `ipcRenderer` shim retained for backwards compat
- [x] `electron/electron-env.d.ts` — full `Window.api` TypeScript declaration; all entity interfaces (`Product`, `Customer`, `User`, `Sale`, `SaleWithItems`, `Asset`, `Settings`, …) declared as globals for renderer use
- [x] `electron/main.ts` — updated: calls `getDatabase()` then registers all six IPC handler modules before `createWindow()`; `closeDatabase()` hooked to `before-quit`

### ⬜ Phase 3 — Billing / POS Register *(Planned)*
- Full POS UI: product grid, cart, quantity stepper, discount input
- Payment modal: cash (change calculator), card, split tender
- Receipt generation with pdfmake + thermal printer IPC
- Staff PIN login / user picker

### ⬜ Phase 4 — Customers & Loyalty *(Planned)*
- Customer CRUD, search, profile view
- Loyalty points engine (earn on sale, redeem as discount)
- Account balance / credit management

### ⬜ Phase 5 — Reports & Export *(Planned)*
- Recharts: daily sales bar, category pie, top-items leaderboard
- Date range picker
- SheetJS Excel export
- pdfmake daily / monthly summary PDF

### ⬜ Phase 6 — Users, Shifts & Asset Tracking *(Planned)*
- Staff CRUD with bcryptjs PIN hashing
- Shift open/close with float management
- Asset register with depreciation

### ⬜ Phase 7 — Settings & Hardware *(Planned)*
- Store profile (name, address, logo, tax rates)
- Thermal printer discovery via IPC
- DB backup / restore UI

### ⬜ Phase 8 — Admin, Audit & Security *(Planned)*
- Audit log (every mutation logged with user + timestamp)
- Role-based access guard (route-level)
- DB maintenance tools (vacuum, integrity check)
