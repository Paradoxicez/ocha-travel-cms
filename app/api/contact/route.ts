import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const SERVICE_TYPES = new Set([
  "sedan",
  "suv",
  "van-10",
  "vip-van",
  "large-van",
  "pickup",
  "other",
]);

const serviceLabels: Record<string, Record<string, string>> = {
  th: {
    sedan: "รถเก๋ง (Sedan)",
    suv: "รถ SUV",
    "vip-van": "รถตู้ VIP + Alphard",
    "van-10": "รถตู้ 10 ที่นั่ง",
    "large-van": "รถตู้ใหญ่ (13 ที่นั่ง)",
    pickup: "รถกระบะ + รถ 6 ล้อ, 10 ล้อ",
    other: "อื่นๆ",
  },
  en: {
    sedan: "Sedan",
    suv: "SUV",
    "vip-van": "VIP Van + Alphard",
    "van-10": "Van 10 Seats",
    "large-van": "Large Van (13 seats)",
    pickup: "Pickup Truck + 6-Wheeler, 10-Wheeler",
    other: "Other",
  },
};

type ContactBody = {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  driverPreference?: string;
  serviceDates: string[];
  message: string;
  honeypot?: string;
  locale: string;
};

export async function POST(request: Request) {
  try {
    const body: ContactBody = await request.json();

    // Honeypot check — return fake success
    if (body.honeypot) {
      return NextResponse.json({ success: true, message: "ส่งข้อความสำเร็จ" });
    }

    // Server-side validation
    const errors: Record<string, string> = {};

    if (!body.name?.trim() || body.name.length > 100) {
      errors.name = "กรุณากรอกชื่อ";
    }
    if (!body.phone?.trim() || !/^0\d{9}$/.test(body.phone.trim())) {
      errors.phone = "กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง";
    }
    if (
      !body.email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ) {
      errors.email = "กรุณากรอก email ให้ถูกต้อง";
    }
    if (!body.serviceType || !SERVICE_TYPES.has(body.serviceType)) {
      errors.serviceType = "กรุณาเลือกประเภทบริการ";
    }
    if (!body.serviceDates || !Array.isArray(body.serviceDates) || body.serviceDates.length === 0) {
      errors.serviceDate = "กรุณาเลือกวันที่ต้องการใช้บริการ";
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      for (const d of body.serviceDates) {
        const date = new Date(d);
        if (isNaN(date.getTime()) || date < today) {
          errors.serviceDate = "กรุณาเลือกวันที่ในอนาคต";
          break;
        }
      }
    }
    if (!body.message?.trim() || body.message.length > 1000) {
      errors.message = "กรุณากรอกข้อความ";
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "กรุณากรอกข้อมูลให้ครบถ้วน",
          errors,
        },
        { status: 400 },
      );
    }

    const locale = body.locale === "en" ? "en" : "th";
    const serviceLabel =
      serviceLabels[locale]?.[body.serviceType] || body.serviceType;
    const driverLabel = body.driverPreference
      ? locale === "th"
        ? { male: "พนักงานขับรถผู้ชาย", female: "พนักงานขับรถผู้หญิง", any: "พนักงานขับรถทั่วไป" }[body.driverPreference] || body.driverPreference
        : { male: "Male Driver", female: "Female Driver", any: "Any Driver" }[body.driverPreference] || body.driverPreference
      : "-";
    const serviceDatesStr = body.serviceDates.join(", ");
    const submittedAt = new Date().toLocaleString(
      locale === "th" ? "th-TH" : "en-US",
      { dateStyle: "long", timeStyle: "short" },
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"Ocha Travel" <${process.env.GMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      replyTo: body.email,
      subject: `[Ocha Travel] New inquiry from ${escapeHtml(body.name)} - ${serviceLabel}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          <tr><td style="padding:8px;font-weight:bold">Name:</td><td style="padding:8px">${escapeHtml(body.name)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Phone:</td><td style="padding:8px">${escapeHtml(body.phone)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px">${escapeHtml(body.email)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Service Type:</td><td style="padding:8px">${escapeHtml(serviceLabel)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Driver Preference:</td><td style="padding:8px">${escapeHtml(driverLabel)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Service Dates:</td><td style="padding:8px">${escapeHtml(serviceDatesStr)}</td></tr>
          <tr><td style="padding:8px;font-weight:bold">Message:</td><td style="padding:8px">${escapeHtml(body.message)}</td></tr>
        </table>
        <hr style="margin:16px 0"/>
        <p style="color:#888;font-size:12px">Submitted: ${submittedAt} | Language: ${locale}</p>
      `,
    });

    return NextResponse.json({ success: true, message: "ส่งข้อความสำเร็จ" });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
      { status: 500 },
    );
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
