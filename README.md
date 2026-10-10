# Embrione Member Platform (PES University)

A modern, sleek, tech-club member management platform built for **Embrione** at PES University.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS + framer-motion + Supabase**.

---

## 🌟 Features Overview

| Route | Purpose | Access | Highlights |
|---|---|---|---|
| `/` | **Home Hub** | Public | Interactive **Circular Reveal Navigation Plate** with hover/touch preview, Unsplash integration, and mobile fallback links. |
| `/register` | **Member Registration** | Public | Split-screen registration form with **live reactive card preview**, 150–200 character bio counter, and **client-side WebP compression/conversion**. |
| `/admin` | **Moderation Dashboard** | Login Required | Protected admin portal with metric counters (Pending, Approved, Rejected, Total), search, optimistic moderation (Approve, Reject, Delete), and confirmation dialogs. |
| `/team` | **"Meet The Team"** | Public | Community directory of approved members with **Domain chips**, **Position filters**, search, empty states, and staggered framer-motion animations. |

---

## 🔐 Admin Credentials

Per the project specification, use the following credentials to access the moderation portal at `/admin`:

- **Email:** `admin@embrione.pes.edu`
- **Password:** `EmbrioneAdmin@2026`

> **Note on Storage & Persistence:**
> - When valid Supabase credentials are configured in `.env`, authentication, member rows, and WebP avatars communicate directly with your Supabase database and Storage bucket.
> - If placeholder credentials are used or offline, the platform automatically runs in seamless **Demo/Offline Mode**, preserving registrations and moderation states in browser `localStorage`.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 / Node 24)
- npm or pnpm

### 2. Installation
```bash
# Clone the repository and navigate into the directory
cd Embroine

# Install dependencies
npm install
```

### 3. Environment Variables
Create or verify `.env` in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-placeholder-here
```
*(An example file `.env.example` is also provided in the repository).*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🗄️ Supabase Backend Setup

When connecting your real Supabase instance:

### Step 1: Run SQL Schema
Execute the SQL statements located in [`supabase/schema.sql`](supabase/schema.sql) in your **Supabase Dashboard SQL Editor**. This creates:
- The `member_status` enum (`pending`, `approved`, `rejected`)
- The `members` table with SRN, bio character constraints, and domain fields
- The `admins` table with foreign key to `auth.users`
- Row Level Security (RLS) policies allowing:
  - Public read access to **approved** members only
  - Public submission as **pending** only
  - Full admin access guarded by the `admins` table
- The `avatars` public storage bucket with `.webp` restriction and 5MB size limit

### Step 2: Seed Initial Members
Run the script in [`supabase/seed.sql`](supabase/seed.sql) to populate 6 initial approved student leaders across multiple domains.

### Step 3: Create Admin User
1. In your **Supabase Dashboard** -> **Authentication** -> **Users**, click **Add User**.
2. Enter:
   - **Email:** `admin@embrione.pes.edu`
   - **Password:** `EmbrioneAdmin@2026`
   - Check **Auto Confirm Email**.
3. Copy the generated User UID (`user_id`).
4. In the SQL Editor, insert the admin:
   ```sql
   insert into admins (user_id) values ('<COPIED_USER_UID>') on conflict do nothing;
   ```

---

## 🎨 Design System

- **Theme:** Sleek, dark, minimal "tech club" aesthetic
- **Background tokens:** `#0a0a0b` (canvas), `#111114` (surface), `#17171c` (elevated)
- **Accents:** Violet (`#8b5cf6`) to Cyan (`#22d3ee`) gradient
- **Status tokens:** Approved (`emerald`), Pending (`amber`), Rejected (`rose`)
- **Typography:** Inter for body, Space Grotesk for display headings
- **Micro-interactions:** Framer Motion spring and easing transitions respecting `prefers-reduced-motion`

---

## 📋 Deviations & Enhancements Note

1. **Brand Icons (`LinkedInIcon`, `GitHubIcon`):** Instead of relying on deprecated or inconsistent external icon pack exports, custom SVG components were implemented in `@/components/ui/icons` to ensure guaranteed compatibility and zero runtime bloat.
2. **Offline / Resilient Demo Mode:** To enable immediate out-of-the-box testing without blocking on manual Supabase cloud provisioning, the data layer includes transparent fallback storage. Any new profile submitted on `/register` appears immediately in `/admin` for approval, and when approved, renders immediately in `/team`.
3. **Responsive Layout Strategy:** MediaPipe is a computer vision framework; per the specification clarification (§8), standard CSS media queries and the custom `useMediaQuery` hook are used for responsive layouts across breakpoint tiers (`< 640px`, `640–1023px`, and `≥ 1024px`).
