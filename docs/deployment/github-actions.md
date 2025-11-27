# GitHub Actions CI/CD

项目使用 GitHub Actions 实现自动化构建和部署。

## 工作流文件

`.github/workflows/fc-build-deploy.yml`

## 触发条件

```yaml
on:
  push:
    branches: [ main ]
  workflow_dispatch:  # 手动触发
```

## 主要步骤

### 1. 检出代码

```yaml
- name: Checkout repo
  uses: actions/checkout@v4
```

### 2. 设置 Node.js 和 pnpm

```yaml
- name: Setup Node 20
  uses: actions/setup-node@v4
  with:
    node-version: 20

- name: Setup pnpm
  uses: pnpm/action-setup@v4
  with:
    version: 10
```

### 3. 安装依赖

```yaml
- name: Install dependencies
  run: pnpm install
```

### 4. 构建项目

```yaml
- name: Build all
  run: pnpm turbo run build
```

### 5. 部署前端

```yaml
- name: Deploy frontend to dist
  run: pnpm --filter frontend deploy dist/deploy-frontend --legacy

- name: Copy static & public into standalone
  working-directory: dist/deploy-frontend
  run: |
    mkdir -p .next/standalone/.next/static
    cp -r .next/static .next/standalone/.next/
    cp -r public .next/standalone/
```

### 6. 部署后端

```yaml
- name: Deploy backend to dist
  run: pnpm --filter backend deploy dist/deploy-backend --legacy
```

### 7. 部署到阿里云

```yaml
- name: Install Serverless Devs CLI
  run: npm i -g @serverless-devs/s

- name: Configure AliCloud credential
  run: |
    s config add \
      --AccessKeyID $ALICLOUD_ACCESS_KEY_ID \
      --AccessKeySecret $ALICLOUD_ACCESS_KEY_SECRET \
      -a default -f

- name: Deploy to FC
  run: s deploy -t s.ci.yaml -y --use-remote --assume-yes
```

## 缓存优化

```yaml
- name: Cache pnpm store
  uses: actions/cache@v4
  with:
    path: ~/.pnpm-store
    key: pnpm-store-${{ runner.os }}-${{ hashFiles('pnpm-lock.yaml') }}
```

## 并发控制

```yaml
concurrency:
  group: fc-deploy-${{ github.ref }}
  cancel-in-progress: true
```

## 手动触发

在 GitHub 仓库 Actions 页面点击 "Run workflow" 可手动触发部署。

## 查看日志

1. 进入 GitHub 仓库 → Actions
2. 选择工作流运行记录
3. 点击具体步骤查看日志
