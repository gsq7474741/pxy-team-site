# 快速开始

本文档将帮助你快速搭建本地开发环境并运行项目。

## 环境要求

| 工具 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | >= 18.0.0 | 推荐使用 v20 LTS |
| pnpm | >= 8.0.0 | 推荐 v10+ |
| Docker | 最新版 | 用于运行本地 PostgreSQL |
| Git | 最新版 | 版本控制 |

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/your-org/pxy-team-site.git
cd pxy-team-site
```

### 2. 安装依赖

```bash
pnpm install
```

这会同时安装前端和后端的所有依赖。

### 3. 配置环境变量

#### 后端环境变量

```bash
cp packages/backend/.env.example packages/backend/.env
```

编辑 `packages/backend/.env`，主要配置：

```bash
# 数据库配置（本地 Docker PostgreSQL）
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi

# 应用密钥（首次运行会自动生成）
APP_KEYS=your-app-keys
ADMIN_JWT_SECRET=your-admin-jwt-secret
JWT_SECRET=your-jwt-secret
API_TOKEN_SALT=your-api-token-salt

# OSS 配置（可选，用于媒体存储）
OSS_ACCESS_KEY_ID=
OSS_ACCESS_KEY_SECRET=
OSS_REGION=
OSS_BUCKET=
OSS_BASE_URL=
```

#### 前端环境变量

```bash
cp packages/frontend/.env.example packages/frontend/.env
```

编辑 `packages/frontend/.env`：

```bash
# Strapi API 地址
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api

# Revalidate 密钥（用于 ISR 缓存刷新）
REVALIDATE_SECRET=your-secret-key
```

### 4. 启动数据库

```bash
pnpm db:up
```

这会使用 Docker Compose 启动本地 PostgreSQL 数据库。

### 5. 启动开发服务器

```bash
pnpm dev
```

这会同时启动：
- **前端**: http://localhost:3000
- **后端**: http://localhost:1337

::: tip 提示
首次启动后端时，需要访问 http://localhost:1337/admin 创建管理员账号。
:::

## 单独启动服务

如果需要单独启动某个服务：

```bash
# 只启动前端
pnpm frontend:dev

# 只启动后端
pnpm backend:dev
```

## 构建项目

```bash
# 构建所有
pnpm build

# 只构建前端
pnpm frontend:build

# 只构建后端
pnpm backend:build
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动数据库和所有开发服务器 |
| `pnpm build` | 构建所有项目 |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm db:up` | 启动 Docker 数据库 |
| `pnpm db:down` | 停止 Docker 数据库 |

## 下一步

- 了解 [项目概述](/guide/project-overview)
- 查看 [技术栈详情](/guide/tech-stack)
- 探索 [目录结构](/guide/directory-structure)
