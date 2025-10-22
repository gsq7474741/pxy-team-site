/**
 * 统一的数据类型定义
 * 用于前后端数据交互的标准化接口
 */

// 基础 Strapi 响应类型
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData<T> {
  id: number;
  documentId: string;
  attributes: T;
}

// 媒体文件统一类型
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

// 统一的视图模型（ViewModel）- 用于前端展示
export interface NewsViewModel {
  id: string;
  title: string;
  publishDate: string;
  content: string;
  coverImage?: MediaFile;
  createdAt: string;
  updatedAt: string;
}

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

export interface PublicationViewModel {
  id: string;
  title: string;
  authors: string;
  year: string;
  publicationVenue: string; // journal/conference name
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

export interface ResearchPageViewModel {
  id: string;
  title?: string;
  content?: string;
  coverImage?: MediaFile;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactPageViewModel {
  id: string;
  title?: string;
  content?: string;
  address?: string;
  email?: string;
  phone?: string;
  mapEmbedCode?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinUsPageViewModel {
  id: string;
  title?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PatentPageViewModel {
  id: string;
  title?: string;
  content?: string;
  patents?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RecruitPageViewModel {
  id: string;
  title?: string;
  content?: string;
  positions?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 招聘岗位（结构化数据）
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

// 专利（结构化数据）
export interface PatentViewModel {
  id: string;
  title: string;
  inventors?: string;
  applicationNumber?: string;
  publicationNumber?: string;
  grantNumber?: string;
  year?: string;
  status?: 'Pending' | 'Granted' | 'Expired';
  pdfFile?: MediaFile;
  link?: string;
  researchAreas?: ResearchAreaViewModel[];
  createdAt: string;
  updatedAt: string;
}

// 研究亮点类型
export interface ResearchHighlight {
  title: string;
  description: string;
  icon?: string;
  link?: string;
}

// 研究方向视图模型
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
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
}

// 原始 Strapi 数据类型（与后端 schema 对应）
export interface NewsAttributes {
  title: string;
  publish_date: string;
  content: string;
  cover_image: {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: any;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface MemberAttributes {
  name: string;
  english_name: string;
  role: string;
  bio: string;
  email: string;
  photo: {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: any;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  };
  slug: string;
  enrollment_year: number;
  enrollment_status: 'Current' | 'Graduated';
  research_interests: string;
  education_background: string;
  publications: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PublicationAttributes {
  title: string;
  authors: string;
  publication_venue: string;
  year: number;
  volume_issue_pages?: string;
  publication_type: 'Journal' | 'Conference';
  doi_link?: string;
  pdf_file?: {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: any;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  };
  code_link?: string;
  abstract?: string;
  research_areas?: {
    data: Array<{
      id: number;
      attributes: ResearchAreaAttributes;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// 研究方向原始数据类型
export interface ResearchAreaAttributes {
  title: string;
  description: string;
  icon: string;
  slug: string;
  order: number;
  cover_image?: {
    data: {
      id: number;
      attributes: {
        name: string;
        alternativeText: string | null;
        caption: string | null;
        width: number;
        height: number;
        formats: any;
        hash: string;
        ext: string;
        mime: string;
        size: number;
        url: string;
        previewUrl: string | null;
        provider: string;
        createdAt: string;
        updatedAt: string;
      };
    } | null;
  };
  detailed_content?: string;
  research_highlights?: Array<{
    title: string;
    description: string;
    icon?: string;
    link?: string;
  }>;
  related_publications?: {
    data: Array<{
      id: number;
      attributes: PublicationAttributes;
    }>;
  };
  keywords?: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// 分页信息类型
export interface PaginationInfo {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
