# 本地开发

本文档介绍本地开发环境的搭建和使用。

## 环境要求

- Node.js >= 18
- pnpm >= 8
- Docker (用于数据库)

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/your-org/pxy-team-site.git
cd pxy-team-site

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env

# 4. 启动开发服务器
pnpm dev
```

## 服务地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 | http://localhost:1337 |
| 后端管理面板 | http://localhost:1337/admin |

## 常用命令

```bash
# 启动所有服务
pnpm dev

# 只启动前端
pnpm frontend:dev

# 只启动后端
pnpm backend:dev

# 启动数据库
pnpm db:up

# 停止数据库
pnpm db:down

# 构建
pnpm build

# 代码检查
pnpm lint
```

## 首次使用

1. 启动服务后访问 http://localhost:1337/admin
2. 创建管理员账号
3. 配置内容类型权限（Settings → Roles → Public）
4. 添加测试内容

## 环境变量

### 后端 `.env`

```bash
HOST=0.0.0.0
PORT=1337
APP_KEYS=tobemodified1,tobemodified2
API_TOKEN_SALT=tobemodified
ADMIN_JWT_SECRET=tobemodified
JWT_SECRET=tobemodified

DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

### 前端 `.env`

```bash
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337/api
REVALIDATE_SECRET=your-secret
```

## 调试技巧

### 查看 API 响应

```bash
# 获取成员列表
curl http://localhost:1337/api/members?populate=photo
```

### 清除缓存

```bash
# 清除 Next.js 缓存
rm -rf packages/frontend/.next

# 清除 Strapi 缓存
rm -rf packages/backend/.cache
```

### 数据库重置

```bash
pnpm db:down
docker volume rm pxy-team-site_postgres_data
pnpm db:up
```
