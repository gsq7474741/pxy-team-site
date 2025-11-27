import { openingApi } from "@/lib/strapi-client";
import { getTranslations } from 'next-intl/server';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/strapi-client";
import { ArrowLeft, Briefcase, MapPin, Calendar, Mail, ExternalLink } from "lucide-react";

// 强制动态渲染，因为使用了 cookies() 进行语言检测
export const dynamic = 'force-dynamic';

interface OpeningDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function OpeningDetailPage({ params }: OpeningDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations('join');
  const tCommon = await getTranslations('common');
  const tResearch = await getTranslations('research');

  let opening = null;
  let error = null;

  try {
    opening = await openingApi.getOpeningBySlug(slug);
  } catch (err) {
    error = `未找到该岗位信息`;
    console.error("获取岗位详情失败:", err);
  }

  if (error || !opening) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
        <Link href="/join" className="inline-flex items-center gap-2 text-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4" />
          {t('back_to_list') || '返回岗位列表'}
        </Link>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">{error || tCommon('error')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-12">
      {/* 返回按钮 */}
      <Link href="/join" className="inline-flex items-center gap-2 text-primary hover:underline mb-8">
        <ArrowLeft className="h-4 w-4" />
        {t('back_to_list') || '返回岗位列表'}
      </Link>

      {/* 标题区域 */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-3">{opening.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-base py-1 px-3">
                <Briefcase className="h-4 w-4 mr-2" />
                {opening.positionType}
              </Badge>
              {opening.status && (
                <Badge variant={opening.status === 'Open' ? 'default' : 'destructive'} className="text-base py-1 px-3">
                  {opening.status === 'Open' ? (t('status_open') || '招聘中') : (t('status_closed') || '已关闭')}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 基本信息卡片 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">{t('basic_info') || '基本信息'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {opening.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">{t('location')}</p>
                <p className="text-base">{opening.location}</p>
              </div>
            </div>
          )}
          {opening.deadlineDate && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">{t('deadline')}</p>
                <p className="text-base">{formatDate(opening.deadlineDate)}</p>
              </div>
            </div>
          )}
          {opening.contactEmail && (
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">{t('contact_email')}</p>
                <Link href={`mailto:${opening.contactEmail}`} className="text-primary hover:underline">
                  {opening.contactEmail}
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 岗位描述 */}
      {opening.description && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{t('description') || '岗位描述'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: opening.description }} />
          </CardContent>
        </Card>
      )}

      {/* 岗位要求 */}
      {opening.requirements && opening.requirements.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{t('requirements')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {opening.requirements.map((req, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 福利待遇 */}
      {opening.benefits && opening.benefits.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{t('benefits')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {opening.benefits.map((benefit, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="text-primary font-bold flex-shrink-0">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* 相关研究方向 */}
      {opening.researchAreas && opening.researchAreas.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">{tResearch('highlights') || '研究方向'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {opening.researchAreas.map((area) => (
                <Link
                  key={area.id}
                  href={`/research/${area.slug}`}
                  className="inline-block"
                >
                  <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
                    {area.title}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 申请按钮 */}
      <div className="flex gap-4 mt-12">
        {opening.applyLink && opening.status !== 'Closed' && (
          <Button size="lg" asChild>
            <Link href={opening.applyLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {t('apply_now')}
            </Link>
          </Button>
        )}
        {opening.contactEmail && (
          <Button variant="outline" size="lg" asChild>
            <Link href={`mailto:${opening.contactEmail}`}>
              <Mail className="h-4 w-4 mr-2" />
              {t('contact_email')}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
