"use client";

import Link from "next/link";

export default function Footer() {
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
                  论文成果
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">研究领域</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">人工智能</li>
              <li className="text-sm text-muted-foreground">机器学习</li>
              <li className="text-sm text-muted-foreground">数据科学</li>
              <li className="text-sm text-muted-foreground">计算机视觉</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">联系方式</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground">地址：[课题组详细地址]</p>
              <p className="text-sm text-muted-foreground">邮箱：[联系邮箱]</p>
            </address>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} PXY Research Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
