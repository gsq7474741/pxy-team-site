import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { researchApi, type ResearchAreaViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Calendar, Trophy } from "lucide-react";
import { getLocale } from "@/lib/server-locale";
import { getTranslations } from 'next-intl/server';

// 研究方向详情缓存：300秒（配合 Webhook 实现实时更新）
export const revalidate = 300;

interface ResearchAreaDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ResearchAreaDetailPage({ params }: ResearchAreaDetailPageProps) {
  const t = await getTranslations('research');
  const tPub = await getTranslations('publications');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();
  let researchArea: ResearchAreaViewModel;

  try {
    const { slug } = await params;
    researchArea = await researchApi.getResearchAreaBySlug(slug, locale);
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
            {t('back_to_list')}
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
          <h2 className="text-3xl font-bold tracking-tight mb-6">{t('details')}</h2>
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: researchArea.detailedContent }}
          />
        </div>
      )}

      {/* 研究亮点 */}
      {researchArea.researchHighlights && researchArea.researchHighlights.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">{t('highlights')}</h2>
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
                          {t('learn_more')}
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
          <h2 className="text-3xl font-bold tracking-tight mb-6">{t('related_publications')}</h2>
          <ul className="rounded-lg border divide-y">
            {researchArea.relatedPublications.map((publication) => (
              <li key={publication.id} className="flex items-start justify-between gap-4 p-5 hover:bg-muted/40">
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
                      {publication.publicationVenue}
                    </div>
                    {publication.publicationType && (
                      <Badge variant="outline" className="text-xs">
                        {publication.publicationType}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {publication.doiLink && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link href={publication.doiLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        {tPub('view_online')}
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 相关专利 */}
      {researchArea.relatedPatents && researchArea.relatedPatents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">{t('related_patents')}</h2>
          <ul className="rounded-lg border divide-y">
            {researchArea.relatedPatents.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 p-5 hover:bg-muted/40">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{p.title}</h3>
                  {p.inventors && (
                    <p className="text-muted-foreground mb-2">{p.inventors}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {p.year || '—'}
                    </div>
                    {p.status && (
                      <Badge variant={p.status === 'Granted' ? 'default' : (p.status === 'Pending' ? 'secondary' : 'destructive')}>
                        {p.status}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {p.pdfFile?.url && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link href={p.pdfFile.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4" />
                        {tPub('download_pdf')}
                      </Link>
                    </Button>
                  )}
                  {p.link && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link href={p.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        {tCommon('external_link')}
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 竞赛奖项 */}
      {researchArea.relatedAwards && researchArea.relatedAwards.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-6">{t('related_awards')}</h2>
          <ul className="rounded-lg border divide-y">
            {researchArea.relatedAwards.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 p-5 hover:bg-muted/40">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{a.title}</h3>
                  {(a.recipients || a.supervisor) && (
                    <p className="text-muted-foreground mb-2">{[a.recipients, a.supervisor].filter(Boolean).join(' ｜ ')}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4" />
                      {a.awardRank || '—'}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {a.year || '—'}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {a.pdfFile?.url && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link href={a.pdfFile.url} target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4" />
                        下载PDF
                      </Link>
                    </Button>
                  )}
                  {a.link && (
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <Link href={a.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        外部链接
                      </Link>
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 底部导航 */}
      <div className="border-t pt-8">
        <div className="flex justify-between items-center">
          <Button asChild variant="outline">
            <Link href="/research">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back_to_list')}
            </Link>
          </Button>
          
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/publications">
                {tPub('view_all_publications')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">
                {tCommon('contact_us')}
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
    const { slug } = await params;
    const researchArea = await researchApi.getResearchAreaBySlug(slug);
    return {
      title: `${researchArea.title} - Prof. Peng 课题组`,
      description: researchArea.description,
      keywords: researchArea.keywords?.join(", ") || "",
    };
  } catch {
    return {
      title: "研究方向详情 - Prof. Peng 课题组",
      description: "查看我们的研究方向详细信息",
    };
  }
}
