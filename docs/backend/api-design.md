# API 设计

Strapi 自动生成 REST API，本文档介绍 API 的使用方式。

## API 基础

### 基础 URL

```
开发环境: http://localhost:1337/api
生产环境: https://cms.prof-peng.team/api
```

### 请求格式

```bash
GET /api/{collection}           # 获取列表
GET /api/{collection}/{id}      # 获取单个
POST /api/{collection}          # 创建
PUT /api/{collection}/{id}      # 更新
DELETE /api/{collection}/{id}   # 删除
```

## 常用查询参数

### 分页

```
?pagination[page]=1&pagination[pageSize]=10
```

### 排序

```
?sort=year:desc
?sort[0]=year:desc&sort[1]=title:asc
```

### 过滤

```
?filters[slug][$eq]=ai-research
?filters[year][$gte]=2020
?filters[title][$contains]=AI
```

### 关联查询

```
# 简单 populate
?populate=cover_image

# 多个字段
?populate[0]=cover_image&populate[1]=author

# 深度 populate
?populate[research_areas][populate]=cover_image
```

### 多语言

```
?locale=zh-CN
?locale=en
```

## API 示例

### 获取成员列表

```bash
GET /api/members?locale=zh-CN&populate=photo&sort=createdAt:desc
```

响应：
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "name": "张三",
      "english_name": "Zhang San",
      "role": "Ph.D. Student",
      "photo": {
        "url": "/uploads/photo.jpg"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 10
    }
  }
}
```

### 获取研究方向详情

```bash
GET /api/research-areas?filters[slug][$eq]=ai-research&populate=*
```

### 获取单例页面

```bash
GET /api/contact-page?locale=zh-CN
```

## 权限配置

在 Strapi 管理面板中配置 Public 角色的权限：

1. 进入 Settings → Users & Permissions → Roles
2. 选择 Public 角色
3. 为每个内容类型启用 `find` 和 `findOne` 权限

## 过滤操作符

| 操作符 | 说明 | 示例 |
|--------|------|------|
| `$eq` | 等于 | `filters[slug][$eq]=xxx` |
| `$ne` | 不等于 | `filters[status][$ne]=draft` |
| `$lt` | 小于 | `filters[year][$lt]=2020` |
| `$lte` | 小于等于 | `filters[year][$lte]=2020` |
| `$gt` | 大于 | `filters[year][$gt]=2020` |
| `$gte` | 大于等于 | `filters[year][$gte]=2020` |
| `$in` | 在列表中 | `filters[role][$in][0]=PhD` |
| `$contains` | 包含 | `filters[title][$contains]=AI` |
| `$null` | 是否为空 | `filters[email][$null]=true` |
