import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { memberApi, getStrapiMedia, type MemberViewModel } from "@/lib/strapi-client";
import { getTranslations, getLocale } from 'next-intl/server';

// 成员详情页面参数类型
interface MemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// 构建期生成静态路径
export async function generateStaticParams() {
  try {
    const res = await memberApi.getMemberList(1, 1000);
    return (res.data || []).map((m) => ({ slug: m.slug }));
  } catch {
    return [];
  }
}

export default async function MemberDetailPage({ params }: MemberPageProps) {
  const t = await getTranslations('members');
  const locale = await getLocale();
  const { slug } = await params;
  let member: MemberViewModel | null = null;

  try {
    member = await memberApi.getMemberBySlug(slug, locale);
  } catch (error) {
    console.error("获取成员数据失败:", error);
  }

  // 如果找不到成员，返回404
  if (!member) {
    notFound();
  }

  // 获取成员信息
  const { name, role, bio, email, photo } = member;
  
  // 翻译角色名称
  const translateRole = (role: string) => {
    // 将后端角色名称映射到翻译键（移除点和空格，避免 next-intl 报错）
    const roleKeyMap: Record<string, string> = {
      'Ph.D. Student': 'PhD_Student',
      'Master Student': 'Master_Student',
      'Supervisor': 'Supervisor',
      'Alumni': 'Alumni'
    };
    
    const translationKey = roleKeyMap[role] || role;
    
    try {
      return t(`roles.${translationKey}`);
    } catch {
      return role;
    }
  };
  
  // 将可能的字符串字段转换为数组以便在UI中展示
  const researchInterests = member.researchInterests ? member.researchInterests.split('\n').filter(Boolean) : [];
  const education = member.educationBackground ? member.educationBackground.split('\n').filter(Boolean) : [];
  const publications = member.publications ? member.publications.split('\n').filter(Boolean) : [];

  // 头像URL
  const photoUrl = getStrapiMedia(photo?.url || null) || "/placeholder-avatar.png";

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/members">
            ← {t('back_to_list')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 左侧：头像和基本信息 */}
        <div className="space-y-6">
          <div className="relative rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden shadow-sm" style={{ aspectRatio: '3/4' }}>
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
            <p className="text-lg text-muted-foreground">{translateRole(role)}</p>
            {role !== 'Supervisor' && (
              <div className="flex gap-2 mt-2">
                {member.enrollmentYear && (
                  <span className="text-xs font-medium text-primary/70 bg-primary/8 px-2.5 py-1 rounded">
                    {member.enrollmentYear}级
                  </span>
                )}
                {member.enrollmentStatus && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded ${
                    member.enrollmentStatus === 'Current' 
                      ? 'text-primary/70 bg-primary/8' 
                      : 'text-muted-foreground/60 bg-muted/50'
                  }`}>
                    {member.enrollmentStatus === 'Current' ? '在读' : '已毕业'}
                  </span>
                )}
              </div>
            )}
            {email && (
              <p className="text-sm">
                <span className="font-medium">{t('email')}:</span> {email}
              </p>
            )}
          </div>
        </div>

        {/* 右侧：详细信息 */}
        <div className="md:col-span-2 space-y-8">
          {/* 个人简介 */}
          <section>
            <h2 className="text-xl font-semibold mb-4">{t('bio')}</h2>
            <div className="prose max-w-none">
              <p className="text-muted-foreground">{bio}</p>
            </div>
          </section>

          {/* 研究兴趣 */}
          {researchInterests.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-4">{t('research_interests')}</h2>
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
              <h2 className="text-xl font-semibold mb-4">{t('education')}</h2>
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
              <h2 className="text-xl font-semibold mb-4">{t('publications')}</h2>
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
