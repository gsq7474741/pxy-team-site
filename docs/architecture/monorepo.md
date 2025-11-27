# Monorepo 结构

项目采用 pnpm + Turbo 的 Monorepo 架构，实现前后端统一管理。

## 为什么使用 Monorepo

### 优势

1. **代码共享** - 前后端可以共享类型定义和工具函数
2. **统一版本控制** - 一次提交包含所有相关更改
3. **简化 CI/CD** - 一个流水线部署所有服务
4. **依赖管理** - 统一的依赖版本管理

### 挑战与解决

| 挑战 | 解决方案 |
|------|----------|
| 构建复杂度 | Turbo 提供增量构建和缓存 |
| 依赖冲突 | pnpm 严格的依赖隔离 |
| CI/CD 时间 | 并行构建 + 缓存 |

## pnpm Workspace 配置

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
```

这表示 `packages/` 目录下的所有子目录都是独立的工作空间包。

### 根目录 `package.json`

```json
{
  "name": "pxy-team-site",
  "private": true,
  "workspaces": ["packages/*"],
  "scripts": {
    "db:up": "docker compose up -d",
    "db:down": "docker compose down",
    "dev": "docker compose up -d && turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "frontend:dev": "turbo run dev --filter=frontend",
    "backend:dev": "turbo run dev --filter=backend"
  }
}
```

## Turbo 配置

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "db:up": { "cache": false },
    "db:down": { "cache": false },
    "dev": { 
      "cache": false, 
      "dependsOn": ["db:up"] 
    },
    "build": { 
      "dependsOn": ["^build"], 
      "outputs": [".next/**", "build/**", "dist/**"] 
    },
    "lint": { 
      "outputs": [] 
    }
  }
}
```

### 关键配置说明

| 配置 | 说明 |
|------|------|
| `cache: false` | 禁用缓存，用于开发命令 |
| `dependsOn: ["^build"]` | 依赖其他包的 build 任务 |
| `outputs` | 指定构建输出目录，用于缓存 |

## 包间依赖

目前前后端相对独立，但可以通过以下方式共享代码：

### 共享类型定义（示例）

```
packages/
├── shared/              # 共享包
│   ├── types/           # 共享类型
│   └── utils/           # 共享工具
├── frontend/
└── backend/
```

### 在 package.json 中引用

```json
{
  "dependencies": {
    "shared": "workspace:*"
  }
}
```

## 常用命令

### 过滤器语法

```bash
# 只运行前端任务
pnpm --filter frontend dev
turbo run dev --filter=frontend

# 只运行后端任务
pnpm --filter backend dev
turbo run dev --filter=backend
```

### 全局命令

```bash
# 安装所有依赖
pnpm install

# 构建所有包
pnpm build

# 运行所有开发服务器
pnpm dev
```

### 在特定包中安装依赖

```bash
# 为前端安装依赖
pnpm --filter frontend add axios

# 为后端安装开发依赖
pnpm --filter backend add -D @types/node
```

## 构建流程

```
                    pnpm build
                        │
                        ▼
                   turbo run build
                        │
            ┌───────────┴───────────┐
            ▼                       ▼
    frontend:build            backend:build
            │                       │
            ▼                       ▼
    .next/standalone          dist/build
```

## CI/CD 中的 Monorepo

### 构建优化

1. **缓存 pnpm store** - 避免重复下载依赖
2. **Turbo 远程缓存** - 可配置远程缓存（可选）
3. **并行构建** - 独立任务并行执行

### 部署流程

```yaml
# GitHub Actions 示例
- name: Install dependencies
  run: pnpm install

- name: Build all
  run: pnpm turbo run build

- name: Deploy frontend
  run: pnpm --filter frontend deploy dist/deploy-frontend --legacy

- name: Deploy backend
  run: pnpm --filter backend deploy dist/deploy-backend --legacy
```

`pnpm deploy` 命令会：
1. 复制包到目标目录
2. 只保留生产依赖
3. 创建可部署的独立包

## 最佳实践

1. **保持包独立** - 减少包间依赖
2. **共享配置** - ESLint、TypeScript 配置可以放在根目录
3. **版本一致** - 使用 pnpm 的 `overrides` 统一依赖版本
4. **增量构建** - 利用 Turbo 缓存加速 CI

## 故障排除

### 依赖问题

```bash
# 清除所有依赖重新安装
pnpm store prune
rm -rf node_modules packages/*/node_modules
pnpm install
```

### 构建缓存问题

```bash
# 清除 Turbo 缓存
rm -rf .turbo
turbo run build --force
```
