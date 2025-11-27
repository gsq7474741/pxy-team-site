# 数据转换层

本文档介绍数据转换器的设计和实现，用于将 Strapi 原始数据转换为前端 ViewModel。

## 设计目标

1. **统一数据格式** - 屏蔽 Strapi API 格式变化
2. **类型安全** - 确保转换后数据符合 TypeScript 类型
3. **驼峰命名** - 将 snake_case 转为 camelCase
4. **媒体 URL 处理** - 自动补全媒体文件完整 URL

## 转换流程

```
Strapi Response          Transformer            ViewModel
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│ {            │       │              │       │ {            │
│   id: 1,     │       │ transform    │       │   id: "abc", │
│   documentId │  ───► │ News()       │  ───► │   title:     │
│   title: ... │       │              │       │   publishDate│
│   cover_image│       │              │       │   coverImage │
│ }            │       │              │       │ }            │
└──────────────┘       └──────────────┘       └──────────────┘
```

## 核心转换器

### transformNews - 新闻

```typescript
export const transformNews = (strapiNews: any): NewsViewModel => {
  // 处理不同的数据格式
  let id, data, coverImageData;
  if (strapiNews.data) {
    // 嵌套格式 { data: { ... } }
    id = strapiNews.data.documentId || strapiNews.data.id;
    data = strapiNews.data.attributes || strapiNews.data;
    coverImageData = strapiNews.data.cover_image || data?.cover_image;
  } else {
    // 扁平格式
    id = strapiNews.documentId || strapiNews.id;
    data = strapiNews.attributes || strapiNews;
    coverImageData = data?.cover_image;
  }
  
  return {
    id: id?.toString() || '',
    title: data?.title || '',
    publishDate: data?.publish_date || data?.publishDate || '',
    content: data?.content || '',
    coverImage: transformMediaFile(coverImageData),
    createdAt: data?.createdAt || strapiNews?.createdAt || '',
    updatedAt: data?.updatedAt || strapiNews?.updatedAt || ''
  };
};
```

### transformMember - 团队成员

```typescript
export const transformMember = (strapiMember: any): MemberViewModel => {
  const id = strapiMember.documentId || strapiMember.id;
  const data = strapiMember.attributes || strapiMember;
  
  return {
    id: id?.toString() || '',
    name: data.name || '',
    englishName: data.english_name || data.englishName || '',
    role: data.role || '',
    bio: data.bio || '',
    email: data.email,
    photo: transformMediaFile(data.photo),
    slug: data.slug || '',
    enrollmentYear: data.enrollment_year || data.enrollmentYear,
    enrollmentStatus: data.enrollment_status || data.enrollmentStatus,
    researchInterests: data.research_interests || data.researchInterests,
    educationBackground: data.education_background || data.educationBackground,
    publications: data.publications,
    createdAt: data.createdAt || strapiMember.createdAt || '',
    updatedAt: data.updatedAt || strapiMember.updatedAt || ''
  };
};
```

### transformPublication - 论文成果

```typescript
export const transformPublication = (strapiPublication: any): PublicationViewModel => {
  let id, data;
  if (strapiPublication.data) {
    id = strapiPublication.data.documentId || strapiPublication.data.id;
    data = strapiPublication.data.attributes || strapiPublication.data;
  } else {
    id = strapiPublication.documentId || strapiPublication.id;
    data = strapiPublication.attributes || strapiPublication;
  }
  
  return {
    id: id?.toString() || '',
    title: data?.title || '',
    authors: data?.authors || '',
    year: data?.year?.toString() || '',
    publicationVenue: data?.publication_venue || '',
    volumeIssuePages: data?.volume_issue_pages,
    publicationType: data?.publication_type || 'Journal',
    doiLink: data?.doi_link,
    pdfFile: transformMediaFile(data?.pdf_file),
    codeLink: data?.code_link,
    abstract: data?.abstract,
    researchAreas: data?.research_areas?.data?.map(transformResearchArea) || [],
    createdAt: data?.createdAt || '',
    updatedAt: data?.updatedAt || ''
  };
};
```

### transformOpening - 招聘岗位

```typescript
export const transformOpening = (strapiOpening: any): OpeningViewModel => {
  let id, data;
  if (strapiOpening.data) {
    id = strapiOpening.data.documentId || strapiOpening.data.id;
    data = strapiOpening.data.attributes || strapiOpening.data;
  } else {
    id = strapiOpening.documentId || strapiOpening.id;
    data = strapiOpening.attributes || strapiOpening;
  }

  // 转换数组字段
  const toTextArray = (items: any): string[] => {
    if (!items) return [];
    return items.map((it: any) => {
      const text = it?.text || it?.attributes?.text || it;
      return typeof text === 'string' ? text : '';
    }).filter(Boolean);
  };

  return {
    id: id?.toString() || '',
    title: data?.title || '',
    slug: data?.slug || '',
    positionType: data?.position_type || 'Other',
    description: data?.description || '',
    requirements: toTextArray(data?.requirements),
    benefits: toTextArray(data?.benefits),
    location: data?.location,
    deadlineDate: data?.deadline_date,
    contactEmail: data?.contact_email,
    applyLink: data?.apply_link,
    order: data?.order,
    status: data?.status_field || data?.status,  // 兼容两种字段名
    researchAreas: data?.research_areas?.data?.map(transformResearchArea) || [],
    createdAt: data?.createdAt || '',
    updatedAt: data?.updatedAt || ''
  };
};
```

