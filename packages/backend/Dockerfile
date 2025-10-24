FROM node:20-bullseye-slim AS builder

WORKDIR /app
ENV NODE_ENV=development

# 构建原生依赖所需工具（better-sqlite3 等可选依赖可能会编译）
RUN sed -i 's|deb.debian.org|mirrors.aliyun.com|g; s|security.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 启用 pnpm 并切换国内镜像源
RUN corepack enable && \
    npm config set registry https://registry.npmmirror.com && \
    pnpm config set registry https://registry.npmmirror.com

# 复制工作区元数据与 backend 包声明
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/package.json

# 安装依赖(工作区及所有包)
RUN pnpm install

# 复制后端源码并编译管理端（Admin）
COPY packages/backend packages/backend
WORKDIR /app/packages/backend
RUN pnpm build

# 运行时镜像
FROM node:20-bullseye-slim

WORKDIR /app
ENV NODE_ENV=production

# 进程管理与干净退出
RUN sed -i 's|deb.debian.org|mirrors.aliyun.com|g; s|security.debian.org|mirrors.aliyun.com|g' /etc/apt/sources.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends tini ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 启用 pnpm 并切换国内镜像源
RUN corepack enable && \
    npm config set registry https://registry.npmmirror.com && \
    pnpm config set registry https://registry.npmmirror.com

# 拷贝后端构建产物与依赖
COPY --from=builder /app/packages/backend /app/packages/backend

# 仅保留生产依赖（可选）
RUN pnpm -C /app/packages/backend prune --prod || true

EXPOSE 1337
WORKDIR /app/packages/backend
ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["pnpm","start"]
