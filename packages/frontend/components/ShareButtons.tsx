'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) {
    return null; // 在服务器端渲染时不显示分享按钮
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild>
        <a 
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Twitter
        </a>
      </Button>
      <Button variant="outline" size="sm" asChild>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Facebook
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: title,
            url: currentUrl
          });
        } else {
          navigator.clipboard.writeText(currentUrl);
          // 这里可以添加一个 toast 提示
        }
      }}>
        分享
      </Button>
    </div>
  );
}
