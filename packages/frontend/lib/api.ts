/**
 * API 工具函数，用于与后端 Strapi API 交互
 */

// 获取 Strapi API 的基础 URL
const getStrapiURL = (path = '') => {
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'}${path}`;
};

// 获取完整的媒体 URL
export const getStrapiMedia = (url: string | null) => {
  if (!url) return null;
  if (url.startsWith('http') || url.startsWith('//')) return url;
  // 媒体文件不需要 /api 前缀，直接拼接基础 URL
  const baseUrl = ('http://localhost:1337');
  // 移除环境变量中可能存在的 /api 后缀
  // const baseUrl = (process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337').replace(/\/api$/, '');
  return `${baseUrl}${url}`;
};

// 通用 fetch 函数
export async function fetchAPI(path: string, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    const res = await fetch(getStrapiURL(`/api${path}`), mergedOptions);
    
    if (!res.ok) {
      throw new Error(`API 请求失败: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('API 请求错误:', error);
    throw error;
  }
}

// 获取新闻列表
export async function fetchNews(pageSize = 10, page = 1) {
  const res = await fetchAPI(`/news?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=publish_date:desc&populate=cover_image`);
  return res;
}

// 获取单个新闻详情
export async function fetchNewsDetail(id: number) {
  const res = await fetchAPI(`/news/${id}?populate=cover_image`);
  return res.data || null;
}

// 获取团队成员列表
export async function fetchMembers(role?: string) {
  const roleFilter = role ? `&filters[role][$eq]=${role}` : '';
  const res = await fetchAPI(`/members?sort=enrollment_year:desc${roleFilter}&populate=photo`);
  return res;
}

// 获取单个成员详情
export async function fetchMemberDetail(id: number) {
  const res = await fetchAPI(`/members/${id}?populate=photo`);
  return res.data || null;
}

// 通过slug获取成员详情
export async function fetchMemberBySlug(slug: string) {
  const res = await fetchAPI(`/members?filters[slug][$eq]=${slug}&populate=photo`);
  return res;
}

// 获取研究方向页面内容
export async function fetchResearchPage() {
  const res = await fetchAPI('/research-page');
  return res.data || null;
}

// 获取论文列表
export async function fetchPublications(pageSize = 20, page = 1, year?: number) {
  const yearFilter = year ? `&filters[year][$eq]=${year}` : '';
  const res = await fetchAPI(`/publications?pagination[page]=${page}&pagination[pageSize]=${pageSize}${yearFilter}&sort=year:desc&populate=pdf_file`);
  return res;
}

// 获取首页数据
export async function fetchHomeData() {
  const res = await fetchAPI('/home');
  return res.data || null;
}

// 获取联系页面内容
export async function fetchContactPage() {
  const res = await fetchAPI('/contact-page');
  return res.data || null;
}

// 获取加入我们页面内容
export async function fetchJoinUsPage() {
  const res = await fetchAPI('/join-us-page');
  return res.data || null;
}

// 提交联系表单
export async function submitContactForm(data: any) {
  const res = await fetchAPI('/contact-forms', {
    method: 'POST',
    body: JSON.stringify({ data }),
  });
  return res;
}

// 获取专利列表
export async function fetchPatents(pageSize = 20, page = 1) {
  const res = await fetchAPI(`/patents?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=year:desc`);
  return res;
}

// 获取招聘信息
export async function fetchRecruitInfo() {
  const res = await fetchAPI('/recruit-page');
  return res.data || null;
}
