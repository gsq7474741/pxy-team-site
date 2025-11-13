"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

/**
 * 语言切换组件
 * 支持中文(zh-CN)和英文(en)切换
 */
export default function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState<string>("zh-CN");
  const [isOpen, setIsOpen] = useState(false);

  // 从 cookie 读取当前语言
  useEffect(() => {
    const locale = getCookie("NEXT_LOCALE") || "zh-CN";
    setCurrentLocale(locale);
  }, []);

  // 切换语言
  const switchLanguage = (locale: string) => {
    // 保存到 cookie（30天过期）
    setCookie("NEXT_LOCALE", locale, 30);
    setCurrentLocale(locale);
    setIsOpen(false);
    
    // 刷新页面以应用新语言
    window.location.reload();
  };

  const languages = [
    { code: "zh-CN", name: "中文", icon: "🇨🇳" },
    { code: "en", name: "English", icon: "🇺🇸" },
  ];

  const currentLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
        <span className="hidden sm:inline">{currentLanguage.icon} {currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.icon}</span>
      </Button>

      {isOpen && (
        <>
          {/* 点击外部关闭 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          {/* 下拉菜单 */}
          <div className="absolute right-0 mt-2 w-40 bg-background border rounded-md shadow-lg z-50">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => switchLanguage(language.code)}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between"
              >
                <span>
                  <span className="mr-2">{language.icon}</span>
                  {language.name}
                </span>
                {currentLocale === language.code && (
                  <span className="text-primary">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Cookie 工具函数
function setCookie(name: string, value: string, days: number) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
