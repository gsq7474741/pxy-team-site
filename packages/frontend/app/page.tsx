import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { researchApi, newsApi, type ResearchAreaViewModel, type NewsViewModel, formatDate, stripHtmlTags, truncateText } from "@/lib/strapi-client";

export const revalidate = 300;

export default async function Home() {
  let researchAreas: ResearchAreaViewModel[] = [];
  let latestNews: NewsViewModel[] = [];
  try {
    const res = await researchApi.getResearchAreaList(1, 100);
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
            <h2 className="text-3xl font-bold tracking-tight">我们的研究</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              我们专注于以下几个前沿研究领域，致力于解决关键科学问题。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchAreas.map((area) => (
              <Card key={area.id} className="transition-all hover:shadow-md">
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
                <CardContent>
                  <p className="text-muted-foreground">{area.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/research/${area.slug}`}>了解更多</Link>
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
            <h2 className="text-3xl font-bold tracking-tight">最新动态</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              了解我们课题组的最新研究成果和活动信息。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestNews.length > 0 ? (
              latestNews.map((n) => (
                <Card key={n.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <CardTitle>{n.title}</CardTitle>
                    <CardDescription>{formatDate(n.publishDate)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {truncateText(stripHtmlTags(n.content || ''), 120)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" asChild>
                      <Link href={`/news/${n.id}`}>查看详情</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">暂无动态</div>
            )}
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/news">查看全部动态</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
