# Feature Specification: Content Management System

**Feature Branch**: `002-content-management`
**Created**: 2026-03-09
**Status**: Draft
**Input**: User request: "ฉันต้องการให้เว็บสามารถอัพเดทคอนเทนต์ได้ทุกส่วน"

## Overview

เพิ่มระบบจัดการเนื้อหา (CMS) ให้เจ้าของธุรกิจสามารถอัพเดทข้อมูลทุกส่วนของเว็บไซต์ผ่าน Admin Dashboard โดยไม่ต้องแก้ code หรือ rebuild Docker image

## Assumptions

- ผู้ใช้ Admin มีแค่ 1 คน (เจ้าของธุรกิจ)
- ไม่ต้องการ role-based access (Admin คนเดียว)
- ใช้ database เก็บเนื้อหาแทน static JSON dictionaries
- รองรับอัพโหลดรูปภาพใหม่
- ต้องรองรับ bilingual (TH/EN) เหมือนเดิม
- Admin Dashboard ใช้ภาษาไทยเป็นหลัก
- เว็บหน้าบ้านดึงข้อมูลจาก database แบบ dynamic (ISR หรือ SSR)

## Clarifications

### Session 2026-03-09

- Q: ต้องการอัพเดทส่วนไหนบ้าง? → A: ทุกส่วน
- Q: ใช้ CMS สำเร็จรูปหรือสร้างเอง? → A: สร้าง Admin Dashboard เอง (ง่ายกว่า, ควบคุมได้เต็มที่)

## Scope: Manageable Content Sections

### 1. Hero Section
- Tagline (TH/EN)
- คำอธิบาย subtitle (TH/EN)
- CTA button text (TH/EN)
- Background image

### 2. About Us
- คำอธิบายธุรกิจ (TH/EN)
- Trust indicators: icon, ตัวเลข, label (TH/EN) — สามารถเพิ่ม/ลบ/แก้ไข

### 3. Performance Gallery
- จัดการหมวดหมู่ (tabs): เพิ่ม/ลบ/แก้ชื่อหมวด (TH/EN)
- อัพโหลด/ลบรูปภาพในแต่ละหมวด
- จัดลำดับรูปภาพ

### 4. Services
- จัดการประเภทบริการ: เพิ่ม/ลบ/แก้ไข
- แต่ละบริการ: ชื่อ (TH/EN), คำอธิบาย (TH/EN), จำนวนที่นั่ง, รูปภาพ (อัพโหลดหลายรูป)
- จัดลำดับการแสดงผล

### 5. Service Areas
- จัดการภูมิภาค: ชื่อภูมิภาค (TH/EN), จังหวัดในแต่ละภูมิภาค
- เพิ่ม/ลบ จังหวัด

### 6. Contact Information
- เบอร์โทร, ที่อยู่ (TH/EN), email
- Social media links: platform, URL, เปิด/ปิด แต่ละช่องทาง
- WeChat ID

### 7. SEO & Meta
- Meta title (TH/EN)
- Meta description (TH/EN)
- OG image

### 8. General Settings
- ชื่อธุรกิจ (TH/EN)
- Logo upload
- สี primary/secondary

## User Scenarios & Testing

### User Story 1 - Admin อัพเดทข้อมูลบริการ (Priority: P1)

เจ้าของธุรกิจต้องการเพิ่มประเภทรถใหม่หรือแก้ไขรายละเอียดบริการที่มีอยู่

**Why this priority**: Services เป็นส่วนที่เปลี่ยนบ่อยที่สุด (เพิ่มรถ, เปลี่ยนราคา, เปลี่ยนรูป)

**Acceptance Scenarios**:

1. **Given** Admin login แล้ว, **When** ไปที่หน้าจัดการ Services, **Then** เห็นรายการบริการทั้งหมดที่มีอยู่
2. **Given** Admin อยู่ที่หน้า Services, **When** กดเพิ่มบริการใหม่ กรอกชื่อ TH/EN, คำอธิบาย, อัพโหลดรูป, **Then** บริการใหม่แสดงบนเว็บหน้าบ้านทันที
3. **Given** Admin อยู่ที่หน้า Services, **When** แก้ไขชื่อบริการที่มีอยู่, **Then** ชื่อใหม่แสดงบนเว็บหน้าบ้านทันที
4. **Given** Admin อยู่ที่หน้า Services, **When** ลบบริการ, **Then** บริการนั้นหายไปจากเว็บหน้าบ้าน

