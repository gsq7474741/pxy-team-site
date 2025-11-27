/**
 * 统一的 Strapi 客户端
 * 使用标准化的数据转换层，提供一致的 API 接口
 */

import { strapi } from '@strapi/client';
import {
  StrapiResponse,
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
  ResearchAreaViewModel,
  PaginationInfo
} from './types';
import { getServerLocale, getLocaleFromAcceptLanguage } from './locale';
import {
  transformNews,
  transformMember,
  transformPublication,
  transformOpening,
  transformPatent,
  transformAward,
  transformPageData,
  transformNewsList,
  transformMemberList,
  transformPublicationList,
  transformAwardList,
  transformResearchArea,
  transformResearchAreaList
} from './transformers';

// 创建 Strapi 客户端实例
const client = strapi({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  // auth: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
});

// 调试信息

export default client;

// 统一的 API 响应类型
interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
}

// 新闻相关 API
export const newsApi = {
  // 获取新闻列表
  async getNewsList(page = 1, pageSize = 10, locale?: string): Promise<ApiResponse<NewsViewModel[]>> {
    try {
      // 尝试不同的 collection 名称
      let newsCollection;
      try {
        newsCollection = client.collection('news-items');
      } catch (e) {
        newsCollection = client.collection('news');
      }
      
      const effectiveLocale = locale || getServerLocale();
      const response = await newsCollection.find({
        locale: effectiveLocale,
        pagination: {
          page,
          pageSize,
        },
        sort: ['publish_date:desc'],
        populate: ['cover_image'],
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      if (!response || !response.data) {
        throw new Error('API 响应格式不正确');
      }
      
      const transformedData = transformNewsList(response.data);
      
      return {
        data: transformedData,
        pagination: response.meta?.pagination
      };
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      throw error;
    }
  },

  // 获取新闻详情
  async getNewsById(id: string, locale?: string): Promise<NewsViewModel> {
    try {
      // 尝试不同的 collection 名称
      let newsCollection;
      try {
        newsCollection = client.collection('news-items');
      } catch (e) {
        newsCollection = client.collection('news');
      }
      
      const effectiveLocale = locale || getServerLocale();
      
      // 尝试多种 populate 语法
      
      let response;
      try {
        // 方法1：使用深度 populate 语法获取完整媒体信息
        response = await newsCollection.findOne(id, {
          locale: effectiveLocale,
          populate: {
            cover_image: {
              fields: ['*']
            }
          },
        }) as unknown as any;
      } catch (e1) {
        try {
          // 方法2：使用通配符
          response = await newsCollection.findOne(id, {
            populate: '*',
          }) as unknown as any;
        } catch (e2) {
          // 方法3：使用数组语法
          response = await newsCollection.findOne(id, {
            populate: ['cover_image'],
          }) as unknown as any;
        }
      }
      
      if (!response) {
        throw new Error(`未找到 ID 为 ${id} 的新闻`);
      }
      
      const transformed = transformNews(response);
      
      return transformed;
    } catch (error) {
      console.error(`获取新闻详情失败 (ID: ${id}):`, error);
      throw error;
    }
  },
};

// 团队成员相关 API
export const memberApi = {
  // 获取团队成员列表
  async getMemberList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<MemberViewModel[]>> {
    try {
      const memberCollection = client.collection('members');
      const effectiveLocale = locale || getServerLocale();
      const response = await memberCollection.find({
        locale: effectiveLocale,
        pagination: {
          page,
          pageSize,
        },
        sort: ['createdAt:desc'],
        populate: ['photo'],
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      return {
        data: transformMemberList(response.data),
        pagination: response.meta.pagination
      };
    } catch (error) {
      console.error('获取团队成员列表失败:', error);
      throw error;
    }
  },

  // 通过 slug 获取团队成员详情
  async getMemberBySlug(slug: string, locale?: string): Promise<MemberViewModel> {
    try {
      const memberCollection = client.collection('members');
      const effectiveLocale = locale || getServerLocale();
      const response = await memberCollection.find({
        locale: effectiveLocale,
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: ['photo'],
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      if (response.data && response.data.length > 0) {
        return transformMember(response.data[0]);
      }
      
      throw new Error(`未找到 slug 为 ${slug} 的团队成员`);
    } catch (error) {
      console.error(`获取团队成员详情失败 (Slug: ${slug}):`, error);
      throw error;
    }
  }
};

// 竞赛奖项相关 API
export const awardsApi = {
  async getAwardList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<AwardViewModel[]>> {
    try {
      const awardCollection = client.collection('awards');
      const effectiveLocale = locale || getServerLocale();
      const response = await awardCollection.find({
        locale: effectiveLocale,
        pagination: { page, pageSize },
        sort: ['year:desc', 'createdAt:desc'],
        populate: {
          research_areas: { fields: ['*'] }
        }
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      return {
        data: (response.data || []).map(transformAward),
        pagination: response.meta?.pagination
      };
    } catch (error) {
      console.error('获取竞赛奖项列表失败:', error);
      throw error;
    }
  }
};

// 研究方向相关 API
export const researchApi = {

  // 获取研究方向列表
  async getResearchAreaList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<ResearchAreaViewModel[]>> {
    try {
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
        pagination: {
          page,
          pageSize
        }
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      const transformedData = transformResearchAreaList(response.data || []);
      
      return {
        data: transformedData,
        pagination: response.meta?.pagination ? {
          page: response.meta.pagination.page,
          pageSize: response.meta.pagination.pageSize,
          pageCount: response.meta.pagination.pageCount,
          total: response.meta.pagination.total
        } : undefined
      };
    } catch (error) {
      console.error('获取研究方向列表失败:', error);
      throw error;
    }
  },

  // 通过 slug 获取研究方向详情
  async getResearchAreaBySlug(slug: string, locale?: string): Promise<ResearchAreaViewModel> {
    try {
      const researchAreaCollection = client.collection('research-areas');
      const effectiveLocale = locale || getServerLocale();
      const response = await researchAreaCollection.find({
        locale: effectiveLocale,
        filters: {
          slug: {
            $eq: slug
          }
        },
        populate: {
          cover_image: { fields: ['*'] },
          related_publications: { populate: '*' },
          related_patents: { populate: '*' },
          related_awards: { populate: '*' }
        }
      }) as unknown as { data: any[] };
      
      if (response.data && response.data.length > 0) {
        return transformResearchArea(response.data[0]);
      }
      
      throw new Error(`未找到 slug 为 ${slug} 的研究方向`);
    } catch (error) {
      console.error('获取研究方向详情失败:', error);
      throw error;
    }
  }
};

// 论文成果相关 API
export const publicationApi = {
  // 获取论文成果列表
  async getPublicationList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<PublicationViewModel[]>> {
    try {
      const publicationCollection = client.collection('publications');
      const effectiveLocale = locale || getServerLocale();
      const response = await publicationCollection.find({
        locale: effectiveLocale,
        pagination: {
          page,
          pageSize,
        },
        sort: ['year:desc'],
        populate: {
          pdf_file: { fields: ['*'] },
          research_areas: { fields: ['*'] }
        }
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      return {
        data: transformPublicationList(response.data),
        pagination: response.meta.pagination
      };
    } catch (error) {
      console.error('获取论文成果列表失败:', error);
      throw error;
    }
  }
};

// 招聘岗位相关 API
export const openingApi = {
  async getOpeningList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<OpeningViewModel[]>> {
    try {
      const openingCollection = client.collection('openings');
      const effectiveLocale = locale || getServerLocale();
      const response = await openingCollection.find({
        locale: effectiveLocale,
        pagination: { page, pageSize },
        sort: ['order:asc', 'createdAt:desc'],
        populate: {
          research_areas: { fields: ['*'] }
        }
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      return {
        data: (response.data || []).map(transformOpening),
        pagination: response.meta?.pagination
      };
    } catch (error) {
      console.error('获取岗位列表失败:', error);
      throw error;
    }
  },

  async getOpeningBySlug(slug: string, locale?: string): Promise<OpeningViewModel> {
    try {
      const openingCollection = client.collection('openings');
      const effectiveLocale = locale || getServerLocale();
      const response = await openingCollection.find({
        locale: effectiveLocale,
        filters: { slug: { $eq: slug } },
        populate: {
          research_areas: { fields: ['*'] }
        }
      }) as unknown as { data: any[] };
      if (response.data && response.data.length > 0) {
        return transformOpening(response.data[0]);
      }
      throw new Error(`未找到 slug 为 ${slug} 的岗位`);
    } catch (error) {
      console.error('获取岗位详情失败:', error);
      throw error;
    }
  }
};

// 专利相关 API
export const patentsApi = {
  async getPatentList(page = 1, pageSize = 100, locale?: string): Promise<ApiResponse<PatentViewModel[]>> {
    try {
      const patentCollection = client.collection('patents');
      const effectiveLocale = locale || getServerLocale();
      const response = await patentCollection.find({
        locale: effectiveLocale,
        pagination: { page, pageSize },
        sort: ['year:desc', 'createdAt:desc'],
        populate: {
          research_areas: { fields: ['*'] }
        }
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      return {
        data: (response.data || []).map(transformPatent),
        pagination: response.meta?.pagination
      };
    } catch (error) {
      console.error('获取专利列表失败:', error);
      throw error;
    }
  }
};

// 联系页面相关 API
export const contactApi = {
  // 获取联系页面内容
  async getContactPage(locale?: string): Promise<ContactPageViewModel> {
    try {
      const contactSingle = client.single('contact-page');
      const effectiveLocale = locale || getServerLocale();
      const response = await contactSingle.find({ locale: effectiveLocale }) as unknown as any;
      
      if (response.data) {
        return transformPageData(response.data, 'contact') as ContactPageViewModel;
      }
      
      throw new Error('未找到联系页面内容');
    } catch (error) {
      console.error('获取联系页面内容失败:', error);
      throw error;
    }
  },

  // 提交联系表单
  async submitContactForm(data: { name: string; email: string; message: string }) {
    try {
      const contactFormsCollection = client.collection('contact-forms');
      const response = await contactFormsCollection.create({
        data,
      });
      return response;
    } catch (error) {
      console.error('提交联系表单失败:', error);
      throw error;
    }
  }
};

// 加入我们页面相关 API
export const joinUsApi = {
  // 获取加入我们页面内容
  async getJoinUsPage(locale?: string): Promise<JoinUsPageViewModel> {
    try {
      const joinUsSingle = client.single('join-us-page');
      const effectiveLocale = locale || getServerLocale();
      const response = await joinUsSingle.find({ locale: effectiveLocale }) as unknown as any;
      
      if (response.data) {
        return transformPageData(response.data, 'join-us') as JoinUsPageViewModel;
      }
      
      throw new Error('未找到加入我们页面内容');
    } catch (error) {
      console.error('获取加入我们页面内容失败:', error);
      throw error;
    }
  }
};


// 导出工具函数
export { getStrapiMedia } from './transformers';
export { formatDate, stripHtmlTags, truncateText } from './transformers';

// 导出类型定义
export type {
  NewsViewModel,
  MemberViewModel,
  PublicationViewModel,
  OpeningViewModel,
  PatentViewModel,
  AwardViewModel,
  ContactPageViewModel,
  JoinUsPageViewModel,
  ResearchAreaViewModel,
  MediaFile,
  PaginationInfo
} from './types';
