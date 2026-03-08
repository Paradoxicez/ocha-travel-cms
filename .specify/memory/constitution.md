<!--
  Sync Impact Report
  ==================
  Version change: (new) → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections:
    - Core Principles (5 principles)
    - Technology & Constraints
    - Development Workflow
    - Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ no update needed (generic)
    - .specify/templates/spec-template.md ✅ no update needed (generic)
    - .specify/templates/tasks-template.md ✅ no update needed (generic)
  Follow-up TODOs: None
-->

# Ocha Travel Landing Page Constitution

## Core Principles

### I. Simplicity First

- ทุกฟีเจอร์ MUST มีจุดประสงค์ชัดเจนและจำเป็นต่อ landing page
- ห้ามเพิ่ม dependency ที่ไม่จำเป็น; ใช้ native browser APIs เมื่อทำได้
- หน้าเว็บ MUST เป็น single-page layout ที่ไม่ซับซ้อน
- ไม่สร้าง abstraction layer ที่ไม่จำเป็น; code ที่อ่านง่าย
  สำคัญกว่า code ที่ "ฉลาด"

**Rationale**: Landing page ต้องโหลดเร็วและดูแลง่าย
ความซับซ้อนที่ไม่จำเป็นทำให้ performance แย่ลง
และเพิ่มต้นทุนในการดูแลรักษา

### II. Bilingual by Default (TH/EN)

- ระบบ MUST รองรับภาษาไทย (TH) และภาษาอังกฤษ (EN)
- ภาษาไทย MUST เป็นภาษาเริ่มต้น (default locale)
- ข้อความทุกชิ้นที่แสดงผลบนหน้าเว็บ MUST มีทั้งสองภาษา
- การสลับภาษา MUST ทำได้ง่ายและชัดเจนสำหรับผู้ใช้
- URL structure SHOULD สะท้อนภาษาที่เลือก (เช่น `/th`, `/en`)

**Rationale**: กลุ่มเป้าหมายเป็นทั้งคนไทยและนักท่องเที่ยว
ต่างชาติ ภาษาไทยเป็นค่าเริ่มต้นเพราะฐานลูกค้าหลักเป็นคนไทย

### III. Trustworthy & Professional Design

- UI MUST ดูน่าเชื่อถือ สะอาด และเป็นมืออาชีพ
- MUST ใช้ typography ที่อ่านง่ายทั้งภาษาไทยและอังกฤษ
- สี, spacing, และ layout MUST สอดคล้องกันทั่วทั้งหน้า
- MUST แสดงข้อมูลติดต่อและ social media links อย่างชัดเจน
- MUST ไม่มี broken links หรือ placeholder content ใน production

**Rationale**: ธุรกิจท่องเที่ยวต้องสร้างความไว้วางใจ
การออกแบบที่ดูน่าเชื่อถือช่วยเพิ่มอัตราการติดต่อจากลูกค้า

### IV. Responsive & Accessible

- หน้าเว็บ MUST แสดงผลถูกต้องบน mobile, tablet, และ desktop
- Mobile-first approach MUST เป็นแนวทางหลักในการออกแบบ
- Contact form MUST ใช้งานได้สะดวกบนทุกขนาดหน้าจอ
- Social media links MUST กดได้ง่ายบน touch devices
- MUST รองรับ browser หลักๆ (Chrome, Safari, Firefox, Edge)

**Rationale**: ผู้ใช้ส่วนใหญ่เข้าถึงผ่าน mobile
การออกแบบที่ responsive ช่วยให้เข้าถึงลูกค้าได้มากที่สุด

### V. Secure & Functional Contact

- Contact form MUST ส่งข้อมูลไปยัง email ที่กำหนดได้อย่างถูกต้อง
- Form MUST มี validation พื้นฐาน (required fields, email format)
- MUST ป้องกัน spam ด้วยวิธีที่ไม่รบกวนผู้ใช้
- ข้อมูลที่ส่งผ่าน form MUST ไม่ถูกเก็บในที่ที่ไม่ปลอดภัย
- MUST แสดง feedback ที่ชัดเจนหลังส่งฟอร์มสำเร็จหรือล้มเหลว

**Rationale**: Contact form เป็นช่องทางหลักในการรับลูกค้า
ต้องทำงานได้อย่างน่าเชื่อถือและปลอดภัย

## Technology & Constraints

- Landing page MUST โหลดเร็ว (Lighthouse Performance score >= 90)
- Total page weight SHOULD ไม่เกิน 1MB (ไม่รวมรูปภาพ)
- รูปภาพ MUST ใช้ format ที่เหมาะสม (WebP preferred) และ lazy loading
- MUST ใช้ HTTPS เท่านั้น
- Social media links MUST เปิดใน new tab
- Email sending MUST ใช้ service ที่เชื่อถือได้
  (ไม่ expose email address โดยตรงใน client-side code)

## Development Workflow

- Code MUST ผ่าน linting ก่อน commit
- MUST test ทั้งภาษาไทยและอังกฤษก่อน deploy
- MUST test contact form ว่าส่ง email ได้จริงก่อน deploy
- MUST test responsive layout บน viewport ขนาดต่างๆ ก่อน deploy
- Assets (images, fonts) MUST ถูก optimize ก่อน commit
- MUST ไม่ commit credentials, API keys, หรือ email addresses
  ลงใน repository โดยตรง; ใช้ environment variables

## Governance

- Constitution นี้เป็นแนวทางหลักของโปรเจกต์
- การแก้ไข Constitution MUST มีเหตุผลที่ชัดเจน
  และอัปเดต version ตาม semantic versioning
- ทุก PR MUST ตรวจสอบว่าสอดคล้องกับ principles ที่กำหนด
- ใช้ไฟล์ CLAUDE.md สำหรับ runtime development guidance

**Version**: 1.0.0 | **Ratified**: 2026-03-02 | **Last Amended**: 2026-03-02
