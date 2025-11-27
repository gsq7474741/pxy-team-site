# 组件设计

本文档介绍前端组件的设计和实现。

## 组件结构

```
components/
├── ui/                     # 基础 UI 组件 (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   ├── label.tsx
│   ├── select.tsx
│   └── ...
│
├── Navbar.tsx              # 导航栏
├── Footer.tsx              # 页脚
├── HeroSection.tsx         # 首页 Hero
├── LanguageSwitcher.tsx    # 语言切换器
├── MembersClient.tsx       # 成员列表（客户端）
├── PublicationsClient.tsx  # 成果列表（客户端）
├── OpeningCard.tsx         # 招聘卡片
└── ShareButtons.tsx        # 分享按钮
```

## 基础 UI 组件

基于 shadcn/ui 的组件，使用 Radix UI 原语和 TailwindCSS：

### Button

```typescript
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
```

### Card

```typescript
// components/ui/card.tsx
export function Card({ className, ...props }) {
  return (
    <div
      className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return <h3 className={cn("text-2xl font-semibold", className)} {...props} />;
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-6 pt-0", className)} {...props} />;
}
```

## 布局组件

### Navbar

```typescript
// components/Navbar.tsx
'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { LanguageSwitcher } from './LanguageSwitcher';

export default function Navbar() {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/research', label: t('research') },
    { href: '/publications', label: t('publications') },
    { href: '/members', label: t('members') },
    { href: '/news', label: t('news') },
    { href: '/join', label: t('join') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background border-b">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Prof. Peng Lab
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu />
          </button>
        </div>

        {/* 移动端菜单 */}
        {isMenuOpen && (
          <div className="md:hidden py-4">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="block py-2">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

### Footer

```typescript
// components/Footer.tsx
import { getTranslations } from 'next-intl/server';

export default async function Footer() {
  const t = await getTranslations('footer');

  return (
    <footer className="bg-muted py-12">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 联系信息 */}
          <div>
            <h3 className="font-semibold mb-4">{t('contact')}</h3>
            <p>{t('address')}</p>
            <p>{t('email')}</p>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="font-semibold mb-4">{t('quick_links')}</h3>
            <ul className="space-y-2">
              <li><Link href="/research">{t('research')}</Link></li>
              <li><Link href="/publications">{t('publications')}</Link></li>
              <li><Link href="/members">{t('members')}</Link></li>
            </ul>
          </div>

          {/* 社交媒体 */}
          <div>
            <h3 className="font-semibold mb-4">{t('follow_us')}</h3>
            {/* 社交链接 */}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
```

## 功能组件

### LanguageSwitcher

```typescript
// components/LanguageSwitcher.tsx
'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const [currentLocale, setCurrentLocale] = useState('zh-CN');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // 从 Cookie 读取当前语言
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    if (match) setCurrentLocale(match[1]);
  }, []);

  const switchLanguage = (locale: string) => {
    // 设置 Cookie
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${60*60*24*30}`;
    setIsOpen(false);
    // 刷新页面
    window.location.reload();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Globe className="w-4 h-4" />
        <span>{languages.find(l => l.code === currentLocale)?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 bg-background border rounded-md shadow-lg">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => switchLanguage(lang.code)}
              className="block w-full px-4 py-2 text-left hover:bg-muted"
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

### MembersClient

```typescript
// components/MembersClient.tsx
'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface Props {
  members: MemberViewModel[];
}

export default function MembersClient({ members }: Props) {
  const t = useTranslations('members');
  const [selectedRole, setSelectedRole] = useState<string>('all');

  // 按角色分组
  const groupedMembers = useMemo(() => {
    const filtered = selectedRole === 'all'
      ? members
      : members.filter(m => m.role === selectedRole);

    return {
      supervisors: filtered.filter(m => m.role === 'Supervisor'),
      phd: filtered.filter(m => m.role === 'Ph.D. Student'),
      master: filtered.filter(m => m.role === 'Master Student'),
      alumni: filtered.filter(m => m.role === 'Alumni'),
    };
  }, [members, selectedRole]);

  return (
    <div>
      {/* 筛选器 */}
      <div className="flex gap-2 mb-8">
        {['all', 'Supervisor', 'Ph.D. Student', 'Master Student', 'Alumni'].map(role => (
          <button
            key={role}
            onClick={() => setSelectedRole(role)}
            className={cn(
              "px-4 py-2 rounded-full",
              selectedRole === role ? "bg-primary text-white" : "bg-muted"
            )}
          >
            {t(`role_${role}`)}
          </button>
        ))}
      </div>

      {/* 成员列表 */}
      {Object.entries(groupedMembers).map(([key, group]) => (
        group.length > 0 && (
          <section key={key} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{t(`section_${key}`)}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {group.map(member => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          </section>
        )
      ))}
    </div>
  );
}
```

### OpeningCard

```typescript
// components/OpeningCard.tsx
'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { MapPin, Calendar, Mail } from 'lucide-react';

interface Props {
  opening: OpeningViewModel;
}

export default function OpeningCard({ opening }: Props) {
  const t = useTranslations('join');

  const positionTypeLabels = {
    Postdoc: t('type_postdoc'),
    PhD: t('type_phd'),
    Master: t('type_master'),
    RA: t('type_ra'),
    Intern: t('type_intern'),
    Engineer: t('type_engineer'),
    Other: t('type_other'),
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
            {positionTypeLabels[opening.positionType]}
          </span>
          {opening.status === 'Open' && (
            <span className="text-green-500 text-sm">{t('status_open')}</span>
          )}
        </div>
        <CardTitle className="mt-2">{opening.title}</CardTitle>
      </CardHeader>

      <CardContent>
        {opening.location && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{opening.location}</span>
          </div>
        )}
        {opening.deadlineDate && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{t('deadline')}: {opening.deadlineDate}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button asChild variant="outline">
          <Link href={`/join/${opening.slug}`}>{t('view_details')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## 组件设计原则

1. **服务端优先** - 默认使用服务端组件，只在需要交互时使用客户端组件
2. **组合优于继承** - 使用小型、可组合的组件
3. **类型安全** - 所有组件都有 TypeScript 类型定义
4. **无障碍** - 使用 Radix UI 确保无障碍支持
5. **响应式** - 使用 TailwindCSS 实现响应式设计
