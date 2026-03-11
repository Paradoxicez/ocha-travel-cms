# Admin API Contract

**Feature**: 002-content-management | **Date**: 2026-03-10

All endpoints require authenticated session (Auth.js JWT cookie). Unauthenticated requests return `401`.

## Authentication

### POST /api/auth/signin
Auth.js built-in endpoint. Credentials provider with username + password.

### POST /api/auth/signout
Auth.js built-in endpoint. Clears session.

### GET /api/auth/session
Auth.js built-in endpoint. Returns current session or null.

---

## Content APIs

Base path: `/api/admin`

### Singleton Resources (GET + PUT)

These resources have only one record (site-wide settings).

#### GET/PUT /api/admin/site-settings
```json
{
  "business_name_th": "string",
  "business_name_en": "string",
  "tagline_th": "string",
  "tagline_en": "string",
  "logo_path": "string | null",
  "primary_color": "#RRGGBB",
  "secondary_color": "#RRGGBB"
}
```

#### GET/PUT /api/admin/hero
```json
{
  "title_main_th": "string",
  "title_main_en": "string",
  "title_accent_th": "string | null",
  "title_accent_en": "string | null",
  "subtitle_th": "string",
  "subtitle_en": "string",
  "cta_text_th": "string",
  "cta_text_en": "string",
  "bg_image_path": "string | null"
}
```

#### GET/PUT /api/admin/about
```json
{
  "title_th": "string",
  "title_en": "string",
  "description_th": "string",
  "description_en": "string"
}
```

#### GET/PUT /api/admin/contact-info
```json
{
  "phone": "string",
  "address_th": "string",
  "address_en": "string",
  "email": "string"
}
```

#### GET/PUT /api/admin/seo
```json
{
  "title_th": "string",
  "title_en": "string",
  "description_th": "string",
  "description_en": "string",
  "og_image_path": "string | null"
}
```

### Collection Resources (CRUD)

#### /api/admin/services
- **GET**: Returns all services sorted by `sort_order`
- **POST**: Create new service → returns created service with `id`
- **PUT /api/admin/services/[id]**: Update service
- **DELETE /api/admin/services/[id]**: Delete service + cascade images
- **PUT /api/admin/services/reorder**: `{ "ids": [3, 1, 2] }` → update sort_order

#### /api/admin/services/[id]/images
- **GET**: Returns images for service
- **POST**: Upload image (multipart/form-data, field: `file`) → returns image record
- **DELETE /api/admin/services/[id]/images/[imageId]**: Delete image + file
- **PUT /api/admin/services/[id]/images/reorder**: `{ "ids": [5, 3, 1] }`

#### /api/admin/trust-indicators
- **GET**: Returns all indicators sorted by `sort_order`
- **POST**: Create new indicator
- **PUT /api/admin/trust-indicators/[id]**: Update indicator
- **DELETE /api/admin/trust-indicators/[id]**: Delete indicator
- **PUT /api/admin/trust-indicators/reorder**: `{ "ids": [2, 1, 3] }`

#### /api/admin/gallery-categories
- **GET**: Returns all categories with image count
- **POST**: Create category
- **PUT /api/admin/gallery-categories/[id]**: Update category
- **DELETE /api/admin/gallery-categories/[id]**: Delete category + cascade images

#### /api/admin/gallery-categories/[id]/images
- **GET**: Returns images for category
- **POST**: Upload image (multipart/form-data)
- **DELETE /api/admin/gallery-categories/[id]/images/[imageId]**: Delete image
- **PUT /api/admin/gallery-categories/[id]/images/reorder**: `{ "ids": [...] }`

#### /api/admin/service-regions
- **GET**: Returns all regions
- **POST**: Create region
- **PUT /api/admin/service-regions/[id]**: Update region
- **DELETE /api/admin/service-regions/[id]**: Delete region
- **PUT /api/admin/service-regions/reorder**: `{ "ids": [...] }`

#### /api/admin/social-links
- **GET**: Returns all social links
- **POST**: Create social link
- **PUT /api/admin/social-links/[id]**: Update (including toggle active)
- **DELETE /api/admin/social-links/[id]**: Delete social link
- **PUT /api/admin/social-links/reorder**: `{ "ids": [...] }`

---

## Image Upload

### POST /api/admin/upload
- **Content-Type**: `multipart/form-data`
- **Field**: `file` (single file)
- **Accepted**: JPG, PNG, WebP
- **Max size**: 5MB
- **Response**: `{ "path": "/data/uploads/abc123.webp", "width": 800, "height": 600 }`
- **Processing**: Sharp auto-resize (max 1920px width), convert to WebP, compress quality 80

---

## Public Content API (Frontend)

### GET /api/content
Returns all content for the public website in a single response (for ISR/SSR).

```json
{
  "settings": { ... },
  "hero": { ... },
  "about": { ..., "indicators": [...] },
  "services": [{ ..., "images": [...] }],
  "gallery": [{ ..., "images": [...] }],
  "regions": [...],
  "contact": { ... },
  "social_links": [...],
  "seo": { ... }
}
```

Cache: ISR with 60-second revalidation or on-demand revalidation via `revalidatePath`.

---

## Standard Response Format

**Success**: `{ "success": true, "data": ... }`
**Error**: `{ "success": false, "error": "message" }` with appropriate HTTP status
- 400: Validation error
- 401: Not authenticated
- 404: Resource not found
- 413: File too large
- 415: Unsupported file type
- 500: Server error
