# 内容类型定义

本文档介绍 Strapi 中定义的所有内容类型。

## Member - 团队成员

### Schema

```json
{
  "kind": "collectionType",
  "collectionName": "members",
  "info": {
    "singularName": "member",
    "pluralName": "members",
    "displayName": "Member"
  },
  "pluginOptions": {
    "i18n": { "localized": true }
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "english_name": { "type": "string", "required": true },
    "slug": { "type": "string", "required": true, "unique": true },
    "photo": { "type": "media", "allowedTypes": ["images"] },
    "role": {
      "type": "enumeration",
      "enum": ["Supervisor", "Ph.D. Student", "Master Student", "Alumni"]
    },
    "enrollment_year": { "type": "integer" },
    "email": { "type": "email" },
    "bio": { "type": "richtext" },
    "enrollment_status": {
      "type": "enumeration",
      "enum": ["Current", "Graduated"]
    },
    "research_interests": { "type": "text" },
    "education_background": { "type": "text" }
  }
}
```

## Publication - 论文成果

### Schema

```json
{
  "kind": "collectionType",
  "collectionName": "publications",
  "attributes": {
    "title": { "type": "string", "required": true },
    "authors": { "type": "string", "required": true },
    "publication_venue": { "type": "string", "required": true },
    "year": { "type": "integer", "required": true },
    "volume_issue_pages": { "type": "string" },
    "publication_type": {
      "type": "enumeration",
      "enum": ["Journal", "Conference"]
    },
    "doi_link": { "type": "string" },
    "pdf_file": { "type": "media", "allowedTypes": ["files"] },
    "code_link": { "type": "string" },
    "abstract": { "type": "text" },
    "research_areas": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::research-area.research-area"
    }
  }
}
```

## Research Area - 研究方向

### Schema

```json
{
  "kind": "collectionType",
  "collectionName": "research_areas",
  "attributes": {
    "title": { "type": "string", "required": true },
    "description": { "type": "text", "required": true },
    "slug": { "type": "string", "required": true, "unique": true },
    "icon": { "type": "string" },
    "order": { "type": "integer", "default": 0 },
    "cover_image": { "type": "media", "allowedTypes": ["images"] },
    "detailed_content": { "type": "richtext" },
    "keywords": { "type": "json" },
    "related_publications": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::publication.publication"
    },
    "related_patents": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::patent.patent"
    }
  }
}
```

## Opening - 招聘岗位

### Schema

```json
{
  "kind": "collectionType",
  "collectionName": "openings",
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "string", "required": true, "unique": true },
    "position_type": {
      "type": "enumeration",
      "enum": ["Postdoc", "PhD", "Master", "RA", "Intern", "Engineer", "Other"]
    },
    "description": { "type": "richtext" },
    "requirements": { "type": "json" },
    "benefits": { "type": "json" },
    "location": { "type": "string" },
    "deadline_date": { "type": "date" },
    "contact_email": { "type": "email" },
    "apply_link": { "type": "string" },
    "order": { "type": "integer" },
    "status_field": {
      "type": "enumeration",
      "enum": ["Open", "Closed"]
    }
  }
}
```

::: warning 注意
`status` 是 Strapi 保留字段，因此使用 `status_field` 替代。
:::

## 字段本地化

支持国际化的字段在 `pluginOptions` 中设置：

```json
{
  "title": {
    "type": "string",
    "pluginOptions": {
      "i18n": { "localized": true }
    }
  },
  "slug": {
    "type": "string",
    "pluginOptions": {
      "i18n": { "localized": false }  // 不翻译
    }
  }
}
```
