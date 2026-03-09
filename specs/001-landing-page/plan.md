# Implementation Plan: Ocha Travel Transport Landing Page

**Branch**: `001-landing-page` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-landing-page/spec.md`

## Summary

Build a bilingual (TH/EN) single-page landing page for Ocha Travel Transport,
a Thai transportation business. The page showcases vehicle rental services,
displays trust signals, and provides a contact form that sends inquiries
directly to the business owner's email. Built with Next.js App Router,
Tailwind CSS, and Nodemailer + Gmail SMTP for email delivery. Deployed
via Docker + Nginx reverse proxy with Cloudflare SSL.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Next.js (App Router), Tailwind CSS, Nodemailer, react-day-picker, date-fns, @next/third-parties
**Storage**: N/A (no database; static content + transient email delivery)
**Testing**: Manual verification per quickstart checklist
**Target Platform**: Web (all modern browsers: Chrome, Safari, Firefox, Edge)
**Project Type**: Static landing page with serverless API route
**Performance Goals**: Lighthouse Performance >= 90, page load < 3s on 4G
**Constraints**: Page weight < 1MB (excl. images), HTTPS only, mobile-first
**Scale/Scope**: Single page, 2 locales, ~5 sections, 1 API route, < 100 form submissions/month

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity First | PASS | Single-page, minimal dependencies (Next.js + Tailwind + 3 small libs), no database, no auth, no complex state management |
| II. Bilingual by Default | PASS | Built-in Next.js i18n via `[lang]` routing, JSON dictionaries, TH default, locale-specific meta tags |
| III. Trustworthy Design | PASS | Professional layout with trust indicators section, consistent color scheme (#e01d47/black/white), real business logos |
| IV. Responsive & Accessible | PASS | Tailwind CSS responsive utilities, mobile-first approach, semantic HTML, touch-friendly social links |
| V. Secure Contact | PASS | Server-side email via Nodemailer + Gmail SMTP (email never exposed), honeypot spam protection, input validation, submit-disable UX |
| Technology Constraints | PASS | Lighthouse target >= 90 achievable with SSG, images optimized via next/image, HTTPS via Cloudflare SSL + Nginx |
| Development Workflow | PASS | ESLint + Prettier for linting, env variables for secrets, image optimization built-in |

**Post-Phase 1 re-check**: All gates still PASS. No violations detected.

## Project Structure

### Documentation (this feature)

```text
specs/001-landing-page/
├── plan.md              # This file
├── research.md          # Phase 0: technology decisions
├── data-model.md        # Phase 1: entities and data shapes
├── quickstart.md        # Phase 1: setup and verification guide
├── contracts/
│   └── contact-api.md   # Phase 1: contact form API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
app/
├── [lang]/
│   ├── layout.tsx           # Root layout (html lang, fonts, GA4)
│   ├── page.tsx             # Landing page (all sections)
│   └── dictionaries.ts     # Dictionary loader helper
├── api/
│   └── contact/
│       └── route.ts         # POST /api/contact (email via Resend)
├── globals.css              # Tailwind base styles
├── layout.tsx               # Top-level layout (metadata defaults)
└── favicon.ico

components/
├── Header.tsx               # Logo + language switcher + nav
├── Hero.tsx                 # Hero section with CTA
├── AboutUs.tsx              # About + trust indicators
├── PerformanceGallery.tsx   # Tab + carousel gallery for customer service photos
├── ImageCarousel.tsx        # Reusable carousel component (used by PerformanceGallery + Services)
├── Services.tsx             # Service cards (5 types, with car image carousels)
├── ServiceAreas.tsx         # Coverage map/list
├── ContactForm.tsx          # Form with validation + date picker
├── Footer.tsx               # Address, social links, copyright
└── SocialLinks.tsx          # Social/messaging icon links

dictionaries/
├── th.json                  # Thai translations
└── en.json                  # English translations

logos/                       # Existing logo files (already in repo)
├── Ocha-Full_0.png
├── Ocha-Full-2_0.png
├── Ocha-Symbol-Only_0.png
└── ocha-symbol_0.png

public/
├── robots.txt
└── sitemap.xml

middleware.ts                # Redirect / → /th
tailwind.config.ts           # Theme colors, fonts
next.config.ts               # Next.js configuration
.env.example                 # Environment variable template
```

**Structure Decision**: Single project structure. No separate backend/frontend
split needed because Next.js handles both static pages (SSG) and the API
route (serverless) in a unified codebase. This is the simplest architecture
for a landing page with one API endpoint.

## Complexity Tracking

> No Constitution Check violations. No complexity justification needed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | — | — |
