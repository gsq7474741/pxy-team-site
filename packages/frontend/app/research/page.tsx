import Link from "next/link";
import Image from "next/image";
import { researchApi, type ResearchAreaViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ResearchPageComponent() {
  // 获取研究页面数据和研究方向列表
  let researchAreas: ResearchAreaViewModel[] = [];

  try {
    // 获取研究方向列表
    const researchAreasResponse = await researchApi.getResearchAreaList();
    researchAreas = researchAreasResponse.data;
  } catch (error) {
    console.error("获取研究方向数据失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">研究方向</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {researchAreas.map((area) => (
          <Card key={area.id} className="transition-all hover:shadow-md">
            <CardHeader>
              {/* 如果有封面图片，显示图片；否则显示图标 */}
              {area.coverImage?.url ? (
                <div className="relative w-full h-48 mb-3 overflow-hidden rounded-lg">
                  <Image
                    src={area.coverImage.url}
                    alt={area.coverImage.alternativeText || area.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="text-4xl mb-3">{area.icon}</div>
              )}
              <CardTitle className="text-2xl">{area.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{area.description}</p>
              
              {/* 显示研究亮点（如果有的话） */}
              {area.researchHighlights && area.researchHighlights.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">研究亮点：</h4>
                  <ul className="space-y-1">
                    {area.researchHighlights.slice(0, 2).map((highlight, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">{highlight.icon || '•'}</span>
                        <span>{highlight.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* 显示关键词（如果有的话） */}
              {area.keywords && area.keywords.length > 0 && (
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {area.keywords.slice(0, 3).map((keyword, index) => (
                      <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button asChild variant="outline">
                <Link href={`/research/${area.slug}`}>
                  了解更多
                </Link>
              </Button>
              
              {/* 如果有相关论文，显示论文数量 */}
              {area.relatedPublications && area.relatedPublications.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {area.relatedPublications.length} 篇相关论文
                </span>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 去除硬编码的底部静态内容，内容由 CMS 管理 */}
    </div>
  );
}
