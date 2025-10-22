import Image from "next/image";
import Link from "next/link";
import { memberApi, type MemberViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface MembersPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
  // 获取成员数据
  let members: MemberViewModel[] = [];
  try {
    const response = await memberApi.getMemberList();
    members = response.data || [];
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }

  const sp = (await (searchParams ?? Promise.resolve({}))) as Record<string, string | string[] | undefined>;
  const activeRole = typeof sp.role === 'string' ? sp.role : 'all';
  const roles = Array.from(new Set((members || []).map(m => m.role).filter(Boolean)));
  const tabs = ['all', ...roles];
  const filteredMembers = activeRole === 'all' ? members : members.filter(m => m.role === activeRole);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">团队成员</h1>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 border-b">
          {tabs.map((r) => {
            const isActive = activeRole === r;
            const href = r === 'all' ? '/members' : `/members?role=${encodeURIComponent(r)}`;
            const label = r === 'all' ? '全部' : r;
            return (
              <Link
                key={r}
                href={href}
                className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => {
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
