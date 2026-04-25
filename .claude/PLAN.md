# Multi-Project Portfolio Dashboard Plan

## Context

**Goal:** Build a unified, publicly-viewable portfolio dashboard that showcases multiple projects (starting with Ascend and Event Globe) with shared authentication for accessing/using the projects.

**Current State:**
- **Ascend** (React Native/Expo + Supabase) - Has built-in login system, deployed on Vercel
- **Event Globe** (Vanilla JS + Flask) - No login system currently
- **Requirement:** Public viewing of portfolio, shared login to access projects, admin panel for managing projects, 5-10+ projects expected

**Key Constraints:**
- Projects have different tech stacks (React, vanilla JS, Flask)
- Ascend already uses Supabase for auth
- Event Globe needs authentication added
- Deep linking to individual projects from dashboard
- Future projects need to fit the shared auth model

---

## Proposed Architecture

### 1. **Portfolio Dashboard (Next.js)**
- **Framework:** Next.js 14+ (App Router)
- **Hosting:** Vercel
- **Purpose:** Public-facing hub that shows project cards and routes to projects
- **Key Pages:**
  - `/` - Landing/portfolio homepage (public)
  - `/projects` - Project gallery (public, shows all projects)
  - `/projects/[id]` - Deep links to individual projects
  - `/admin` - Admin panel for managing projects (protected)
  - `/login` - Shared authentication login page

### 2. **Shared Authentication**
- **Approach:** Supabase Auth (what Ascend already uses)
- **Benefits:**
  - Ascend integrates seamlessly
  - Event Globe can connect to same Supabase instance
  - Future projects can use Supabase Auth
  - Built-in row-level security (RLS) for project access
- **Implementation:**
  - Create a `projects` table in Supabase tracking all portfolio projects
  - Create a `project_access` table for managing which users can access which projects
  - Use Supabase Auth with email/password or OAuth (GitHub/Google)

### 3. **Project Access Model**
- **Portfolio Dashboard:** Publicly viewable (anyone can see project listings)
- **Project Access:** Requires shared Supabase login
  - User logs in once at `/login`
  - Session persists across projects (Supabase session token in cookie/localStorage)
  - Dashboard stores auth state and passes to projects via URL params or shared session
  
### 4. **How Projects Integrate**

#### **Ascend (Already has login)**
- Modify to detect shared Supabase session
- If session exists, use it; if not, show login
- Option to "skip" Ascend's separate login if Supabase session is active

#### **Event Globe (No login currently)**
- Add Supabase authentication check before accessing API
- Backend (Flask) validates Supabase token
- Frontend checks session before allowing access

#### **Future Projects**
- Must integrate with Supabase Auth
- Each project validates token from shared session

### 5. **Admin Panel (Next.js)**
- **Location:** `/admin` (protected route)
- **Features:**
  - List all projects (published/draft)
  - Add new project metadata (name, description, icon, tech stack, URL)
  - Enable/disable projects
  - View access logs
  - Manage user roles (if needed)
- **Data Storage:** Supabase `projects` table

---

## Technical Implementation Plan

### Phase 1: Setup Shared Authentication
1. Create Supabase `projects` table schema:
   ```
   - id (UUID)
   - name (string)
   - slug (string)
   - description (text)
   - icon_url (string)
   - tech_stack (array)
   - external_url (string)
   - is_published (boolean)
   - created_at (timestamp)
   - updated_at (timestamp)
   ```

2. Create Supabase `project_metadata` table for additional fields (screenshots, features, etc.)

3. Enable RLS on `projects` table (public read, authenticated write)

### Phase 2: Setup Authentication Methods
1. Configure Supabase Auth providers:
   - Enable Email/Password authentication
   - Configure Google OAuth (create credentials in Google Cloud Console)
   - Add redirect URLs: `https://asixstud.io/auth/callback`

### Phase 3: Build Next.js Dashboard
1. Create Next.js project structure:
   ```
   portfolio/
   ├── app/
   │   ├── layout.tsx (root layout with auth provider)
   │   ├── page.tsx (landing page)
   │   ├── projects/
   │   │   ├── page.tsx (projects gallery)
   │   │   └── [id]/
   │   │       └── page.tsx (deep link to project)
   │   ├── admin/
   │   │   ├── layout.tsx (protected layout)
   │   │   ├── page.tsx (admin dashboard)
   │   │   └── projects/
   │   │       ├── page.tsx (manage projects)
   │   │       └── [id]/
   │   │           └── page.tsx (edit project)
   │   └── login/
   │       └── page.tsx (auth page)
   ├── lib/
   │   ├── supabase.ts (client & server)
   │   ├── auth.ts (auth utilities)
   │   └── projects.ts (project queries)
   ├── components/
   │   ├── ProjectCard.tsx
   │   ├── AuthProvider.tsx
   │   ├── ProtectedRoute.tsx
   │   └── Navbar.tsx
   └── styles/
       └── globals.css
   ```

2. Setup Supabase client with Next.js:
   - Install `@supabase/supabase-js` and `@supabase/auth-helpers-nextjs`
   - Configure environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_ANON_KEY)

3. Create Auth Context/Provider for sharing session across app

4. Build UI components (with Email/Password + Google OAuth forms):
   - ProjectCard (displays project metadata, links to project)
   - Navbar (shows login/logout, current user)
   - ProjectGallery (responsive grid)
   - AdminPanel (manage projects)

