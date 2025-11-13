/**
 * 服务端 Locale 检测工具
 * 专门用于 Next.js App Router 的服务端组件
 */

import { cookies } from 'next/headers';
import { getServerLocale } from './locale';

/**
 * 在服务端组件中获取当前 locale
 * 自动从 Next.js cookies 读取用户选择的语言
 * 
 * 使用方法：
 * ```typescript
 * import { getLocale } from '@/lib/server-locale';
 * 
 * export default async function MyPage() {
 *   const locale = await getLocale();
 *   const data = await api.getData(locale);
 * }
 * ```
 */
export async function getLocale(): Promise<string> {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE');
  return getServerLocale(localeCookie?.value);
}
