import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import MembersClient from "@/components/MembersClient";
import { getLocale } from 'next-intl/server';

// 团队成员页面缓存：300秒（配合 Webhook 实现实时更新）
export const revalidate = 300;

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
