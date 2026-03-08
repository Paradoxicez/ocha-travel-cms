# Contract: Contact Form API

**Endpoint**: `POST /api/contact`
**Type**: Next.js API Route (serverless function)

## Request

**Content-Type**: `application/json`

### Body

```json
{
  "name": "สมชาย ใจดี",
  "phone": "0661244999",
  "email": "somchai@example.com",
  "serviceType": "sedan",
  "serviceDate": "2026-04-15",
  "message": "ต้องการรถเก๋งไปสนามบิน",
  "honeypot": "",
  "locale": "th"
}
```

### Field Specifications

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | yes | 1-100 characters |
| phone | string | yes | Thai format: `/^0\d{9}$/` |
| email | string | yes | Valid email format |
| serviceType | string | yes | Enum: `sedan`, `suv`, `vip-van`, `large-van`, `pickup`, `other` |
| serviceDate | string | yes | ISO date format (YYYY-MM-DD), must be future date |
| message | string | yes | 1-1000 characters |
| honeypot | string | no | Must be empty string (spam detection) |
| locale | string | yes | `th` or `en` |

## Response

### Success (200)

```json
{
  "success": true,
  "message": "ส่งข้อความสำเร็จ"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "message": "กรุณากรอกข้อมูลให้ครบถ้วน",
  "errors": {
    "email": "รูปแบบ email ไม่ถูกต้อง",
    "serviceDate": "กรุณาเลือกวันที่ในอนาคต"
  }
}
```

### Spam Detected (200)

When honeypot field is non-empty, return fake success to avoid
revealing spam detection to bots:

```json
{
  "success": true,
  "message": "ส่งข้อความสำเร็จ"
}
```

No email is sent in this case.

### Server Error (500)

```json
{
  "success": false,
  "message": "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง"
}
```

## Email Output

When form is valid and not spam, send email via Resend:

**From**: `contact@<verified-domain>` (configured via env)
**To**: `BUSINESS_EMAIL` (environment variable)
**Subject**: `[Ocha Travel] New inquiry from {name} - {serviceType}`

**Body** (HTML):

```
New Contact Form Submission
===========================
Name: {name}
Phone: {phone}
Email: {email}
Service Type: {serviceType label in locale}
Service Date: {serviceDate formatted in locale}
Message: {message}

---
Submitted: {submittedAt}
Language: {locale}
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| RESEND_API_KEY | Resend API key | `re_xxxxxxxxxxxx` |
| BUSINESS_EMAIL | Recipient email | `owner@ochatravel.com` |
| EMAIL_FROM | Sender address (verified domain) | `contact@ochatravel.com` |

## Rate Limiting

No server-side rate limiting implemented for MVP.
Client-side protection via submit button disable during request.
Honeypot field provides basic bot protection.
