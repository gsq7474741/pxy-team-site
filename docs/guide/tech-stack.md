# 技术栈

本项目采用现代化的全栈技术栈，以下是详细说明。

## 前端技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 15.4.x | React 全栈框架，App Router |
| React | 19.1.x | UI 库 |
| TypeScript | 5.x | 类型安全 |

### UI 和样式

| 技术 | 版本 | 说明 |
|------|------|------|
| TailwindCSS | 4.x | 原子化 CSS 框架 |
| Radix UI | 最新 | 无障碍组件原语 |
| Lucide React | 最新 | 图标库 |
| clsx / tailwind-merge | 最新 | 样式工具 |

### 国际化

| 技术 | 版本 | 说明 |
|------|------|------|
| next-intl | 4.5.x | Next.js 国际化解决方案 |

### API 客户端

| 技术 | 版本 | 说明 |
|------|------|------|
| @strapi/client | 1.4.x | Strapi 官方 SDK |

## 后端技术栈

### 核心框架

| 技术 | 版本 | 说明 |
|------|------|------|
| Strapi | 5.19.x | Headless CMS |
| Node.js | 18-22 | 运行时 |
| TypeScript | 5.x | 类型安全 |

### 数据库

| 技术 | 版本 | 说明 |
|------|------|------|
| PostgreSQL | 14+ | 主数据库 |
| pg | 8.x | PostgreSQL 驱动 |

### 存储

| 技术 | 说明 |
|------|------|
| 阿里云 OSS | 媒体文件存储 |
| 自定义 Provider | `strapi-provider-upload-custom-oss` |

## 构建工具

| 技术 | 版本 | 说明 |
|------|------|------|
| pnpm | 10.x | 包管理器 |
| Turbo | 1.13.x | Monorepo 构建工具 |
| Docker | 最新 | 容器化（本地开发数据库） |

## 部署技术

| 技术 | 说明 |
|------|------|
| GitHub Actions | CI/CD 流水线 |
| Serverless Devs | 阿里云部署 CLI |
| 阿里云函数计算 | Serverless 运行时 |

## 依赖关系图

```
pxy-team-site/
├── packages/frontend/          # Next.js 前端
│   ├── next 15.4.x
│   ├── react 19.x
│   ├── tailwindcss 4.x
│   ├── next-intl 4.5.x
│   └── @strapi/client 1.4.x
│
├── packages/backend/           # Strapi 后端
│   ├── @strapi/strapi 5.19.x
│   ├── pg 8.x
│   └── ali-oss 6.x
│
└── 根目录
    ├── turbo 1.13.x           # Monorepo 构建
    └── tsx 4.x                # TypeScript 脚本执行
```

## 版本约束

项目的 `engines` 配置：

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

后端额外约束：

```json
{
  "engines": {
    "node": ">=18.0.0 <=22.x.x",
    "npm": ">=6.0.0"
  }
}
```

## 关键设计决策

### 为什么选择 Next.js 15?

1. **App Router** - 更好的布局系统和数据获取
2. **Server Components** - 减少客户端 JavaScript
3. **ISR** - 增量静态再生，平衡性能和实时性
4. **React 19** - 最新的 React 特性支持

### 为什么选择 Strapi 5?

1. **可视化管理** - 非技术人员可以管理内容
2. **多语言支持** - 原生 i18n 能力
3. **灵活的内容类型** - 自定义数据结构
4. **REST API** - 自动生成的 API

### 为什么选择 pnpm + Turbo?

1. **磁盘效率** - pnpm 硬链接机制
2. **增量构建** - Turbo 的构建缓存
3. **依赖隔离** - 严格的依赖管理
4. **并行执行** - 提高构建速度

### 为什么选择阿里云?

1. **国内访问** - 目标用户在国内
2. **Serverless** - 按需计费，成本低
3. **OSS CDN** - 媒体文件加速
4. **云数据库** - 托管 PostgreSQL
