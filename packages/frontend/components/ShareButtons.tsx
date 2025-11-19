'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { QrCode, MessageCircle, Mail, Copy } from "lucide-react";
import { useTranslations } from 'next-intl';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const t = useTranslations('news');
  const [currentUrl, setCurrentUrl] = useState('');
  const [wechatOpen, setWechatOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) {
    return null; // 在服务器端渲染时不显示分享按钮
  }

  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(title + "\n\n" + currentUrl)}`;
  const qqShareUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(title)}&source=${encodeURIComponent('PXY Research Group')}`;
  const qrImgSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentUrl)}`;

  return (
    <div className="flex gap-2 flex-wrap">
      {/* 微信：二维码弹层 */}
      <Button variant="outline" size="sm" onClick={() => setWechatOpen(true)} title={t('share_wechat')} aria-label={t('share_wechat')}>
        <QrCode className="h-4 w-4 mr-2" /> {t('wechat')}
      </Button>

      {/* QQ 分享 */}
      <Button variant="outline" size="sm" asChild title={t('share_qq')} aria-label={t('share_qq')}>
        <a href={qqShareUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 mr-2" /> {t('qq')}
        </a>
      </Button>

      {/* 邮件分享 */}
      <Button variant="outline" size="sm" asChild title={t('share_email')} aria-label={t('share_email')}>
        <a href={mailHref}>
          <Mail className="h-4 w-4 mr-2" /> {t('email')}
        </a>
      </Button>

      {/* 复制链接 */}
      <Button
        variant="outline"
        size="sm"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            // 兼容不支持 clipboard 的环境
            const ok = window.prompt(t('copy_prompt'), currentUrl);
            if (ok !== null) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          }
        }}
        title={t('copy_link')}
        aria-label={t('copy_link')}
      >
        <Copy className="h-4 w-4 mr-2" /> {copied ? t('copied') : t('copy_link')}
      </Button>

      {/* 微信二维码弹层（无外部依赖） */}
      {wechatOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setWechatOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">{t('wechat_qr_title')}</h3>
              <p className="text-xs text-muted-foreground mt-1">{t('wechat_qr_description')}</p>
            </div>
            <div className="flex items-center justify-center">
              <img src={qrImgSrc} alt={t('wechat_qr_alt')} width={180} height={180} />
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setWechatOpen(false)}>{t('close')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
