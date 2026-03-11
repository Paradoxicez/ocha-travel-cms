# Implementation Plan: Content Management System

**Branch**: `002-content-management` | **Date**: 2026-03-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-content-management/spec.md`

## Summary

Add an Admin Dashboard to the existing Ocha Travel landing page, allowing the
business owner to update all website content (hero, about, services, gallery,
service areas, contact info, SEO, social links) without code changes or Docker
rebuilds. Uses SQLite + Drizzle ORM for data, Auth.js v5 for login, Sharp for
image optimization, and shadcn/ui for the admin interface.

## Technical Context

**Language/Version**: TypeScript 5.x, Node.js 20+
**Primary Dependencies**: Next.js (App Router), Tailwind CSS, Drizzle ORM, better-sqlite3, next-auth@5, sharp, shadcn/ui
**Storage**: SQLite (file-based, Docker volume at `/data/ocha.db`) + local filesystem for images (`/data/uploads/`)
**Testing**: Manual verification per quickstart.md checklist
**Target Platform**: Web (all modern browsers: Chrome, Safari, Firefox, Edge)
**Project Type**: Full-stack web application (landing page + admin CMS)
**Performance Goals**: Admin dashboard < 2s load, frontend Lighthouse >= 85, image upload < 10s
**Constraints**: Single Docker container, single volume mount (`/data`), single admin user
**Scale/Scope**: ~12 admin pages, ~15 API routes, ~12 DB tables, 1 admin user

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Simplicity First | PASS with justification | CMS adds complexity but fulfills clear need — owner cannot update content without it. Minimal stack (SQLite, no external services). See Complexity Tracking. |
| II. Bilingual by Default | PASS | All CMS fields have TH/EN pairs. Admin can edit both languages for every content section. |
| III. Trustworthy Design | PASS | Admin dashboard is separate from public site. Content updates reflect immediately. No broken links from dynamic content (validation enforced). |
| IV. Responsive & Accessible | PASS | Admin dashboard uses shadcn/ui (Radix primitives = accessible). Dashboard is responsive for mobile use. |
| V. Secure Contact | PASS | Contact form continues to work. Service types in dropdown now come from DB (always in sync with admin edits). |
| Technology Constraints | PASS | Frontend Lighthouse target adjusted to >= 85 (from 90) due to dynamic rendering. Still fast with ISR caching. |
| Development Workflow | PASS | Drizzle Kit for migrations, TypeScript types, env vars for secrets, Sharp for image optimization. |

**Post-Phase 1 re-check**: All gates PASS.

## Project Structure

### Documentation (this feature)

```text
specs/002-content-management/
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Database entities and relationships
├── quickstart.md        # Setup and verification guide
├── contracts/
│   └── admin-api.md     # Admin API contract
└── tasks.md             # Implementation tasks (from /speckit.tasks)
```

### Source Code (repository root)

```text
# Database & ORM
lib/
├── db.ts                    # Database connection (better-sqlite3 + Drizzle)
├── schema.ts                # Drizzle table definitions (all entities)
└── seed.ts                  # Seed script: JSON dictionaries → DB

drizzle.config.ts             # Drizzle Kit configuration
scripts/
└── seed-from-json.ts         # CLI entry point for seeding

# Authentication
auth.ts                       # Auth.js v5 configuration (Credentials + JWT)
middleware.ts                  # Updated: add /admin/* protection

# Admin Dashboard (App Router)
app/
├── admin/
│   ├── layout.tsx            # Admin layout (sidebar nav, auth check)
│   ├── page.tsx              # Dashboard home
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── hero/
│   │   └── page.tsx          # Edit hero content
│   ├── about/
│   │   └── page.tsx          # Edit about + trust indicators
│   ├── services/
│   │   ├── page.tsx          # Service list + CRUD
│   │   └── [id]/
│   │       └── page.tsx      # Edit single service + images
│   ├── gallery/
│   │   ├── page.tsx          # Gallery categories list
│   │   └── [id]/
│   │       └── page.tsx      # Manage images in category
│   ├── regions/
│   │   └── page.tsx          # Edit service regions
│   ├── contact/
│   │   └── page.tsx          # Edit contact info + social links
│   ├── seo/
│   │   └── page.tsx          # Edit SEO meta tags
│   └── settings/
│       └── page.tsx          # Site settings (name, logo, colors)

