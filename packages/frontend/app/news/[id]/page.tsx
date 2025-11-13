import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { newsApi, formatDate, type NewsViewModel } from "@/lib/strapi-client";
import ShareButtons from "@/components/ShareButtons";
import { getTranslations } from 'next-intl/server';

// 新闻详情缓存：300秒（配合 Webhook 实现实时更新）
export const revalidate = 300;

// 定义页面参数类型
interface NewsDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

// 构建期生成静态路径
export async function generateStaticParams() {
  try {
    const res = await newsApi.getNewsList(1, 1000);
    return (res.data || []).map((n) => ({ id: String(n.id) }));
  } catch (e) {
    return [];
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const t = await getTranslations('news');
  // Next.js 15 要求 await params
  const { id } = await params;
  
  // 获取新闻详情
  let newsDetail: NewsViewModel | null = null;
  
  try {
    newsDetail = await newsApi.getNewsById(id);
  } catch (error) {
    return notFound();
  }
  
  if (!newsDetail) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 返回按钮 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-4">
          <Button variant="ghost" size="sm" asChild className="text-gray-600 hover:text-gray-900">
            <Link href="/news">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              {t('back_to_list')}
            </Link>
          </Button>
        </div>
      </div>

      {/* 新闻详情内容 */}
      <article className="max-w-4xl mx-auto bg-white">
        {/* 封面图片 */}
        {newsDetail.coverImage?.url && (
          <div className="relative w-full h-[500px] overflow-hidden">
            <Image 
              src={newsDetail.coverImage.url}
              alt={newsDetail.coverImage.alternativeText || newsDetail.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            {newsDetail.coverImage.caption && (
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-sm opacity-90">{newsDetail.coverImage.caption}</p>
              </div>
            )}
          </div>
        )}

        {/* 文章内容区域 */}
        <div className="px-6 md:px-12 py-12">
          {/* 标题和元信息 */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900">
              {newsDetail.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <time dateTime={newsDetail.publishDate}>
                {formatDate(newsDetail.publishDate)}
              </time>
              {newsDetail.publishDate !== newsDetail.updatedAt && (
                <>
                  <span className="mx-2">•</span>
                  <span>{t('updated_at')} {formatDate(newsDetail.updatedAt)}</span>
                </>
              )}
            </div>
          </header>

          {/* 文章正文 */}
          <div className="prose prose-lg prose-gray max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: newsDetail.content }}
            />
          </div>
        </div>

        {/* 分享和操作区域 */}
        <footer className="px-6 md:px-12 py-8 bg-gray-50 border-t">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{t('share')}:</span>
              <ShareButtons title={newsDetail.title} />
            </div>
            <Button variant="default" size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/news">
                {t('view_more')}
              </Link>
            </Button>
          </div>
        </footer>
      </article>
    </div>
  );
}
