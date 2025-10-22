'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { QrCode, MessageCircle, Mail, Copy } from "lucide-react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
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
      <Button variant="outline" size="sm" onClick={() => setWechatOpen(true)} title="分享到微信" aria-label="分享到微信">
        <QrCode className="h-4 w-4 mr-2" /> 微信
      </Button>

      {/* QQ 分享 */}
      <Button variant="outline" size="sm" asChild title="分享到QQ" aria-label="分享到QQ">
        <a href={qqShareUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 mr-2" /> QQ
        </a>
      </Button>

      {/* 邮件分享 */}
      <Button variant="outline" size="sm" asChild title="通过电子邮件分享" aria-label="通过电子邮件分享">
        <a href={mailHref}>
          <Mail className="h-4 w-4 mr-2" /> 邮件
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
          } catch (e) {
            // 兼容不支持 clipboard 的环境
            const ok = window.prompt('复制下面的链接', currentUrl);
            if (ok !== null) {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }
          }
        }}
        title="复制链接"
        aria-label="复制链接"
      >
        <Copy className="h-4 w-4 mr-2" /> {copied ? '已复制' : '复制链接'}
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
              <h3 className="text-lg font-semibold">微信扫一扫分享</h3>
              <p className="text-xs text-muted-foreground mt-1">用微信扫描二维码，转发给朋友或分享到朋友圈</p>
            </div>
            <div className="flex items-center justify-center">
              <img src={qrImgSrc} alt="微信分享二维码" width={180} height={180} />
            </div>
            <div className="mt-6 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => setWechatOpen(false)}>关闭</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
