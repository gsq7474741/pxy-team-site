import { publicationApi, type PublicationViewModel } from "@/lib/strapi-client";
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

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">论文成果</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          我们课题组在各个领域发表的学术论文和研究成果。
        </p>
      </div>

      <div className="space-y-12">
        {years.map(year => (
          <div key={year} className="space-y-6">
            <h2 className="text-2xl font-bold border-b pb-2">{year}</h2>
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
