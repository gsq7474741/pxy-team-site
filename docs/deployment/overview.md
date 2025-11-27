# 部署概述

项目部署到阿里云函数计算 (FC)，使用 GitHub Actions 实现 CI/CD。

## 部署架构

```
GitHub Repository
       │
       │ push to main
       ▼
GitHub Actions
       │
       ├── 构建前端 (Next.js standalone)
       ├── 构建后端 (Strapi)
       │
       ▼
Serverless Devs CLI
       │
       ▼
阿里云函数计算 (FC)
       │
       ├── 前端函数: prof-peng.team
       └── 后端函数: cms.prof-peng.team
```

## 部署组件

| 组件 | 技术 | 域名 |
|------|------|------|
| 前端 | Next.js standalone | prof-peng.team |
| 后端 | Strapi | cms.prof-peng.team |
| 数据库 | 阿里云 RDS PostgreSQL | - |
| 存储 | 阿里云 OSS | - |

## 配置文件

| 文件 | 说明 |
|------|------|
| `s.ci.yaml` | Serverless Devs 部署配置 |
| `.github/workflows/fc-build-deploy.yml` | CI/CD 工作流 |

## 部署流程

1. 推送代码到 main 分支
2. GitHub Actions 自动触发
3. 安装依赖并构建项目
4. 使用 Serverless Devs 部署到 FC
5. 更新域名路由

## 下一步

- 配置 [环境变量](/deployment/environment)
- 了解 [GitHub Actions](/deployment/github-actions)
- 查看 [阿里云 FC](/deployment/aliyun-fc)
