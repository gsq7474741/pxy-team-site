import Link from "next/link";
import Image from "next/image";
import { newsApi, getStrapiMedia, formatDate, stripHtmlTags, truncateText, type NewsViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations } from 'next-intl/server';

// 新闻页面缓存：60秒
export const revalidate = 60;

// 新闻列表页面

export default async function NewsPage() {
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');
  // 获取新闻数据
  let news: NewsViewModel[] = [];
  let pagination = {
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  };

  try {
    const response = await newsApi.getNewsList(1, 10);
    news = response.data || [];
    pagination = response.pagination || pagination;
  } catch (error) {
    console.error("获取新闻数据失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      {news.length > 0 ? (
        <div className="space-y-6">
          {news.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              {item.coverImage?.url && (
                <div className="relative w-full h-48">
                  <Image 
                    src={item.coverImage.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {formatDate(item.publishDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">
                  {truncateText(stripHtmlTags(item.content))}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline">
                  <Link href={`/news/${item.id}`}>
                    {t('read_more')}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{tCommon('no_data')}</p>
        </div>
      )}

      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {Array.from({ length: pagination.pageCount }).map((_, index) => (
            <Button
              key={index}
              variant={pagination.page === index + 1 ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/news?page=${index + 1}`}>
                {index + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
