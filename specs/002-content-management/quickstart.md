# Quickstart: Content Management System

**Feature**: 002-content-management | **Date**: 2026-03-10

## Prerequisites

- Node.js 20+
- Existing 001-landing-page fully working
- `.env.local` with existing config

## Setup Steps

### 1. Install Dependencies
```bash
npm install better-sqlite3 drizzle-orm next-auth@5 sharp
npm install -D drizzle-kit @types/better-sqlite3
npx shadcn@latest init  # Choose: default style, zinc color, CSS variables
```

### 2. Environment Variables
Add to `.env.local`:
```
AUTH_SECRET=<generate with: npx auth secret>
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<bcrypt hash of chosen password>
DATA_DIR=/data
```

### 3. Database Setup
```bash
npx drizzle-kit push  # Create/update SQLite tables
npx tsx scripts/seed-from-json.ts  # Migrate existing content
```

### 4. Docker Volume
Update `docker-compose.yml` to mount data volume:
```yaml
volumes:
  - ocha-data:/data
```

### 5. Nginx Static Serving
Add to `nginx.conf`:
```nginx
location /uploads/ {
    alias /data/uploads/;
    expires 30d;
    add_header Cache-Control "public";
}
```

## Verification Checklist

- [ ] `npx tsc --noEmit` passes
- [ ] Admin login at `/admin` works
- [ ] Can edit Hero text → shows on frontend within 60s
- [ ] Can add new service with image → shows on frontend
- [ ] Can upload gallery images → shows in carousel
- [ ] Can toggle social link on/off → updates frontend
- [ ] Can edit contact info → updates footer
- [ ] Can edit SEO meta → updates page meta tags
- [ ] Image upload resizes to max 1920px and converts to WebP
- [ ] Uploaded images > 5MB rejected with error
- [ ] Unauthenticated access to /admin redirects to login
- [ ] Frontend Lighthouse Performance >= 85
- [ ] Existing content from JSON fully migrated to DB
- [ ] Frontend works with database content (no JSON fallback needed)
- [ ] Docker build succeeds with data volume mounted
