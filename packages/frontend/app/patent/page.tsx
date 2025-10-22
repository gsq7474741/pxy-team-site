import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { patentApi, patentsApi, type PatentPageViewModel, type PatentViewModel } from "@/lib/strapi-client";

export default async function PatentPage() {
  let page: PatentPageViewModel | null = null;
  let patents: PatentViewModel[] = [];
  try {
    page = await patentApi.getPatentPage();
  } catch (error) {
    console.error("获取专利页面内容失败:", error);
  }
  try {
    const res = await patentsApi.getPatentList();
    patents = res.data || [];
  } catch (error) {
    console.error("获取专利列表失败:", error);
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">专利信息</h1>
      </div>

      <div className="prose max-w-none">
        {page?.content ? (
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        ) : (
          <p className="text-muted-foreground">暂时没有内容。</p>
        )}
      </div>

      <div className="mt-12">
        {patents.length > 0 ? (
          <div className="space-y-4">
            {patents.map((p) => (
              <Card key={p.id}>
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{p.title}</h3>
                    {p.status && <Badge variant="secondary">{p.status}</Badge>}
                    {p.year && <Badge>{p.year}</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  {p.inventors && (
                    <p className="text-sm text-muted-foreground">发明人：{p.inventors}</p>
                  )}
                </CardContent>
                <CardFooter className="flex gap-4">
                  {p.pdfFile?.url && (
                    <Link href={p.pdfFile.url} target="_blank" className="text-primary hover:underline">PDF</Link>
                  )}
                  {p.link && (
                    <Link href={p.link} target="_blank" className="text-primary hover:underline">外部链接</Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无专利数据。</p>
          </div>
        )}
      </div>
    </div>
  );
}
