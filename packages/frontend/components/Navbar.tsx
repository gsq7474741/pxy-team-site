"use client";

import * as React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from "./LanguageSwitcher";

// 导航项定义
const navItemsKeys = [
  { key: "home", href: "/" },
  { key: "news", href: "/news" },
  { key: "research", href: "/research" },
  { key: "members", href: "/members" },
  { key: "publications", href: "/publications" },
  { key: "join", href: "/join" },
  { key: "contact", href: "/contact" },
] as const;

export default function Navbar() {
  const t = useTranslations('nav');
  const tHero = useTranslations('hero');
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">{tHero('title')}</span>
        </Link>

        {/* 桌面导航 */}
        <div className="hidden md:flex md:items-center md:space-x-4 lg:space-x-6">
          {navItemsKeys.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`px-3 py-2 text-sm transition-colors hover:text-primary ${pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"}`}
            >
              {t(item.key)}
            </Link>
          ))}
          {/* 语言切换器 */}
          <LanguageSwitcher />
        </div>

        {/* 移动端右侧按钮组 */}
        <div className="md:hidden flex items-center gap-2">
          {/* 语言切换器 */}
          <LanguageSwitcher />
          
          {/* 移动端菜单按钮 */}
          <button
            className="flex items-center justify-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* 移动端菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-sm border-b">
          <div className="max-w-screen-xl mx-auto py-2 px-4">
            {navItemsKeys.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`block px-3 py-2 text-sm transition-colors hover:text-primary ${pathname === item.href ? "text-primary font-medium" : "text-muted-foreground"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(item.key)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
