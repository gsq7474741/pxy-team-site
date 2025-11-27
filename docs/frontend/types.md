# 类型定义

本文档介绍前端使用的 TypeScript 类型定义，文件位于 `lib/types.ts`。

## 基础类型

### MediaFile - 媒体文件

```typescript
export interface MediaFile {
  id: number;
  url: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
}
```

### PaginationInfo - 分页信息

```typescript
export interface PaginationInfo {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
```

## ViewModel 类型

### NewsViewModel

```typescript
export interface NewsViewModel {
  id: string;
  title: string;
  publishDate: string;
  content: string;
  coverImage?: MediaFile;
  createdAt: string;
  updatedAt: string;
}
```

### MemberViewModel

```typescript
export interface MemberViewModel {
  id: string;
  name: string;
  englishName: string;
  role: string;
  bio: string;
  email?: string;
  photo?: MediaFile;
  slug: string;
  enrollmentYear?: number;
  enrollmentStatus?: 'Current' | 'Graduated';
  researchInterests?: string;
  educationBackground?: string;
  publications?: string;
  createdAt: string;
  updatedAt: string;
}
```

### PublicationViewModel

```typescript
export interface PublicationViewModel {
  id: string;
  title: string;
  authors: string;
  year: string;
  publicationVenue: string;
  volumeIssuePages?: string;
  publicationType: 'Journal' | 'Conference';
  doiLink?: string;
  pdfFile?: MediaFile;
  codeLink?: string;
  abstract?: string;
  researchAreas?: ResearchAreaViewModel[];
  createdAt: string;
  updatedAt: string;
}
```

### OpeningViewModel

```typescript
export interface OpeningViewModel {
  id: string;
  title: string;
  slug: string;
  positionType: 'Postdoc' | 'PhD' | 'Master' | 'RA' | 'Intern' | 'Engineer' | 'Other';
  description?: string;
  requirements?: string[];
  benefits?: string[];
  location?: string;
  deadlineDate?: string;
  contactEmail?: string;
  applyLink?: string;
  order?: number;
  status?: 'Open' | 'Closed';
  researchAreas?: ResearchAreaViewModel[];
  createdAt: string;
  updatedAt: string;
}
```

### ResearchAreaViewModel

```typescript
export interface ResearchAreaViewModel {
  id: string;
  title: string;
  description: string;
  icon: string;
  slug: string;
  order: number;
  coverImage?: MediaFile;
  detailedContent?: string;
  researchHighlights?: ResearchHighlight[];
  relatedPublications?: PublicationViewModel[];
  relatedPatents?: PatentViewModel[];
  relatedAwards?: AwardViewModel[];
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}
```

## 命名规范

| Strapi 字段 | ViewModel 属性 |
|------------|---------------|
| `publish_date` | `publishDate` |
| `cover_image` | `coverImage` |
| `english_name` | `englishName` |
| `enrollment_year` | `enrollmentYear` |
| `publication_venue` | `publicationVenue` |

所有 snake_case 转换为 camelCase。
