"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Code, Calendar, BookOpen, Trophy } from "lucide-react";
import type { PublicationViewModel, PatentViewModel, AwardViewModel } from "@/lib/types";
import { useMemo } from "react";
import { useTranslations } from 'next-intl';

interface Props {
  publications: PublicationViewModel[];
  patents: PatentViewModel[];
  awards: AwardViewModel[];
}

export default function PublicationsClient({ publications, patents, awards }: Props) {
  const t = useTranslations('publications');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("type") ?? "publications";

  // 按年份对论文进行分组
  const publicationsByYear: Record<string, PublicationViewModel[]> = {};
  (publications || []).forEach((pub) => {
    const year = pub.year;
    if (!publicationsByYear[year]) publicationsByYear[year] = [];
    publicationsByYear[year].push(pub);
  });
  const years = useMemo(() => Object.keys(publicationsByYear).sort((a, b) => parseInt(b) - parseInt(a)), [publicationsByYear]);

  // 专利按年分组（未标注年份归类为 "0"）
  const patentsByYear: Record<string, PatentViewModel[]> = {};
  (patents || []).forEach((p) => {
    const y = p.year ? p.year : "0";
    if (!patentsByYear[y]) patentsByYear[y] = [];
    patentsByYear[y].push(p);
  });
  const patentYears = useMemo(() => Object.keys(patentsByYear).sort((a, b) => parseInt(b) - parseInt(a)), [patentsByYear]);

  // 奖项按年分组（未标注年份归类为 "0"）
  const awardsByYear: Record<string, AwardViewModel[]> = {};
  (awards || []).forEach((a) => {
    const y = a.year ? a.year : "0";
    if (!awardsByYear[y]) awardsByYear[y] = [];
    awardsByYear[y].push(a);
  });
  const awardYears = useMemo(() => Object.keys(awardsByYear).sort((a, b) => parseInt(b) - parseInt(a)), [awardsByYear]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      {/* 顶部类型 Tabs */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 border-b">
          {
            [
              { key: "publications", label: t('publications'), href: "/publications" },
              { key: "patents", label: t('patents'), href: "/publications?type=patents" },
              { key: "awards", label: t('awards'), href: "/publications?type=awards" },
            ].map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <Link
                  key={tab.key}
                  href={tab.href}
                  className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.label}
                </Link>
              );
            })
          }
        </div>
      </div>

      <div className="space-y-16">
        {activeTab === "publications" && (
          <section className="space-y-6">
            <div className="space-y-12">
              {years.map((year) => (
                <div key={year} className="space-y-6">
                  <h3 className="text-2xl font-bold border-b pb-2">{year}</h3>
                  <div className="space-y-6">
                    {publicationsByYear[year].map((pub) => (
                      <Card key={pub.id} className="transition-all hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <CardTitle className="text-lg leading-tight mb-2">{pub.title}</CardTitle>
                              <CardDescription className="text-base">{pub.authors}</CardDescription>
                            </div>
                            <Badge variant={pub.publicationType === "Journal" ? "default" : "secondary"}>
                              {pub.publicationType === "Journal" ? t('journal') : t('conference')}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span className="font-medium">{t('venue')}:</span>
                            <span>{pub.publicationVenue}</span>
                          </div>
                          {pub.volumeIssuePages && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4" />
                              <span className="font-medium">{t('volume_issue_pages')}:</span>
                              <span>{pub.volumeIssuePages}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium">{t('year')}:</span>
                            <span>{pub.year}</span>
                          </div>
                          {pub.abstract && (
                            <div className="mt-3">
                              <p className="text-sm text-muted-foreground line-clamp-3">
                                <span className="font-medium">{t('abstract')}:</span>
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
                                {t('view_online')}
                              </Link>
                            </Button>
                          )}
                          {pub.pdfFile?.url && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={pub.pdfFile.url} target="_blank" rel="noopener noreferrer">
                                <FileText className="h-4 w-4 mr-2" />
                                {t('download_pdf')}
                              </Link>
                            </Button>
                          )}
                          {pub.codeLink && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={pub.codeLink} target="_blank" rel="noopener noreferrer">
                                <Code className="h-4 w-4 mr-2" />
                                {t('view_code')}
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
        )}

        {activeTab === "patents" && (
          <section className="space-y-6">
            <div className="space-y-12">
              {patents.length === 0 && <p className="text-muted-foreground">{tCommon('no_data')}</p>}
              {patents.length > 0 && (
                <>
                  {Object.keys(patentsByYear).length === 0 && <></>}
                  {patentYears.map((py) => (
                    <div key={py} className="space-y-6">
                      <h3 className="text-2xl font-bold border-b pb-2">{py === "0" ? tCommon('others') : py}</h3>
                      <div className="space-y-6">
                        {patentsByYear[py].map((p) => (
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
                                  <Badge variant={p.status === "Granted" ? "default" : p.status === "Pending" ? "secondary" : "destructive"}>
                                    {p.status}
                                  </Badge>
                                )}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">{t('year')}:</span>
                                <span>{p.year || "—"}</span>
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
                                    {t('download_pdf')}
                                  </Link>
                                </Button>
                              )}
                              {p.link && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={p.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {tCommon('external_link')}
                                  </Link>
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        )}

        {activeTab === "awards" && (
          <section className="space-y-6">
            <div className="space-y-12">
              {awards.length === 0 && <p className="text-muted-foreground">{tCommon('no_data')}</p>}
              {awards.length > 0 && (
                <>
                  {awardYears.map((ay) => (
                    <div key={ay} className="space-y-6">
                      <h3 className="text-2xl font-bold border-b pb-2">{ay === "0" ? tCommon('others') : ay}</h3>
                      <div className="space-y-6">
                        {awardsByYear[ay].map((a) => (
                          <Card key={a.id} className="transition-all hover:shadow-md">
                            <CardHeader>
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <CardTitle className="text-lg leading-tight mb-2">{a.title}</CardTitle>
                                  {(a.recipients || a.competitionName) && (
                                    <CardDescription className="text-base">{[a.recipients, a.competitionName].filter(Boolean).join(" ｜ ")}</CardDescription>
                                  )}
                                </div>
                                {a.awardRank && <Badge variant="default">{a.awardRank}</Badge>}
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Trophy className="h-4 w-4" />
                                <span className="font-medium">{t('competition')}:</span>
                                <span>{a.competitionName || "—"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span className="font-medium">{t('year')}:</span>
                                <span>{a.year || "—"}</span>
                              </div>
                              {a.researchAreas && a.researchAreas.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-3">
                                  {a.researchAreas.map((area, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {area.title}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                            <CardFooter className="flex gap-2">
                              {a.pdfFile?.url && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={a.pdfFile.url} target="_blank" rel="noopener noreferrer">
                                    <FileText className="h-4 w-4 mr-2" />
                                    {t('download_pdf')}
                                  </Link>
                                </Button>
                              )}
                              {a.link && (
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={a.link} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    {tCommon('external_link')}
                                  </Link>
                                </Button>
                              )}
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
