# 目录结构

本项目采用 Monorepo 结构，前后端代码在同一仓库中管理。

## 根目录结构

```
pxy-team-site/
├── .github/                    # GitHub 配置
│   └── workflows/              # CI/CD 工作流
│       └── fc-build-deploy.yml # 构建部署流水线
│
├── packages/                   # 工作空间包
│   ├── frontend/               # Next.js 前端应用
│   └── backend/                # Strapi 后端应用
│
├── scripts/                    # 工具脚本
│   └── upload-env.ts           # 环境变量上传脚本
│
├── docs/                       # 项目文档 (VitePress)
│
├── docker-compose.yml          # 本地数据库配置
├── package.json                # 根 package.json
├── pnpm-workspace.yaml         # pnpm 工作空间配置
├── turbo.json                  # Turbo 构建配置
└── s.ci.yaml                   # Serverless Devs 部署配置
```

## 前端目录结构

```
packages/frontend/
├── app/                        # Next.js App Router 页面
│   ├── layout.tsx              # 根布局
│   ├── page.tsx                # 首页
│   ├── globals.css             # 全局样式
│   ├── api/                    # API 路由
│   │   └── revalidate/         # ISR 重验证接口
│   ├── contact/                # 联系页面
│   ├── join/                   # 加入我们
│   │   ├── page.tsx            # 岗位列表
│   │   └── [slug]/             # 岗位详情
│   ├── members/                # 团队成员
│   │   ├── page.tsx            # 成员列表
│   │   └── [slug]/             # 成员详情
│   ├── news/                   # 新闻动态
│   │   ├── page.tsx            # 新闻列表
│   │   └── [id]/               # 新闻详情
│   ├── publications/           # 学术成果
│   └── research/               # 研究方向
│       ├── page.tsx            # 方向列表
│       └── [slug]/             # 方向详情
│
├── components/                 # React 组件
│   ├── ui/                     # 基础 UI 组件 (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── Navbar.tsx              # 导航栏
│   ├── Footer.tsx              # 页脚
│   ├── HeroSection.tsx         # 首页 Hero
│   ├── LanguageSwitcher.tsx    # 语言切换器
│   ├── MembersClient.tsx       # 成员列表客户端组件
│   ├── PublicationsClient.tsx  # 成果列表客户端组件
│   ├── OpeningCard.tsx         # 招聘卡片
│   └── ShareButtons.tsx        # 分享按钮
│
├── lib/                        # 工具库
│   ├── strapi-client.ts        # Strapi API 客户端
│   ├── transformers.ts         # 数据转换函数
│   ├── types.ts                # TypeScript 类型定义
│   ├── locale.ts               # 客户端 locale 工具
│   ├── server-locale.ts        # 服务端 locale 工具
│   ├── data-service.ts         # 数据服务层
│   ├── api.ts                  # API 工具
│   └── utils.ts                # 通用工具函数
│
├── i18n/                       # 国际化配置
│   ├── config.ts               # i18n 配置
│   └── request.ts              # next-intl 请求配置
│
├── messages/                   # 翻译文件
│   ├── zh-CN.json              # 中文翻译
│   └── en.json                 # 英文翻译
│
├── public/                     # 静态资源
│
├── next.config.ts              # Next.js 配置
├── tailwind.config.ts          # TailwindCSS 配置
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖配置
```

## 后端目录结构

```
packages/backend/
├── config/                     # Strapi 配置
│   ├── admin.ts                # 管理面板配置
│   ├── api.ts                  # API 配置
│   ├── database.ts             # 数据库配置
│   ├── middlewares.ts          # 中间件配置
│   ├── plugins.ts              # 插件配置
│   └── server.ts               # 服务器配置
│
├── src/
│   ├── api/                    # API 定义（内容类型）
│   │   ├── member/             # 团队成员
│   │   │   ├── content-types/
│   │   │   │   └── member/
│   │   │   │       └── schema.json
│   │   │   ├── controllers/
│   │   │   ├── routes/
│   │   │   └── services/
│   │   ├── publication/        # 论文成果
│   │   ├── news/               # 新闻
│   │   ├── research-area/      # 研究方向
│   │   ├── opening/            # 招聘岗位
│   │   ├── patent/             # 专利
│   │   ├── award/              # 获奖
│   │   ├── contact-page/       # 联系页面（单例）
│   │   ├── join-us-page/       # 加入我们页面（单例）
│   │   └── ...
│   │
│   ├── admin/                  # 管理面板定制
│   ├── components/             # 可复用组件
│   ├── extensions/             # Strapi 扩展
│   ├── middlewares/            # 自定义中间件
│   ├── providers/              # 自定义 Provider
│   └── index.ts                # 入口文件
│
├── providers/                  # 本地 Provider 包
│   └── strapi-provider-upload-custom-oss/
│       ├── package.json
│       └── lib/
│           └── index.js        # OSS 上传实现
│
├── database/                   # 数据库迁移（自动生成）
├── public/                     # 公共文件
├── types/                      # 类型定义
│
├── Dockerfile                  # Docker 构建文件
├── tsconfig.json               # TypeScript 配置
└── package.json                # 依赖配置
```

## 关键文件说明

### 构建配置

| 文件 | 说明 |
|------|------|
| `turbo.json` | Turbo 任务依赖和缓存配置 |
| `pnpm-workspace.yaml` | pnpm 工作空间定义 |
| `s.ci.yaml` | Serverless Devs 部署配置 |

### 前端核心

| 文件 | 说明 |
|------|------|
| `lib/strapi-client.ts` | Strapi API 封装，所有数据请求入口 |
| `lib/types.ts` | 统一的 TypeScript 类型定义 |
| `lib/transformers.ts` | Strapi 数据到 ViewModel 的转换 |

### 后端核心

| 文件 | 说明 |
|------|------|
| `config/database.ts` | 数据库连接配置 |
| `config/plugins.ts` | 插件配置（含 OSS） |
| `src/api/*/content-types/*/schema.json` | 内容类型定义 |
