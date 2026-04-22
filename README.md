# asixstud.io - Project Hub

A modern portfolio hub website showcasing three innovative webapps: Ascend, GeoIntel, and Heavy Pocket.

## 🎯 Features

- **Landing Page**: Hero section with call-to-actions and featured projects grid
- **Project Pages**: Dedicated pages for each project with hero sections, features, and iframe embeds
- **About Page**: Information about the hub and its mission
- **Contact Page**: Contact form with validation and email integration
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern Aesthetic**: Clean, minimal design using Tailwind CSS
- **Dark Mode**: Built-in dark mode support

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Email**: Resend (when configured)
- **Hosting**: Vercel (recommended)

## 📁 Project Structure

```
asixstud.io/
├── app/                          # Next.js app directory
│   ├── (marketing)/              # Marketing pages group
│   │   ├── page.tsx              # Landing page
│   │   ├── about/page.tsx        # About page
│   │   ├── contact/page.tsx      # Contact page
│   │   └── projects/
│   │       ├── ascend/page.tsx   # Ascend project page
│   │       ├── geointel/page.tsx # GeoIntel project page
│   │       └── heavy-pocket/     # Heavy Pocket project page
│   ├── api/contact/route.ts      # Contact form API
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # UI components (Button, Card, Input, etc.)
│   ├── layout/                   # Layout components (Navigation, Footer)
│   ├── projects/                 # Project-specific components
│   ├── forms/                    # Form components
│   └── home/                     # Home page components
├── lib/                          # Utility functions
│   ├── project-config.ts         # Project metadata and configuration
│   ├── validation.ts             # Zod validation schemas
│   ├── utils.ts                  # Helper utilities
│   └── get-project.ts            # Project data fetching
├── public/                       # Static assets
│   └── images/projects/          # Project images and placeholders
└── types/                        # TypeScript type definitions
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` (or the available port shown) in your browser.

### Build

```bash
npm run build
npm run start
```

## 📋 Configuration

### Projects

Edit `lib/project-config.ts` to update project information:

- **name**: Project name
- **tagline**: Short description
- **description**: Longer description
- **longDescription**: Detailed description
- **image**: Project image path
- **iframeUrl**: Live demo iframe URL (add when deployed)
- **externalUrl**: External project URL
- **features**: Array of key features
- **category**: Project category
- **color**: Brand color for the project

### Environment Variables

Create a `.env.local` file based on `.env.example`:

```
NEXT_PUBLIC_SITE_URL=https://asixstud.io
RESEND_API_KEY=your_key_here
CONTACT_EMAIL_TO=your-email@example.com
NEXT_PUBLIC_ASCEND_IFRAME_URL=https://...
NEXT_PUBLIC_GEOINTEL_IFRAME_URL=https://...
NEXT_PUBLIC_HEAVY_POCKET_IFRAME_URL=https://...
```

## 📧 Contact Form

The contact form is configured but uses a placeholder implementation. To enable email:

1. Get a Resend API key from [resend.com](https://resend.com)
2. Add `RESEND_API_KEY` to `.env.local`
3. Update `app/api/contact/route.ts` to send emails via Resend

## 🖼️ Adding Project Images

1. Place project images in `public/images/projects/`
2. Update the image paths in `lib/project-config.ts`
3. Supported formats: JPG, PNG, WebP

## 📱 Responsive Design

The site is fully responsive and optimized for:
- Mobile (375px and up)
- Tablet (768px and up)
- Desktop (1280px and up)

## 🌙 Dark Mode

Dark mode is automatically supported via Tailwind's `dark:` prefix using system preferences.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## 🔄 Next Steps

1. **Add Project URLs**: Update `lib/project-config.ts` with iframe and external URLs when projects are deployed
2. **Add Images**: Place project images in `public/images/projects/` and update config
3. **Configure Email**: Set up Resend API key and enable email in the contact form API
4. **Update Bio**: Add your bio and content to the about page
5. **Deploy**: Push to Vercel for production deployment

## 📝 Pages & Routes

- `/` - Landing page
- `/about` - About page
- `/contact` - Contact page with form
- `/projects/ascend` - Ascend project detail
- `/projects/geointel` - GeoIntel project detail
- `/projects/heavy-pocket` - Heavy Pocket project detail
- `/api/contact` - Contact form API endpoint

## 📄 License

This project is proprietary and confidential.
