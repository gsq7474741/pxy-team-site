import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function JoinUsPage() {
  // 职位类型定义
  const positions = [
    {
      title: "博士后研究员",
      description: "我们正在招聘对人工智能、机器学习或数据科学领域有深入研究的博士后研究员。",
      requirements: [
        "人工智能、计算机科学或相关领域的博士学位",
        "在顶级期刊或会议上发表过高质量论文",
        "具有良好的编程技能和团队合作精神",
        "能够独立开展研究并指导学生"
      ],
      benefits: [
        "有竞争力的薪资待遇",
        "灵活的工作环境",
        "参与国际学术交流的机会",
        "与业界领先企业合作的机会"
      ]
    },
    {
      title: "博士研究生",
      description: "我们欢迎对人工智能和机器学习充满热情的学生加入我们的博士项目。",
      requirements: [
        "计算机科学、数学或相关领域的硕士学位",
        "扎实的数学基础和编程能力",
        "良好的英语读写能力",
        "对研究有强烈的兴趣和主动性"
      ],
      benefits: [
        "全额奖学金支持",
        "参与前沿研究项目",
        "国际会议和交流机会",
        "实习和就业推荐"
      ]
    },
    {
      title: "硕士研究生",
      description: "我们招收有志于在人工智能领域深造的硕士研究生。",
      requirements: [
        "计算机科学或相关领域的学士学位",
        "基本的编程技能和数学基础",
        "对人工智能或机器学习有浓厚兴趣",
        "良好的团队合作精神"
      ],
      benefits: [
        "奖学金机会",
        "参与实际研究项目",
        "与行业合作伙伴交流的机会",
        "继续攻读博士学位的可能性"
      ]
    }
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">加入我们</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          我们欢迎优秀的研究人员和学生加入我们的团队，共同探索科学前沿。
        </p>
      </div>

      {/* 为什么选择我们 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🔬</div>
              <CardTitle>前沿研究</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                我们专注于人工智能和机器学习领域的前沿研究，发表高质量学术论文。
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">🌐</div>
              <CardTitle>国际合作</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                我们与全球多所知名大学和研究机构保持密切合作，提供国际交流机会。
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="text-3xl mb-2">💼</div>
              <CardTitle>产业联系</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                我们与多家科技企业建立了紧密的合作关系，为学生提供实习和就业机会。
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 开放职位 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">开放职位</h2>
        <div className="space-y-8">
          {positions.map((position, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle>{position.title}</CardTitle>
                <CardDescription>{position.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">要求</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {position.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">福利</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {position.benefits.map((benefit, i) => (
                        <li key={i}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-6">
                  <Button asChild>
                    <Link href="/contact">申请此职位</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* 申请流程 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-center">申请流程</h2>
        <div className="bg-muted/30 p-8 rounded-lg">
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="flex-none bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="font-semibold mb-1">准备申请材料</h3>
                <p className="text-muted-foreground">
                  准备您的个人简历、研究陈述、学术成绩单以及推荐信（如有）。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-none bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="font-semibold mb-1">提交在线申请</h3>
                <p className="text-muted-foreground">
                  通过我们的联系页面提交您的申请材料，并注明您感兴趣的研究方向。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-none bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="font-semibold mb-1">面试</h3>
                <p className="text-muted-foreground">
                  通过初步筛选的申请人将被邀请参加面试，面试可能包括研究演讲和技术问题讨论。
                </p>
              </div>
            </li>
            <li className="flex gap-4">
              <div className="flex-none bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="font-semibold mb-1">录取通知</h3>
                <p className="text-muted-foreground">
                  成功的申请人将收到正式的录取通知，并讨论入职或入学的具体安排。
                </p>
              </div>
            </li>
          </ol>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link href="/contact">立即申请</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
