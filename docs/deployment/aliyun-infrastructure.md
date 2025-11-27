# 阿里云基础设施

本文档详细介绍项目所需的阿里云基础设施配置。

## 架构总览

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                      阿里云                              │
                    │                                                         │
   用户请求         │   ┌─────────┐      ┌─────────────────────────────────┐  │
  ─────────────────►│   │  DNS    │─────►│  函数计算 (FC)                   │  │
                    │   │ 云解析   │      │  ├── 前端函数 (prof-peng.team)   │  │
                    │   └─────────┘      │  └── 后端函数 (cms.prof-peng.team)│  │
                    │                    └────────────┬────────────────────┘  │
                    │                                 │                       │
                    │         ┌───────────────────────┼───────────────────┐   │
                    │         │                       │                   │   │
                    │         ▼                       ▼                   │   │
                    │   ┌──────────┐           ┌───────────┐              │   │
                    │   │   OSS    │           │    RDS    │              │   │
                    │   │ 媒体存储  │           │ PostgreSQL│              │   │
                    │   └──────────┘           └───────────┘              │   │
                    │                                                     │   │
                    │   ┌──────────┐           ┌───────────┐              │   │
                    │   │   SSL    │           │    ICP    │              │   │
                    │   │  证书    │           │   备案     │              │   │
                    │   └──────────┘           └───────────┘              │   │
                    └─────────────────────────────────────────────────────────┘
```

## 1. ICP 备案

::: warning 重要
在中国大陆提供互联网服务必须完成 ICP 备案，否则域名无法解析到阿里云服务器。
:::

### 备案流程

1. **准备材料**
   - 域名证书
   - 企业营业执照 / 个人身份证
   - 网站负责人身份证
   - 网站负责人手机号
   - 应急联系人信息

2. **提交备案**
   - 登录 [阿里云备案系统](https://beian.aliyun.com)
   - 填写主体信息（企业/个人）
   - 填写网站信息
   - 上传证件照片
   - 提交初审

3. **阿里云初审**
   - 1-2 个工作日
   - 可能会电话核实信息

4. **管局审核**
   - 各省不同，一般 3-20 个工作日
   - 审核通过后收到备案号

### 备案号展示

备案通过后，需要在网站底部展示备案号：

```tsx
// components/Footer.tsx
<a href="https://beian.miit.gov.cn/" target="_blank">
  浙ICP备XXXXXXXX号
</a>
```

## 2. 域名配置

### 购买域名

1. 登录 [阿里云域名注册](https://wanwang.aliyun.com)
2. 搜索并购买域名
3. 完成实名认证

### 域名规划

| 域名 | 用途 |
|------|------|
| `prof-peng.team` | 前端网站 |
| `cms.prof-peng.team` | 后端 CMS |
| `www.prof-peng.team` | 重定向到主域名 |

## 3. DNS 云解析

### 配置步骤

1. 登录 [云解析 DNS 控制台](https://dns.console.aliyun.com)
2. 添加域名并配置解析记录

### 解析记录

| 主机记录 | 记录类型 | 记录值 | 说明 |
|----------|----------|--------|------|
| `@` | CNAME | FC 分配的域名 | 主域名 |
| `www` | CNAME | `prof-peng.team` | www 重定向 |
| `cms` | CNAME | FC 分配的域名 | CMS 后端 |

### FC 自定义域名

函数计算会分配一个默认域名，配置自定义域名后需要添加 CNAME 解析：

```
主机记录: @
记录类型: CNAME
记录值: xxxxxxx.cn-chengdu.fc.aliyuncs.com
```

## 4. SSL 证书

### 免费证书申请

1. 登录 [SSL 证书控制台](https://yundunnext.console.aliyun.com)
2. 选择"免费证书"
3. 申请 DigiCert 免费单域名证书（每年 20 个）

### 申请流程

1. **创建证书**
   - 证书类型：免费版 DV SSL
   - 域名：`prof-peng.team`

2. **域名验证**
   - 选择 DNS 验证
   - 添加 TXT 记录到 DNS

3. **证书签发**
   - 验证通过后自动签发
   - 一般几分钟内完成

### 证书绑定

将证书绑定到函数计算自定义域名：

```yaml
# s.ci.yaml
fc3_domain_fe:
  component: fc3-domain
  props:
    domainName: prof-peng.team
    protocol: HTTP,HTTPS
    certConfig:
      certId: 21130608  # 证书 ID
