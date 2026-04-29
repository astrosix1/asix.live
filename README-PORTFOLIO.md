# asixstud.io - Multi-Project Portfolio

A unified portfolio dashboard for showcasing multiple projects with shared authentication and admin panel.

## Features

- 🎨 **Modern Design** - Clean, responsive UI built with Next.js and Tailwind CSS
- 🔐 **Shared Authentication** - Email/Password + Google OAuth via Supabase  
- 📊 **Project Gallery** - Publicly viewable project listings
- 🔗 **Deep Linking** - Individual project pages with auth-gated access
- 🛠️ **Admin Panel** - Create, edit, and manage projects
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🚀 **Vercel Ready** - Deploy with one click

## Tech Stack

- **Frontend:** Next.js 14 with App Router
- **Styling:** Tailwind CSS  
- **Language:** TypeScript
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Copy `.env.local` template
   - Add your Supabase credentials

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   http://localhost:3000

## Complete Setup

See [SETUP.md](./SETUP.md) for detailed instructions:
- Supabase project and database setup
- Authentication configuration (Email + Google OAuth)
- Local development
- Vercel deployment
- Project integration with Ascend and Event Globe

## Pages

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Landing page | Public |
| `/projects` | Project gallery | Public |
| `/projects/[slug]` | Project details | Auth required |
| `/login` | Sign in | Public |
| `/admin` | Dashboard | Auth required |
| `/admin/projects` | Manage projects | Auth required |
| `/admin/projects/new` | Create project | Auth required |

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Development

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Lint code
```

## Deployment

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variables
4. Auto-deploys on push to main

## Integration

- **Ascend:** Detects portfolio session, seamless auth
- **Event Globe:** Validates Supabase tokens in API calls

See [SETUP.md](./SETUP.md) Phase 5 for integration code examples.
