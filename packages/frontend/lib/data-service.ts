/**
 * 统一数据服务层
 * 管理所有前端数据获取逻辑，提供统一的错误处理和数据转换
 */

import { 
  newsApi, 
  memberApi, 
  researchApi, 
  publicationApi, 
  contactApi, 
  joinUsApi, 
  patentApi, 
  recruitApi,
  type NewsItem,
  type Member,
  type Publication,
  type ContactPage,
  type JoinUsPage,
  type PatentPage,
  type RecruitPage,
  type ResearchDirection,
  type StrapiResponse,
  type StrapiData
} from './strapi-client';

// 统一的错误处理
const handleApiError = (error: any, operation: string) => {
  console.error(`${operation} 失败:`, error);
  return null;
};

// 数据转换工具
const transformStrapiData = <T>(data: StrapiData<T>[] | StrapiData<T> | null): T[] | T | null => {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => ({
      id: item.id,
      documentId: item.id.toString(),
      ...item.attributes
    })) as T[];
  }
  
  return {
    id: data.id,
    documentId: data.id.toString(),
    ...data.attributes
  } as T;
};

export class DataService {
  // 新闻数据服务
  static async getNewsList(page = 1, pageSize = 10) {
    try {
      const response = await newsApi.getNewsList(page, pageSize);
      return {
        data: transformStrapiData<NewsItem>(response.data) as NewsItem[],
        pagination: response.meta?.pagination
      };
    } catch (error) {
      return {
        data: [],
        pagination: null,
        error: handleApiError(error, '获取新闻列表')
      };
    }
  }

  static async getNewsById(id: string) {
    try {
      const response = await newsApi.getNewsById(id);
      return transformStrapiData<NewsItem>(response.data) as NewsItem;
    } catch (error) {
      handleApiError(error, '获取新闻详情');
      return null;
    }
  }

  // 获取首页最新新闻（用于首页展示）
  static async getLatestNews(limit = 2) {
    try {
      const response = await this.getNewsList(1, limit);
      return response.data || [];
    } catch (error) {
      handleApiError(error, '获取最新新闻');
      return [];
    }
  }

  // 团队成员数据服务
  static async getMemberList(page = 1, pageSize = 100) {
    try {
      const response = await memberApi.getMemberList(page, pageSize);
      return {
        data: transformStrapiData<Member>(response.data) as Member[],
        pagination: response.meta?.pagination
      };
    } catch (error) {
      return {
        data: [],
        pagination: null,
        error: handleApiError(error, '获取团队成员列表')
      };
    }
  }

  static async getMemberBySlug(slug: string) {
    try {
      const response = await memberApi.getMemberBySlug(slug);
      return transformStrapiData<Member>(response) as Member;
    } catch (error) {
      handleApiError(error, '获取团队成员详情');
      return null;
    }
  }

  // 研究方向数据服务
  static async getResearchPage() {
    try {
      const response = await researchApi.getResearchPage();
      return transformStrapiData<ResearchDirection>(response.data) as ResearchDirection;
    } catch (error) {
      handleApiError(error, '获取研究方向内容');
      return null;
    }
  }

  // 论文成果数据服务
  static async getPublicationList(page = 1, pageSize = 100) {
    try {
      const response = await publicationApi.getPublicationList(page, pageSize);
      return {
        data: transformStrapiData<Publication>(response.data) as Publication[],
        pagination: response.meta?.pagination
      };
    } catch (error) {
      return {
        data: [],
        pagination: null,
        error: handleApiError(error, '获取论文成果列表')
      };
    }
  }

  // 页面内容数据服务
  static async getContactPage() {
    try {
      const response = await contactApi.getContactPage();
      return transformStrapiData<ContactPage>(response) as ContactPage;
    } catch (error) {
      handleApiError(error, '获取联系页面内容');
      return null;
    }
  }

  static async getJoinUsPage() {
    try {
      const response = await joinUsApi.getJoinUsPage();
      return transformStrapiData<JoinUsPage>(response) as JoinUsPage;
    } catch (error) {
      handleApiError(error, '获取加入我们页面内容');
      return null;
    }
  }

  static async getPatentPage() {
    try {
      const response = await patentApi.getPatentPage();
      return transformStrapiData<PatentPage>(response) as PatentPage;
    } catch (error) {
      handleApiError(error, '获取专利页面内容');
      return null;
    }
  }

  static async getRecruitPage() {
    try {
      const response = await recruitApi.getRecruitPage();
      return transformStrapiData<RecruitPage>(response) as RecruitPage;
    } catch (error) {
      handleApiError(error, '获取招聘页面内容');
      return null;
    }
  }

  // 提交表单数据
  static async submitContactForm(data: { name: string; email: string; message: string }) {
    try {
      const response = await contactApi.submitContactForm(data);
      return response;
    } catch (error) {
      handleApiError(error, '提交联系表单');
      throw error;
    }
  }
}

export default DataService;
