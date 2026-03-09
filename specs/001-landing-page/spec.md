# Feature Specification: Ocha Travel Transport Landing Page

**Feature Branch**: `001-landing-page`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "สร้างหน้า web landing page TH/EN (default TH) พร้อม contact form ส่ง email, ดูน่าเชื่อถือ, ลิงค์ social media, ข้อมูลจากเว็บเดิม taxiserviceocha999.com"

## Assumptions

- ชื่อธุรกิจ: **บริษัท โอชา ทราเวล ทรานสปอร์ต จำกัด** (Ocha Travel Transport Co., Ltd.)
- โทนสีหลัก: `#e01d47` (ชมพู/แดง), สีรอง: ดำ `#000000`, ขาว `#FFFFFF`
- Logo ใช้ `/logos/Ocha-Symbol-Only_0.png` (symbol only) + ข้อความ "OCHA" / "TRAVEL TRANSPORT"
- ข้อมูลบริการอ้างอิงจากเว็บเดิม taxiserviceocha999.com แต่ปรับปรุงเนื้อหา
- เบอร์ติดต่อ: 0661244999
- Social media & messaging: Line Official, Facebook (Ocha.Jirasak), Instagram (mr.ocha999), WhatsApp, Messenger, WeChat (_ochatravel_999), Telegram (@Ochataxiservice999)
- ที่อยู่: 168/284 ม.3, ปทุมธานี 12000
- หน้าเว็บเป็น single-page landing page (ไม่ใช่ multi-page site)
- Contact form ส่งข้อมูลไปยัง email โดยใช้ backend service (ไม่ expose email ใน client)
- การป้องกัน spam ใช้วิธี honeypot field (ไม่ต้อง CAPTCHA ที่ซับซ้อน)

## Clarifications

### Session 2026-03-02

- Q: ต้องการเพิ่มช่องทาง Line Official หรือ messaging อื่นนอกจาก Facebook/Instagram หรือไม่? → A: เพิ่มทั้ง 7 ช่องทาง: Line Official, Facebook, Instagram, WhatsApp, Messenger, WeChat (_ochatravel_999), Telegram (@Ochataxiservice999)
- Q: ต้องการ SEO และ Social Sharing ระดับไหน? → A: SEO แบบเต็ม (meta title, description, OG tags, structured data/schema markup, sitemap, robots.txt)
- Q: ต้องการเพิ่มฟิลด์เลือกประเภทบริการใน contact form หรือไม่? → A: เพิ่ม dropdown เลือกประเภทบริการ + calendar เลือกวันที่ต้องการใช้บริการ
- Q: ต้องการ Analytics & Tracking หรือไม่? → A: เพิ่ม Google Analytics (GA4) ติดตาม page views, form submissions, social clicks
- Q: ต้องการส่วน About Us / Trust Signals หรือไม่? → A: เพิ่มส่วน About Us สั้นๆ + trust indicators (ปีที่เปิดบริการ, จำนวนเที่ยว, บริการ 24 ชม., ครอบคลุมทั่วไทย)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - เรียกดูข้อมูลบริการและติดต่อ (Priority: P1)

ลูกค้าชาวไทยเข้าเว็บไซต์เพื่อดูข้อมูลบริการรถเหมาพร้อมคนขับ
เห็นรายละเอียดบริการต่างๆ ที่ชัดเจน รู้สึกน่าเชื่อถือ
และกรอกแบบฟอร์มติดต่อเพื่อสอบถามข้อมูลหรือจองบริการ

**Why this priority**: นี่คือ core journey หลักของเว็บไซต์
ลูกค้าส่วนใหญ่เป็นคนไทยที่ต้องการดูบริการและติดต่อกลับ
ถ้าขั้นตอนนี้ใช้ไม่ได้ เว็บไซต์ทั้งหมดก็ไม่มีประโยชน์

**Independent Test**: เปิดเว็บไซต์ภาษาไทย สามารถอ่านข้อมูล
บริการทั้งหมดได้ กรอกฟอร์มติดต่อแล้วได้รับ confirmation
และ email ถูกส่งไปยังเจ้าของธุรกิจ

**Acceptance Scenarios**:

