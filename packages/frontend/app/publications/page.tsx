import { publicationApi, patentsApi, awardsApi, type PublicationViewModel, type PatentViewModel, type AwardViewModel } from "@/lib/strapi-client";
import PublicationsClient from "@/components/PublicationsClient";
import { getLocale } from 'next-intl/server';

// 强制动态渲染，因为使用了 cookies() 进行语言检测
export const dynamic = 'force-dynamic';

export default async function PublicationsPage() {
  const locale = await getLocale();
  let publications: PublicationViewModel[] = [];
  let patents: PatentViewModel[] = [];
  let awards: AwardViewModel[] = [];

  try {
    const response = await publicationApi.getPublicationList(1, 100, locale);
    publications = response.data || [];
  } catch (error) {
    console.error("获取论文数据失败:", error);
  }

  try {
    const response = await patentsApi.getPatentList(1, 100, locale);
    patents = response.data || [];
  } catch (error) {
    console.error("获取专利数据失败:", error);
  }

  try {
    const response = await awardsApi.getAwardList(1, 100, locale);
    awards = response.data || [];
  } catch (error) {
    console.error("获取竞赛奖项失败:", error);
  }

  return (
    <PublicationsClient publications={publications} patents={patents} awards={awards} />
  );
}
