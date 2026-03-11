# Tasks: Content Management System

**Input**: Design documents from `/specs/002-content-management/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Manual verification via quickstart.md checklist.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Install dependencies and configure database + auth infrastructure

- [ ] T001 Install CMS dependencies: `npm install better-sqlite3 drizzle-orm next-auth@5 sharp bcryptjs` and dev deps `npm install -D drizzle-kit @types/better-sqlite3 @types/bcryptjs`
- [ ] T002 Initialize shadcn/ui: `npx shadcn@latest init` with default style, zinc color, CSS variables. Add base components: `npx shadcn@latest add button input label textarea select card dialog table tabs toast dropdown-menu separator badge`
- [ ] T003 [P] Create Drizzle config in drizzle.config.ts pointing to SQLite at `./data/ocha.db` with schema at `lib/schema.ts`
- [ ] T004 [P] Add CMS environment variables to .env.example and .env.local: AUTH_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD_HASH, DATA_DIR

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Database schema, auth system, and admin layout that ALL user stories depend on

- [ ] T005 Define all Drizzle schema tables in lib/schema.ts: adminUsers, siteSettings, heroContent, aboutContent, trustIndicators, services, serviceImages, galleryCategories, galleryImages, serviceRegions, contactInfo, socialLinks, seoMeta — per data-model.md entity definitions
- [ ] T006 Create database connection singleton in lib/db.ts using better-sqlite3 with WAL mode enabled, Drizzle ORM wrapper, and automatic directory/file creation for data/ocha.db
- [ ] T007 Create seed script in scripts/seed-from-json.ts that reads existing dictionaries/th.json + dictionaries/en.json and inserts all content into database tables (services, about, hero, trust indicators, gallery categories/images from /pics/performance/, service regions, contact info, social links, SEO meta). Run with `npx tsx scripts/seed-from-json.ts`
- [ ] T008 Run `npx drizzle-kit push` to create SQLite tables, then run seed script to populate initial data
- [ ] T009 [P] Configure Auth.js v5 in auth.ts with Credentials provider (username + bcrypt password verification from DB), JWT session strategy, and session callback. Export auth, signIn, signOut handlers
- [ ] T010 [P] Update middleware.ts to protect /admin/* routes (except /admin/login) — redirect unauthenticated users to /admin/login. Keep existing locale redirect logic for public routes
- [ ] T011 Create admin layout in app/admin/layout.tsx with sidebar navigation (links to all admin sections: Dashboard, Hero, About, Services, Gallery, Regions, Contact, SEO, Settings), auth session check, sign out button, responsive sidebar (collapsible on mobile)
- [ ] T012 [P] Create reusable admin components: components/admin/BilingualInput.tsx (paired TH/EN text inputs with labels), components/admin/BilingualTextarea.tsx (paired TH/EN textareas), components/admin/ImageUploader.tsx (drag & drop upload with preview, accepts JPG/PNG/WebP, max 5MB validation, shows upload progress)
- [ ] T013 [P] Create image upload API route in app/api/admin/upload/route.ts: accept multipart/form-data, validate file type (JPG/PNG/WebP) and size (<=5MB), process with Sharp (resize max 1920px width, convert to WebP, quality 80), save to data/uploads/ with unique filename, return path + dimensions
- [ ] T014 Create admin login page in app/admin/login/page.tsx with username + password form, error display for invalid credentials, redirect to /admin on success. Use shadcn/ui Card, Input, Button components

**Checkpoint**: Database has all tables with seeded data, admin login works at /admin/login, protected routes redirect to login, admin layout shows sidebar navigation

---

## Phase 3: User Story 1 - Admin อัพเดทข้อมูลบริการ (Priority: P1) MVP

**Goal**: Admin can add, edit, delete, and reorder services with images through the dashboard

**Independent Test**: Login at /admin, go to Services, add a new service with TH/EN name + description + images, verify it appears. Edit an existing service, verify changes. Delete a service, verify it's gone. Reorder services, verify new order.

### Implementation for User Story 1

- [ ] T015 [US1] Create services CRUD API routes: app/api/admin/services/route.ts (GET all sorted by sort_order, POST create new service), app/api/admin/services/[id]/route.ts (PUT update, DELETE with cascade images), app/api/admin/services/reorder/route.ts (PUT update sort_order from ids array)
- [ ] T016 [US1] Create service images API routes: app/api/admin/services/[id]/images/route.ts (GET images for service, POST upload + attach image), app/api/admin/services/[id]/images/[imageId]/route.ts (DELETE image + file), app/api/admin/services/[id]/images/reorder/route.ts (PUT reorder)
- [ ] T017 [US1] Create services list page in app/admin/services/page.tsx: data table showing all services (name TH, name EN, seats, active status, image count, sort order), add new service button (opens dialog), drag-to-reorder, toggle active, delete with confirmation dialog
- [ ] T018 [US1] Create single service edit page in app/admin/services/[id]/page.tsx: BilingualInput for name, BilingualTextarea for description, seats input, slug input, active toggle, image gallery with ImageUploader + drag-to-reorder + delete, save button

**Checkpoint**: Admin can fully manage services — create, edit, delete, reorder, manage images per service

---

## Phase 4: User Story 2 - Admin จัดการรูปภาพ Gallery (Priority: P1)

**Goal**: Admin can manage gallery categories and upload/delete/reorder images within each category

**Independent Test**: Login at /admin, go to Gallery, create a new category, upload images, reorder them, delete one. Verify all actions persist.

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create gallery categories CRUD API routes: app/api/admin/gallery-categories/route.ts (GET all with image counts, POST create), app/api/admin/gallery-categories/[id]/route.ts (PUT update, DELETE cascade images)
- [ ] T020 [P] [US2] Create gallery images API routes: app/api/admin/gallery-categories/[id]/images/route.ts (GET images, POST upload), app/api/admin/gallery-categories/[id]/images/[imageId]/route.ts (DELETE image + file), app/api/admin/gallery-categories/[id]/images/reorder/route.ts (PUT reorder)
- [ ] T021 [US2] Create gallery categories list page in app/admin/gallery/page.tsx: cards for each category showing name TH/EN, image count, thumbnail preview. Add category button, edit name dialog, delete with confirmation
- [ ] T022 [US2] Create gallery category images page in app/admin/gallery/[id]/page.tsx: grid of images with drag-to-reorder, ImageUploader for batch upload, delete individual images, alt text editing (TH/EN)

**Checkpoint**: Admin can fully manage gallery — create/edit/delete categories, upload/reorder/delete images per category

---

## Phase 5: User Story 3 - Admin แก้ไขข้อมูลทั่วไป (Priority: P2)

**Goal**: Admin can edit all text content sections (Hero, About, Contact, SEO, Settings) and manage social links

**Independent Test**: Login at /admin, edit Hero tagline, save, verify change. Edit About description, save. Edit contact phone, save. Toggle a social link off, save. Edit SEO title, save.

### Implementation for User Story 3

- [ ] T023 [P] [US3] Create singleton content API routes: app/api/admin/hero/route.ts (GET/PUT), app/api/admin/about/route.ts (GET/PUT), app/api/admin/contact-info/route.ts (GET/PUT), app/api/admin/seo/route.ts (GET/PUT), app/api/admin/site-settings/route.ts (GET/PUT)
- [ ] T024 [P] [US3] Create trust indicators CRUD API routes: app/api/admin/trust-indicators/route.ts (GET/POST), app/api/admin/trust-indicators/[id]/route.ts (PUT/DELETE), app/api/admin/trust-indicators/reorder/route.ts (PUT reorder)
- [ ] T025 [P] [US3] Create social links CRUD API routes: app/api/admin/social-links/route.ts (GET/POST), app/api/admin/social-links/[id]/route.ts (PUT/DELETE with active toggle), app/api/admin/social-links/reorder/route.ts (PUT reorder)
- [ ] T026 [P] [US3] Create service regions CRUD API routes: app/api/admin/service-regions/route.ts (GET/POST), app/api/admin/service-regions/[id]/route.ts (PUT/DELETE), app/api/admin/service-regions/reorder/route.ts (PUT reorder)
- [ ] T027 [US3] Create Hero edit page in app/admin/hero/page.tsx: BilingualInput for title_main, title_accent, subtitle, cta_text. Image upload for background. Save button with success toast
- [ ] T028 [US3] Create About edit page in app/admin/about/page.tsx: BilingualInput for title, BilingualTextarea for description. Trust indicators list below with add/edit/delete/reorder (icon selector, value input, BilingualInput for label)
- [ ] T029 [US3] Create Contact edit page in app/admin/contact/page.tsx: phone input, BilingualTextarea for address, email input. Social links management below: list with platform, URL, active toggle, add/delete/reorder
- [ ] T030 [US3] Create SEO edit page in app/admin/seo/page.tsx: BilingualInput for title, BilingualTextarea for description, image upload for OG image
- [ ] T031 [US3] Create Settings edit page in app/admin/settings/page.tsx: BilingualInput for business_name and tagline, logo upload, color pickers for primary/secondary colors
- [ ] T032 [US3] Create Service Regions edit page in app/admin/regions/page.tsx: list of regions with BilingualInput for name, editable province lists (TH/EN as comma-separated or tag input), add/delete/reorder regions

**Checkpoint**: Admin can edit all text content, manage trust indicators, social links, regions, SEO, and site settings

---

## Phase 6: User Story 4 - Frontend Migration (Priority: P2)

**Goal**: Public website reads content from database instead of static JSON dictionaries

**Independent Test**: Edit content in admin dashboard, wait 60 seconds (or trigger revalidation), verify frontend shows updated content without Docker rebuild

### Implementation for User Story 4

- [ ] T033 [US4] Create public content API route in app/api/content/route.ts that queries all DB tables and returns complete content JSON (settings, hero, about + indicators, services + images, gallery + images, regions, contact, social links, SEO). Add Cache-Control headers for ISR (60s stale-while-revalidate)
- [ ] T034 [US4] Create content fetching utility in lib/content.ts with `getContent(lang: 'th' | 'en')` function that calls /api/content and maps bilingual fields to the requested language. Include revalidation tag for on-demand cache invalidation
- [ ] T035 [US4] Update app/[lang]/page.tsx to fetch content from database via lib/content.ts instead of dictionary imports. Pass DB content to all section components. Keep dictionary for UI strings (nav labels, form labels, validation messages)
- [ ] T036 [P] [US4] Update components/Hero.tsx to accept content props from DB instead of dictionary. Map DB fields (title_main, title_accent, subtitle, cta_text) to existing component props
- [ ] T037 [P] [US4] Update components/AboutUs.tsx to accept content props from DB. Trust indicators from DB array instead of hardcoded dictionary entries
- [ ] T038 [P] [US4] Update components/Services.tsx to accept services array from DB with dynamic images per service (from ServiceImage records) instead of hardcoded image arrays
- [ ] T039 [P] [US4] Update components/PerformanceGallery.tsx to accept gallery categories + images from DB instead of hardcoded image lists and tab names
- [ ] T040 [P] [US4] Update components/ServiceAreas.tsx to accept regions from DB instead of hardcoded province lists in dictionary
- [ ] T041 [P] [US4] Update components/Footer.tsx, components/SocialLinks.tsx, components/FloatingButtons.tsx to read social links from DB (active links only, sorted by sort_order) instead of environment variables
- [ ] T042 [P] [US4] Update components/Header.tsx to read business name + tagline from DB instead of dictionary brand section
- [ ] T043 [US4] Update components/ContactForm.tsx to read service types for dropdown from DB (active services only) instead of hardcoded dictionary options
- [ ] T044 [US4] Update app/[lang]/layout.tsx generateMetadata to read SEO meta (title, description, OG image) from DB instead of dictionary meta section
- [ ] T045 [US4] Add revalidatePath/revalidateTag calls to all admin API PUT/POST/DELETE routes so frontend updates immediately after admin saves content

**Checkpoint**: Frontend displays all content from database. Admin edits show on frontend within seconds. No Docker rebuild needed for content changes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Docker config, cleanup, and final verification

- [ ] T046 [P] Update Dockerfile to install Sharp (add `RUN npm install sharp` in deps stage), create /data directory with correct permissions for nextjs user
- [ ] T047 [P] Update docker-compose.yml to add named volume `ocha-data:/data` for both ocha-cms service, and update nginx service to serve /data/uploads/ as static files
- [ ] T048 [P] Update nginx/nginx.conf to add `location /uploads/ { alias /data/uploads/; expires 30d; }` for serving uploaded images
- [ ] T049 Create admin dashboard home page in app/admin/page.tsx showing content summary: total services, total gallery images, last updated timestamps, quick links to each section
- [ ] T050 Clean up dictionaries/th.json and dictionaries/en.json — remove content data that is now in DB (hero content, about description, service details, region lists, contact details). Keep only UI strings (nav labels, form labels, validation messages, button texts)
- [ ] T051 Add admin password setup script in scripts/create-admin.ts that prompts for username + password, bcrypt hashes the password, and inserts/updates admin_users table. Run with `npx tsx scripts/create-admin.ts`
- [ ] T052 Run quickstart.md verification checklist (15 items) to validate all CMS functionality end-to-end
- [ ] T053 Update .dockerignore to exclude /data directory from Docker build context

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase. Services CRUD.
- **User Story 2 (Phase 4)**: Depends on Foundational phase. Can run in parallel with US1.
- **User Story 3 (Phase 5)**: Depends on Foundational phase. Can run in parallel with US1/US2.
- **User Story 4 (Phase 6)**: Depends on US1 + US2 + US3 (admin APIs must exist before frontend can consume them)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — independent
- **User Story 2 (P1)**: Can start after Phase 2 — independent, parallel with US1
- **User Story 3 (P2)**: Can start after Phase 2 — independent, parallel with US1/US2
- **User Story 4 (P2)**: DEPENDS on US1 + US2 + US3 — frontend migration needs all APIs ready

### Within Each User Story

- API routes before admin pages (pages consume APIs)
- List/index pages before detail/edit pages
- Core CRUD before reorder functionality

### Parallel Opportunities

- **Phase 1**: T003, T004 in parallel after T001+T002
- **Phase 2**: T009, T010, T012, T013 in parallel after T005+T006. T007 after T005+T006. T008 after T007. T011 after T009+T010. T014 after T009+T010.
- **Phase 3-5**: US1 (T015-T018), US2 (T019-T022), US3 (T023-T032) can all run in parallel
- **Phase 6**: T036-T042 all in parallel (different component files)
- **Phase 7**: T046, T047, T048, T053 in parallel

---

## Parallel Example: User Stories 1 + 2 + 3

```bash
# After Phase 2 completes, launch all three stories in parallel:

