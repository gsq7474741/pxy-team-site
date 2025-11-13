"use client";

 

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Prof. Peng 课题组
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            探索前沿科技，推动学术创新。
            <br />
            我们致力于在人工智能、机器学习和数据科学领域开展尖端研究，培养下一代科研人才。
          </p>
        </div>
      </div>
      
      {/* 装饰性背景元素 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <svg
          className="absolute left-[max(50%,25rem)] top-0 h-[64rem] w-[128rem] -translate-x-1/2 stroke-gray-200 [mask-image:radial-gradient(64rem_64rem_at_top,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="e813992c-7d03-4cc4-a2bd-151760b470a0"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M100 200V.5M.5 .5H200" fill="none" />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#e813992c-7d03-4cc4-a2bd-151760b470a0)"
          />
        </svg>
      </div>
    </div>
  );
}
