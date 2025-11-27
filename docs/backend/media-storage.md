# 媒体存储（OSS）

后端使用阿里云 OSS 存储媒体文件。

## 架构

```
┌─────────────┐    上传     ┌─────────────┐
│   Strapi    │ ──────────► │  阿里云 OSS  │
└─────────────┘             └──────┬──────┘
                                   │
                                   │ CDN 分发
                                   ▼
                            ┌─────────────┐
                            │   用户访问   │
                            └─────────────┘
```

## 自定义 Provider

### 位置

```
packages/backend/providers/strapi-provider-upload-custom-oss/
├── package.json
└── lib/
    └── index.js
```

### 实现

```javascript
// lib/index.js
const OSS = require('ali-oss');

module.exports = {
  init(config) {
    const client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      internal: config.internal,
      secure: config.secure,
    });

    return {
      async upload(file) {
        const path = `${config.uploadPath}/${file.hash}${file.ext}`;
        await client.put(path, Buffer.from(file.buffer, 'binary'));
        file.url = `${config.baseUrl}/${path}`;
      },

      async delete(file) {
        const path = file.url.replace(`${config.baseUrl}/`, '');
        await client.delete(path);
      },
    };
  },
};
```

## 配置

### 环境变量

```bash
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_REGION=oss-cn-chengdu
OSS_BUCKET=your-bucket-name
OSS_BASE_URL=https://your-bucket.oss-cn-chengdu.aliyuncs.com
OSS_UPLOAD_PATH=uploads
OSS_SECURE=true
OSS_INTERNAL=false
```

### 插件配置

```typescript
// config/plugins.ts
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
```

## 文件格式支持

### 图片

自动生成多种尺寸：
- thumbnail (245px)
- small (500px)
- medium (750px)
- large (1000px)

### 文件

支持 PDF、DOC 等文档文件上传。

## 前端使用

```typescript
// 获取完整 URL
const imageUrl = getStrapiMedia(member.photo?.url);

// 使用缩略图
const thumbnailUrl = member.photo?.formats?.thumbnail?.url;
```
