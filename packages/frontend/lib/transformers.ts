/**
 * 数据转换器
 * 将 Strapi 原始数据转换为统一的视图模型
 */

import {
  StrapiData,
  NewsAttributes,
  MemberAttributes,
  PublicationAttributes,
  NewsViewModel,
  MemberViewModel,
  PublicationViewModel,
  OpeningViewModel,
  PatentViewModel,
  AwardViewModel,
  ContactPageViewModel,
  JoinUsPageViewModel,
  PatentPageViewModel,
  RecruitPageViewModel,
  ResearchAreaViewModel,
  MediaFile
} from './types';

// 获取媒体文件 URL
export const getStrapiMedia = (url: string | null): string | null => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  const baseUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/api$/, '');
  return `${baseUrl}${url}`;
};

// 竞赛奖项数据转换器
export const transformAward = (strapiAward: any): AwardViewModel => {
  let id, data;
  if (strapiAward.data) {
    id = strapiAward.data.documentId || strapiAward.data.id;
    data = strapiAward.data.attributes || strapiAward.data;
  } else {
    id = strapiAward.documentId || strapiAward.id;
    data = strapiAward.attributes || strapiAward;
  }
  return {
    id: id?.toString() || '',
    title: data?.title || '',
    recipients: data?.recipients,
    competitionName: data?.competition_name,
    awardRank: data?.award_rank,
    year: data?.year?.toString() || '',
    date: data?.date || '',
    pdfFile: transformMediaFile(data?.pdf_file),
    link: data?.link,
    researchAreas: data?.research_areas?.data?.map((area: any) => transformResearchArea(area)) || [],
    createdAt: data?.createdAt || strapiAward?.createdAt || '',
    updatedAt: data?.updatedAt || strapiAward?.updatedAt || ''
  };
};

// 招聘岗位数据转换器
export const transformOpening = (strapiOpening: any): OpeningViewModel => {
  let id, data;
  if (strapiOpening.data) {
    id = strapiOpening.data.documentId || strapiOpening.data.id;
    data = strapiOpening.data.attributes || strapiOpening.data;
  } else {
    id = strapiOpening.documentId || strapiOpening.id;
    data = strapiOpening.attributes || strapiOpening;
  }

  const toTextArray = (items: any): string[] => {
    if (!items) return [];
    const arr = items?.map?.((it: any) => {
      const a = it?.text || it?.attributes?.text || it;
      return typeof a === 'string' ? a : '';
    }) || [];
    return arr.filter(Boolean);
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
    status: data?.status_field || data?.status,
    researchAreas: data?.research_areas?.data?.map((area: any) => transformResearchArea(area)) || [],
    createdAt: data?.createdAt || strapiOpening?.createdAt || '',
    updatedAt: data?.updatedAt || strapiOpening?.updatedAt || ''
  };
};

// 专利数据转换器
export const transformPatent = (strapiPatent: any): PatentViewModel => {
  let id, data;
  if (strapiPatent.data) {
    id = strapiPatent.data.documentId || strapiPatent.data.id;
    data = strapiPatent.data.attributes || strapiPatent.data;
  } else {
    id = strapiPatent.documentId || strapiPatent.id;
    data = strapiPatent.attributes || strapiPatent;
  }

  return {
    id: id?.toString() || '',
    title: data?.title || '',
    inventors: data?.inventors,
    applicationNumber: data?.application_number,
    publicationNumber: data?.publication_number,
    grantNumber: data?.grant_number,
    year: data?.year?.toString(),
    status: data?.status_field || data?.status,
    pdfFile: transformMediaFile(data?.pdf_file),
    link: data?.link,
    researchAreas: data?.research_areas?.data?.map((area: any) => transformResearchArea(area)) || [],
    createdAt: data?.createdAt || strapiPatent?.createdAt || '',
    updatedAt: data?.updatedAt || strapiPatent?.updatedAt || ''
  };
};

// 转换 Strapi 媒体对象为统一格式
export const transformMediaFile = (mediaData: any): MediaFile | undefined => {
  if (!mediaData) return undefined;
  let mediaInfo;
  if (mediaData.data) {
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
    url: getStrapiMedia(mediaInfo.url) || '',
    alternativeText: mediaInfo.alternativeText,
    caption: mediaInfo.caption,
    width: mediaInfo.width,
    height: mediaInfo.height,
    formats: mediaInfo.formats ? {
      thumbnail: mediaInfo.formats.thumbnail ? { url: getStrapiMedia(mediaInfo.formats.thumbnail.url) || '' } : undefined,
      small: mediaInfo.formats.small ? { url: getStrapiMedia(mediaInfo.formats.small.url) || '' } : undefined,
      medium: mediaInfo.formats.medium ? { url: getStrapiMedia(mediaInfo.formats.medium.url) || '' } : undefined,
      large: mediaInfo.formats.large ? { url: getStrapiMedia(mediaInfo.formats.large.url) || '' } : undefined,
    } : undefined
  };
};

