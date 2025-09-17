import Link from "next/link";
import Image from "next/image";
import { researchApi, type ResearchPageViewModel, type ResearchAreaViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ResearchPageComponent() {
  // 获取研究页面数据和研究方向列表
  let researchPageData: ResearchPageViewModel | null = null;
  let researchAreas: ResearchAreaViewModel[] = [];

  try {
    // 尝试获取研究页面配置（如果有的话）
    try {
      researchPageData = await researchApi.getResearchPage();
    } catch (pageError) {
      console.log("没有找到研究页面配置，将使用默认标题和描述");
    }
    
    // 获取研究方向列表
    const researchAreasResponse = await researchApi.getResearchAreaList();
    researchAreas = researchAreasResponse.data;
  } catch (error) {
    console.error("获取研究方向数据失败:", error);
    // 如果后端数据获取失败，使用默认数据作为后备
    researchAreas = [
      {
        id: "1",
        title: "人工智能",
        description: "探索人工智能的前沿技术和应用，包括深度学习、强化学习和自然语言处理等领域。",
        icon: "🧠",
        slug: "ai",
        order: 1,
        createdAt: "",
        updatedAt: ""
      },
      {
        id: "2",
        title: "机器学习",
        description: "研究机器学习算法和模型，致力于解决复杂的数据分析和预测问题。",
        icon: "🤖",
        slug: "ml",
        order: 2,
        createdAt: "",
        updatedAt: ""
      },
      {
        id: "3",
        title: "数据科学",
        description: "利用统计学和计算机科学的方法，从大规模数据中提取知识和见解。",
        icon: "📊",
        slug: "data-science",
        order: 3,
        createdAt: "",
        updatedAt: ""
      },
      {
        id: "4",
        title: "计算机视觉",
        description: "研究如何使计算机能够从图像或视频中获取高层次的理解，模拟人类视觉系统。",
        icon: "👁️",
        slug: "cv",
        order: 4,
        createdAt: "",
        updatedAt: ""
      }
    ];
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{researchPageData?.title || "研究方向"}</h1>
        <div className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto"
             dangerouslySetInnerHTML={{ __html: researchPageData?.content || "我们课题组专注于以下前沿研究领域，致力于推动学术创新和技术进步。" }} />
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

      <div className="mt-16 border-t pt-12">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">研究成果</h2>
        <div className="space-y-6">
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">最新突破</h3>
            <p className="text-muted-foreground mb-4">
              我们课题组最近在[研究领域]取得了重要突破，相关论文已发表在顶级期刊上。
            </p>
            <Button asChild size="sm">
              <Link href="/publications">查看相关论文</Link>
            </Button>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">合作项目</h3>
            <p className="text-muted-foreground mb-4">
              我们与多家知名研究机构和企业建立了长期合作关系，共同推进前沿技术研究。
            </p>
            <Button asChild size="sm">
              <Link href="/contact">了解合作机会</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