```

### 获取证书 ID

1. 在 SSL 证书控制台找到已签发的证书
2. 点击"部署"
3. 选择"云产品" → "函数计算"
4. 记录证书 ID

## 5. 对象存储 OSS

### 创建 Bucket

1. 登录 [OSS 控制台](https://oss.console.aliyun.com)
2. 创建 Bucket

### Bucket 配置

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Bucket 名称 | `pxy-team-site-media` | 唯一标识 |
| 地域 | 华西1（成都） | 与 FC 同区域 |
| 存储类型 | 标准存储 | 频繁访问 |
| 读写权限 | 公共读 | 允许匿名读取 |
| 版本控制 | 关闭 | 非必需 |

### CORS 配置

```json
{
  "CORSRule": [
    {
      "AllowedOrigin": ["*"],
      "AllowedMethod": ["GET", "HEAD"],
      "AllowedHeader": ["*"],
      "ExposeHeader": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
}
```

### 访问控制

创建 RAM 用户并授权：

1. 创建 RAM 用户 `strapi-oss`
2. 授予权限：`AliyunOSSFullAccess` 或自定义策略
3. 创建 AccessKey

### 自定义策略（最小权限）

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
        "oss:ListObjects"
      ],
      "Resource": [
        "acs:oss:*:*:pxy-team-site-media",
        "acs:oss:*:*:pxy-team-site-media/*"
      ]
    }
  ]
}
```

### 环境变量

```bash
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_REGION=oss-cn-chengdu
OSS_BUCKET=pxy-team-site-media
OSS_BASE_URL=https://pxy-team-site-media.oss-cn-chengdu.aliyuncs.com
OSS_UPLOAD_PATH=uploads
OSS_SECURE=true
OSS_INTERNAL=false
```

::: tip 内网访问
在 FC 函数中访问同区域 OSS，可设置 `OSS_INTERNAL=true` 使用内网，免流量费用。
:::

## 6. 云数据库 RDS PostgreSQL

### 创建实例

1. 登录 [RDS 控制台](https://rdsnext.console.aliyun.com)
2. 创建实例

### 实例配置

| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| 数据库类型 | PostgreSQL | Strapi 推荐 |
| 版本 | 14.0 | 稳定版本 |
| 系列 | 基础版 | 个人/开发环境 |
| 规格 | 1核 1GB | 最小规格 |
| 存储类型 | ESSD 云盘 | 高性能 |
| 存储空间 | 20GB | 按需扩容 |
| 地域 | 华西1（成都） | 与 FC 同区域 |

### Serverless 版本（推荐）

选择 Serverless 版本可按需付费：

| 配置项 | 值 |
|--------|-----|
| 最小 RCU | 0.5 |
| 最大 RCU | 8 |
| 自动暂停 | 启用（空闲 10 分钟后暂停） |

### 网络配置

1. **VPC 配置**
   - 创建或选择 VPC
   - 配置安全组规则

2. **白名单设置**
   - 添加 FC 函数所在的 VPC CIDR
   - 或添加 `0.0.0.0/0`（仅测试环境）

### 创建数据库

```sql
-- 连接到 RDS
CREATE DATABASE strapi;
CREATE USER strapi WITH ENCRYPTED PASSWORD 'your-password';
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;
```

### 连接信息

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=pgm-xxxxx.pg.rds.aliyuncs.com
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-password
DATABASE_SSL=true
```

### 连接池配置

```typescript
// config/database.ts
pool: {
  min: env.int('DATABASE_POOL_MIN', 2),
  max: env.int('DATABASE_POOL_MAX', 10),
  acquireTimeoutMillis: 30000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
}
```

## 7. 函数计算 FC

### 服务配置

详见 [阿里云函数计算](/deployment/aliyun-fc)

### 资源规格

| 函数 | CPU | 内存 | 超时 | 并发 |
|------|-----|------|------|------|
| 前端 | 0.35 vCPU | 512 MB | 60s | 20 |
| 后端 | 1 vCPU | 2048 MB | 120s | 100 |

### VPC 配置

如需访问 RDS 内网：

```yaml
props:
  vpcConfig:
    vpcId: vpc-xxxxxx
    securityGroupId: sg-xxxxxx
    vSwitchIds:
      - vsw-xxxxxx
```

### 日志配置

```yaml
props:
  logConfig:
    project: pxy-team-site-logs
    logstore: fc-logs
    enableRequestMetrics: true
```

## 8. CDN 加速（可选）

### 添加域名

1. 登录 [CDN 控制台](https://cdn.console.aliyun.com)
2. 添加加速域名

### CDN 配置

| 配置项 | 值 |
|--------|-----|
| 加速域名 | `static.prof-peng.team` |
| 业务类型 | 图片小文件 |
| 源站类型 | OSS 域名 |
| 源站地址 | `pxy-team-site-media.oss-cn-chengdu.aliyuncs.com` |

### 缓存配置

```
目录: /uploads/
过期时间: 30 天

文件后缀: .jpg,.png,.gif,.webp
过期时间: 30 天

文件后缀: .pdf,.doc
过期时间: 7 天
```

### HTTPS 配置

1. 绑定 SSL 证书
2. 开启强制 HTTPS 跳转

## 成本估算

| 服务 | 规格 | 月费用（约） |
|------|------|-------------|
| 域名 | .team 域名 | ¥200/年 |
| DNS 云解析 | 免费版 | ¥0 |
| SSL 证书 | 免费单域名 | ¥0 |
| FC 函数计算 | 预留 1 实例 | ¥50-100 |
| RDS PostgreSQL | Serverless 0.5-8 RCU | ¥30-100 |
| OSS | 10GB + 流量 | ¥5-20 |
| CDN（可选） | 按流量计费 | ¥10-50 |
| **合计** | | **¥95-270/月** |

::: tip 省钱技巧
1. 使用 Serverless RDS，空闲时自动暂停
2. FC 预留实例可选择 0（按需冷启动）
3. OSS 启用内网访问免流量费
4. 购买资源包可享折扣
:::

## 下一步

- 查看 [环境变量配置](/deployment/environment)
- 了解 [GitHub Actions CI/CD](/deployment/github-actions)
