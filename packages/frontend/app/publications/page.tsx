import { publicationApi, patentsApi, awardsApi, type PublicationViewModel, type PatentViewModel, type AwardViewModel } from "@/lib/strapi-client";
import PublicationsClient from "@/components/PublicationsClient";

export default async function PublicationsPage() {
  let publications: PublicationViewModel[] = [];
  let patents: PatentViewModel[] = [];
  let awards: AwardViewModel[] = [];

  try {
    const response = await publicationApi.getPublicationList(1, 100);
    publications = response.data || [];
  } catch (error) {
    console.error("获取论文数据失败:", error);
  }

  try {
    const response = await patentsApi.getPatentList(1, 100);
    patents = response.data || [];
  } catch (error) {
    console.error("获取专利数据失败:", error);
  }

  try {
    const response = await awardsApi.getAwardList(1, 100);
    awards = response.data || [];
  } catch (error) {
    console.error("获取竞赛奖项失败:", error);
  }

  return (
    <PublicationsClient publications={publications} patents={patents} awards={awards} />
  );
}
