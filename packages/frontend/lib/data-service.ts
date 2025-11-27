/**
 * 统一数据服务层
 * 管理所有前端数据获取逻辑，提供统一的错误处理和数据转换
 */

import { 
  newsApi, 
  memberApi, 
  publicationApi, 
  contactApi, 
  joinUsApi, 
  type NewsViewModel,
  type MemberViewModel,
  type PublicationViewModel,
  type ContactPageViewModel,
  type JoinUsPageViewModel
} from './strapi-client';

// 统一的错误处理
const handleApiError = (error: any, operation: string) => {
  console.error(`${operation} 失败:`, error);
  return null;
};

// 已不再需要二次转换，统一使用 ViewModel

export class DataService {
  // 新闻数据服务
  static async getNewsList(page = 1, pageSize = 10) {
    try {
      const response = await newsApi.getNewsList(page, pageSize);
      return {
        data: response.data as NewsViewModel[],
        pagination: response.pagination
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
      return response as NewsViewModel;
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
        data: response.data as MemberViewModel[],
        pagination: response.pagination
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
      return response as MemberViewModel;
    } catch (error) {
      handleApiError(error, '获取团队成员详情');
      return null;
    }
  }

  // 研究方向单页接口已移除，直接使用 researchApi.getResearchAreaList / getResearchAreaBySlug（在各页面内调用）

  // 论文成果数据服务
  static async getPublicationList(page = 1, pageSize = 100) {
    try {
      const response = await publicationApi.getPublicationList(page, pageSize);
      return {
        data: response.data as PublicationViewModel[],
        pagination: response.pagination
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
      return response as ContactPageViewModel;
    } catch (error) {
      handleApiError(error, '获取联系页面内容');
      return null;
    }
  }

  static async getJoinUsPage() {
    try {
      const response = await joinUsApi.getJoinUsPage();
      return response as JoinUsPageViewModel;
    } catch (error) {
      handleApiError(error, '获取加入我们页面内容');
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