## 媒体文件转换

### transformMediaFile

```typescript
export const transformMediaFile = (mediaData: any): MediaFile | undefined => {
  if (!mediaData) return undefined;
  
  let mediaInfo;
  if (mediaData.data) {
    // 嵌套格式 { data: { attributes: {...} } }
    const { attributes } = mediaData.data;
    mediaInfo = {
      id: mediaData.data.id,
      url: attributes?.url,
      alternativeText: attributes?.alternativeText,
      caption: attributes?.caption,
      width: attributes?.width,
      height: attributes?.height,
      formats: attributes?.formats
    };
  } else {
    // 扁平格式
    mediaInfo = {
      id: mediaData.id,
      url: mediaData.url,
      alternativeText: mediaData.alternativeText,
      caption: mediaData.caption,
      width: mediaData.width,
      height: mediaData.height,
      formats: mediaData.formats
    };
  }
  
  if (!mediaInfo.url) return undefined;
  
  return {
    id: mediaInfo.id,
    url: getStrapiMedia(mediaInfo.url) || '',  // 补全完整 URL
    alternativeText: mediaInfo.alternativeText,
    caption: mediaInfo.caption,
    width: mediaInfo.width,
    height: mediaInfo.height,
    formats: mediaInfo.formats ? {
      thumbnail: mediaInfo.formats.thumbnail 
        ? { url: getStrapiMedia(mediaInfo.formats.thumbnail.url) || '' } 
        : undefined,
      small: mediaInfo.formats.small 
        ? { url: getStrapiMedia(mediaInfo.formats.small.url) || '' } 
        : undefined,
      medium: mediaInfo.formats.medium 
        ? { url: getStrapiMedia(mediaInfo.formats.medium.url) || '' } 
        : undefined,
      large: mediaInfo.formats.large 
        ? { url: getStrapiMedia(mediaInfo.formats.large.url) || '' } 
        : undefined,
    } : undefined
  };
};
```

### getStrapiMedia

```typescript
export const getStrapiMedia = (url: string | null): string | null => {
  if (!url) return null;
  
  // 已经是完整 URL
  if (url.startsWith('http') || url.startsWith('//')) return url;
  
  // 添加基础 URL
  const baseUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337')
    .replace(/\/api$/, '');  // 移除 /api 后缀
  return `${baseUrl}${url}`;
};
```

## 批量转换

```typescript
export const transformNewsList = (strapiNewsList: any[]): NewsViewModel[] => {
  return strapiNewsList.map(transformNews);
};

export const transformMemberList = (strapiMemberList: any[]): MemberViewModel[] => {
  return strapiMemberList.map(transformMember);
};

export const transformPublicationList = (strapiPublicationList: any[]): PublicationViewModel[] => {
  return strapiPublicationList.map(transformPublication);
};
```

## 工具函数

### formatDate - 日期格式化

```typescript
export const formatDate = (dateString: string, locale: string = 'zh-CN'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 使用
formatDate('2024-01-15', 'zh-CN');  // "2024年1月15日"
formatDate('2024-01-15', 'en');     // "January 15, 2024"
```

### stripHtmlTags - 移除 HTML 标签

```typescript
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// 使用
stripHtmlTags('<p>Hello <b>World</b></p>');  // "Hello World"
```

### truncateText - 文本截断

```typescript
export const truncateText = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// 使用
truncateText('很长的文本...', 100);  // 截断到 100 字符
```

## 兼容性处理

### status 字段兼容

由于 Strapi 保留字问题，`status` 字段改名为 `status_field`：

```typescript
status: data?.status_field || data?.status,  // 优先使用 status_field
```

### 多格式数据处理

Strapi 返回数据可能有多种格式：

```typescript
// 格式 1: 扁平
{ id: 1, title: 'xxx' }

// 格式 2: 带 attributes
{ id: 1, attributes: { title: 'xxx' } }

// 格式 3: 带 data 包装
{ data: { id: 1, attributes: { title: 'xxx' } } }

// 转换器统一处理
const id = strapiData.documentId || strapiData.data?.documentId || strapiData.id;
const data = strapiData.attributes || strapiData.data?.attributes || strapiData;
```
