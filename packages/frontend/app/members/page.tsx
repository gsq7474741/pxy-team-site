import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import MembersClient from "@/components/MembersClient";
// 团队成员页面缓存：60秒
export const revalidate = 60;

export default async function MembersPage() {
  let members: MemberViewModel[] = [];
  try {
    const response = await memberApi.getMemberList();
    members = response.data || [];
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }
  return <MembersClient members={members} />;
}
