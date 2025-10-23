import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import MembersClient from "@/components/MembersClient";
export const revalidate = 300;

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
