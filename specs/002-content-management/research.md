# Research: Content Management System

**Feature**: 002-content-management | **Date**: 2026-03-10

## Technology Decisions

### 1. Database: SQLite via better-sqlite3

**Decision**: SQLite with better-sqlite3 driver
**Rationale**: Single Docker container, single admin user, low write concurrency. No separate DB process needed. File-based — mount Docker volume (`/data/ocha.db`) for persistence. Enable WAL mode to avoid locking issues.
**Alternatives considered**:
- PostgreSQL: Overkill — requires separate container, more memory/config
- Prisma SQLite adapter: Adds generation step and larger bundle

### 2. ORM: Drizzle ORM

**Decision**: Drizzle ORM with better-sqlite3 driver
**Rationale**: Native better-sqlite3 support, zero-generation workflow, tiny bundle (~7.4KB), SQL-like API with full TypeScript type inference. Drizzle Kit for migrations.
**Alternatives considered**:
- Prisma: Generation step friction, larger bundle, edge runtime issues
- Raw SQL: Viable but loses type safety and migration tooling
- Kysely: Good query builder but less ecosystem tooling

### 3. Auth: Auth.js v5 (Credentials + JWT)

**Decision**: Auth.js v5 with Credentials provider and JWT session strategy
**Rationale**: First-class Next.js App Router support (middleware, server components, route handlers). Single admin = Credentials + JWT, no DB session table needed. Built-in CSRF protection, HttpOnly cookies, session management.
**Alternatives considered**:
- Custom JWT middleware: Loses CSRF protection and session rotation
- Clerk/WorkOS: Unnecessary cost for single user

### 4. Image Storage: Local Filesystem + Docker Volume

**Decision**: Store uploads at `/data/uploads/`, serve via Nginx static files
**Rationale**: No cloud costs, single volume mount persists DB + images. Nginx (already in stack) serves static files efficiently. `output: "standalone"` doesn't copy `/public`, so use separate path.
**Alternatives considered**:
- Cloudinary: External dependency + cost for small image count
- S3/MinIO: Over-engineered for single-container deployment

### 5. Image Optimization: Sharp

**Decision**: Sharp for server-side resize/compress on upload
**Rationale**: Next.js recommended, 40-70% file size reduction, WebP/AVIF support. Create thumbnails + web-optimized versions on upload.
**Alternatives considered**:
- Squoosh/wasm: Slower fallback, no advantage over Sharp
- ImageMagick: External binary, harder in Docker

### 6. Admin UI: shadcn/ui

**Decision**: shadcn/ui (Radix UI + Tailwind CSS)
**Rationale**: Copy-paste components (own source code), Tailwind-native (matches existing project), accessible Radix primitives. Project already has `lucide-react`. Pre-built tables, forms, dialogs, toasts cover 90% of admin needs.
**Alternatives considered**:
- Plain Tailwind: Would rebuild modals, dropdowns, forms from scratch
- DaisyUI: Less flexible, theme-based rather than utility-based
- Material UI: Heavy runtime, clashes with Tailwind approach

## Summary Stack

| Concern | Choice | Packages |
|---------|--------|----------|
| Database | SQLite | `better-sqlite3` |
| ORM | Drizzle | `drizzle-orm`, `drizzle-kit` |
| Auth | Auth.js v5 | `next-auth@5` |
| Image Storage | Local filesystem | Docker volume + Nginx |
| Image Optimization | Sharp | `sharp` |
| Admin UI | shadcn/ui | `@radix-ui/*`, copy-paste |
