"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { normalizeLocale, getClientLocale } from "@/lib/locale";

/**
 * Locale 调试页面
 * 访问 /debug-locale 查看当前环境的语言设置
 */
export default function DebugLocalePage() {
  const [localeInfo, setLocaleInfo] = useState<{
    navigatorLanguage: string;
    navigatorLanguages: readonly string[];
    envLocale: string | undefined;
    normalizedLocale: string;
    finalLocale: string;
    documentLang: string;
    timezoneOffset: number;
    timezone: string;
  } | null>(null);

  useEffect(() => {
    const browserLang = navigator.language;
    setLocaleInfo({
      navigatorLanguage: browserLang,
      navigatorLanguages: navigator.languages,
      envLocale: process.env.NEXT_PUBLIC_STRAPI_LOCALE,
      normalizedLocale: normalizeLocale(browserLang),
      finalLocale: getClientLocale(),
      documentLang: document.documentElement.lang || '未设置',
      timezoneOffset: new Date().getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  }, []);

  if (!localeInfo) {
    return <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">加载中...</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">语言环境调试</h1>
        <p className="text-muted-foreground">查看当前浏览器和系统的语言设置</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>浏览器主语言</CardTitle>
            <CardDescription>navigator.language</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{localeInfo.navigatorLanguage}</div>
            <p className="text-sm text-muted-foreground mt-2">
              这是浏览器报告的首选语言
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>语言偏好列表</CardTitle>
            <CardDescription>navigator.languages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from(localeInfo.navigatorLanguages).map((lang, i) => (
                <Badge key={i} variant={i === 0 ? "default" : "secondary"}>
                  {lang} {i === 0 && "(优先)"}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              按优先级排序的语言列表
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>规范化后的 Locale</CardTitle>
            <CardDescription>normalizeLocale() 兜底机制</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{localeInfo.normalizedLocale}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {localeInfo.normalizedLocale === 'zh-CN' 
                ? "✅ 中文变体 → 映射到 zh-CN"
                : "✅ 非中文 → 映射到 en"}
            </p>
            <div className="mt-3 p-2 bg-muted rounded text-xs">
              原始: <code>{localeInfo.navigatorLanguage}</code> → 
              规范化: <code>{localeInfo.normalizedLocale}</code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最终使用的 Locale</CardTitle>
            <CardDescription>实际发送到后端的值</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{localeInfo.finalLocale}</div>
            <p className="text-sm text-muted-foreground mt-2">
              {localeInfo.envLocale 
                ? `使用环境变量: ${localeInfo.envLocale}`
                : `使用浏览器检测: ${localeInfo.normalizedLocale}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>时区信息</CardTitle>
            <CardDescription>Timezone & Offset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">时区：</span>
                <Badge variant="outline" className="ml-2">{localeInfo.timezone}</Badge>
              </div>
              <div>
                <span className="font-semibold">UTC 偏移：</span>
                <Badge variant="outline" className="ml-2">
                  {localeInfo.timezoneOffset > 0 ? '-' : '+'}
                  {Math.abs(localeInfo.timezoneOffset / 60)} 小时
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>如何修改浏览器语言</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Chrome / Edge:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>访问 <code className="bg-muted px-1 rounded">chrome://settings/languages</code></li>
              <li>在 "首选语言" 列表中调整语言顺序</li>
              <li>将 "中文(简体)" 拖到最上面即可设为 zh-CN</li>
              <li>刷新页面查看效果</li>
            </ol>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Safari (macOS):</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>打开 "系统设置" → "通用" → "语言与地区"</li>
              <li>调整 "首选语言" 顺序</li>
              <li>重启 Safari 浏览器</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>🎯 兜底机制说明</CardTitle>
          <CardDescription>智能语言映射规则</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">映射规则：</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-muted rounded">
                <div className="font-semibold text-primary mb-2">中文用户 → zh-CN</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code>zh-CN</code> (中国大陆) → <code className="text-primary">zh-CN</code></li>
                  <li><code>zh-TW</code> (台湾) → <code className="text-primary">zh-CN</code></li>
                  <li><code>zh-HK</code> (香港) → <code className="text-primary">zh-CN</code></li>
                  <li><code>zh-Hans</code> (简体) → <code className="text-primary">zh-CN</code></li>
                  <li><code>zh-Hant</code> (繁体) → <code className="text-primary">zh-CN</code></li>
                </ul>
              </div>
              <div className="p-3 bg-muted rounded">
                <div className="font-semibold text-green-600 mb-2">其他用户 → en</div>
                <ul className="space-y-1 text-muted-foreground">
                  <li><code>en-US</code> (美国) → <code className="text-green-600">en</code></li>
                  <li><code>en-GB</code> (英国) → <code className="text-green-600">en</code></li>
                  <li><code>ja-JP</code> (日本) → <code className="text-green-600">en</code></li>
                  <li><code>ko-KR</code> (韩国) → <code className="text-green-600">en</code></li>
                  <li><code>fr-FR</code> (法国) → <code className="text-green-600">en</code></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">💡 为什么这样设计？</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>确保<strong>所有中文用户</strong>（不论地区）都能看到中文内容</li>
              <li>为<strong>国际用户</strong>提供统一的英文体验</li>
              <li>简化后端内容管理，只需维护两个语言版本</li>
              <li>未来可轻松扩展支持更多语言（日语、韩语等）</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
