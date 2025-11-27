# 后端概述

后端使用 Strapi 5 作为 Headless CMS，提供内容管理和 REST API。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Strapi | 5.19.x | Headless CMS |
| Node.js | 18-22 | 运行时 |
| PostgreSQL | 14+ | 数据库 |
| 阿里云 OSS | - | 媒体存储 |

## 目录结构

```
packages/backend/
├── config/                 # 配置文件
│   ├── admin.ts            # 管理面板配置
│   ├── database.ts         # 数据库配置
│   ├── middlewares.ts      # 中间件配置
│   ├── plugins.ts          # 插件配置
│   └── server.ts           # 服务器配置
├── src/
│   ├── api/                # 内容类型定义
│   ├── admin/              # 管理面板定制
│   └── index.ts            # 入口文件
├── providers/              # 自定义 Provider
│   └── strapi-provider-upload-custom-oss/
└── types/                  # 类型定义
```

## 内容类型

### Collection Types (集合)

| 名称 | API 路径 | 说明 |
|------|----------|------|
| Member | `/api/members` | 团队成员 |
| Publication | `/api/publications` | 论文成果 |
| News | `/api/news-items` | 新闻动态 |
| Research Area | `/api/research-areas` | 研究方向 |
| Opening | `/api/openings` | 招聘岗位 |
| Patent | `/api/patents` | 专利 |
| Award | `/api/awards` | 获奖 |

### Single Types (单例)

| 名称 | API 路径 | 说明 |
|------|----------|------|
| Contact Page | `/api/contact-page` | 联系页面 |
| Join Us Page | `/api/join-us-page` | 加入我们页面 |

## 主要功能

1. **内容管理** - 可视化编辑器管理所有内容
2. **多语言** - 原生 i18n 支持中英文
3. **媒体库** - 图片/文件上传到 OSS
4. **REST API** - 自动生成的 CRUD 接口
5. **权限控制** - 基于角色的访问控制

## 访问地址

- **管理面板**: http://localhost:1337/admin
- **API**: http://localhost:1337/api

## 下一步

- 了解 [Strapi 配置](/backend/strapi-config)
- 查看 [内容类型定义](/backend/content-types)
