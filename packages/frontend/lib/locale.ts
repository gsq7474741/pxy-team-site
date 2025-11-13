/**
 * Locale 检测和规范化工具
 * 为国际化做准备，支持动态 locale 检测
 */

/**
 * 规范化 locale 代码 - 兜底机制
 * 
 * 策略：
 * 1. 所有中文变体（zh-CN, zh-TW, zh-HK, zh-Hans, zh-Hant 等）→ zh-CN
 * 2. 所有其他语言（en, ja, ko, fr 等）→ en
 * 
 * 这样确保：
 * - 中文用户（大陆/台湾/香港/新加坡等）都能看到中文内容
 * - 非中文用户都看到英文内容
 */
export function normalizeLocale(locale: string): string {
  if (!locale) return 'zh-CN';
  
  // 转换为小写并处理下划线
  const normalized = locale.toLowerCase().replace('_', '-');
  
  // 检查是否为中文变体（任何以 zh 开头的 locale）
  if (normalized.startsWith('zh')) {
    // 所有中文变体统一映射到 zh-CN（简体中文）
    return 'zh-CN';
  }
  
  // 所有非中文语言映射到英文
  // 注意：后续如果后端添加了其他语言版本（如日语、韩语），
  // 可以在这里添加更精细的映射
  return 'en';
}

/**
 * 从 Accept-Language 头中获取首选语言
 * 用于服务端检测用户语言偏好
 */
export function getLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'zh-CN';
  
  // Accept-Language 格式: "zh-CN,zh;q=0.9,en;q=0.8"
  // 提取第一个（权重最高的）语言
  const firstLocale = acceptLanguage.split(',')[0].split(';')[0].trim();
  return normalizeLocale(firstLocale);
}

/**
 * 获取当前应用的 locale (服务端)
 * 
 * 优先级：
 * 1. Cookie 中的用户选择 (需要在调用处传入)
 * 2. 环境变量
 * 3. 默认值 (zh-CN)
 * 
 * 注意：这个函数用于服务端组件
 * 对于客户端组件，应该使用 getClientLocale()
 * 
 * @param cookieLocale - 从 Next.js cookies() 读取的 locale 值
 */
export function getServerLocale(cookieLocale?: string | null): string {
  // 1. 优先使用 Cookie 中保存的用户选择
  if (cookieLocale) return normalizeLocale(cookieLocale);
  
  // 2. 使用环境变量（如果设置了）
  const envLocale = process.env.NEXT_PUBLIC_STRAPI_LOCALE;
  if (envLocale) return normalizeLocale(envLocale);
  
  // 3. 默认使用中文
  return 'zh-CN';
}

/**
 * 客户端 locale 检测
 * 仅在浏览器环境中可用
 * 
 * 优先级：
 * 1. Cookie 中的用户选择
 * 2. 环境变量
 * 3. 浏览器语言
 * 4. 默认中文
 */
export function getClientLocale(): string {
  if (typeof window === 'undefined') {
    return getServerLocale();
  }
  
  // 1. 优先使用 Cookie 中保存的用户选择
  const cookieLocale = getCookie('NEXT_LOCALE');
  if (cookieLocale) return normalizeLocale(cookieLocale);
  
  // 2. 使用环境变量（如果设置了）
  const envLocale = process.env.NEXT_PUBLIC_STRAPI_LOCALE;
  if (envLocale) return normalizeLocale(envLocale);
  
  // 3. 检测浏览器语言
  const browserLocale = navigator.language || navigator.languages?.[0];
  if (browserLocale) return normalizeLocale(browserLocale);
  
  // 4. 默认中文
  return 'zh-CN';
}

/**
 * 获取 Cookie 值
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * 支持的语言列表
 * 
 * 注意：这里只定义后端实际支持的 locale
 * 前端会通过 normalizeLocale() 将用户的各种语言映射到这两个
 */
export const SUPPORTED_LOCALES = {
  'zh-CN': {
    code: 'zh-CN',
    name: '简体中文',
    englishName: 'Simplified Chinese',
    description: '适用于所有中文用户（大陆、台湾、香港、新加坡等）',
  },
  'en': {
    code: 'en',
    name: 'English',
    englishName: 'English',
    description: 'For all non-Chinese users',
  },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

/**
 * 检查是否为支持的语言
 */
export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in SUPPORTED_LOCALES;
}

/**
 * 获取支持的语言，如果不支持则返回默认语言
 */
export function getSupportedLocale(locale: string): SupportedLocale {
  const normalized = normalizeLocale(locale);
  return isSupportedLocale(normalized) ? normalized : 'zh-CN';
}
