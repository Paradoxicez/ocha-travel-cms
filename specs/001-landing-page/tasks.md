# Tasks: Ocha Travel Transport Landing Page

**Input**: Design documents from `/specs/001-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in the feature specification. Manual verification via quickstart.md checklist.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup

**Purpose**: Initialize Next.js project with TypeScript, Tailwind CSS, and all dependencies

- [X] T001 Initialize Next.js project with TypeScript and App Router, install dependencies (next, react, react-dom, tailwindcss, resend, react-day-picker, date-fns, @next/third-parties) at repository root
- [X] T002 [P] Configure tailwind.config.ts with brand colors (#e01d47 primary, #000000, #FFFFFF), Thai-friendly font stack (Noto Sans Thai + system fonts), and responsive breakpoints
- [X] T003 [P] Create .env.example with all environment variables (GMAIL_USER, GMAIL_APP_PASSWORD, BUSINESS_EMAIL, NEXT_PUBLIC_GA_MEASUREMENT_ID, NEXT_PUBLIC_LINE_URL, NEXT_PUBLIC_FACEBOOK_URL, NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_WHATSAPP_URL, NEXT_PUBLIC_MESSENGER_URL, NEXT_PUBLIC_TELEGRAM_URL)
- [X] T004 [P] Configure next.config.ts with image optimization settings for logos/ directory
- [X] T005 [P] Configure ESLint (.eslintrc.json) and Prettier (.prettierrc) with TypeScript and Next.js rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: i18n infrastructure, layout skeleton, and global styles that ALL user stories depend on

- [X] T006 Create Thai translation dictionary in dictionaries/th.json with all sections: meta, nav, hero, about (with trust indicators), services (5 items with names, seats, descriptions), serviceAreas, contact (form labels, validation messages, service types dropdown options, success/error messages), footer
- [X] T007 [P] Create English translation dictionary in dictionaries/en.json mirroring the exact same structure as th.json with all English translations
- [X] T008 Create dictionary loader helper in app/[lang]/dictionaries.ts with getDictionary(lang) function that dynamically imports th.json or en.json, and type definitions for the dictionary schema
- [X] T009 Create locale redirect middleware in middleware.ts that redirects root `/` to `/th`, handles invalid locales (e.g., `/jp`) by redirecting to `/th`, and only matches supported locales (th, en)
- [X] T010 Create top-level layout in app/layout.tsx with basic HTML structure and viewport meta tag
- [X] T011 Create locale-specific layout in app/[lang]/layout.tsx with generateStaticParams for th/en, html lang attribute, font loading (Noto Sans Thai from Google Fonts), GoogleAnalytics component from @next/third-parties, and generateMetadata with locale-specific title and description
- [X] T012 [P] Create global styles in app/globals.css with Tailwind directives (@tailwind base, components, utilities) and any base style overrides for Thai typography

**Checkpoint**: i18n routing works - visiting /th and /en shows correct lang attribute, middleware redirects / to /th

---

## Phase 3: User Story 1 - เรียกดูข้อมูลบริการและติดต่อ (Priority: P1) MVP

**Goal**: Thai customer can view all service information, feel trust, and submit a contact form that sends email to the business owner

**Independent Test**: Open /th, scroll through all sections (hero, about, services, service areas, contact form), fill out and submit the contact form, verify confirmation message and email delivery

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Header component in components/Header.tsx with logo from /logos (using next/image), business name "Ocha Travel Transport", and sticky navigation with anchor links to sections (services, about, contact)
- [X] T014 [P] [US1] Create Hero component in components/Hero.tsx with full-width hero section, tagline from dictionary, and CTA button that smooth-scrolls to contact form section. Use brand color #e01d47 for CTA
- [X] T015 [P] [US1] Create AboutUs component in components/AboutUs.tsx with short business description paragraph and 4 trust indicator cards (experience, trips, 24/7, 77 provinces) displayed as icon + number + label grid
- [X] T016 [P] [US1] Create Services component in components/Services.tsx with 5 service cards (sedan, SUV, VIP van, large van, pickup) showing name, seat count, and description from dictionary. Use responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
- [X] T017 [P] [US1] Create ServiceAreas component in components/ServiceAreas.tsx showing nationwide coverage text with highlighted regions (Bangkok, Eastern Thailand, border areas) from dictionary
- [X] T018 [US1] Create ContactForm component in components/ContactForm.tsx with fields: name (text input), phone (tel input with Thai format validation), email (email input), serviceType (dropdown from dictionary), serviceDate (react-day-picker calendar with date-fns th locale, past dates disabled), message (textarea), honeypot (hidden field). Include client-side validation, submit button disable during request, success/error message display, form state management (idle/submitting/success/error)
- [X] T019 [US1] Implement POST /api/contact API route in app/api/contact/route.ts per contracts/contact-api.md: validate all fields server-side, check honeypot (return fake success if filled), send email via Nodemailer + Gmail SMTP to BUSINESS_EMAIL with formatted HTML body, return JSON response with success/error status
- [X] T020 [US1] Assemble landing page in app/[lang]/page.tsx importing and composing all components in order: Header, Hero, AboutUs, Services, ServiceAreas, ContactForm. Pass dictionary data as props to each component
- [X] T021 [US1] Add Schema.org LocalBusiness structured data as JSON-LD script tag in app/[lang]/layout.tsx with business name, address (168/284 ม.3 ปทุมธานี 12000), phone (0661244999), and service area

**Checkpoint**: Full Thai landing page works at /th - all sections visible, contact form submits and sends email, confirmation shown

---

## Phase 4: User Story 2 - สลับภาษาเป็นภาษาอังกฤษ (Priority: P2)

**Goal**: Foreign visitors can switch to English and see all content translated, submit form with English UI

**Independent Test**: Click language switcher on /th to navigate to /en, verify all text is in English, submit contact form on /en, verify English confirmation message

### Implementation for User Story 2

- [X] T022 [US2] Add language switcher button to Header component in components/Header.tsx that navigates between /th and /en using Next.js Link, showing "EN" when on Thai page and "TH" when on English page
- [X] T023 [US2] Wire dictionary translations into all section components (Hero, AboutUs, Services, ServiceAreas) by accepting dictionary prop and replacing any hardcoded Thai text with dictionary lookups in components/Hero.tsx, components/AboutUs.tsx, components/Services.tsx, components/ServiceAreas.tsx
- [X] T024 [US2] Update ContactForm in components/ContactForm.tsx to use locale-aware labels, validation messages, service type dropdown options, and date picker locale (switch between th and enUS date-fns locales) from dictionary prop
- [X] T025 [US2] Update generateMetadata in app/[lang]/layout.tsx to output locale-specific meta title, description, Open Graph tags (og:title, og:description, og:image, og:url, og:locale), and hreflang alternate links for both /th and /en

**Checkpoint**: Language switcher works, /en shows all English content, form works in both languages, meta tags correct per locale

---

## Phase 5: User Story 3 - เข้าถึง Social Media และช่องทางติดต่อ (Priority: P3)

**Goal**: Users can reach the business via Line, Facebook, Instagram, WhatsApp, Messenger, WeChat, or phone

**Independent Test**: Click each of the 5 social/messaging links and verify they open correct profiles in new tabs. Click phone number on mobile and verify dialer opens with 0661244999

### Implementation for User Story 3

- [X] T026 [P] [US3] Create SocialLinks component in components/SocialLinks.tsx with icon links for all 7 channels (Line, Facebook, Instagram, WhatsApp, Messenger, WeChat, Telegram) + phone (tel: link). Each link opens in new tab (target="_blank" rel="noopener noreferrer") or uses platform deep link. URLs from environment variables (WeChat uses ID: _ochatravel_999, copy-to-clipboard popup). Include GA4 sendGAEvent tracking for each click with platform name
- [X] T027 [US3] Create Footer component in components/Footer.tsx with business address, phone number (clickable tel: link), SocialLinks component, copyright text with current year, and dictionary translations for all text
- [X] T028 [US3] Integrate Footer into page layout by adding it to app/[lang]/page.tsx after ContactForm section, and optionally add SocialLinks to Header for quick access on all viewport sizes
- [X] T029 [US3] Add GA4 event tracking for social link clicks and phone number clicks using sendGAEvent from @next/third-parties/google in components/SocialLinks.tsx (event: social_link_click, params: platform, link_location)

**Checkpoint**: All 6 social links + phone work correctly, open in new tabs, GA4 events fire on click, footer shows complete business info

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: SEO files, performance optimization, analytics, responsive verification

- [X] T030 [P] Create robots.txt in public/robots.txt allowing all crawlers, pointing to sitemap.xml
- [X] T031 [P] Create sitemap.xml in public/sitemap.xml listing /th and /en URLs with lastmod date
- [X] T032 [P] Optimize logo images: copy appropriate logo variants from /logos to /public or use next/image directly, ensure WebP conversion and proper sizing for header display
- [X] T033 Add GA4 custom event tracking for form submission in components/ContactForm.tsx using sendGAEvent (events: form_submission_start, form_submission_success, form_submission_error with form_name and service_type params)
- [X] T034 Verify and adjust responsive design across all components for mobile (320px), tablet (768px), and desktop (1024px+) viewports - ensure touch targets >= 44px for social links and CTA buttons
- [X] T035 Run quickstart.md verification checklist (18 items) to validate all functionality end-to-end

---

## Phase 7: Performance Gallery & Car Showcase

**Purpose**: Add image slideshow for customer service performance photos and car images into Services section

### Implementation

- [X] T036 [P] Create reusable ImageCarousel component in components/ImageCarousel.tsx — accepts array of image paths, supports left/right navigation arrows, dot indicators, responsive (3-4 images per view desktop, 1-2 mobile), lazy loading via next/image with WebP auto-conversion, touch swipe support on mobile
- [X] T037 Create PerformanceGallery component in components/PerformanceGallery.tsx — 3 tabs (ลูกค้าทั่วไป/General Customers, ขนส่ง/Transport, บริการรถตู้/Van Service) each loading images from corresponding `/pics/performance/` subfolder, uses ImageCarousel for each tab content, tab labels from dictionary (TH/EN), lazy loads all images
- [X] T038 Add Performance Gallery translations to dictionaries/th.json and dictionaries/en.json — section title "ผลงานของเรา"/"Our Portfolio", tab labels for 3 categories, alt text templates
- [X] T039 Update Services component in components/Services.tsx — add mini ImageCarousel to service cards that have car images (SUV → `/pics/cars/suv/`, Van 10 → `/pics/cars/van-10seats/`, Van 13 → `/pics/cars/van-13seats/`, VIP → `/pics/cars/van-vip/`), keep icon/text-only cards for Sedan and Pickup
- [X] T040 Integrate PerformanceGallery into page in app/[lang]/page.tsx — add between AboutUs and Services sections (or after Services), pass dictionary data
- [X] T041 Verify responsive layout and performance — test gallery on mobile (320px), tablet (768px), desktop (1024px+), ensure Lighthouse Performance score remains >= 90 with lazy loading, verify all images load correctly

**Checkpoint**: Performance Gallery shows 3 tabbed categories with carousel, Services cards for SUV/Van10/Van13/VIP show car image carousels, Sedan/Pickup remain icon-only, responsive on all viewports

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 (components must exist before adding translations)
- **User Story 3 (Phase 5)**: Depends on Foundational phase; can run in parallel with US2 if desired
- **Polish (Phase 6)**: Depends on all user stories being complete
- **Gallery & Car Showcase (Phase 7)**: Depends on Phase 3 (Services component must exist) and Phase 4 (dictionaries must have i18n structure). T036 can start independently. T037 depends on T036. T039 depends on T036. T040 depends on T037+T039. T041 depends on T040

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates all core components in TH
- **User Story 2 (P2)**: Depends on User Story 1 - Adds i18n to existing components
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Creates SocialLinks and Footer independently. Can be parallelized with US2

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- ContactForm (T018) depends on no other components but is complex - start early
- API route (T019) can be built in parallel with ContactForm
- Page assembly (T020) depends on all components being ready

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005 all run in parallel after T001
- **Phase 2**: T006+T007 in parallel, T012 in parallel with T008-T011
- **Phase 3**: T013, T014, T015, T016, T017 all in parallel; T018+T019 in parallel
- **Phase 5**: T026 can start as soon as Phase 2 is done (independent of US1/US2)
- **Phase 6**: T030, T031, T032 all in parallel
- **Phase 7**: T036 independent; T037+T039 depend on T036 (can run in parallel with each other); T038 parallel with T036; T040 after T037+T039; T041 last

---

## Parallel Example: User Story 1

```bash
# Launch all parallel components for US1 together:
Task: "Create Header component in components/Header.tsx"
Task: "Create Hero component in components/Hero.tsx"
Task: "Create AboutUs component in components/AboutUs.tsx"
Task: "Create Services component in components/Services.tsx"
Task: "Create ServiceAreas component in components/ServiceAreas.tsx"