# US1: Services
Task: "Create services CRUD API routes"
Task: "Create service images API routes"
Task: "Create services list page"
Task: "Create service edit page"

# US2: Gallery (parallel with US1)
Task: "Create gallery categories CRUD API routes"
Task: "Create gallery images API routes"
Task: "Create gallery list page"
Task: "Create gallery images page"

# US3: Content sections (parallel with US1+US2)
Task: "Create singleton content API routes"
Task: "Create trust indicators API routes"
Task: "Create social links API routes"
Task: "Create Hero/About/Contact/SEO/Settings admin pages"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T014)
3. Complete Phase 3: User Story 1 — Services CRUD (T015-T018)
4. **STOP and VALIDATE**: Admin can manage services through dashboard
5. Deploy if ready — this is a functional MVP

### Incremental Delivery

1. Setup + Foundational → Infrastructure ready
2. Add US1 → Services management (MVP!)
3. Add US2 → Gallery management
4. Add US3 → All content sections management
5. Add US4 → Frontend reads from DB (full CMS!)
6. Polish → Docker, cleanup, verification

### Recommended Execution Order (Single Developer)

1. Phase 1: Setup (~30 min)
2. Phase 2: Foundational (~3 hrs)
3. Phase 3: US1 — Services (~2 hrs)
4. Phase 4: US2 — Gallery (~1.5 hrs)
5. Phase 5: US3 — Content sections (~3 hrs)
6. Phase 6: US4 — Frontend migration (~3 hrs)
7. Phase 7: Polish (~1 hr)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- JSON dictionaries will still hold UI strings (nav, form labels, validation messages)
- Only content data moves to database
- Existing /pics/* images referenced as-is; new uploads go to /data/uploads/
- ISR with 60s revalidation + on-demand revalidateTag for instant admin updates
- shadcn/ui toast for all save/delete/error feedback in admin
- All admin API routes check auth session before processing
