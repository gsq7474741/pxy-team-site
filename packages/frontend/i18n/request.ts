/**
 * i18n 请求配置
 * 用于服务端组件获取翻译
 */

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale, locales } from './config';

async function getLocaleFromCookies(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    const locale = localeCookie?.value;
    
    // 验证 locale 是否有效
    if (locale && locales.includes(locale as 'zh-CN' | 'en')) {
      return locale;
    }
  } catch {
    // 在构建时或静态生成时，cookies() 可能不可用
    // 静默失败，使用默认语言
  }
  
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocaleFromCookies();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
