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
 * 注意：此函数使用 cookies()，会使页面变成动态渲染
 * 在静态生成时会返回默认 locale
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
  try {
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    return getServerLocale(localeCookie?.value);
  } catch {
    // 在静态生成或构建时，cookies() 可能不可用
    // 返回默认 locale
    return getServerLocale(undefined);
  }
}
