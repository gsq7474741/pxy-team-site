import { publicationApi, patentsApi, type PublicationViewModel, type PatentViewModel } from "@/lib/strapi-client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ExternalLink, FileText, Code, Calendar, BookOpen } from "lucide-react";

export default async function PublicationsPage() {
  // 获取论文数据
  let publications: PublicationViewModel[] = [];
  let pagination = {
    page: 1,
    pageSize: 20,
    pageCount: 1,
    total: 0
  };

  try {
    const response = await publicationApi.getPublicationList(1, 100);
    publications = response.data || [];
    pagination = response.pagination || pagination;
  } catch (error) {
    console.error("获取论文数据失败:", error);
  }

  // 获取专利数据
  let patents: PatentViewModel[] = [];
  try {
    const response = await patentsApi.getPatentList(1, 100);
    patents = response.data || [];
  } catch (error) {
    console.error("获取专利数据失败:", error);
  }

  // 按年份对论文进行分组
  const publicationsByYear: Record<string, PublicationViewModel[]> = {};
  publications.forEach(pub => {
    const year = pub.year;
    if (!publicationsByYear[year]) {
      publicationsByYear[year] = [];
    }
    publicationsByYear[year].push(pub);
  });

  // 获取所有年份并降序排序
  const years = Object.keys(publicationsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  // 按年份对专利进行分组（未标注年份归类为 "0"，显示为“其他”）
  const patentsByYear: Record<string, PatentViewModel[]> = {};
  patents.forEach(p => {
    const y = p.year ? p.year : "0";
    if (!patentsByYear[y]) {
      patentsByYear[y] = [];
    }
    patentsByYear[y].push(p);
  });
  const patentYears = Object.keys(patentsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">成果概览</h1>
      </div>

      <div className="space-y-16">
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">论文</h2>
          <div className="space-y-12">
            {years.map(year => (
              <div key={year} className="space-y-6">
                <h3 className="text-2xl font-bold border-b pb-2">{year}</h3>
                <div className="space-y-6">
                  {publicationsByYear[year].map(pub => (
                    <Card key={pub.id} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight mb-2">{pub.title}</CardTitle>
                            <CardDescription className="text-base">{pub.authors}</CardDescription>
                          </div>
                          <Badge variant={pub.publicationType === 'Journal' ? 'default' : 'secondary'}>
                            {pub.publicationType === 'Journal' ? '期刊' : '会议'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span className="font-medium">发表于：</span>
                          <span>{pub.publicationVenue}</span>
                        </div>
                        {pub.volumeIssuePages && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4" />
                            <span className="font-medium">卷期页：</span>
                            <span>{pub.volumeIssuePages}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">年份：</span>
                          <span>{pub.year}</span>
                        </div>
                        {pub.abstract && (
                          <div className="mt-3">
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              <span className="font-medium">摘要：</span>
                              {pub.abstract}
                            </p>
                          </div>
                        )}
                        {pub.researchAreas && pub.researchAreas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {pub.researchAreas.map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {area.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        {pub.doiLink && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={pub.doiLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              查看论文
                            </Link>
                          </Button>
                        )}
                        {pub.pdfFile?.url && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={pub.pdfFile.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              下载PDF
                            </Link>
                          </Button>
                        )}
                        {pub.codeLink && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={pub.codeLink} target="_blank" rel="noopener noreferrer">
                              <Code className="h-4 w-4 mr-2" />
                              查看代码
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold">专利</h2>
          <div className="space-y-12">
            {patentYears.map(py => (
              <div key={py} className="space-y-6">
                <h3 className="text-2xl font-bold border-b pb-2">{py === '0' ? '其他' : py}</h3>
                <div className="space-y-6">
                  {patentsByYear[py].map(p => (
                    <Card key={p.id} className="transition-all hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg leading-tight mb-2">{p.title}</CardTitle>
                            {p.inventors && (
                              <CardDescription className="text-base">{p.inventors}</CardDescription>
                            )}
                          </div>
                          {p.status && (
                            <Badge variant={p.status === 'Granted' ? 'default' : (p.status === 'Pending' ? 'secondary' : 'destructive')}>
                              {p.status}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">年份：</span>
                          <span>{p.year || '—'}</span>
                        </div>
                        {p.researchAreas && p.researchAreas.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {p.researchAreas.map((area, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {area.title}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        {p.pdfFile?.url && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={p.pdfFile.url} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              下载PDF
                            </Link>
                          </Button>
                        )}
                        {p.link && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={p.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              外部链接
                            </Link>
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {pagination.pageCount > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          {Array.from({ length: pagination.pageCount }).map((_, index) => (
            <Button
              key={index}
              variant={pagination.page === index + 1 ? "default" : "outline"}
              size="sm"
              asChild
            >
              <Link href={`/publications?page=${index + 1}`}>
                {index + 1}
              </Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
