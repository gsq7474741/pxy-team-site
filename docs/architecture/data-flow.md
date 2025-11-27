# 数据流设计

本文档详细描述系统中数据的流动方式。

## 整体数据流

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              数据来源                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Strapi 管理面板  │  │   PostgreSQL    │  │    阿里云 OSS   │          │
│  │  (内容编辑)      │  │   (数据存储)     │  │   (媒体存储)    │          │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘          │
└───────────┼─────────────────────┼────────────────────┼──────────────────┘
            │                     │                    │
            ▼                     ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Strapi REST API                                  │
│                   cms.prof-peng.team/api/*                               │
│                                                                         │
│  • /api/members          - 团队成员                                      │
│  • /api/publications     - 论文成果                                      │
│  • /api/research-areas   - 研究方向                                      │
│  • /api/news-items       - 新闻动态                                      │
│  • /api/openings         - 招聘岗位                                      │
│  • /api/patents          - 专利                                         │
│  • /api/awards           - 获奖                                         │
└─────────────────────────────────────────────────────────────────────────┘
            │
            │ HTTP Request
            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       Next.js 前端                                       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    lib/strapi-client.ts                              ││
│  │                    (API 客户端层)                                     ││
│  │                                                                      ││
│  │  • newsApi.getNewsList()                                             ││
│  │  • memberApi.getMemberList()                                         ││
│  │  • publicationApi.getPublicationList()                               ││
│  │  • researchApi.getResearchAreaList()                                 ││
│  │  • ...                                                               ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    lib/transformers.ts                               ││
│  │                    (数据转换层)                                       ││
│  │                                                                      ││
│  │  Strapi Response  →  ViewModel                                       ││
│  │  (原始格式)            (前端使用格式)                                  ││
│  └─────────────────────────────────────────────────────────────────────┘│
│                              │                                          │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐│
│  │                    React 组件                                        ││
│  │                    (展示层)                                          ││
│  │                                                                      ││
│  │  • Server Components (服务端渲染)                                     ││
│  │  • Client Components (客户端交互)                                     ││
│  └─────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────┘
```

## 数据获取模式

### 服务端组件数据获取

大部分页面使用服务端组件直接获取数据：

```typescript
// app/page.tsx (Server Component)
export default async function Home() {
  // 直接在组件中调用 API
  const { data: researchAreas } = await researchApi.getResearchAreaList();
  const { data: latestNews } = await newsApi.getNewsList(1, 2);
  
  return (
    <div>
      {/* 使用数据渲染 */}
    </div>
  );
}
```

### 客户端组件数据获取

需要交互的组件使用客户端数据获取：

```typescript
// components/PublicationsClient.tsx (Client Component)
'use client';

export function PublicationsClient({ initialData }) {
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState('all');
  
  // 客户端筛选/排序等操作
  const filteredData = useMemo(() => {
    return data.filter(item => ...);
  }, [data, filter]);
  
  return (
    <div>
      {/* 交互式 UI */}
    </div>
  );
}
```

## 数据转换流程

### Strapi 原始数据

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "title": "论文标题",
      "publication_venue": "期刊名",
      "year": 2024,
      "pdf_file": {
        "id": 1,
        "url": "/uploads/paper.pdf"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "meta": {
    "pagination": { "page": 1, "pageSize": 10, "total": 50 }
  }
}
```

### 转换后的 ViewModel

```typescript
interface PublicationViewModel {
  id: string;           // "abc123" (使用 documentId)
  title: string;        // "论文标题"
  publicationVenue: string;  // "期刊名" (驼峰命名)
  year: string;         // "2024" (转为字符串)
  pdfFile?: MediaFile;  // { id, url: "https://oss.xxx/uploads/paper.pdf" }
  createdAt: string;
}
```

### 转换器实现

```typescript
// lib/transformers.ts
export const transformPublication = (strapiPublication: any): PublicationViewModel => {
  const id = strapiPublication.documentId || strapiPublication.id;
  const data = strapiPublication.attributes || strapiPublication;
  
  return {
    id: id?.toString() || '',
    title: data?.title || '',
    publicationVenue: data?.publication_venue || '',
    year: data?.year?.toString() || '',
    pdfFile: transformMediaFile(data?.pdf_file),
    createdAt: data?.createdAt || ''
  };
};
```

## 缓存策略

### Next.js ISR 缓存

```typescript
// app/page.tsx
export const revalidate = 300; // 5分钟缓存
```

### 按需重验证

```typescript
// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const { secret, path } = await request.json();
  
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }
  
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

### Strapi Webhook 触发

```
内容更新 → Strapi Webhook → /api/revalidate → 清除缓存
```

## 国际化数据流

### 请求时 Locale 传递

```typescript
// lib/strapi-client.ts
async getNewsList(page, pageSize, locale?: string) {
  const effectiveLocale = locale || getServerLocale();
  
  const response = await newsCollection.find({
    locale: effectiveLocale,  // 传递给 Strapi
    // ...
  });
}
```

### 多语言内容结构

Strapi 中同一内容的不同语言版本：

```
Document ID: abc123
├── locale: zh-CN
│   └── title: "研究方向介绍"
└── locale: en
    └── title: "Research Introduction"
```

## 媒体文件处理

### URL 转换

```typescript
// lib/transformers.ts
export const getStrapiMedia = (url: string | null): string | null => {
  if (!url) return null;
  
  // 已经是完整 URL
  if (url.startsWith('http') || url.startsWith('//')) return url;
  
  // 添加 Strapi 基础 URL
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/api$/, '');
  return `${baseUrl}${url}`;
};
```

### 图片格式

Strapi 自动生成多种尺寸：

```typescript
interface MediaFile {
  id: number;
  url: string;
  formats?: {
    thumbnail?: { url: string };  // 小缩略图
    small?: { url: string };      // 小图
    medium?: { url: string };     // 中图
    large?: { url: string };      // 大图
  };
}
```

## 错误处理

### API 层错误处理

```typescript
// lib/strapi-client.ts
async getNewsList(...) {
  try {
    const response = await newsCollection.find({...});
    return { data: transformNewsList(response.data) };
  } catch (error) {
    console.error('获取新闻列表失败:', error);
    throw error;
  }
}
```

### 页面层错误处理

```typescript
// app/page.tsx
let researchAreas = [];
try {
  const res = await researchApi.getResearchAreaList();
  researchAreas = res.data;
} catch (error) {
  console.error("获取研究方向失败:", error);
  // 显示空列表或错误提示
}
```
