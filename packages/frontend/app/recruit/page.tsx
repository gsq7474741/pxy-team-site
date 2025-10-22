import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { recruitApi, openingApi, type RecruitPageViewModel, type OpeningViewModel } from "@/lib/strapi-client";

export default async function RecruitPage() {
  let page: RecruitPageViewModel | null = null;
  let openings: OpeningViewModel[] = [];
  try {
    page = await recruitApi.getRecruitPage();
  } catch (error) {
    console.error("获取招聘页面内容失败:", error);
  }
  try {
    const res = await openingApi.getOpeningList();
    openings = res.data || [];
  } catch (error) {
    console.error("获取岗位列表失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">招聘信息</h1>
      </div>

      <div className="prose max-w-none">
        {page?.content ? (
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <p className="text-muted-foreground">暂时没有内容。</p>
        )}
      </div>

      <div className="mt-12">
        {openings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openings.map((opening) => (
              <Card key={opening.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{opening.title}</h3>
                    <Badge variant="secondary">{opening.positionType}</Badge>
                    {opening.status && <Badge>{opening.status}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {opening.location && (
                    <p className="text-sm text-muted-foreground">地点：{opening.location}</p>
                  )}
                  {opening.deadlineDate && (
                    <p className="text-sm text-muted-foreground mt-1">截止：{opening.deadlineDate}</p>
                  )}
                  {opening.description && (
                    <div className="mt-3 prose max-w-none" dangerouslySetInnerHTML={{ __html: opening.description }} />
                  )}
                </CardContent>
                <CardFooter className="flex gap-4">
                  {opening.applyLink && (
                    <Link href={opening.applyLink} className="text-primary hover:underline" target="_blank">立即申请</Link>
                  )}
                  {opening.contactEmail && (
                    <Link href={`mailto:${opening.contactEmail}`} className="text-primary hover:underline">联系邮箱</Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">当前暂无开放岗位。</p>
          </div>
        )}
      </div>
    </div>
  );
}
