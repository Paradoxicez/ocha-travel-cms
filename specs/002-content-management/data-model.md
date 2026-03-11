# Data Model: Content Management System

**Feature**: 002-content-management | **Date**: 2026-03-10

## Entity Relationship Overview

```
AdminUser (1)
SiteSettings (1)
HeroContent (1)
AboutContent (1)
  └── TrustIndicator (many)
GalleryCategory (many)
  └── GalleryImage (many)
Service (many)
  └── ServiceImage (many)
ServiceRegion (many)
ContactInfo (1)
SocialLink (many)
SeoMeta (1)
```

## Entities

### AdminUser

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| username | TEXT | UNIQUE, NOT NULL |
| password_hash | TEXT | NOT NULL |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

### SiteSettings

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, default 1 |
| business_name_th | TEXT | NOT NULL |
| business_name_en | TEXT | NOT NULL |
| tagline_th | TEXT | NOT NULL |
| tagline_en | TEXT | NOT NULL |
| logo_path | TEXT | nullable |
| primary_color | TEXT | NOT NULL, default '#E11D48' |
| secondary_color | TEXT | NOT NULL, default '#000000' |
| updated_at | TEXT | ISO 8601 |

### HeroContent

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, default 1 |
| title_main_th | TEXT | NOT NULL |
| title_main_en | TEXT | NOT NULL |
| title_accent_th | TEXT | nullable |
| title_accent_en | TEXT | nullable |
| subtitle_th | TEXT | NOT NULL |
| subtitle_en | TEXT | NOT NULL |
| cta_text_th | TEXT | NOT NULL |
| cta_text_en | TEXT | NOT NULL |
| bg_image_path | TEXT | nullable |
| updated_at | TEXT | ISO 8601 |

### AboutContent

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, default 1 |
| title_th | TEXT | NOT NULL |
| title_en | TEXT | NOT NULL |
| description_th | TEXT | NOT NULL |
| description_en | TEXT | NOT NULL |
| updated_at | TEXT | ISO 8601 |

### TrustIndicator

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| icon | TEXT | NOT NULL (lucide icon name) |
| value | TEXT | NOT NULL (e.g., "9+", "5,000+") |
| label_th | TEXT | NOT NULL |
| label_en | TEXT | NOT NULL |
| sort_order | INTEGER | NOT NULL, default 0 |
| active | INTEGER | NOT NULL, default 1 (boolean) |

### Service

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| name_th | TEXT | NOT NULL |
| name_en | TEXT | NOT NULL |
| description_th | TEXT | NOT NULL |
| description_en | TEXT | NOT NULL |
| seats | TEXT | nullable (e.g., "5 ที่นั่ง") |
| seats_en | TEXT | nullable (e.g., "5 seats") |
| slug | TEXT | UNIQUE, NOT NULL (for contact form dropdown) |
| sort_order | INTEGER | NOT NULL, default 0 |
| active | INTEGER | NOT NULL, default 1 |
| created_at | TEXT | ISO 8601 |
| updated_at | TEXT | ISO 8601 |

### ServiceImage

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| service_id | INTEGER | FK → Service.id, ON DELETE CASCADE |
| image_path | TEXT | NOT NULL |
| sort_order | INTEGER | NOT NULL, default 0 |

### GalleryCategory

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| name_th | TEXT | NOT NULL |
| name_en | TEXT | NOT NULL |
| slug | TEXT | UNIQUE, NOT NULL |
| sort_order | INTEGER | NOT NULL, default 0 |
| active | INTEGER | NOT NULL, default 1 |

### GalleryImage

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| category_id | INTEGER | FK → GalleryCategory.id, ON DELETE CASCADE |
| image_path | TEXT | NOT NULL |
| alt_th | TEXT | nullable |
| alt_en | TEXT | nullable |
| sort_order | INTEGER | NOT NULL, default 0 |

### ServiceRegion

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| name_th | TEXT | NOT NULL |
| name_en | TEXT | NOT NULL |
| provinces_th | TEXT | NOT NULL (JSON array) |
| provinces_en | TEXT | NOT NULL (JSON array) |
| sort_order | INTEGER | NOT NULL, default 0 |
| active | INTEGER | NOT NULL, default 1 |

### ContactInfo

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, default 1 |
| phone | TEXT | NOT NULL |
| address_th | TEXT | NOT NULL |
| address_en | TEXT | NOT NULL |
| email | TEXT | NOT NULL |
| updated_at | TEXT | ISO 8601 |

### SocialLink

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, auto-increment |
| platform | TEXT | NOT NULL (e.g., 'line', 'facebook') |
| url | TEXT | NOT NULL |
| icon | TEXT | nullable (SVG or lucide icon name) |
| sort_order | INTEGER | NOT NULL, default 0 |
| active | INTEGER | NOT NULL, default 1 |

### SeoMeta

| Field | Type | Constraints |
|-------|------|-------------|
| id | INTEGER | PK, default 1 |
| title_th | TEXT | NOT NULL |
| title_en | TEXT | NOT NULL |
| description_th | TEXT | NOT NULL |
| description_en | TEXT | NOT NULL |
| og_image_path | TEXT | nullable |
| updated_at | TEXT | ISO 8601 |

## Migration Strategy

1. **Seed from existing data**: Read `dictionaries/th.json` + `dictionaries/en.json` → insert into all tables
2. **Image paths**: Convert existing `/pics/*` references to database records
3. **Fallback**: If database is empty/unavailable, components fall back to JSON dictionaries
4. **One-time migration script**: `scripts/seed-from-json.ts` runs once on first deployment

## Validation Rules

- All text fields: max 1000 characters (descriptions max 5000)
- Image paths: must be valid file paths within `/data/uploads/`
- Slug fields: lowercase, alphanumeric + hyphens only
- Sort order: non-negative integers
- Color fields: valid hex format (#RRGGBB)
- Phone: Thai format (0xx-xxx-xxxx or +66...)
