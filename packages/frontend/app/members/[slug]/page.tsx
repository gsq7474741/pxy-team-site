import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { memberApi, getStrapiMedia } from "@/lib/strapi-client";

// 成员详情页面参数类型
interface MemberPageProps {
  params: {
    slug: string;
  };
}

// 成员类型定义
interface Member {
  documentId: string;
  name: string;
  english_name: string;
  role: string;
  bio: string;
  email: string;
  photo?: {
    url: string;
  };
  slug: string;
  enrollment_year: string;
  enrollment_status: string;
  research_interests: string;
  education_background: string;
  publications: string;
  createdAt: string;
  updatedAt: string;
}

export default async function MemberDetailPage({ params }: MemberPageProps) {
  const { slug } = params;
  let member: Member | null = null;

  try {
    const response = await memberApi.getMemberBySlug(slug);
    if (response && response.data) {
      member = response.data as unknown as Member;
    }
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }

  // 如果找不到成员，返回404
  if (!member) {
    notFound();
  }

  // 获取成员信息
  const { name, english_name, role, bio, email, photo, enrollment_year, enrollment_status } = member;
  
  // 将可能的字符串字段转换为数组以便在UI中展示
  const researchInterests = member.research_interests ? member.research_interests.split('\n').filter(Boolean) : [];
  const education = member.education_background ? member.education_background.split('\n').filter(Boolean) : [];
  const publications = member.publications ? member.publications.split('\n').filter(Boolean) : [];

  // 头像URL
  const photoUrl = getStrapiMedia(photo?.url || null) || "/placeholder-avatar.png";

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/members">
            ← 返回团队成员
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧：头像和基本信息 */}
        <div className="space-y-6">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image
              src={photoUrl}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{name}</h1>
            <p className="text-lg text-muted-foreground">{role}</p>
            {email && (
              <p className="text-sm">
                <span className="font-medium">邮箱：</span> {email}
              </p>
            )}
          </div>
        </div>

        {/* 右侧：详细信息 */}
        <div className="md:col-span-2 space-y-8">
          {/* 个人简介 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">个人简介</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{bio}</p>
            </div>
          </section>

          {/* 研究兴趣 */}
          {researchInterests.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">研究兴趣</h2>
              <ul className="list-disc list-inside space-y-1">
                {researchInterests.map((interest, index) => (
                  <li key={index} className="text-muted-foreground">{interest}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 教育背景 */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">教育背景</h2>
              <ul className="list-disc list-inside space-y-1">
                {education.map((edu, index) => (
                  <li key={index} className="text-muted-foreground">{edu}</li>
                ))}
              </ul>
            </section>
          )}

          {/* 代表性论文 */}
          {publications.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">代表性论文</h2>
              <ul className="list-disc list-inside space-y-1">
                {publications.map((pub, index) => (
                  <li key={index} className="text-muted-foreground">{pub}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
