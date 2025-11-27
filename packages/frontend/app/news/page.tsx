import Link from "next/link";
import Image from "next/image";
import { newsApi, formatDate, stripHtmlTags, truncateText, type NewsViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTranslations, getLocale } from 'next-intl/server';

// 强制动态渲染，因为使用了 cookies() 进行语言检测
export const dynamic = 'force-dynamic';

// 新闻列表页面

export default async function NewsPage() {
  const t = await getTranslations('news');
  const tCommon = await getTranslations('common');
  const locale = await getLocale();
  
  // 获取新闻数据
  let news: NewsViewModel[] = [];
  let pagination = {
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0
  };

  try {
    const response = await newsApi.getNewsList(1, 10, locale);
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
            <Card key={item.id} className="overflow-hidden py-0 gap-0">
              {item.coverImage?.url && (
                <div className="relative w-full" style={{ aspectRatio: '21/9' }}>
                  <Image 
                    src={item.coverImage.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="pt-6">
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {formatDate(item.publishDate)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <p className="line-clamp-3">
                  {truncateText(stripHtmlTags(item.content))}
                </p>
              </CardContent>
              <CardFooter className="pb-6 pt-4">
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
