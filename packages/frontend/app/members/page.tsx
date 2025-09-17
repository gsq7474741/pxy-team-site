import Image from "next/image";
import Link from "next/link";
import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export default async function MembersPage() {
  // 获取成员数据
  let members: MemberViewModel[] = [];
  try {
    const response = await memberApi.getMemberList();
    members = response.data || [];
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">团队成员</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          我们的团队由一群充满激情和才华的研究人员组成，致力于推动科学技术的发展。
        </p>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => {
            return (
              <Card key={member.id} className="overflow-hidden">
                <CardHeader className="p-0">
                  <div className="relative h-64 w-full">
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-muted flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                  <p className="mt-2 line-clamp-3">{member.bio}</p>
                </CardContent>
                <CardFooter>
                  <Link
                    href={`/members/${member.slug}`}
                    className="text-primary hover:underline"
                  >
                    查看详情
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无团队成员数据</p>
        </div>
      )}
    </div>
  );
}
