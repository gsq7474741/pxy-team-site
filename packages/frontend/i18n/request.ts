/**
 * i18n 请求配置
 * 用于服务端组件获取翻译
 */

import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { defaultLocale } from './config';

export default getRequestConfig(async () => {
  // 从 Cookie 读取用户选择的语言
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  
  // 使用 Cookie 中的语言，否则使用默认语言
  const locale = localeCookie?.value || defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
