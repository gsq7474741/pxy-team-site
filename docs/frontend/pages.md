# 路由与页面

本文档详细介绍前端的路由结构和各页面的实现。

## 路由结构

```
app/
├── page.tsx                    # /            首页
├── layout.tsx                  # 根布局
├── globals.css                 # 全局样式
│
├── research/
│   ├── page.tsx                # /research    研究方向列表
│   └── [slug]/
│       └── page.tsx            # /research/:slug  研究方向详情
│
├── members/
│   ├── page.tsx                # /members     团队成员列表
│   └── [slug]/
│       └── page.tsx            # /members/:slug   成员详情
│
├── publications/
│   └── page.tsx                # /publications    成果概览
│
├── news/
│   ├── page.tsx                # /news        新闻列表
│   └── [id]/
│       └── page.tsx            # /news/:id    新闻详情
│
├── join/
│   ├── page.tsx                # /join        加入我们（岗位列表）
│   └── [slug]/
│       └── page.tsx            # /join/:slug  岗位详情
│
├── contact/
│   └── page.tsx                # /contact     联系我们
│
├── patent/
│   └── page.tsx                # /patent      专利页面
│
├── recruit/
│   └── page.tsx                # /recruit     招聘页面
│
└── api/
    └── revalidate/
        └── route.ts            # ISR 重验证 API
```

## 根布局

### `app/layout.tsx`

```typescript
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

## 首页

### `app/page.tsx`

首页包含 Hero 区域、研究方向预览和最新新闻：

```typescript
export const revalidate = 300; // 5分钟缓存

export default async function Home() {
  const t = await getTranslations('home');
  const locale = await getLocale();
  
  // 获取研究方向
  let researchAreas = [];
  try {
    const res = await researchApi.getResearchAreaList(1, 100, locale);
    researchAreas = res.data.sort((a, b) => a.order - b.order).slice(0, 3);
  } catch (error) {
    console.error("获取研究方向失败:", error);
  }
  
  // 获取最新新闻
  let latestNews = [];
  try {
    const newsRes = await newsApi.getNewsList(1, 2);
    latestNews = newsRes.data;
  } catch (error) {
    console.error("获取新闻列表失败:", error);
  }
  
  return (
    <div>
      <HeroSection />
      
      {/* 研究方向 */}
      <section>
        <h2>{t('research_title')}</h2>
        <div className="grid grid-cols-3 gap-6">
          {researchAreas.map(area => (
            <Card key={area.id}>
              <CardTitle>{area.title}</CardTitle>
              <CardContent>{area.description}</CardContent>
              <Link href={`/research/${area.slug}`}>了解更多</Link>
            </Card>
          ))}
        </div>
      </section>
      
      {/* 最新新闻 */}
      <section>
        <h2>{t('news_title')}</h2>
        {/* ... */}
      </section>
    </div>
  );
}
```

## 动态路由页面

### 研究方向详情 `app/research/[slug]/page.tsx`

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResearchDetailPage({ params }: PageProps) {
  const { slug } = await params;  // Next.js 15 需要 await
  const locale = await getLocale();
  
  let researchArea;
  try {
    researchArea = await researchApi.getResearchAreaBySlug(slug, locale);
  } catch (error) {
    notFound();  // 返回 404
  }
  
  return (
    <div>
      <h1>{researchArea.title}</h1>
      <p>{researchArea.description}</p>
      
      {/* 相关论文 */}
      {researchArea.relatedPublications?.length > 0 && (
        <section>
          <h2>相关论文</h2>
          {/* ... */}
        </section>
      )}
    </div>
  );
}
```

### 成员详情 `app/members/[slug]/page.tsx`

```typescript
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  
  let member;
  try {
    member = await memberApi.getMemberBySlug(slug, locale);
  } catch (error) {
    notFound();
  }
  
  return (
    <div>
      {member.photo && (
        <Image src={member.photo.url} alt={member.name} />
      )}
      <h1>{member.name}</h1>
      <p>{member.englishName}</p>
      <p>{member.role}</p>
      <div dangerouslySetInnerHTML={{ __html: member.bio }} />
    </div>
  );
}
```

## 列表页面

### 成果概览 `app/publications/page.tsx`

使用客户端组件实现筛选功能：

```typescript
export default async function PublicationsPage() {
  const locale = await getLocale();
  
  // 获取所有数据
  const [publications, patents, awards, researchAreas] = await Promise.all([
    publicationApi.getPublicationList(1, 100, locale),
    patentsApi.getPatentList(1, 100, locale),
    awardsApi.getAwardList(1, 100, locale),
    researchApi.getResearchAreaList(1, 100, locale),
  ]);
  
  return (
    <PublicationsClient
      publications={publications.data}
      patents={patents.data}
      awards={awards.data}
      researchAreas={researchAreas.data}
    />
  );
}
```

## API 路由

### ISR 重验证 `app/api/revalidate/route.ts`

```typescript
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, path, tag } = body;
    
    // 验证密钥
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json(
        { error: 'Invalid secret' },
        { status: 401 }
      );
    }
    
    // 重验证路径或标签
    if (path) {
      revalidatePath(path);
    }
    if (tag) {
      revalidateTag(tag);
    }
    
    return NextResponse.json({ revalidated: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error revalidating' },
      { status: 500 }
    );
  }
}
```

## Next.js 15 注意事项

### 动态参数需要 await

```typescript
// Next.js 15 中 params 是 Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;  // 必须 await
}
```

### 服务端获取 Cookies

```typescript
import { cookies } from 'next/headers';

// 必须 await
const cookieStore = await cookies();
const locale = cookieStore.get('NEXT_LOCALE')?.value;
```

## 错误处理

### 404 页面

```typescript
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const data = await fetchData(params.id);
  
  if (!data) {
    notFound();  // 显示 404 页面
  }
  
  return <div>{data}</div>;
}
```

### 错误边界

```typescript
// app/error.tsx
'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>出错了</h2>
      <button onClick={() => reset()}>重试</button>
    </div>
  );
}
```