### Phase 4: Integrate Event Globe
1. Update Event Globe Flask backend to validate Supabase tokens
   - Check Authorization header for Bearer token
   - Validate token with Supabase
   - Add middleware for protected endpoints

2. Update Event Globe frontend to check for Supabase session
   - If session exists, pass token to backend
   - If no session, redirect to portfolio login

### Phase 5: Update Ascend (Seamless Integration)
1. Detect shared Supabase session from asixstud.io dashboard
2. If session exists → Ascend uses that auth, skips separate login screen
3. If no session → Ascend shows login as fallback
4. Both auth systems share same Supabase instance

### Phase 6: Admin Panel
1. Build admin dashboard to manage projects
2. CRUD operations for projects table
3. Publish/unpublish projects

---

## Domain & Branding

**Primary Domain:** `asixstud.io`
- Main portfolio URL: `https://asixstud.io`
- Projects gallery: `https://asixstud.io/projects`
- Login: `https://asixstud.io/login`
- Admin panel: `https://asixstud.io/admin`

**Optional Subdomains (future):**
- `api.asixstud.io` - If centralizing project APIs
- `blog.asixstud.io` - For project blog/documentation

**Branding:**
- Clean, modern design with project showcase aesthetic
- Navigation: Home → Projects → [Project deeplink] → Back to portfolio
- Header: asixstud branding, login/logout button
- Footer: Social links, GitHub links to project repos if public

---

## Deployment Strategy

### Initial Deployment
1. Create Next.js portfolio repo on GitHub
2. Deploy to Vercel (auto-deploys on push to main)
3. Configure environment variables in Vercel dashboard
4. Point custom domain to Vercel

### Ongoing
- Portfolio updates trigger Vercel auto-deploy
- Event Globe backend deployed separately (Flask on Railway, Heroku, or DigitalOcean)
- Ascend continues deploying to Vercel
- All projects share Supabase instance for auth

---

## Data Flow

```
User visits asixstud.io
↓
Dashboard loads, shows public project listings
↓
User clicks project card
↓
Check for Supabase session
  ├─ Session exists → Redirect to project with session token
  └─ No session → Redirect to /login
↓
User logs in (or already logged in)
↓
Session created, stored in localStorage/cookie
↓
User redirected to project (Ascend or Event Globe)
↓
Project receives session token, validates with Supabase
↓
Access granted → Project loads and syncs data
```

---

## Critical Files to Create/Modify

### New Files (Portfolio Dashboard)
- `app/layout.tsx` - Root layout with auth provider
- `app/page.tsx` - Landing page
- `app/projects/page.tsx` - Projects gallery
- `app/projects/[id]/page.tsx` - Project deeplink
- `app/login/page.tsx` - Auth page
- `lib/supabase.ts` - Supabase client config
- `lib/auth.ts` - Auth utilities
- `components/ProjectCard.tsx` - Project card component

### Modified Files (Event Globe)
- `backend/app.py` - Add Supabase token validation middleware
- `backend/requirements.txt` - Add `pyjwt` for token validation (or use Supabase Python client)
- `frontend/index.html` or `frontend-api.js` - Check for Supabase session before API calls

### Supabase Schema
- Create `projects` table (id, name, slug, description, url, tech_stack, is_published)
- Create `project_metadata` table (project_id, screenshots, features, etc.)
- Enable RLS for public read access

---

## Testing & Verification

1. **Portfolio Dashboard:**
   - ✅ Public viewing of projects (no login required)
   - ✅ Project cards display correctly with metadata
   - ✅ Deep links to projects work
   - ✅ Login redirects to Supabase auth
   - ✅ Admin panel creates/edits projects in DB

2. **Auth Integration:**
   - ✅ Login creates Supabase session
   - ✅ Session persists across page navigation
   - ✅ Logout clears session
   - ✅ Protect routes (admin) check for auth

3. **Project Access:**
   - ✅ Ascend recognizes shared session (can skip separate login)
   - ✅ Event Globe backend validates Supabase token
   - ✅ Event Globe frontend checks session before API calls
   - ✅ Unauth users can't access project data

4. **Deployment:**
   - ✅ Portfolio deploys to Vercel automatically
   - ✅ Custom domain points to Vercel
   - ✅ Event Globe backend accessible from frontend
   - ✅ Supabase env vars configured in Vercel

---

## Final Decisions (Locked In)

✅ **Domain:** `asixstud.io`
✅ **Auth Methods:** Email/Password + Google OAuth  
✅ **Ascend Integration:** Yes - detect shared session and skip separate login
✅ **Architecture:** Unified dashboard with deep linking to projects
✅ **Deployment:** Vercel for portfolio + projects
✅ **Project Management:** Admin panel for managing projects
✅ **Future Growth:** Built for 5-10+ projects

---

## Implementation Order

1. **Setup Supabase:** Configure auth providers (Email/Password, Google OAuth), create projects table
2. **Next.js Portfolio:** Build dashboard, auth flows, project gallery, admin panel
3. **Event Globe:** Add Supabase token validation to backend + frontend
4. **Ascend:** Add shared session detection for seamless auth
5. **Deploy:** Point asixstud.io to Vercel, configure environment variables
6. **Test:** Verify login flows, project access, admin functionality