---

### User Story 2 - Admin จัดการรูปภาพ Gallery (Priority: P1)

เจ้าของธุรกิจต้องการเพิ่มรูปผลงานใหม่หรือลบรูปเก่า

**Acceptance Scenarios**:

1. **Given** Admin อยู่ที่หน้า Gallery, **When** เลือกหมวด แล้วอัพโหลดรูปใหม่, **Then** รูปแสดงใน Gallery หน้าบ้านทันที
2. **Given** Admin อยู่ที่หน้า Gallery, **When** ลากจัดลำดับรูป, **Then** ลำดับเปลี่ยนบนเว็บหน้าบ้าน
3. **Given** Admin อยู่ที่หน้า Gallery, **When** ลบรูป, **Then** รูปหายจากเว็บและไฟล์ถูกลบ

---

### User Story 3 - Admin แก้ไขข้อมูลทั่วไป (Priority: P2)

เจ้าของธุรกิจต้องการแก้ไขข้อความ Hero, About Us, ข้อมูลติดต่อ, หรือ SEO

**Acceptance Scenarios**:

1. **Given** Admin อยู่ที่หน้า Hero Settings, **When** แก้ tagline ภาษาไทย, **Then** tagline ใหม่แสดงบนเว็บหน้าบ้านทันที
2. **Given** Admin อยู่ที่หน้า Contact Settings, **When** เพิ่ม social link ใหม่หรือปิด link เก่า, **Then** เว็บหน้าบ้านแสดงตาม
3. **Given** Admin อยู่ที่หน้า SEO Settings, **When** แก้ meta title/description, **Then** HTML meta tags อัพเดทตาม

---

### User Story 4 - Admin Login (Priority: P1)

เจ้าของธุรกิจต้องเข้าสู่ระบบก่อนแก้ไขข้อมูล

**Acceptance Scenarios**:

1. **Given** ผู้ใช้เปิด /admin, **When** ใส่ username + password ถูกต้อง, **Then** เข้า dashboard ได้
2. **Given** ผู้ใช้เปิด /admin, **When** ใส่ password ผิด, **Then** แสดง error "ข้อมูลไม่ถูกต้อง"
3. **Given** ผู้ใช้พยายามเข้า /admin/services โดยตรงโดยไม่ login, **Then** redirect ไปหน้า login

---

### Edge Cases

- Admin อัพโหลดรูปขนาดใหญ่เกิน (>5MB): แสดง error แจ้งขนาดที่อนุญาต
- Admin ลบบริการที่มีอยู่ใน Contact form dropdown: dropdown ต้องอัพเดทตาม
- Admin แก้ไขข้อมูลพร้อมกัน 2 tab: ใช้ last-write-wins (ผู้ใช้คนเดียว)
- Database ล่ม: เว็บหน้าบ้านแสดง fallback จาก cache
- รูปภาพ format ไม่รองรับ: แจ้ง error รองรับเฉพาะ JPG, PNG, WebP

## Requirements

### Functional Requirements

- **FR-CMS-001**: ระบบ MUST มี Admin Dashboard ที่เข้าถึงผ่าน `/admin`
- **FR-CMS-002**: Admin MUST login ด้วย username + password ก่อนใช้งาน Dashboard
- **FR-CMS-003**: Authentication MUST ใช้ session-based (cookie) หรือ JWT
- **FR-CMS-004**: Admin MUST สามารถแก้ไขข้อความทุกส่วนของเว็บได้ทั้ง TH และ EN
- **FR-CMS-005**: Admin MUST สามารถอัพโหลดรูปภาพใหม่ได้ (JPG, PNG, WebP, ขนาดไม่เกิน 5MB)
- **FR-CMS-006**: Admin MUST สามารถลบรูปภาพที่ไม่ต้องการได้
- **FR-CMS-007**: Admin MUST สามารถจัดลำดับรูปภาพและรายการบริการได้ (drag & drop)
- **FR-CMS-008**: Admin MUST สามารถเพิ่ม/ลบ/แก้ไข ประเภทบริการได้
- **FR-CMS-009**: Admin MUST สามารถเพิ่ม/ลบ/แก้ไข หมวดหมู่ Gallery ได้
- **FR-CMS-010**: Admin MUST สามารถเปิด/ปิด social media links แต่ละช่องทางได้
- **FR-CMS-011**: การเปลี่ยนแปลงข้อมูล MUST แสดงผลบนเว็บหน้าบ้านภายใน 60 วินาที
- **FR-CMS-012**: ระบบ MUST มี database เก็บข้อมูลเนื้อหาทั้งหมด
- **FR-CMS-013**: Admin MUST สามารถแก้ไข SEO meta tags (title, description) ได้ทั้ง TH/EN
- **FR-CMS-014**: Admin MUST สามารถแก้ไขข้อมูลติดต่อ (เบอร์โทร, ที่อยู่, email) ได้
- **FR-CMS-015**: Admin MUST สามารถแก้ไข Service Areas (ภูมิภาค, จังหวัด) ได้
- **FR-CMS-016**: รูปภาพที่อัพโหลด MUST ถูก optimize (resize, compress) อัตโนมัติ
- **FR-CMS-017**: Dashboard MUST responsive ใช้งานได้บน mobile
- **FR-CMS-018**: ระบบ MUST มี image storage ที่เหมาะสม (local filesystem หรือ cloud storage)

