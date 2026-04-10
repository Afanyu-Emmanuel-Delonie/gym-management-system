# GymPro — Gym Management System

A full-stack gym management dashboard built with **Next.js 15**, **Supabase Auth**, **Prisma ORM**, and **PostgreSQL**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Auth | Supabase Auth |
| Database | PostgreSQL (via Supabase) |
| ORM | Prisma 7 (`@prisma/adapter-pg`) |
| Styling | Tailwind CSS v4 + custom CSS design tokens |
| Icons | Lucide React |
| Charts | Recharts |
| Fonts | Anton (headings), Roboto (body) |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://...        # Pooled connection (used by Prisma at runtime)
DIRECT_URL=postgresql://...          # Direct connection (used by Prisma migrations & seed)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # Required for seed & admin user creation
```

### 3. Generate Prisma client

```bash
npx prisma generate
```

### 4. Seed the database

```bash
npx tsx prisma/seed.ts
```

This will:
- Clear all existing auth users and database records
- Create 6 staff accounts + 10 client accounts
- Seed subscriptions, products, orders, discounts, services, testimonials, inquiries, roster, and attendance

### 5. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Login Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | admin@gym.com | GymAdmin@2025 |
| Sales Agent | agent@gym.com | GymAgent@2025 |
| Sales Agent 2 | agent2@gym.com | GymAgent@2025 |
| Coach | coach@gym.com | GymCoach@2025 |
| Coach 2 | coach2@gym.com | GymCoach@2025 |
| Nutritionist | nutri@gym.com | GymNutri@2025 |

---

## Project Structure

```
src/
├── actions/          # "use server" action files — only entry point for client components
│   ├── auth.ts       # signUp, login
│   ├── subscriptions.ts
│   ├── staff.ts
│   ├── store.ts
│   ├── access.ts
│   ├── gym.ts
│   └── content.ts    # gym services, testimonials, inquiries
│
├── services/         # Pure DB logic (Prisma queries/mutations) — server-only
│   ├── subscriptions/
│   ├── staff/
│   ├── store/
│   ├── access/
│   ├── gym/
│   └── utilities/
│
├── app/
│   ├── (auth)/       # login, register, forgot-password, verify-email
│   ├── (dashboard)/  # protected dashboard routes
│   │   ├── layout.tsx          # auth check + sidebar + header
│   │   ├── admin/
│   │   │   ├── dashboard/      # stat cards, charts, expiring subs, activity
│   │   │   ├── staff/          # staff list, roster builder, attendance
│   │   │   ├── subscriptions/  # subscription stats + table
│   │   │   ├── store/          # products, orders, discounts
│   │   │   └── content/        # gym services, testimonials, inquiries
│   │   ├── agent/
│   │   │   ├── dashboard/      # (placeholder)
│   │   │   ├── subscriptions/  # (placeholder)
│   │   │   └── access/         # (placeholder)
│   │   └── coach/
│   │       ├── dashboard/      # (placeholder)
│   │       └── schedule/       # (placeholder)
│   └── api/
│       └── auth/signout/       # POST → supabase.auth.signOut()
│
├── components/
│   ├── dashboard/
│   │   ├── Header.tsx          # search, notifications, profile dropdown
│   │   ├── Sidebar.tsx         # role-based nav, collapsible
│   │   └── SidebarContext.tsx  # collapse state + mobile detection
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Toast.tsx
│
├── constants/
│   ├── dashboard.ts            # PAGE_TITLES, NAV_ITEMS, mock notifications
│   ├── admin-dashboard.ts      # mock stat/chart data (to be replaced)
│   ├── subscriptions.ts        # STATUS_STYLES, TYPE_STYLES
│   └── store-content.ts        # ORDER_STATUS_STYLES, INQUIRY_STATUS_STYLES
│
├── lib/
│   ├── prisma.ts               # Prisma singleton
│   ├── serialize.ts            # Decimal → number serializer for server→client
│   └── supabase/
│       ├── client.ts           # browser Supabase client
│       └── server.ts           # server Supabase client (SSR cookies)
│
└── hooks/
    └── useToast.ts
```

---

## Architecture Rules

### Server vs Client boundary

**Never import from `@/services/...` in a client component.** Services use Prisma which pulls in Node.js-only modules (`pg`, `dns`, etc.) that cannot run in the browser.

```
Client Component  →  @/actions/*  →  @/services/*  →  Prisma  →  DB
```

### Decimal serialization

Prisma returns `Decimal` objects for numeric fields (`price`, `value`, `finalAmount`, etc.). These cannot be passed across the server/client boundary directly.

All action getters that return Decimal-containing data must wrap the result with `serialize()` from `@/lib/serialize.ts`:

```ts
import { serialize } from "../lib/serialize"

export async function getProducts() {
  return serialize(await _getProducts())
}
```

### "use server" files

Next.js requires `"use server"` files to export **explicit async functions**, not re-exports:

```ts
// ✅ correct
export async function deleteProduct(id: string) { return _deleteProduct(id) }

// ❌ will throw build error
export { deleteProduct } from "../services/store"
```

---

## Database Schema (key models)

| Model | Description |
|---|---|
| `Profile` | Central user — linked to Supabase auth by `id` |
| `Subscription` | DAILY / WEEKLY / MONTHLY / YEARLY — generates 6-digit `accessCode` on activation |
| `Appointment` | 1:1 services (personal training, massage, etc.) |
| `Schedule` + `Booking` | Group classes with capacity enforcement |
| `Roster` + `RosterShift` | Weekly staff scheduling |
| `Attendance` | Daily check-in / check-out tracking |
| `Product` + `Order` + `OrderItem` | E-commerce with stock management |
| `Discount` | Percentage or fixed discount codes |
| `Delivery` | Delivery tracking for orders |
| `GymService` | Services shown on the public site |
| `Testimonial` | Client reviews — require admin approval |
| `ContactInquiry` | Contact form submissions |

---

## Roles & Access

| Role | Dashboard | Features |
|---|---|---|
| `ADMIN` | `/admin/dashboard` | Full access to all modules |
| `SALES_AGENT` | `/agent/dashboard` | Subscriptions + access verification |
| `COACH` | `/coach/schedule` | Schedule + bookings |
| `NUTRITIONIST` | — | (TBD) |
| `CLIENT` | — | (TBD — public-facing) |

---

## What's Done ✅

- Auth (login, register, sign out)
- Role-based routing and sidebar navigation
- Admin dashboard — real DB (stat cards, donut charts, revenue trend, expiring subscriptions, recent activity)
- Admin subscriptions — real DB (stats + table with activate/cancel)
- Admin staff — real DB (staff list, roster builder, attendance)
- Admin store — real DB (products, orders, discounts)
- Admin content — real DB (gym services, testimonials, inquiries)
- Inquiries reply via WhatsApp (`wa.me` deep link)
- Database seeded with realistic data

## What's Pending 🔲

- Agent dashboard (placeholder)
- Agent subscriptions page (placeholder)
- Agent access verification page (placeholder)
- Coach dashboard (placeholder)
- Coach schedule page (placeholder)
- No middleware for route protection (deleted — needs to be re-added)
- Notifications (currently mock data in header)
- Profile page
- Public-facing landing page / shop
