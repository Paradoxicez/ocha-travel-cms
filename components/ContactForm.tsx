"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, isBefore, startOfDay } from "date-fns";
import { th, enUS } from "date-fns/locale";
import { sendGAEvent } from "@next/third-parties/google";
import {
  Phone,
  MessageCircle,
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Shield,
} from "lucide-react";
import type { Dictionary, Lang } from "@/app/[lang]/dictionaries";
import "react-day-picker/style.css";

type FormState = "idle" | "submitting" | "success" | "error";
type Errors = Partial<Record<string, string>>;

export default function ContactForm({
  dict,
  lang,
}: {
  dict: Dictionary;
  lang: Lang;
}) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  const dateLocale = lang === "th" ? th : enUS;
  const v = dict.contact.validation;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      ) {
        setShowCalendar(false);
      }
    }
    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showCalendar]);

  function validate(fd: FormData): Errors {
    const errs: Errors = {};
    const name = fd.get("name") as string;
    const phone = fd.get("phone") as string;
    const email = fd.get("email") as string;
    const serviceType = fd.get("serviceType") as string;
    const message = fd.get("message") as string;

    if (!name?.trim()) errs.name = v.nameRequired;
    if (!phone?.trim()) errs.phone = v.phoneRequired;
    else if (!/^0\d{9}$/.test(phone.trim())) errs.phone = v.phoneInvalid;
    if (!email?.trim()) errs.email = v.emailRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = v.emailInvalid;
    if (!serviceType) errs.serviceType = v.serviceTypeRequired;
    if (selectedDates.length === 0) errs.serviceDate = v.serviceDateRequired;
    if (!message?.trim()) errs.message = v.messageRequired;

    return errs;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const errs = validate(fd);

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setFormState("submitting");

    try {
      sendGAEvent("event", "form_submission_start", {
        form_name: "contact_form",
        service_type: fd.get("serviceType") as string,
      });

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          email: fd.get("email"),
          serviceType: fd.get("serviceType"),
          driverPreference: fd.get("driverPreference"),
          serviceDates: selectedDates
            .sort((a, b) => a.getTime() - b.getTime())
            .map((d) => format(d, "yyyy-MM-dd")),
          message: fd.get("message"),
          honeypot: fd.get("honeypot"),
          locale: lang,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setFormState("success");
        sendGAEvent("event", "form_submission_success", {
          form_name: "contact_form",
        });
      } else {
        setFormState("error");
        sendGAEvent("event", "form_submission_error", {
          form_name: "contact_form",
        });
      }
    } catch {
      setFormState("error");
      sendGAEvent("event", "form_submission_error", {
        form_name: "contact_form",
      });
    }
  }

  const formatSelectedDates = () => {
    if (selectedDates.length === 0) return "";
    if (selectedDates.length === 1)
      return format(selectedDates[0], "PPP", { locale: dateLocale });
    const sorted = [...selectedDates].sort(
      (a, b) => a.getTime() - b.getTime()
    );
    return `${format(sorted[0], "d MMM", { locale: dateLocale })} — ${format(sorted[sorted.length - 1], "d MMM yyyy", { locale: dateLocale })} (${selectedDates.length} ${lang === "th" ? "วัน" : "days"})`;
  };

  const inputClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm text-secondary placeholder:text-zinc-400 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const trustItems = [
    { icon: <Shield className="h-5 w-5" />, text: lang === "th" ? "ปลอดภัย 100%" : "100% Safe" },
    { icon: <Clock className="h-5 w-5" />, text: lang === "th" ? "ตอบกลับภายใน 30 นาที" : "Reply within 30 min" },
    { icon: <MapPin className="h-5 w-5" />, text: lang === "th" ? "บริการทั่วประเทศ" : "Nationwide service" },
  ];

  return (
    <section id="contact" className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
            {dict.contact.title}
          </h2>
          <h3 className="mb-4 text-4xl font-bold text-secondary md:text-5xl">
            {dict.contact.subtitle}
          </h3>
          <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-6">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="text-primary">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-5">
          {/* Left - Contact info */}
          <div className="lg:col-span-2">
            <div className="sticky top-28 space-y-6">
              <div className="overflow-hidden rounded-3xl bg-primary p-8 text-white">
                <h4 className="mb-2 text-2xl font-bold">
                  {lang === "th" ? "ติดต่อโดยตรง" : "Contact Directly"}
                </h4>
                <p className="mb-8 text-sm text-rose-100">
                  {lang === "th"
                    ? "โทรหาเราหรือแชทผ่าน Line ได้ทันที"
                    : "Call us or chat via Line instantly"}
                </p>
                <div className="space-y-4">
                  <a
                    href="tel:0661244999"
                    className="flex items-center gap-4 rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm transition-all hover:bg-white/25"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-rose-200">
                        {lang === "th" ? "โทรเลย" : "Call now"}
                      </div>
                      <div className="text-lg font-bold">066-124-4999</div>
                    </div>
                  </a>
                  <a
                    href={process.env.NEXT_PUBLIC_LINE_URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-2xl bg-white/15 px-5 py-4 backdrop-blur-sm transition-all hover:bg-white/25"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs text-rose-200">Line</div>
                      <div className="text-lg font-bold">@Ocha Travel</div>
                    </div>
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-100 bg-zinc-50 p-6 text-center">
                <div className="text-4xl font-bold text-primary">24/7</div>
                <div className="mt-1 text-sm text-zinc-500">
                  {lang === "th" ? "พร้อมให้บริการตลอด" : "Always available"}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-3">
            {formState === "success" ? (
              <div className="rounded-3xl border border-zinc-100 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="mb-2 text-2xl font-bold text-secondary">
                  {lang === "th" ? "ส่งข้อความสำเร็จ!" : "Message Sent!"}
                </h4>
                <p className="text-zinc-500">{dict.contact.form.success}</p>
              </div>
            ) : (
              <div className="rounded-3xl border border-zinc-100 bg-white p-8 shadow-sm md:p-10">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <input
                    type="text"
                    name="honeypot"
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute -left-[9999px] opacity-0"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-secondary">
                        {dict.contact.form.name}
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={dict.contact.form.namePlaceholder}
                        className={inputClass}
                        maxLength={100}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-secondary">
                        {dict.contact.form.phone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={dict.contact.form.phonePlaceholder}
                        className={inputClass}
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                      {dict.contact.form.email}
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder={dict.contact.form.emailPlaceholder}
                      className={inputClass}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-secondary">
                        {dict.contact.form.serviceType}
                      </label>
                      <select
                        name="serviceType"
                        className={`${inputClass} appearance-none`}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {dict.contact.form.serviceTypePlaceholder}
                        </option>
                        {dict.contact.serviceTypes.map((st) => (
                          <option key={st.value} value={st.value}>
                            {st.label}
                          </option>
                        ))}
                      </select>
                      {errors.serviceType && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.serviceType}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-secondary">
                        {dict.contact.form.driverPreference}
                      </label>
                      <select
                        name="driverPreference"
                        className={`${inputClass} appearance-none`}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {dict.contact.form.driverPreferencePlaceholder}
                        </option>
                        {dict.contact.driverTypes.map((dt) => (
                          <option key={dt.value} value={dt.value}>
                            {dt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div ref={calendarRef} className="relative">
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                      {dict.contact.form.serviceDate}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(!showCalendar)}
                      className={`${inputClass} flex items-center gap-2 text-left ${selectedDates.length === 0 ? "text-zinc-400" : ""}`}
                    >
                      <Calendar className="h-4 w-4 shrink-0 text-zinc-400" />
                      <span className="truncate">
                        {selectedDates.length > 0
                          ? formatSelectedDates()
                          : dict.contact.form.serviceDatePlaceholder}
                      </span>
                      {selectedDates.length > 0 && (
                        <span className="ml-auto shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                          {selectedDates.length}
                        </span>
                      )}
                    </button>
                    {showCalendar && (
                      <div className="absolute left-0 top-full z-50 mt-2 rounded-2xl border border-zinc-200 bg-white p-3 shadow-2xl sm:left-auto sm:right-0">
                        <DayPicker
                          mode="multiple"
                          selected={selectedDates}
                          onSelect={(dates) => setSelectedDates(dates || [])}
                          disabled={(date) =>
                            isBefore(date, startOfDay(new Date()))
                          }
                          locale={dateLocale}
                        />
                        {selectedDates.length > 0 && (
                          <div className="mt-2 flex items-center justify-between border-t border-zinc-100 px-2 pt-2">
                            <span className="text-xs text-zinc-500">
                              {selectedDates.length} {lang === "th" ? "วันที่เลือก" : "dates selected"}
                            </span>
                            <button
                              type="button"
                              onClick={() => setSelectedDates([])}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              {lang === "th" ? "ล้างทั้งหมด" : "Clear all"}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    {errors.serviceDate && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.serviceDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                      {dict.contact.form.message}
                    </label>
                    <textarea
                      name="message"
                      placeholder={dict.contact.form.messagePlaceholder}
                      rows={4}
                      className={inputClass}
                      maxLength={1000}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {formState === "error" && (
                    <p className="text-center text-sm text-red-500">
                      {dict.contact.form.error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full rounded-xl bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-rose-600 disabled:opacity-70"
                  >
                    {formState === "submitting"
                      ? dict.contact.form.submitting
                      : dict.contact.form.submit}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
