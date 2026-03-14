"use client";

import { Phone } from "lucide-react";
import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";

const WECHAT_ID = "_ochatravel_999";

const floatingSocials = [
  {
    platform: "line",
    url: process.env.NEXT_PUBLIC_LINE_URL || "#",
    color: "bg-[#06C755]",
    label: "Chat on Line",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
      </svg>
    ),
  },
  {
    platform: "facebook",
    url: process.env.NEXT_PUBLIC_FACEBOOK_URL || "#",
    color: "bg-[#1877F2]",
    label: "Facebook",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    platform: "instagram",
    url: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#",
    color: "bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    label: "Instagram",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.882 0 1.441 1.441 0 012.882 0z" />
      </svg>
    ),
  },
  {
    platform: "whatsapp",
    url: process.env.NEXT_PUBLIC_WHATSAPP_URL || "#",
    color: "bg-[#25D366]",
    label: "WhatsApp",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  {
    platform: "messenger",
    url: process.env.NEXT_PUBLIC_MESSENGER_URL || "#",
    color: "bg-[#0084FF]",
    label: "Messenger",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.001 11.639C.001 4.949 5.241 0 12.001 0S24 4.95 24 11.639c0 6.689-5.24 11.638-12 11.638-1.21 0-2.38-.16-3.47-.46a.96.96 0 00-.64.05l-2.39 1.05a.96.96 0 01-1.35-.85l-.07-2.14a.97.97 0 00-.32-.68A11.39 11.389 0 01.002 11.64zm8.32-2.19l-3.52 5.6c-.35.53.32 1.139.82.75l3.79-2.87c.26-.2.6-.2.87 0l2.8 2.1c.84.63 2.04.4 2.6-.48l3.52-5.6c.35-.53-.32-1.13-.82-.75l-3.79 2.87c-.25.2-.6.2-.86 0l-2.8-2.1a1.8 1.8 0 00-2.61.48z" />
      </svg>
    ),
  },
  {
    platform: "telegram",
    url: process.env.NEXT_PUBLIC_TELEGRAM_URL || "#",
    color: "bg-[#26A5E4]",
    label: "Telegram",
    icon: (
      <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

const wechatIcon = (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05a6.937 6.937 0 01-.263-1.857c0-3.74 3.46-6.778 7.725-6.778.264 0 .524.013.78.04C16.712 4.842 13.05 2.188 8.691 2.188zm-2.6 4.408c.56 0 1.016.455 1.016 1.016 0 .56-.456 1.016-1.016 1.016S5.075 8.172 5.075 7.612c0-.56.456-1.016 1.016-1.016zm5.21 0c.56 0 1.017.455 1.017 1.016 0 .56-.457 1.016-1.016 1.016-.56 0-1.017-.456-1.017-1.016 0-.56.457-1.016 1.017-1.016zm4.661 4.066c-3.743 0-6.783 2.674-6.783 5.972 0 3.3 3.04 5.973 6.783 5.973.737 0 1.45-.105 2.121-.3a.723.723 0 01.6.082l1.418.83a.272.272 0 00.14.045c.133 0 .244-.11.244-.245 0-.06-.024-.12-.04-.178l-.29-1.104a.493.493 0 01.177-.556C21.155 19.933 22.244 18.19 22.244 16.634c0-3.298-3.04-5.972-6.783-5.972h.001zm-2.348 3.397c.467 0 .847.38.847.847 0 .468-.38.847-.847.847a.847.847 0 01-.847-.847c0-.467.38-.847.847-.847zm4.696 0c.467 0 .847.38.847.847 0 .468-.38.847-.847.847a.847.847 0 01-.847-.847c0-.467.38-.847.847-.847z" />
  </svg>
);

type FloatingProps = {
  content?: {
    socialLinks?: { platform: string; url: string }[];
    contact?: { phone: string } | null;
  };
};

export default function FloatingButtons({ content }: FloatingProps) {
  const [showWeChat, setShowWeChat] = useState(false);
  const [copied, setCopied] = useState(false);

  const phone = content?.contact?.phone || "0661244999";

  // Override floatingSocials URLs with DB data if available
  const socials = content?.socialLinks && content.socialLinks.length > 0
    ? floatingSocials.map((fs) => {
        const match = content.socialLinks!.find((s) => s.platform.toLowerCase() === fs.platform.toLowerCase());
        return match ? { ...fs, url: match.url } : fs;
      })
    : floatingSocials;

  // For WeChat
  const wechatData = content?.socialLinks?.find((s) => s.platform.toLowerCase() === "wechat");
  const wechatId = wechatData?.url || WECHAT_ID;

  function handleCopy() {
    navigator.clipboard.writeText(wechatId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
    sendGAEvent("event", "social_link_click", {
      platform: "wechat",
      link_location: "floating",
    });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {socials.map((s) => (
        <a
          key={s.platform}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex h-12 w-12 items-center justify-center rounded-full ${s.color} text-white shadow-2xl transition-transform hover:scale-110 active:scale-90`}
          aria-label={s.label}
        >
          {s.icon}
        </a>
      ))}

      {/* WeChat with tooltip */}
      <div className="relative">
        {showWeChat && (
          <div className="absolute bottom-0 right-14 flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-4 py-3 shadow-2xl ring-1 ring-zinc-100">
            <span className="text-sm font-medium text-zinc-700">
              WeChat ID:
            </span>
            <code className="rounded bg-zinc-100 px-2 py-0.5 text-sm font-bold text-zinc-900">
              {wechatId}
            </code>
            <button
              onClick={handleCopy}
              className="rounded-lg bg-[#07C160] px-3 py-1 text-xs font-bold text-white transition-colors hover:bg-[#06a850]"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        <button
          onClick={() => setShowWeChat(!showWeChat)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#07C160] text-white shadow-2xl transition-transform hover:scale-110 active:scale-90"
          aria-label="WeChat: ochatravel_999"
        >
          {wechatIcon}
        </button>
      </div>

      <a
        href={`tel:${phone}`}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-110 active:scale-90"
        aria-label="Call Us"
      >
        <Phone className="h-7 w-7" />
      </a>
    </div>
  );
}
