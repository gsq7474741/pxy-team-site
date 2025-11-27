# 前端概述

前端使用 Next.js 15 构建，采用 App Router 架构，支持服务端渲染和增量静态再生。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 15.4.x | React 全栈框架 |
| React | 19.1.x | UI 库 |
| TypeScript | 5.x | 类型安全 |
| TailwindCSS | 4.x | 样式框架 |
| next-intl | 4.5.x | 国际化 |
| @strapi/client | 1.4.x | API 客户端 |
| Radix UI | latest | 无障碍组件 |
| Lucide React | latest | 图标库 |

## 目录结构

```
packages/frontend/
├── app/                # 页面和路由
├── components/         # React 组件
├── lib/                # 工具库和 API
├── i18n/               # 国际化配置
├── messages/           # 翻译文件
└── public/             # 静态资源
```

## 核心概念

### App Router

Next.js 15 使用 App Router，每个文件夹代表一个路由段：

```
app/
├── page.tsx           # /
├── research/
│   ├── page.tsx       # /research
│   └── [slug]/
│       └── page.tsx   # /research/:slug
└── members/
    ├── page.tsx       # /members
    └── [slug]/
        └── page.tsx   # /members/:slug
```

### Server vs Client Components

- **Server Components** (默认) - 在服务端渲染，可直接访问数据库
- **Client Components** (`'use client'`) - 在客户端渲染，支持交互

```typescript
// Server Component (默认)
export default async function Page() {
  const data = await fetchData(); // 服务端获取数据
  return <div>{data}</div>;
}

// Client Component
'use client';
export default function Button() {
  const [count, setCount] = useState(0); // 客户端状态
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### 数据获取

服务端组件直接使用 async/await：

```typescript
// app/research/page.tsx
export default async function ResearchPage() {
  const { data } = await researchApi.getResearchAreaList();
  return <ResearchList items={data} />;
}
```

### 缓存与重验证

```typescript
// 设置页面缓存时间
export const revalidate = 300; // 5分钟

// 按需重验证
import { revalidatePath } from 'next/cache';
revalidatePath('/research');
```

## 关键文件

| 文件 | 说明 |
|------|------|
| `app/layout.tsx` | 根布局，包含 Navbar/Footer |
| `lib/strapi-client.ts` | Strapi API 封装 |
| `lib/types.ts` | TypeScript 类型定义 |
| `lib/transformers.ts` | 数据转换函数 |
| `next.config.ts` | Next.js 配置 |

## 配置说明

### `next.config.ts`

```typescript
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,  // OSS 图片不使用 Next.js 优化
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '1337' },
    ],
  },
};

export default withNextIntl(nextConfig);
```

## 下一步

- 了解 [路由与页面](/frontend/pages)
- 查看 [组件设计](/frontend/components)
- 学习 [Strapi 客户端](/frontend/strapi-client)