### Non-Functional Requirements

- **NFR-CMS-001**: Dashboard page load MUST < 2 วินาที
- **NFR-CMS-002**: Image upload MUST สำเร็จภายใน 10 วินาที (สำหรับไฟล์ <= 5MB)
- **NFR-CMS-003**: Database MUST รองรับ concurrent read/write จากเว็บหน้าบ้านและ admin
- **NFR-CMS-004**: Admin session MUST expire หลัง 24 ชั่วโมง
- **NFR-CMS-005**: MUST ไม่มีผลกระทบต่อ performance ของเว็บหน้าบ้าน (Lighthouse >= 85)

### Key Entities

- **SiteSettings**: ชื่อธุรกิจ (TH/EN), logo, primary color, secondary color
- **HeroContent**: tagline (TH/EN), subtitle (TH/EN), CTA text (TH/EN), background image
- **AboutContent**: description (TH/EN), trust indicators (array)
- **TrustIndicator**: icon, value, label (TH/EN), sort order
- **Service**: name (TH/EN), description (TH/EN), seats, images (array), sort order, active
- **GalleryCategory**: name (TH/EN), sort order, active
- **GalleryImage**: category_id, image path, sort order
- **ServiceRegion**: name (TH/EN), provinces (TH/EN array), sort order
- **SocialLink**: platform, url, icon, active, sort order
- **ContactInfo**: phone, address (TH/EN), email
- **SeoMeta**: title (TH/EN), description (TH/EN), og_image
- **AdminUser**: username, password_hash

## Technical Approach (Recommended)

### Database
- **SQLite** (via Prisma ORM) — simple, no separate DB server, file-based, Docker-friendly
- หรือ **PostgreSQL** ถ้าต้องการ scale ในอนาคต

### Admin UI
- Next.js pages under `/admin/*` route group
- Tailwind CSS (reuse existing setup)
- React state + fetch API for CRUD operations

### API
- Next.js API routes under `/api/admin/*`
- Middleware สำหรับ authentication check

### Image Storage
- Local filesystem (`/uploads/`) mounted as Docker volume
- Sharp library สำหรับ image optimization

### Migration Strategy
- อ่านข้อมูลจาก existing `dictionaries/*.json` แล้ว seed เข้า database ครั้งแรก
- เว็บหน้าบ้านเปลี่ยนจากอ่าน JSON → อ่าน database
- Fallback: ถ้า database ไม่พร้อม ยังอ่าน JSON ได้

## Success Criteria

- **SC-CMS-001**: Admin สามารถ login และแก้ไขข้อความ Hero ได้ → แสดงผลบนเว็บภายใน 60 วินาที
- **SC-CMS-002**: Admin สามารถเพิ่มบริการใหม่พร้อมรูปภาพได้ → แสดงบนเว็บทันที
- **SC-CMS-003**: Admin สามารถอัพโหลดรูป Gallery ได้ → แสดงใน carousel ทันที
- **SC-CMS-004**: Admin สามารถแก้ไข social links ได้ → เว็บหน้าบ้านอัพเดทตาม
- **SC-CMS-005**: เว็บหน้าบ้าน Lighthouse Performance >= 85 หลังเปลี่ยนเป็น dynamic content
- **SC-CMS-006**: ข้อมูลเดิมทั้งหมดจาก JSON dictionaries ถูก migrate เข้า database ครบถ้วน
