import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const researchAreas = [
  {
    title: "研究领域一",
    description: "这里是关于研究领域一的简要介绍，我们在这个方向上取得了重要进展。",
    icon: "🔬",
  },
  {
    title: "研究领域二",
    description: "这里是关于研究领域二的简要介绍，我们在这个方向上取得了重要进展。",
    icon: "🧪",
  },
  {
    title: "研究领域三",
    description: "这里是关于研究领域三的简要介绍，我们在这个方向上取得了重要进展。",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* 研究领域部分 */}
      <section className="py-16 bg-background">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">我们的研究</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              我们专注于以下几个前沿研究领域，致力于解决关键科学问题。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchAreas.map((area, index) => (
              <Card key={index} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="text-4xl mb-2">{area.icon}</div>
                  <CardTitle>{area.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{area.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/research">了解更多</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* 最新动态部分 */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">最新动态</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              了解我们课题组的最新研究成果和活动信息。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>最新论文发表</CardTitle>
                <CardDescription>2025年7月15日</CardDescription>
              </CardHeader>
              <CardContent>
                <p>我们的研究团队最近在顶级期刊上发表了重要论文，取得了突破性进展。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/news">查看详情</Link>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>学术讲座通知</CardTitle>
                <CardDescription>2025年7月20日</CardDescription>
              </CardHeader>
              <CardContent>
                <p>我们将举办一场关于前沿技术的学术讲座，欢迎各位同行参加。</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href="/news">查看详情</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/news">查看全部动态</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
