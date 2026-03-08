# Research: Ocha Travel Transport Landing Page

**Date**: 2026-03-02
**Branch**: `001-landing-page`

## R1: Email Sending Service

**Decision**: Resend

**Rationale**: Free tier covers 3,000 emails/month (30x the estimated need).
Server-side API keeps business email secure. Simple SDK integrates
directly with Next.js API routes. High deliverability as a dedicated
transactional email service.

**Alternatives considered**:
- Nodemailer (SMTP): More complex setup, Gmail SMTP deliverability concerns,
  maintenance burden for credentials
- EmailJS: Exposes credentials client-side (security risk per constitution V)
- Web3Forms: Limited control over email content, less suitable for React forms

## R2: Internationalization (i18n) Approach

**Decision**: Built-in Next.js App Router i18n with `[lang]` dynamic segment

**Rationale**: Zero additional dependencies (aligns with constitution I: Simplicity).
Uses `app/[lang]/` folder structure for automatic locale routing.
`generateStaticParams()` pre-renders both `/th` and `/en` at build time.
Native `generateMetadata()` handles locale-specific SEO tags.
JSON dictionary files for static content translations.

**Alternatives considered**:
- next-intl: Full-featured but overkill for 2-language static landing page,
  adds unnecessary dependency
- Custom JSON + client hook: Poor SEO due to client-side rendering,
  no static generation support

**URL Structure**:
- `/` → redirects to `/th` (middleware)
- `/th` → Thai version (default)
- `/en` → English version

## R3: Date Picker Component

**Decision**: react-day-picker + date-fns

**Rationale**: Lightweight (~17-18 KB gzipped total). Built-in Thai locale
support via date-fns. Ships unstyled for perfect Tailwind CSS integration.
Mobile-first responsive design. Supports disabling past dates natively.
Runtime locale switching between TH/EN.

**Alternatives considered**:
- Native `<input type="date">`: Inconsistent cross-browser appearance,
  limited Thai locale, cannot be styled with Tailwind
- react-datepicker: 26+ KB gzipped, opinionated styles require overrides,
  overkill for simple date selection

## R4: Google Analytics GA4

**Decision**: @next/third-parties/google

**Rationale**: Official Next.js package, optimized for App Router.
Automatic pageview tracking. `sendGAEvent()` helper for custom events
(form submission, social link clicks). Minimal bundle impact.
Tracking ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable.

**Alternatives considered**:
- react-ga4: Third-party package, not officially supported
- Manual gtag.js: More verbose setup, requires manual pageview tracking

## R5: Framework & Styling

**Decision**: Next.js (App Router) + Tailwind CSS

**Rationale**: Next.js provides SSG for performance, API routes for
email backend, built-in image optimization, and i18n routing.
Tailwind CSS provides utility-first styling, responsive design system,
and small production CSS bundle (only used classes shipped).
Both are industry standard with excellent documentation.

## R6: Structured Data & SEO

**Decision**: JSON-LD for Schema.org LocalBusiness markup

**Rationale**: JSON-LD is Google's recommended format for structured data.
Can be rendered server-side in Next.js `<script>` tags.
LocalBusiness schema includes business name, address, phone, hours,
and service area coverage.

## R7: Deployment Target

**Decision**: Vercel (recommended) or any Node.js hosting

**Rationale**: Vercel is the native deployment target for Next.js.
Free tier supports the project's scale. Automatic HTTPS, CDN,
and serverless functions for the contact form API route.
Alternative: any platform supporting Next.js (Netlify, Railway, etc.)
