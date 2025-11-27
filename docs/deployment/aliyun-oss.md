# 对象存储 OSS

本文档详细介绍 OSS 的配置和使用。

## 创建 Bucket

### 控制台操作

1. 登录 [OSS 控制台](https://oss.console.aliyun.com)
2. 点击"创建 Bucket"

### Bucket 配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Bucket 名称 | `pxy-team-site-media` | 全局唯一 |
| 地域 | 华西1（成都） | 与 FC 同区域 |
| 存储类型 | 标准存储 | 频繁访问 |
| 存储冗余 | 本地冗余 | 成本较低 |
| 版本控制 | 不开通 | 简化管理 |
| 读写权限 | 公共读 | 允许匿名读取 |

## 访问控制

### 创建 RAM 用户

1. 登录 [RAM 控制台](https://ram.console.aliyun.com)
2. 创建用户 `strapi-oss`
3. 开启"编程访问"

### 授权策略

#### 方式一：系统策略

授予 `AliyunOSSFullAccess`（权限较大）

#### 方式二：自定义策略（推荐）

```json
{
  "Version": "1",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "oss:PutObject",
        "oss:GetObject",
        "oss:DeleteObject",
        "oss:ListObjects",
        "oss:GetObjectAcl",
        "oss:PutObjectAcl"
      ],
      "Resource": [
        "acs:oss:*:*:pxy-team-site-media",
        "acs:oss:*:*:pxy-team-site-media/*"
      ]
    }
  ]
}
```

### 创建 AccessKey

1. 进入用户详情
2. 创建 AccessKey
3. 保存 ID 和 Secret（仅显示一次）

## CORS 配置

在 Bucket 设置中配置跨域：

```json
[
  {
    "AllowedOrigin": [
      "https://prof-peng.team",
      "https://cms.prof-peng.team",
      "http://localhost:3000",
      "http://localhost:1337"
    ],
    "AllowedMethod": ["GET", "HEAD", "PUT", "POST", "DELETE"],
    "AllowedHeader": ["*"],
    "ExposeHeader": ["ETag", "x-oss-request-id"],
    "MaxAgeSeconds": 3600
  }
]
```

## Strapi 集成

### 自定义 Provider

```
packages/backend/providers/strapi-provider-upload-custom-oss/
├── package.json
└── lib/
    └── index.js
```

### Provider 实现

```javascript
// lib/index.js
'use strict';

const OSS = require('ali-oss');

module.exports = {
  init(config) {
    const client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      internal: config.internal || false,
      secure: config.secure !== false,
    });

    const uploadPath = config.uploadPath || 'uploads';

    return {
      async upload(file) {
        const path = `${uploadPath}/${file.hash}${file.ext}`;
        
        await client.put(path, Buffer.from(file.buffer, 'binary'), {
          headers: {
            'Content-Type': file.mime,
          },
        });
        
        file.url = `${config.baseUrl}/${path}`;
      },

      async uploadStream(file) {
        const path = `${uploadPath}/${file.hash}${file.ext}`;
        
        await client.putStream(path, file.stream, {
          headers: {
            'Content-Type': file.mime,
          },
        });
        
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

### package.json

```json
{
  "name": "strapi-provider-upload-custom-oss",
  "version": "1.0.0",
  "main": "./lib/index.js",
  "dependencies": {
    "ali-oss": "^6.17.0"
  }
}
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
      uploadPath: env('OSS_UPLOAD_PATH', 'uploads'),
      baseUrl: env('OSS_BASE_URL'),
      secure: env.bool('OSS_SECURE', true),
      internal: env.bool('OSS_INTERNAL', false),
    },
  },
},
```

## 环境变量

```bash
OSS_ACCESS_KEY_ID=LTAI5txxxxxxxxxxxxxxxx
OSS_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
OSS_REGION=oss-cn-chengdu
OSS_BUCKET=pxy-team-site-media
OSS_BASE_URL=https://pxy-team-site-media.oss-cn-chengdu.aliyuncs.com
OSS_UPLOAD_PATH=uploads
OSS_SECURE=true
OSS_INTERNAL=false
```

## 内网访问

FC 函数访问同区域 OSS 可使用内网：

```bash
OSS_INTERNAL=true
```

优势：
- 免流量费用
- 更低延迟

## 生命周期规则

自动清理临时文件：

| 规则 | 前缀 | 操作 | 天数 |
|------|------|------|------|
| 清理临时上传 | `tmp/` | 删除 | 1 天 |
| 转换存储类型 | `uploads/` | 转为低频 | 90 天 |

## 图片处理

OSS 支持 URL 参数进行图片处理：

```
# 缩略图
https://bucket.oss.aliyuncs.com/image.jpg?x-oss-process=image/resize,w_200

# 裁剪
?x-oss-process=image/crop,w_100,h_100

# 质量压缩
?x-oss-process=image/quality,q_80

# 格式转换
?x-oss-process=image/format,webp
```

## 监控告警

### 关键指标

| 指标 | 说明 |
|------|------|
| 存储容量 | 已用存储空间 |
| 请求次数 | GET/PUT 请求数 |
| 流量 | 公网流出流量 |
| 成功率 | 请求成功比例 |

### 费用告警

设置费用预警，避免意外支出。
