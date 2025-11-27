# Strapi 客户端

本文档介绍前端与 Strapi 后端通信的 API 客户端实现。

## 概述

前端使用 `@strapi/client` 官方 SDK 与后端通信，并在其上封装了一层业务 API。

```
┌─────────────────────┐
│   React 组件        │
└──────────┬──────────┘
           │ 调用
           ▼
┌─────────────────────┐
│  strapi-client.ts   │  ← 业务 API 层
│  (业务封装)          │
└──────────┬──────────┘
           │ 调用
           ▼
┌─────────────────────┐
│  @strapi/client     │  ← 官方 SDK
│  (HTTP 通信)         │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│  Strapi REST API    │
└─────────────────────┘
```

## 客户端初始化

```typescript
// lib/strapi-client.ts
import { strapi } from '@strapi/client';

const client = strapi({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
});

export default client;
```

## API 模块

### newsApi - 新闻

```typescript
export const newsApi = {
  // 获取新闻列表
  async getNewsList(page = 1, pageSize = 10, locale?: string) {
    const newsCollection = client.collection('news-items');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await newsCollection.find({
      locale: effectiveLocale,
      pagination: { page, pageSize },
      sort: ['publish_date:desc'],
      populate: ['cover_image'],
    });
    
    return {
      data: transformNewsList(response.data),
      pagination: response.meta?.pagination
    };
  },

  // 获取新闻详情
  async getNewsById(id: string, locale?: string) {
    const newsCollection = client.collection('news-items');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await newsCollection.findOne(id, {
      locale: effectiveLocale,
      populate: ['cover_image'],
    });
    
    if (!response) {
      throw new Error(`未找到 ID 为 ${id} 的新闻`);
    }
    
    return transformNews(response);
  },
};
```

### memberApi - 团队成员

```typescript
export const memberApi = {
  // 获取成员列表
  async getMemberList(page = 1, pageSize = 100, locale?: string) {
    const memberCollection = client.collection('members');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await memberCollection.find({
      locale: effectiveLocale,
      pagination: { page, pageSize },
      sort: ['createdAt:desc'],
      populate: ['photo'],
    });
    
    return {
      data: transformMemberList(response.data),
      pagination: response.meta.pagination
    };
  },

  // 通过 slug 获取成员详情
  async getMemberBySlug(slug: string, locale?: string) {
    const memberCollection = client.collection('members');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await memberCollection.find({
      locale: effectiveLocale,
      filters: {
        slug: { $eq: slug },
      },
      populate: ['photo'],
    });
    
    if (response.data && response.data.length > 0) {
      return transformMember(response.data[0]);
    }
    
    throw new Error(`未找到 slug 为 ${slug} 的团队成员`);
  }
};
```

### researchApi - 研究方向

```typescript
export const researchApi = {
  // 获取研究方向列表
  async getResearchAreaList(page = 1, pageSize = 100, locale?: string) {
    const researchAreaCollection = client.collection('research-areas');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await researchAreaCollection.find({
      locale: effectiveLocale,
      populate: {
        cover_image: { fields: ['*'] },
        related_publications: { populate: '*' },
        related_patents: { populate: '*' },
        related_awards: { populate: '*' }
      },
      sort: ['order:asc', 'createdAt:desc'],
      pagination: { page, pageSize }
    });
    
    return {
      data: transformResearchAreaList(response.data || []),
      pagination: response.meta?.pagination
    };
  },

  // 通过 slug 获取研究方向详情
  async getResearchAreaBySlug(slug: string, locale?: string) {
    const researchAreaCollection = client.collection('research-areas');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await researchAreaCollection.find({
      locale: effectiveLocale,
      filters: { slug: { $eq: slug } },
      populate: {
        cover_image: { fields: ['*'] },
        related_publications: { populate: '*' },
        related_patents: { populate: '*' },
        related_awards: { populate: '*' }
      }
    });
    
    if (response.data && response.data.length > 0) {
      return transformResearchArea(response.data[0]);
    }
    
    throw new Error(`未找到 slug 为 ${slug} 的研究方向`);
  }
};
```

### publicationApi - 论文成果

```typescript
export const publicationApi = {
  async getPublicationList(page = 1, pageSize = 100, locale?: string) {
    const publicationCollection = client.collection('publications');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await publicationCollection.find({
      locale: effectiveLocale,
      pagination: { page, pageSize },
      sort: ['year:desc'],
      populate: {
        pdf_file: { fields: ['*'] },
        research_areas: { fields: ['*'] }
      }
    });
    
    return {
      data: transformPublicationList(response.data),
      pagination: response.meta.pagination
    };
  }
};
```

### 单例 API (Single Types)

```typescript
// 联系页面
export const contactApi = {
  async getContactPage(locale?: string) {
    const contactSingle = client.single('contact-page');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await contactSingle.find({ locale: effectiveLocale });
    
    if (response.data) {
      return transformPageData(response.data, 'contact');
    }
    
    throw new Error('未找到联系页面内容');
  }
};

// 加入我们页面
export const joinUsApi = {
  async getJoinUsPage(locale?: string) {
    const joinUsSingle = client.single('join-us-page');
    const effectiveLocale = locale || getServerLocale();
    
    const response = await joinUsSingle.find({ locale: effectiveLocale });
    
    if (response.data) {
      return transformPageData(response.data, 'join-us');
    }
    
    throw new Error('未找到加入我们页面内容');
  }
};
```

## 查询参数说明

### 分页 (pagination)

```typescript
{
  pagination: {
    page: 1,        // 页码，从 1 开始
    pageSize: 10,   // 每页数量
  }
}
```

### 排序 (sort)

```typescript
{
  sort: ['year:desc', 'title:asc']  // 字段:方向
}
```

### 过滤 (filters)

```typescript
{
  filters: {
    slug: { $eq: 'xxx' },           // 等于
    year: { $gte: 2020 },           // 大于等于
    title: { $contains: 'AI' },     // 包含
    role: { $in: ['PhD', 'Master'] } // 在列表中
  }
}
```

### 关联查询 (populate)

```typescript
// 简单 populate
{ populate: ['cover_image', 'author'] }

// 深度 populate
{
  populate: {
    cover_image: { fields: ['*'] },
    research_areas: {
      fields: ['title', 'slug'],
      populate: { cover_image: { fields: ['url'] } }
    }
  }
}
```

### 多语言 (locale)

```typescript
{
  locale: 'zh-CN'  // 或 'en'
}
```

## 错误处理

```typescript
export const newsApi = {
  async getNewsList(...) {
    try {
      const response = await newsCollection.find({...});
      return { data: transformNewsList(response.data) };
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;  // 向上抛出，让页面处理
    }
  }
};
```

## 使用示例

### 在服务端组件中

```typescript
// app/news/page.tsx
export default async function NewsPage() {
  const locale = await getLocale();
  
  try {
    const { data, pagination } = await newsApi.getNewsList(1, 10, locale);
    return <NewsList items={data} pagination={pagination} />;
  } catch (error) {
    return <div>加载失败</div>;
  }
}
```

### 在客户端组件中

```typescript
// components/NewsClient.tsx
'use client';

export default function NewsClient() {
  const [news, setNews] = useState([]);
  
  useEffect(() => {
    newsApi.getNewsList(1, 10)
      .then(res => setNews(res.data))
      .catch(console.error);
  }, []);
  
  return <div>{/* ... */}</div>;
}
```
