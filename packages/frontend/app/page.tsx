import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { researchApi, newsApi, type ResearchAreaViewModel, type NewsViewModel, formatDate, stripHtmlTags, truncateText } from "@/lib/strapi-client";
import { getLocale } from "@/lib/server-locale";
import { getTranslations } from 'next-intl/server';

// 强制动态渲染，因为使用了 cookies() 进行语言检测
export const dynamic = 'force-dynamic';

export default async function Home() {
  const t = await getTranslations('home');
  const tResearch = await getTranslations('research');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();
  let researchAreas: ResearchAreaViewModel[] = [];
  let latestNews: NewsViewModel[] = [];
  try {
    const res = await researchApi.getResearchAreaList(1, 100, locale);
    researchAreas = (res.data || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 3);
  } catch (error) {
    console.error("获取研究方向失败:", error);
  }
  try {
    const newsRes = await newsApi.getNewsList(1, 2);
    latestNews = newsRes.data || [];
  } catch (error) {
    console.error("获取新闻列表失败:", error);
  }
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* 研究领域部分 */}
      <section className="py-16 bg-background">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t('research_title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('research_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchAreas.map((area) => (
              <Card key={area.id} className="transition-all hover:shadow-md flex flex-col">
                <CardHeader>
                  {area.coverImage?.url ? (
                    <div className="relative w-full h-40 mb-2 overflow-hidden rounded-lg">
                      <Image
                        src={area.coverImage.url}
                        alt={area.coverImage.alternativeText || area.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-4xl mb-2">{area.icon}</div>
                  )}
                  <CardTitle>{area.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{area.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/research/${area.slug}`}>{tResearch('learn_more')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* 最新动态部分 */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">{t('news_title')}</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('news_subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestNews.length > 0 ? (
              latestNews.map((n) => (
                <Card key={n.id} className="transition-all hover:shadow-md flex flex-col">
                  <CardHeader>
                    <CardTitle>{n.title}</CardTitle>
                    <CardDescription>{formatDate(n.publishDate)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground">
                      {truncateText(stripHtmlTags(n.content || ''), 120)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/news/${n.id}`}>{tCommon('view_details')}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">{tCommon('no_data')}</div>
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/news">{t('view_all_news')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
