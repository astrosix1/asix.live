# asixstud.io Portfolio Setup Guide

## Phase 1: Supabase Configuration

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New project" and fill in details:
   - **Project name:** asixstud-portfolio
   - **Database password:** Generate a strong password
   - **Region:** Choose closest to you
3. Wait for project to initialize

### 1.2 Create Database Tables

In Supabase SQL Editor, run:

```sql
-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  external_url TEXT NOT NULL,
  icon_url TEXT,
  tech_stack TEXT[] NOT NULL,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read published projects"
  ON projects FOR SELECT
  USING (is_published = true);

-- Authenticated write access
CREATE POLICY "Authenticated users can create projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');
```

### 1.3 Get API Keys

In Supabase Dashboard:
1. Go to **Settings > API**
2. Copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 1.4 Setup Authentication

1. Go to **Authentication > Providers**
2. **Email Provider:** Already enabled by default
3. **Google OAuth:**
   - Click "Google"
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable "Google+ API"
   - Create OAuth 2.0 credentials (Desktop application)
   - In Credentials, get Client ID and Client Secret
   - Add authorized redirect URIs:
     - `https://[your-supabase-project].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
   - Copy Client ID and Secret into Supabase Google provider settings

4. **Email Confirmation (Optional):**
   - Go to **Authentication > Email Templates**
   - Customize if desired

---

## Phase 2: Local Development Setup

### 2.1 Environment Variables

In `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2.2 Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

---

## Phase 3: Add Sample Projects

1. Go to `http://localhost:3000/login`
2. Sign up with email or Google
3. Go to `http://localhost:3000/admin/projects`
4. Click "+ Add Project"
5. Fill in details:

**Sample Project 1: Ascend**
- **Name:** Ascend
- **Slug:** ascend
- **Description:** A personal habit-tracking and wellness application with cloud synchronization
- **External URL:** https://ascend.vercel.app (replace with actual Ascend URL)
- **Tech Stack:** React Native, Expo, TypeScript, Supabase
- **Icon URL:** (optional image URL)
- **Publish:** Check

**Sample Project 2: Event Globe**
- **Name:** Event Globe
- **Slug:** event-globe
- **Description:** Real-time geopolitical intelligence platform with interactive 3D globe visualization
- **External URL:** https://event-globe.example.com (replace with actual URL)
- **Tech Stack:** Vanilla JavaScript, Flask, Three.js, D3.js
- **Publish:** Check

---

## Phase 4: Deployment to Vercel

### 4.1 Push to GitHub

```bash
git add .
git commit -m "Initial portfolio setup"
git push origin main
```

### 4.2 Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repo
4. Fill in Project Name: `asixstud-portfolio`
5. Set Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL=https://asixstud.io`
6. Click "Deploy"

### 4.3 Configure Domain

1. After deployment, go to **Settings > Domains**
2. Add your domain `asixstud.io`
3. Point your domain registrar to Vercel nameservers (or CNAME record)

### 4.4 Update Supabase Callback URL

In Supabase Dashboard > Authentication > Providers > Email:
- Add redirect URL: `https://asixstud.io/auth/callback`

For Google OAuth:
- Add authorized redirect URI: `https://asixstud.io/auth/callback`

---

## Phase 5: Integration with Projects

### Ascend Integration

In Ascend's codebase, detect portfolio session:

```typescript
import { supabase } from '@/lib/supabase';

// Check for portfolio session token
const { data: { session } } = await supabase.auth.getSession();

if (session) {
  // Use portfolio auth, skip Ascend login
  usePortfolioSession(session);
} else {
  // Show Ascend login as fallback
}
```

### Event Globe Integration

In Event Globe backend (`backend/app.py`), add token validation:

```python
from supabase import create_client
import os

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

@app.before_request
def check_auth():
    auth_header = request.headers.get("Authorization")
    if auth_header:
        token = auth_header.split("Bearer ")[-1]
        try:
            user = supabase.auth.get_user(token)
            request.user = user
        except:
            return {"error": "Unauthorized"}, 401
```

In Event Globe frontend, pass token to backend:

```javascript
const token = localStorage.getItem('supabase.auth.token');
if (!token) {
  window.location.href = 'https://asixstud.io/login';
  return;
}

const response = await fetch('https://event-globe-api.com/data', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## Troubleshooting

### OAuth Not Working

1. Verify redirect URLs in Supabase match your deployment URL
2. Check Google Cloud Console OAuth credentials
3. Ensure cookies are enabled in browser

### Projects Not Showing

1. Check database has `is_published = true`
2. Verify RLS policies are correct
3. Check browser console for errors

### Build Errors

```bash
npm run build
```

Check for TypeScript errors and fix.

---

## Next Steps

1. ✅ Set up Supabase
2. ✅ Configure environment variables
3. ✅ Add sample projects via admin panel
4. ✅ Deploy to Vercel
5. ✅ Integrate Ascend (seamless session detection)
6. ✅ Integrate Event Globe (backend token validation)
7. Build admin panel for user management
8. Add analytics tracking
9. Deploy Event Globe backend