# Then in parallel:
Task: "Create ContactForm component in components/ContactForm.tsx"
Task: "Implement POST /api/contact API route in app/api/contact/route.ts"

# Then sequential:
Task: "Assemble landing page in app/[lang]/page.tsx"
Task: "Add structured data JSON-LD in app/[lang]/layout.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T012)
3. Complete Phase 3: User Story 1 (T013-T021)
4. **STOP and VALIDATE**: Full Thai landing page with working contact form
5. Deploy/demo if ready - this is a functional MVP

### Incremental Delivery

1. Setup + Foundational -> Infrastructure ready
2. Add User Story 1 -> Thai landing page with contact form (MVP!)
3. Add User Story 2 -> Bilingual TH/EN support
4. Add User Story 3 -> Social media links and footer
5. Polish -> SEO files, analytics, responsive verification
6. Each story adds value without breaking previous stories

### Recommended Execution Order

With a single developer (sequential):

1. Phase 1: Setup (~30 min)
2. Phase 2: Foundational (~1 hr)
3. Phase 3: US1 - Core page + contact form (~3 hrs)
4. Phase 4: US2 - Language switching (~1.5 hrs)
5. Phase 5: US3 - Social links + footer (~1 hr)
6. Phase 6: Polish (~1 hr)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Logo files already exist in /logos directory (4 variants available)
- Contact info: phone 0661244999, address 168/284 ม.3 ปทุมธานี 12000
- Social URLs: Facebook (Ocha.Jirasak), Instagram (mr.ocha999), WhatsApp (wa.me/66661244999), Messenger (m.me/Ocha.Jirasak), Line (lin.ee/A1kdeUD), WeChat ID: _ochatravel_999, Telegram (@Ochataxiservice999)
