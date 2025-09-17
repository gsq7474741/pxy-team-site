import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { researchApi, publicationApi, type ResearchAreaViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Calendar } from "lucide-react";

interface ResearchAreaDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function ResearchAreaDetailPage({ params }: ResearchAreaDetailPageProps) {
  let researchArea: ResearchAreaViewModel;

  try {
    researchArea = await researchApi.getResearchAreaBySlug(params.slug);
  } catch (error) {
    console.error("获取研究方向详情失败:", error);
    notFound();
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      {/* 返回按钮 */}
      <div className="mb-8">
        <Button asChild variant="ghost" className="gap-2">
          <Link href="/research">
            <ArrowLeft className="h-4 w-4" />
            返回研究方向列表
          </Link>
        </Button>
      </div>

      {/* 页面标题和基本信息 */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="text-6xl">{researchArea.icon}</div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{researchArea.title}</h1>
            <p className="text-xl text-muted-foreground">{researchArea.description}</p>
          </div>
        </div>

        {/* 关键词标签 */}
        {researchArea.keywords && researchArea.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {researchArea.keywords.map((keyword, index) => (
              <Badge key={index} variant="secondary">
                {keyword}
              </Badge>
            ))}
          </div>
        )}

        {/* 封面图片 */}
        {researchArea.coverImage?.url && (
          <div className="relative w-full h-96 overflow-hidden rounded-lg mb-8">
            <Image
              src={researchArea.coverImage.url}
              alt={researchArea.coverImage.alternativeText || researchArea.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>

      {/* 详细内容 */}
      {researchArea.detailedContent && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">研究详情</h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: researchArea.detailedContent }}
          />
        </div>
      )}

      {/* 研究亮点 */}
      {researchArea.researchHighlights && researchArea.researchHighlights.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">研究亮点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {researchArea.researchHighlights.map((highlight, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{highlight.icon || "✨"}</div>
                    <CardTitle className="text-xl">{highlight.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{highlight.description}</p>
                  {highlight.link && (
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={highlight.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          了解更多
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 相关论文 */}
      {researchArea.relatedPublications && researchArea.relatedPublications.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">相关论文</h2>
          <div className="space-y-6">
            {researchArea.relatedPublications.map((publication) => (
              <Card key={publication.id} className="transition-all hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{publication.title}</h3>
                      <p className="text-muted-foreground mb-2">{publication.authors}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {publication.year}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {publication.journal}
                        </div>
                        {publication.type && (
                          <Badge variant="outline" className="text-xs">
                            {publication.type}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {publication.doi && (
                      <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href={publication.doi} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          查看论文
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 底部导航 */}
      <div className="border-t pt-8">
        <div className="flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href="/research">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回研究方向
            </Link>
          </Button>
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/publications">
                查看所有论文
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                联系我们
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 生成静态参数（可选，用于静态生成）
export async function generateStaticParams() {
  try {
    const response = await researchApi.getResearchAreaList(1, 100);
    return response.data.map((area) => ({
      slug: area.slug,
    }));
  } catch (error) {
    console.error("生成静态参数失败:", error);
    return [];
  }
}

// 生成页面元数据
export async function generateMetadata({ params }: ResearchAreaDetailPageProps) {
  try {
    const researchArea = await researchApi.getResearchAreaBySlug(params.slug);
    return {
      title: `${researchArea.title} - Prof. Peng 课题组`,
      description: researchArea.description,
      keywords: researchArea.keywords?.join(", ") || "",
    };
  } catch (error) {
    return {
      title: "研究方向详情 - Prof. Peng 课题组",
      description: "查看我们的研究方向详细信息",
    };
  }
}
