# Data Model: Ocha Travel Transport Landing Page

**Date**: 2026-03-02
**Branch**: `001-landing-page`

## Overview

This is a static landing page with one dynamic interaction (contact form).
No database is required. Data is either static content (hardcoded in
translation dictionaries) or transient (form submission sent directly
to email via API).

## Entities

### Service (Static)

Defined in translation dictionary JSON files. Not stored in a database.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (e.g., "sedan", "suv", "vip-van", "large-van", "pickup") |
| name | string | Display name (locale-specific) |
| seats | string | Seat count display (e.g., "4-5", "6-7", "10", "13", "-") |
| description | string | Short description (locale-specific) |
| icon | string | Icon identifier or image path |

**Instances** (5 fixed):

| id | name (TH) | name (EN) | seats |
|----|-----------|-----------|-------|
| sedan | รถเก๋ง | Sedan | 4-5 |
| suv | รถ SUV | SUV | 6-7 |
| vip-van | รถตู้ VIP | VIP Van | 10 |
| large-van | รถตู้ใหญ่ | Large Van | 13 |
| pickup | รถกระบะ | Pickup | - |

### ContactInquiry (Transient)

Submitted via contact form, sent to email, not persisted in database.

| Field | Type | Validation | Required |
|-------|------|-----------|----------|
| name | string | min 1 char, max 100 chars | yes |
| phone | string | Thai phone format (10 digits, starts with 0) | yes |
| email | string | valid email format | yes |
| serviceType | enum | one of: sedan, suv, vip-van, large-van, pickup, other | yes |
| serviceDate | date | must be future date (> today) | yes |
| message | string | min 1 char, max 1000 chars | yes |
| honeypot | string | must be empty (spam check) | no |
| locale | string | "th" or "en" (auto-detected from current page) | auto |
| submittedAt | datetime | auto-generated ISO 8601 | auto |

**Validation Rules**:
- `phone`: Must match Thai format `/^0\d{9}$/`
- `email`: Must match standard email regex
- `serviceDate`: Must be strictly after current date (no same-day)
- `honeypot`: If non-empty, silently reject as spam (return fake success)

### SocialLink (Static)

Defined in configuration. Not stored in a database.

| Field | Type | Description |
|-------|------|-------------|
| platform | string | Platform identifier |
| url | string | Link URL or deep link |
| icon | string | Icon component name |

**Instances** (5 fixed + 1 phone):

| platform | url pattern |
|----------|------------|
| line | Line Official Account URL |
| facebook | https://facebook.com/Ocha.Jirasak |
| instagram | https://instagram.com/mr.ocha999 |
| whatsapp | https://wa.me/66661244999 |
| messenger | https://m.me/Ocha.Jirasak |
| phone | tel:0661244999 |

### TrustIndicator (Static)

Defined in translation dictionary.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| value | string | Display value (e.g., "24/7", "77 จังหวัด") |
| label | string | Label text (locale-specific) |
| icon | string | Icon identifier |

**Instances** (4 fixed):

| id | value | label (TH) | label (EN) |
|----|-------|-----------|-----------|
| experience | TBD | ปีประสบการณ์ | Years of Experience |
| trips | TBD | เที่ยวที่ให้บริการ | Trips Completed |
| availability | 24/7 | บริการตลอด 24 ชม. | Available 24/7 |
| coverage | 77 | จังหวัดทั่วไทย | Provinces Nationwide |

## Translation Dictionary Structure

```
dictionaries/
├── th.json    # Thai translations (default)
└── en.json    # English translations
```

**Schema** (simplified):

```json
{
  "meta": {
    "title": "...",
    "description": "..."
  },
  "nav": {
    "languageSwitch": "...",
    "services": "...",
    "about": "...",
    "contact": "..."
  },
  "hero": {
    "title": "...",
    "tagline": "...",
    "cta": "..."
  },
  "about": {
    "title": "...",
    "description": "...",
    "indicators": { ... }
  },
  "services": {
    "title": "...",
    "items": [ ... ]
  },
  "serviceAreas": {
    "title": "...",
    "description": "..."
  },
  "contact": {
    "title": "...",
    "form": {
      "name": "...",
      "phone": "...",
      "email": "...",
      "serviceType": "...",
      "serviceDate": "...",
      "message": "...",
      "submit": "...",
      "success": "...",
      "error": "..."
    },
    "serviceTypes": [ ... ]
  },
  "footer": {
    "copyright": "...",
    "address": "..."
  }
}
```

## State Transitions

### Contact Form Submission

```
idle → submitting → success
                  → error → idle (user can retry)
```

- `idle`: Form ready for input
- `submitting`: Submit button disabled, loading indicator shown
- `success`: Confirmation message displayed, form reset after delay
- `error`: Error message displayed, form remains editable for retry