1. **Given** ผู้ใช้เปิดเว็บไซต์ครั้งแรก, **When** หน้าเว็บโหลดเสร็จ, **Then** แสดงเนื้อหาภาษาไทยเป็นค่าเริ่มต้น พร้อม logo, ชื่อธุรกิจ, และ hero section
2. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** เลื่อนดูเนื้อหา, **Then** เห็นส่วนบริการต่างๆ (รถเก๋ง, รถ SUV, รถตู้, รถ VIP, รถกระบะ) พร้อมรายละเอียดย่อ
3. **Given** ผู้ใช้ต้องการติดต่อ, **When** กรอก contact form (ชื่อ, เบอร์โทร, email, ประเภทบริการ, วันที่ต้องการ, ข้อความ) และกดส่ง, **Then** ระบบแสดง confirmation message และส่ง email ไปยังเจ้าของธุรกิจ
4. **Given** ผู้ใช้กรอก form ไม่ครบ, **When** กดส่ง, **Then** ระบบแสดง validation error ที่ชัดเจนเป็นภาษาไทย

---

### User Story 2 - สลับภาษาเป็นภาษาอังกฤษ (Priority: P2)

นักท่องเที่ยวต่างชาติหรือชาวต่างชาติที่อาศัยในไทย
เข้าเว็บไซต์แล้วสลับภาษาเป็นอังกฤษ
เพื่อดูข้อมูลบริการและติดต่อสอบถาม

**Why this priority**: รองรับกลุ่มลูกค้าต่างชาติ
ซึ่งเป็นฐานลูกค้ารอง แต่มีมูลค่าต่อ transaction สูง

**Independent Test**: สลับภาษาเป็น EN แล้วเนื้อหาทั้งหมด
แสดงเป็นภาษาอังกฤษ สามารถกรอก form และส่งได้ปกติ

**Acceptance Scenarios**:

1. **Given** ผู้ใช้อยู่บนหน้าเว็บภาษาไทย, **When** กดปุ่มสลับภาษาเป็น EN, **Then** เนื้อหาทั้งหมดเปลี่ยนเป็นภาษาอังกฤษ (service names, descriptions, form labels, buttons, footer)
2. **Given** ผู้ใช้อยู่ในโหมดภาษาอังกฤษ, **When** กรอก contact form และส่ง, **Then** ระบบแสดง confirmation เป็นภาษาอังกฤษ และ email ถูกส่งเหมือนกัน
3. **Given** ผู้ใช้สลับภาษาแล้ว, **When** รีเฟรชหน้าเว็บ, **Then** ภาษาที่เลือกยังคงอยู่ (จดจำผ่าน URL path หรือ localStorage)

---

### User Story 3 - เข้าถึง Social Media และช่องทางติดต่อ (Priority: P3)

ผู้ใช้ต้องการติดต่อผ่านช่องทาง social media
หรือโทรศัพท์โดยตรง แทนการกรอก form

**Why this priority**: เป็นช่องทางสำรองที่สำคัญ
ลูกค้าบางคนสะดวกติดต่อผ่าน Facebook/Instagram
หรือโทรตรงมากกว่า

**Independent Test**: กดลิงค์ social media แล้วเปิดไปยัง
profile ที่ถูกต้อง กดเบอร์โทรบน mobile แล้วโทรได้

**Acceptance Scenarios**:

1. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** กดลิงค์ Facebook, **Then** เปิดหน้า Facebook page ของ Ocha ใน tab ใหม่
2. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** กดลิงค์ Instagram, **Then** เปิดหน้า Instagram profile ใน tab ใหม่
3. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** กดลิงค์ Line, **Then** เปิด Line Official Account หรือ deep link ไปยังแอป Line
4. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** กดลิงค์ WhatsApp, **Then** เปิด WhatsApp chat พร้อมเบอร์ธุรกิจ
5. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** กดลิงค์ Messenger, **Then** เปิด Facebook Messenger chat กับ page ของ Ocha
6. **Given** ผู้ใช้ใช้ mobile, **When** กดเบอร์โทรศัพท์, **Then** เปิดแอปโทรศัพท์พร้อมเบอร์ 0661244999
7. **Given** ผู้ใช้อยู่บนหน้าเว็บ, **When** ดูส่วน footer, **Then** เห็นที่อยู่, เบอร์โทร, social/messaging links ทั้ง 7 ช่องทาง, และข้อมูลลิขสิทธิ์

---

### Edge Cases

