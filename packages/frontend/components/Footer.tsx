import Link from "next/link";
import { contactApi, researchApi, type ContactPageViewModel, type ResearchAreaViewModel } from "@/lib/strapi-client";

export default async function Footer() {
  let contact: ContactPageViewModel | null = null;
  let researchAreas: ResearchAreaViewModel[] = [];
  try {
    const [contactRes, researchRes] = await Promise.all([
      contactApi.getContactPage(),
      researchApi.getResearchAreaList(1, 100)
    ]);
    contact = contactRes;
    researchAreas = researchRes.data || [];
  } catch (error) {
    console.error("获取页脚数据失败:", error);
  }
  return (
    <footer className="border-t bg-muted/40">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Prof. Peng 课题组</h3>
            <p className="text-sm text-muted-foreground">
              探索前沿科技，推动学术创新。
            </p>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">快速链接</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-muted-foreground hover:text-primary">
                  新闻动态
                </Link>
              </li>
              <li>
                <Link href="/research" className="text-sm text-muted-foreground hover:text-primary">
                  研究方向
                </Link>
              </li>
              <li>
                <Link href="/publications" className="text-sm text-muted-foreground hover:text-primary">
                  成果概览
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">研究领域</h3>
            <ul className="space-y-2">
              {(researchAreas || []).sort((a, b) => (a.order ?? 0) - (b.order ?? 0)).slice(0, 4).map((area) => (
                <li key={area.id}>
                  <Link href={`/research/${area.slug}`} className="text-sm text-muted-foreground hover:text-primary">
                    {area.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">联系方式</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground">地址：{contact?.address || '—'}</p>
              <p className="text-sm text-muted-foreground">邮箱：{contact?.email || '—'}</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} PXY Research Group. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            <a 
              href="https://beian.miit.gov.cn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              渝ICP备2025072323号
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
