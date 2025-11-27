import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import MembersClient from "@/components/MembersClient";
import { getLocale } from 'next-intl/server';

// 强制动态渲染，因为使用了 cookies() 进行语言检测
export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  const locale = await getLocale();
  let members: MemberViewModel[] = [];
  try {
    const response = await memberApi.getMemberList(1, 100, locale);
    members = response.data || [];
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }
  return <MembersClient members={members} />;
}