- ผู้ใช้ส่ง form ซ้ำหลายครั้งติดกัน: ระบบ MUST ป้องกัน duplicate submission โดยปิดปุ่มส่งหลังกดจนกว่าจะได้ response
- ผู้ใช้กรอก email ผิด format: แสดง validation error ก่อนส่ง
- ผู้ใช้เปิดเว็บบน browser เก่า (IE11): ไม่ต้องรองรับ แต่ MUST ไม่แสดงหน้าว่างเปล่า ควรแสดง fallback content พื้นฐาน
- Bot spam กรอก form: ป้องกันด้วย honeypot field
- รูปภาพโหลดช้า: ใช้ placeholder/skeleton ระหว่างโหลด
- ผู้ใช้เลือกวันที่ในอดีต: calendar MUST ไม่อนุญาตให้เลือกวันที่ผ่านมาแล้ว
- ผู้ใช้เข้าเว็บจาก URL ที่มี locale ไม่ถูกต้อง (เช่น /jp): redirect ไปยังภาษาไทย (default)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: หน้าเว็บ MUST แสดงเนื้อหาภาษาไทยเป็นค่าเริ่มต้น
- **FR-002**: ผู้ใช้ MUST สามารถสลับระหว่างภาษาไทยและอังกฤษได้ทุกที่บนหน้าเว็บ
- **FR-003**: เนื้อหาทุกส่วนที่แสดงผล MUST มีทั้งภาษาไทยและอังกฤษ
- **FR-004**: หน้าเว็บ MUST แสดง logo ของ Ocha Travel Transport จากไฟล์ใน `/logos`
- **FR-005**: หน้าเว็บ MUST มี hero section ที่แสดงชื่อธุรกิจ tagline และ call-to-action
- **FR-006**: หน้าเว็บ MUST แสดงรายการบริการอย่างน้อย 5 ประเภท: รถเก๋ง (5 ที่นั่ง), SUV (7 ที่นั่ง), รถตู้ (10-13 ที่นั่ง), รถ VIP, รถกระบะ
- **FR-007**: Contact form MUST มี fields: ชื่อ (required), เบอร์โทร (required), email (required, validated), ประเภทบริการ (required, dropdown: รถเก๋ง/Sedan, SUV, รถตู้ VIP/VIP Van, รถตู้ใหญ่/Large Van, รถกระบะ/Pickup, อื่นๆ/Other), วันที่ต้องการใช้บริการ (required, calendar date picker, ต้องเป็นวันในอนาคตเท่านั้น), ข้อความ (required)
- **FR-008**: Contact form MUST ส่งข้อมูลไปยัง email ของเจ้าของธุรกิจ
- **FR-009**: หลังส่ง form สำเร็จ MUST แสดง confirmation message
- **FR-010**: หลังส่ง form ล้มเหลว MUST แสดง error message ที่ชัดเจน
- **FR-011**: Contact form MUST มี honeypot field เพื่อป้องกัน spam
- **FR-012**: Social media และ messaging links MUST เปิดใน tab ใหม่ หรือ deep link ไปยังแอป (Line Official, Facebook, Instagram, WhatsApp, Messenger, WeChat, Telegram)
- **FR-013**: เบอร์โทรศัพท์ MUST เป็น clickable tel: link
- **FR-014**: หน้าเว็บ MUST responsive บน mobile (320px+), tablet (768px+), desktop (1024px+)
- **FR-015**: โทนสี MUST ใช้ `#e01d47` เป็นสีหลัก, ดำและขาวเป็นสีรอง
- **FR-016**: Footer MUST แสดงที่อยู่ธุรกิจ, เบอร์โทร, social/messaging links ทั้ง 7 ช่องทาง (Line, Facebook, Instagram, WhatsApp, Messenger, WeChat, Telegram), copyright
- **FR-017**: ภาษาที่เลือก MUST ถูกจดจำเมื่อผู้ใช้กลับมาใหม่
- **FR-018**: ปุ่มส่ง form MUST ถูก disable ระหว่างรอ response เพื่อป้องกัน duplicate submission
- **FR-019**: หน้าเว็บ MUST มี meta title และ meta description ที่เหมาะสมทั้งภาษาไทยและอังกฤษ ตามภาษาที่เลือก
- **FR-020**: หน้าเว็บ MUST มี Open Graph tags (og:title, og:description, og:image, og:url) เพื่อแสดงผล preview ที่สวยงามเมื่อ share บน social media
- **FR-021**: หน้าเว็บ MUST มี structured data (Schema.org LocalBusiness markup) สำหรับ search engine
- **FR-022**: เว็บไซต์ MUST มี sitemap.xml และ robots.txt
- **FR-023**: หน้าเว็บ MUST ติดตั้ง Google Analytics (GA4) เพื่อติดตาม page views, form submissions, และ social/messaging link clicks
- **FR-024**: GA4 tracking ID MUST ถูกกำหนดผ่าน environment variable (ไม่ hardcode ใน source code)
- **FR-025**: หน้าเว็บ MUST มีส่วน About Us สั้นๆ ที่แสดงข้อมูลเกี่ยวกับธุรกิจ Ocha Travel Transport
- **FR-026**: ส่วน About Us MUST แสดง trust indicators อย่างน้อย 4 รายการ เช่น ปีที่เปิดบริการ, จำนวนเที่ยวที่ให้บริการ, บริการ 24 ชม., ครอบคลุมทั่วไทย (แสดงเป็นตัวเลข/icon ที่เข้าใจง่าย)
- **FR-027**: หน้าเว็บ MUST แสดง Performance Gallery section ที่มี tab แยก 3 หมวด (ลูกค้าทั่วไป, ขนส่ง, บริการรถตู้) โดยแต่ละ tab มี carousel เลื่อนดูรูปภาพได้ แสดง 3-4 รูปต่อ view บน desktop, 1-2 รูปบน mobile, แสดงรูปทั้งหมดในแต่ละหมวดโดยใช้ lazy loading, รูปภาพอยู่ใน `/pics/performance/` (3 folders: "Pick-up and drop-off-service", "transport-service", "van-service")
- **FR-028**: Services section MUST แสดงรูปภาพรถจริงสำหรับทุกประเภท (Sedan, SUV, รถตู้ 10 ที่นั่ง, รถตู้ 13 ที่นั่ง, รถตู้ VIP, Pickup) โดยแต่ละ service card MUST มี carousel เลื่อนดูรูปรถได้, รูปภาพอยู่ใน `/pics/cars/` (6 folders: "sedan", "suv", "van-10seats", "van-13seats", "van-vip", "truck")

