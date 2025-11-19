"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { MemberViewModel } from "@/lib/types";
import { useMemo } from "react";
import { useTranslations } from 'next-intl';

interface Props {
  members: MemberViewModel[];
}

export default function MembersClient({ members }: Props) {
  const t = useTranslations('members');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const activeRole = searchParams.get("role") ?? "all";

  // 翻译角色名称的辅助函数
  const translateRole = (role: string) => {
    // 将后端角色名称映射到翻译键（移除点和空格，避免 next-intl 报错）
    const roleKeyMap: Record<string, string> = {
      'Ph.D. Student': 'PhD_Student',
      'Master Student': 'Master_Student',
      'Supervisor': 'Supervisor',
      'Alumni': 'Alumni'
    };
    
    const translationKey = roleKeyMap[role] || role;
    
    // 尝试从翻译文件中获取，如果不存在则返回原始值
    try {
      return t(`roles.${translationKey}`);
    } catch {
      return role;
    }
  };

  const roles = useMemo(() => Array.from(new Set((members || []).map((m) => m.role).filter(Boolean))), [members]);
  const tabs = useMemo(() => ["all", ...roles], [roles]);
  const filteredMembers = useMemo(() => {
    const result = activeRole === "all" ? [...members] : members.filter((m) => m.role === activeRole);
    
    return result.sort((a, b) => {
      // 1. 导师排在前面
      const isASupervisor = a.role === 'Supervisor';
      const isBSupervisor = b.role === 'Supervisor';
      if (isASupervisor && !isBSupervisor) return -1;
      if (!isASupervisor && isBSupervisor) return 1;
      
      // 2. 如果都是导师，按年份排序（升序：入学越早越靠前）
      if (isASupervisor && isBSupervisor) {
        const yearA = a.enrollmentYear || 0;
        const yearB = b.enrollmentYear || 0;
        if (yearA !== yearB) {
          return yearA - yearB;
        }
        // 年份相同，按姓名排序
        return (a.name || '').localeCompare(b.name || '', 'zh-CN');
      }

      // 3. 非导师成员，按状态排序：Graduated 在 Current 前面
      const statusOrder = { 'Graduated': 0, 'Current': 1 };
      const statusA = a.enrollmentStatus ? statusOrder[a.enrollmentStatus] ?? 1 : 1;
      const statusB = b.enrollmentStatus ? statusOrder[b.enrollmentStatus] ?? 1 : 1;
      
      if (statusA !== statusB) {
        return statusA - statusB;
      }

      // 4. 状态相同，按入学年份排序（升序：入学越早越靠前）
      const yearA = a.enrollmentYear || 0;
      const yearB = b.enrollmentYear || 0;
      if (yearA !== yearB) {
        return yearA - yearB;
      }

      // 5. 年份相同，按姓名排序
      return (a.name || '').localeCompare(b.name || '', 'zh-CN');
    });
  }, [activeRole, members]);

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 border-b">
          {tabs.map((r) => {
            const isActive = activeRole === r;
            const href = r === "all" ? "/members" : `/members?role=${encodeURIComponent(r)}`;
            const label = r === "all" ? t('all') : translateRole(r);
            return (
              <Link
                key={r}
                href={href}
                className={`px-4 py-2 text-sm whitespace-nowrap border-b-2 ${isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>

      {filteredMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredMembers.map((member) => {
            return (
              <Card key={member.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 group py-0 gap-0 border-0 ring-1 ring-border">
                <CardHeader className="p-0 space-y-0">
                  <div className="relative w-full bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden" style={{ aspectRatio: '3/4' }}>
                    {member.photo?.url ? (
                      <Image src={member.photo.url} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-5xl opacity-30">👤</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <div className="flex flex-col flex-1 justify-between">
                  <CardContent className="px-4 pt-3 pb-2">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="text-base font-bold leading-tight">{member.name}</h3>
                      <span className="text-[10px] font-medium text-primary/80 bg-primary/5 px-1.5 py-0.5 rounded-full">{translateRole(member.role)}</span>
                    </div>
                    {member.role !== 'Supervisor' && (
                      <div className="flex gap-1.5 mb-1.5">
                        {member.enrollmentYear && (
                          <span className="text-[9px] font-medium text-primary/70 bg-primary/8 px-2 py-0.5 rounded">
                            {member.enrollmentYear}级
                          </span>
                        )}
                        {member.enrollmentStatus && (
                          <span className={`text-[9px] font-medium px-2 py-0.5 rounded ${
                            member.enrollmentStatus === 'Current' 
                              ? 'text-primary/70 bg-primary/8' 
                              : 'text-muted-foreground/60 bg-muted/50'
                          }`}>
                            {member.enrollmentStatus === 'Current' ? '在读' : '已毕业'}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{member.bio}</p>
                  </CardContent>
                  <CardFooter className="px-4 pb-3 pt-0">
                    <Link href={`/members/${member.slug}`} className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                      {t('view_details')} <span className="text-xs">→</span>
                    </Link>
                  </CardFooter>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{tCommon('no_data')}</p>
        </div>
      )}
    </div>
  );
}