# Admin API Routes
app/api/admin/
├── site-settings/
│   └── route.ts              # GET/PUT site settings
├── hero/
│   └── route.ts              # GET/PUT hero content
├── about/
│   └── route.ts              # GET/PUT about content
├── trust-indicators/
│   ├── route.ts              # GET/POST trust indicators
│   ├── [id]/
│   │   └── route.ts          # PUT/DELETE single indicator
│   └── reorder/
│       └── route.ts          # PUT reorder
├── services/
│   ├── route.ts              # GET/POST services
│   ├── [id]/
│   │   ├── route.ts          # PUT/DELETE single service
│   │   └── images/
│   │       ├── route.ts      # GET/POST service images
│   │       ├── [imageId]/
│   │       │   └── route.ts  # DELETE single image
│   │       └── reorder/
│   │           └── route.ts  # PUT reorder images
│   └── reorder/
│       └── route.ts          # PUT reorder services
├── gallery-categories/
│   ├── route.ts              # GET/POST categories
│   ├── [id]/
│   │   ├── route.ts          # PUT/DELETE single category
│   │   └── images/
│   │       ├── route.ts      # GET/POST gallery images
│   │       ├── [imageId]/
│   │       │   └── route.ts  # DELETE single image
│   │       └── reorder/
│   │           └── route.ts  # PUT reorder images
├── service-regions/
│   ├── route.ts              # GET/POST regions
│   ├── [id]/
│   │   └── route.ts          # PUT/DELETE single region
│   └── reorder/
│       └── route.ts          # PUT reorder
├── social-links/
│   ├── route.ts              # GET/POST social links
│   ├── [id]/
│   │   └── route.ts          # PUT/DELETE single link
│   └── reorder/
│       └── route.ts          # PUT reorder
├── contact-info/
│   └── route.ts              # GET/PUT contact info
├── seo/
│   └── route.ts              # GET/PUT SEO meta
└── upload/
    └── route.ts              # POST image upload (multipart)

# Public Content API
app/api/content/
└── route.ts                  # GET all content for frontend (cached)

# Admin UI Components (shadcn/ui based)
components/admin/
├── AdminSidebar.tsx          # Navigation sidebar
├── BilingualInput.tsx        # TH/EN text input pair
├── ImageUploader.tsx         # Drag & drop image upload
├── SortableList.tsx          # Drag & drop reorderable list
└── DataTable.tsx             # Generic data table

# Updated Frontend Components
# (Change from static JSON → DB content)
components/
├── Header.tsx                # Updated: read from DB
├── Hero.tsx                  # Updated: read from DB
├── AboutUs.tsx               # Updated: read from DB
├── Services.tsx              # Updated: read from DB
├── PerformanceGallery.tsx    # Updated: read from DB
├── ServiceAreas.tsx          # Updated: read from DB
├── ContactForm.tsx           # Updated: service types from DB
├── Footer.tsx                # Updated: read from DB
├── SocialLinks.tsx           # Updated: read from DB
└── FloatingButtons.tsx       # Updated: read from DB
```

**Structure Decision**: Single Next.js project. Admin dashboard uses App Router
route groups under `/admin/*`. API routes under `/api/admin/*`. Same deployment,
same Docker container. Database and uploads persist via Docker volume.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Database added (SQLite) | Owner needs to update content without code changes | JSON file editing requires rebuild + redeploy every time |
| Auth added (Auth.js) | Admin dashboard must be protected | No auth = anyone can edit site content |
| ORM added (Drizzle) | Type-safe DB access, migrations | Raw SQL loses type safety and migration tooling |
| UI library added (shadcn/ui) | Admin dashboard needs forms, tables, modals | Building from scratch wastes time on solved problems |

## Migration Strategy

### Phase A: Database Setup (non-breaking)
1. Add SQLite + Drizzle + schema
2. Create seed script from existing JSON
3. Add `/api/content` endpoint
4. Frontend still reads JSON (unchanged)

### Phase B: Admin Dashboard (additive)
1. Add Auth.js + login page
2. Build admin pages one section at a time
3. Each admin page manages one DB table
4. Frontend still reads JSON

### Phase C: Frontend Migration (switch)
1. Change frontend components to read from `/api/content` (ISR)
2. Remove direct JSON dictionary reads for content (keep for UI labels/form labels)
3. Verify all content displays correctly from DB

### Phase D: Cleanup
1. Remove content data from dictionaries (keep UI strings only)
2. Update Docker config for data volume
3. Update Nginx for uploads serving

## Notes

- JSON dictionaries will still hold **UI strings** (button labels, form labels, validation messages, nav items) — only **content** moves to DB
- Existing `/pics/` images can be referenced from DB as-is; new uploads go to `/data/uploads/`
- ISR (Incremental Static Regeneration) with 60s revalidation balances freshness vs performance
- `revalidatePath` can be called from admin API routes for instant updates