// 新闻数据转换器
export const transformNews = (strapiNews: any): NewsViewModel => {
  let id, data, coverImageData;
  if (strapiNews.data) {
    id = strapiNews.data.documentId || strapiNews.data.id;
    data = strapiNews.data.attributes || strapiNews.data;
    coverImageData = strapiNews.data.cover_image || data?.cover_image || data?.coverImage;
  } else {
    id = strapiNews.documentId || strapiNews.id;
    data = strapiNews.attributes || strapiNews;
    coverImageData = data?.cover_image || data?.coverImage;
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

// 团队成员数据转换器
export const transformMember = (strapiMember: any): MemberViewModel => {
  // 处理新版 Strapi SDK 的 Document 格式
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

// 论文成果数据转换器
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
    researchAreas: data?.research_areas?.data?.map((area: any) => transformResearchArea(area)) || [],
    createdAt: data?.createdAt || strapiPublication?.createdAt || '',
    updatedAt: data?.updatedAt || strapiPublication?.updatedAt || ''
  };
};

// 通用页面数据转换器
export const transformPageData = (strapiData: any, type: 'contact' | 'join-us' | 'patent' | 'recruit'): 
  ContactPageViewModel | JoinUsPageViewModel | PatentPageViewModel | RecruitPageViewModel => {
  
  // 处理新版 Strapi SDK 的 Document 格式
  const id = strapiData.documentId || strapiData.id;
  const data = strapiData.attributes || strapiData;
  const baseData = {
    id: id?.toString() || '',
    title: data.title || '',
    content: data.content || '',
    createdAt: data.createdAt || strapiData.createdAt || '',
    updatedAt: data.updatedAt || strapiData.updatedAt || ''
  };

  switch (type) {
    case 'contact':
      return {
        ...baseData,
        address: data.address || '',
        email: data.email || '',
        phone: data.phone_number || data.phone || '',
        mapEmbedCode: data.map_embed_code
      } as ContactPageViewModel;
    
    case 'join-us':
      return baseData as JoinUsPageViewModel;
    
    case 'patent':
      return baseData as PatentPageViewModel;
    
    case 'recruit':
      return baseData as RecruitPageViewModel;
    
    default:
      return baseData as any;
  }
};

// 批量转换函数
export const transformNewsList = (strapiNewsList: any[]): NewsViewModel[] => {
  return strapiNewsList.map(transformNews);
};

export const transformMemberList = (strapiMemberList: any[]): MemberViewModel[] => {
  return strapiMemberList.map(transformMember);
};

export const transformPublicationList = (strapiPublicationList: any[]): PublicationViewModel[] => {
  return strapiPublicationList.map(transformPublication);
};

export const transformOpeningList = (strapiOpeningList: any[]): OpeningViewModel[] => {
  return strapiOpeningList.map(transformOpening);
};

export const transformPatentList = (strapiPatentList: any[]): PatentViewModel[] => {
  return strapiPatentList.map(transformPatent);
};

export const transformAwardList = (strapiAwardList: any[]): AwardViewModel[] => {
  return strapiAwardList.map(transformAward);
};

// 研究方向数据转换器
export const transformResearchArea = (strapiResearchArea: any): ResearchAreaViewModel => {
  let id, data;
  if (strapiResearchArea.data) {
    id = strapiResearchArea.data.documentId || strapiResearchArea.data.id;
    data = strapiResearchArea.data.attributes || strapiResearchArea.data;
  } else {
    id = strapiResearchArea.documentId || strapiResearchArea.id;
    data = strapiResearchArea.attributes || strapiResearchArea;
  }
  return {
    id: id?.toString() || '',
    title: data?.title || '',
    description: data?.description || '',
    icon: data?.icon || '🧠',
    slug: data?.slug || '',
    order: data?.order || 0,
    coverImage: transformMediaFile(data?.cover_image),
    detailedContent: data?.detailed_content || '',
    researchHighlights: data?.research_highlights || [],
    relatedPublications: (() => {
      const pubs = data?.related_publications?.data ?? data?.related_publications;
      return Array.isArray(pubs) ? pubs.map(transformPublication) : [];
    })(),
    relatedPatents: (() => {
      const pats = data?.related_patents?.data ?? data?.related_patents;
      return Array.isArray(pats) ? pats.map(transformPatent) : [];
    })(),
    relatedAwards: (() => {
      const awds = data?.related_awards?.data ?? data?.related_awards;
      return Array.isArray(awds) ? awds.map(transformAward) : [];
    })(),
    keywords: data?.keywords || [],
    createdAt: data?.createdAt || strapiResearchArea?.createdAt || '',
    updatedAt: data?.updatedAt || strapiResearchArea?.updatedAt || ''
  };
};

export const transformResearchAreaList = (strapiResearchAreaList: any[]): ResearchAreaViewModel[] => {
  return strapiResearchAreaList.map(transformResearchArea);
};

// 格式化日期的工具函数
export const formatDate = (dateString: string, locale: string = 'zh-CN'): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 清理 HTML 标签的工具函数
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

// 截取文本的工具函数
export const truncateText = (text: string, maxLength: number = 200): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
