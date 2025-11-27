# Strapi 配置

本文档介绍 Strapi 的各项配置文件。

## 服务器配置

### `config/server.ts`

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
```

## 数据库配置

### `config/database.ts`

```typescript
export default ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'postgres'),
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
    },
  },
});
```

## 插件配置

### `config/plugins.ts`

```typescript
export default ({ env }) => ({
  // 国际化插件
  i18n: {
    enabled: true,
    config: {
      defaultLocale: 'zh-CN',
      locales: ['zh-CN', 'en'],
    },
  },
  
  // OSS 上传插件
  upload: {
    config: {
      provider: 'strapi-provider-upload-custom-oss',
      providerOptions: {
        accessKeyId: env('OSS_ACCESS_KEY_ID'),
        accessKeySecret: env('OSS_ACCESS_KEY_SECRET'),
        region: env('OSS_REGION'),
        bucket: env('OSS_BUCKET'),
        uploadPath: env('OSS_UPLOAD_PATH'),
        baseUrl: env('OSS_BASE_URL'),
        secure: env.bool('OSS_SECURE', true),
        internal: env.bool('OSS_INTERNAL', false),
      },
    },
  },
});
```

## 中间件配置

### `config/middlewares.ts`

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      origin: ['*'],  // 生产环境应限制
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 管理面板配置

### `config/admin.ts`

```typescript
export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
});
```

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `HOST` | 监听地址 | `0.0.0.0` |
| `PORT` | 监听端口 | `1337` |
| `APP_KEYS` | 应用密钥 | 随机字符串 |
| `ADMIN_JWT_SECRET` | JWT 密钥 | 随机字符串 |
| `JWT_SECRET` | API JWT 密钥 | 随机字符串 |
| `API_TOKEN_SALT` | API Token 盐 | 随机字符串 |
| `DATABASE_*` | 数据库配置 | 见上文 |
| `OSS_*` | OSS 配置 | 见上文 |
