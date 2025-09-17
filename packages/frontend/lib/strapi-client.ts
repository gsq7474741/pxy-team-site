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
  ResearchPageViewModel,
  ContactPageViewModel,
  JoinUsPageViewModel,
  PatentPageViewModel,
  RecruitPageViewModel,
  ResearchAreaViewModel,
  PaginationInfo
} from './types';
import {
  transformNews,
  transformMember,
  transformPublication,
  transformPageData,
  transformNewsList,
  transformMemberList,
  transformPublicationList,
  transformResearchArea,
  transformResearchAreaList
} from './transformers';

// 创建 Strapi 客户端实例
const client = strapi({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  // auth: process.env.NEXT_PUBLIC_STRAPI_API_TOKEN,
});

// 调试信息
console.log('Strapi 客户端配置:', {
  baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api',
  env: process.env.NODE_ENV
});

export default client;

// 统一的 API 响应类型
interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
}

// 新闻相关 API
export const newsApi = {
  // 获取新闻列表
  async getNewsList(page = 1, pageSize = 10): Promise<ApiResponse<NewsViewModel[]>> {
    try {
      console.log(`正在获取新闻列表 - 页码: ${page}, 每页: ${pageSize}`);
      
      // 尝试不同的 collection 名称
      let newsCollection;
      try {
        newsCollection = client.collection('news-items');
      } catch (e) {
        console.log('尝试使用 news collection');
        newsCollection = client.collection('news');
      }
      
      const response = await newsCollection.find({
        pagination: {
          page,
          pageSize,
        },
        sort: ['publish_date:desc'],
        populate: ['cover_image'],
      }) as unknown as { data: any[]; meta: { pagination?: any } };
      
      console.log('新闻列表 API 响应:', response);
      
      if (!response || !response.data) {
        throw new Error('API 响应格式不正确');
      }
      
      const transformedData = transformNewsList(response.data);
      console.log('转换后的新闻列表:', transformedData);
      
      return {
        data: transformedData,
        pagination: response.meta?.pagination
      };
    } catch (error) {
      console.error('获取新闻列表失败:', error);
      console.error('错误详情:', {
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  // 获取新闻详情
  async getNewsById(id: string): Promise<NewsViewModel> {
    try {
      console.log(`正在获取新闻详情 - ID: ${id}`);
      
      // 尝试不同的 collection 名称
      let newsCollection;
      try {
        newsCollection = client.collection('news-items');
      } catch (e) {
        console.log('尝试使用 news collection');
        newsCollection = client.collection('news');
      }
      
      // 尝试多种 populate 语法
      console.log('尝试获取数据，包含封面图片...');
      
      let response;
      try {
        // 方法1：使用深度 populate 语法获取完整媒体信息
        response = await newsCollection.findOne(id, {
          populate: {
            cover_image: {
              fields: ['*']
            }
          },
        }) as unknown as any;
        console.log('方法1 (深度 populate) API 响应:', response);
      } catch (e1) {
        console.log('方法1失败，尝试方法2...');
        try {
          // 方法2：使用通配符
          response = await newsCollection.findOne(id, {
            populate: '*',
          }) as unknown as any;
          console.log('方法2 (通配符) API 响应:', response);
        } catch (e2) {
          console.log('方法2失败，尝试方法3...');
          // 方法3：使用数组语法
          response = await newsCollection.findOne(id, {
            populate: ['cover_image'],
          }) as unknown as any;
          console.log('方法3 (通配符) API 响应:', response);
        }
      }
      
      if (!response) {
        throw new Error(`未找到 ID 为 ${id} 的新闻`);
      }
      
      // 详细检查响应数据结构
      console.log('响应数据详细结构:');
      console.log('- response.data:', response.data);
      if (response.data) {
        console.log('- response.data.cover_image:', response.data.cover_image);
        console.log('- response.data.attributes:', response.data.attributes);
        if (response.data.attributes) {
          console.log('- response.data.attributes.cover_image:', response.data.attributes.cover_image);
        }
      }
      
      const transformed = transformNews(response);
      console.log('转换后的新闻详情:', transformed);
      
      return transformed;
    } catch (error) {
      console.error(`获取新闻详情失败 (ID: ${id}):`, error);
      console.error('错误详情:', {
        message: error instanceof Error ? error.message : '未知错误',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  },

  // 测试 API 连接
  async testConnection(): Promise<boolean> {
    try {
      console.log('测试 Strapi API 连接...');
      
      // 尝试获取新闻列表的第一页来测试连接
      const response = await this.getNewsList(1, 1);
      console.log('API 连接测试成功:', response);
      return true;
    } catch (error) {
      console.error('API 连接测试失败:', error);
      return false;
    }
  }
};

// 团队成员相关 API
export const memberApi = {
  // 获取团队成员列表
  async getMemberList(page = 1, pageSize = 100): Promise<ApiResponse<MemberViewModel[]>> {
    try {
      const memberCollection = client.collection('members');
      const response = await memberCollection.find({
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
  async getMemberBySlug(slug: string): Promise<MemberViewModel> {
    try {
      const memberCollection = client.collection('members');
      const response = await memberCollection.find({
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

// 研究方向相关 API
export const researchApi = {
  // 获取研究方向页面内容（如果有单独的页面配置）
  async getResearchPage(): Promise<ResearchPageViewModel> {
    try {
      const researchSingle = client.single('research-areas');
      const response = await researchSingle.find({
        populate: ['cover_image'],
      }) as unknown as any;
      
      if (response.data) {
        return transformPageData(response.data, 'research') as ResearchPageViewModel;
      }
      
      throw new Error('未找到研究方向页面内容');
    } catch (error) {
      console.error('获取研究方向内容失败:', error);
      throw error;
    }
  },

  // 获取研究方向列表
  async getResearchAreaList(page = 1, pageSize = 100): Promise<ApiResponse<ResearchAreaViewModel[]>> {
    try {
      const researchAreaCollection = client.collection('research-areas');
      const response = await researchAreaCollection.find({
        populate: {
          cover_image: {
            fields: ['*']
          },
          related_publications: {
            fields: ['*']
          }
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
  async getResearchAreaBySlug(slug: string): Promise<ResearchAreaViewModel> {
    try {
      const researchAreaCollection = client.collection('research-areas');
      const response = await researchAreaCollection.find({
        filters: {
          slug: {
            $eq: slug
          }
        },
        populate: {
          cover_image: {
            fields: ['*']
          },
          related_publications: {
            fields: ['*']
          }
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
  async getPublicationList(page = 1, pageSize = 100): Promise<ApiResponse<PublicationViewModel[]>> {
    try {
      const publicationCollection = client.collection('publications');
      const response = await publicationCollection.find({
        pagination: {
          page,
          pageSize,
        },
        sort: ['year:desc'],
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

// 联系页面相关 API
export const contactApi = {
  // 获取联系页面内容
  async getContactPage(): Promise<ContactPageViewModel> {
    try {
      const contactCollection = client.collection('contact-page');
      const response = await contactCollection.find({}) as unknown as { data: StrapiData<any>[]; meta: { pagination?: any } };
      
      if (response.data && response.data.length > 0) {
        return transformPageData(response.data[0], 'contact') as ContactPageViewModel;
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
  async getJoinUsPage(): Promise<JoinUsPageViewModel> {
    try {
      const joinUsCollection = client.collection('join-us-page');
      const response = await joinUsCollection.find({}) as unknown as { data: StrapiData<any>[]; meta: { pagination?: any } };
      
      if (response.data && response.data.length > 0) {
        return transformPageData(response.data[0], 'join-us') as JoinUsPageViewModel;
      }
      
      throw new Error('未找到加入我们页面内容');
    } catch (error) {
      console.error('获取加入我们页面内容失败:', error);
      throw error;
    }
  }
};

// 专利页面相关 API
export const patentApi = {
  // 获取专利页面内容
  async getPatentPage(): Promise<PatentPageViewModel> {
    try {
      const patentCollection = client.collection('patent-page');
      const response = await patentCollection.find({}) as unknown as { data: StrapiData<any>[]; meta: { pagination?: any } };
      
      if (response.data && response.data.length > 0) {
        return transformPageData(response.data[0], 'patent') as PatentPageViewModel;
      }
      
      throw new Error('未找到专利页面内容');
    } catch (error) {
      console.error('获取专利页面内容失败:', error);
      throw error;
    }
  }
};

// 招聘页面相关 API
export const recruitApi = {
  // 获取招聘页面内容
  async getRecruitPage(): Promise<RecruitPageViewModel> {
    try {
      const recruitCollection = client.collection('recruit-page');
      const response = await recruitCollection.find({}) as unknown as { data: StrapiData<any>[]; meta: { pagination?: any } };
      
      if (response.data && response.data.length > 0) {
        return transformPageData(response.data[0], 'recruit') as RecruitPageViewModel;
      }
      
      throw new Error('未找到招聘页面内容');
    } catch (error) {
      console.error('获取招聘页面内容失败:', error);
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
  ResearchPageViewModel,
  ContactPageViewModel,
  JoinUsPageViewModel,
  PatentPageViewModel,
  RecruitPageViewModel,
  ResearchAreaViewModel,
  MediaFile,
  PaginationInfo
} from './types';
