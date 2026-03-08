# Quickstart: Ocha Travel Transport Landing Page

## Prerequisites

- Node.js 20+
- npm or pnpm
- Resend account (free tier: https://resend.com)
- Google Analytics GA4 property (https://analytics.google.com)

## Setup

### 1. Clone and install

```bash
git clone <repo-url>
cd ocha-cms
git checkout 001-landing-page
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Resend (email service)
RESEND_API_KEY=re_your_api_key_here
BUSINESS_EMAIL=owner@ochatravel.com
EMAIL_FROM=contact@ochatravel.com

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Social links (configure actual URLs)
NEXT_PUBLIC_LINE_URL=https://line.me/R/ti/p/@ocha
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/Ocha.Jirasak
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/mr.ocha999
NEXT_PUBLIC_WHATSAPP_URL=https://wa.me/66661244999
NEXT_PUBLIC_MESSENGER_URL=https://m.me/Ocha.Jirasak
```

### 3. Run development server

```bash
npm run dev
```

Open:
- Thai: http://localhost:3000/th
- English: http://localhost:3000/en

### 4. Test contact form

1. Fill out the contact form on `/th` or `/en`
2. Submit the form
3. Check the `BUSINESS_EMAIL` inbox for the email
4. Verify confirmation message appears on the page

### 5. Build for production

```bash
npm run build
npm run start
```

## Verification Checklist

- [ ] Homepage redirects `/` to `/th`
- [ ] Language switcher toggles between `/th` and `/en`
- [ ] All text displays in correct language (no mixed content)
- [ ] Logo displays correctly from `/logos` directory
- [ ] All 5 services shown with correct details
- [ ] About Us section shows trust indicators
- [ ] Contact form validates all fields
- [ ] Contact form date picker blocks past dates
- [ ] Contact form submission sends email to business
- [ ] Success/error messages display in current language
- [ ] Phone number is clickable (tel: link)
- [ ] All 5 social/messaging links open correctly
- [ ] Page is responsive on mobile (320px), tablet (768px), desktop (1024px)
- [ ] Color scheme uses #e01d47 (primary), black, white
- [ ] GA4 tracks page views (check GA4 Debug View)
- [ ] Meta tags and OG tags render correctly per locale
- [ ] Structured data validates (https://validator.schema.org)
- [ ] sitemap.xml and robots.txt accessible

## Deployment

### Vercel (recommended)

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard under
Project Settings > Environment Variables.

### Other platforms

Any platform supporting Next.js works (Netlify, Railway, etc.).
Ensure environment variables are configured and Node.js 20+ available.