### Key Entities

- **Service (บริการ)**: ประเภทรถ, จำนวนที่นั่ง, คำอธิบายบริการ (TH/EN), ไอคอนหรือรูปภาพ
- **Contact Inquiry (การติดต่อ)**: ชื่อผู้ติดต่อ, เบอร์โทร, email, ประเภทบริการที่สนใจ, วันที่ต้องการใช้บริการ, ข้อความ, วันเวลาที่ส่ง, ภาษาที่ใช้ตอนส่ง
- **Social Link (ช่องทาง social/messaging)**: ชื่อ platform (Line, Facebook, Instagram, WhatsApp, Messenger, WeChat, Telegram), URL หรือ deep link หรือ ID, icon

## Section Layout Order

> รายละเอียดแต่ละ section ดูที่ Functional Requirements (FR-001–FR-028)
> ข้อมูลเนื้อหาจริงอยู่ใน `dictionaries/th.json` และ `dictionaries/en.json`

1. **Header** — Logo + navigation + language switcher
2. **Hero** — Tagline + CTA (FR-005)
3. **About Us** — คำอธิบายธุรกิจ + trust indicators: 9+ ปี, 5,000+ เที่ยว, 24/7, 77 จังหวัด (FR-025, FR-026)
4. **Performance Gallery** — 3 tabs: ลูกค้าทั่วไป, ขนส่ง, บริการรถตู้ (FR-027)
5. **Services** — 6 ประเภทรถพร้อมรูปภาพทุกประเภท (FR-006, FR-028)
6. **Service Areas** — แผนที่ประเทศไทย + 7 ภูมิภาค ครบ 77 จังหวัด พร้อม interactive pins
7. **Contact** — Contact form + เบอร์โทร 0661244999 (FR-007–FR-011)
8. **Footer** — ข้อมูลธุรกิจ + social/messaging links 7 ช่องทาง + copyright (FR-016)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: ผู้ใช้สามารถเข้าถึงหน้าเว็บและเห็นเนื้อหาทั้งหมดภายใน 3 วินาทีบน 4G connection
- **SC-002**: ผู้ใช้สามารถกรอกและส่ง contact form สำเร็จภายใน 1 นาที
- **SC-003**: เจ้าของธุรกิจได้รับ email จาก contact form ภายใน 5 นาทีหลังส่ง
- **SC-004**: เนื้อหาทั้งหมด 100% มีทั้งภาษาไทยและอังกฤษ ไม่มีข้อความปะปนภาษา
- **SC-005**: หน้าเว็บแสดงผลถูกต้องบน mobile, tablet, desktop โดยไม่มี layout broken
- **SC-006**: ลิงค์ social media ทุกลิงค์นำไปยัง profile ที่ถูกต้อง
- **SC-007**: 90% ของผู้ใช้ที่เริ่มกรอก contact form สามารถส่งสำเร็จได้ในครั้งแรก
