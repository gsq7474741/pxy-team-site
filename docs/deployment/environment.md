# 环境变量配置

本文档列出所有需要配置的环境变量。

## GitHub Secrets

在 GitHub 仓库的 Settings → Secrets and variables → Actions 中配置：

### 应用密钥

| 变量 | 说明 |
|------|------|
| `APP_KEYS` | Strapi 应用密钥 |
| `ADMIN_JWT_SECRET` | 管理员 JWT 密钥 |
| `JWT_SECRET` | API JWT 密钥 |
| `API_TOKEN_SALT` | API Token 盐值 |
| `REVALIDATE_SECRET` | ISR 重验证密钥 |

### 数据库

| 变量 | 说明 |
|------|------|
| `DATABASE_PASSWORD` | 数据库密码 |

### 阿里云

| 变量 | 说明 |
|------|------|
| `ALICLOUD_ACCESS_KEY_ID` | 阿里云 AccessKey ID |
| `ALICLOUD_ACCESS_KEY_SECRET` | 阿里云 AccessKey Secret |
| `OSS_ACCESS_KEY_ID` | OSS AccessKey ID |
| `OSS_ACCESS_KEY_SECRET` | OSS AccessKey Secret |

## GitHub Variables

在 Settings → Secrets and variables → Actions → Variables 中配置：

### 前端

| 变量 | 示例 |
|------|------|
| `NEXT_PUBLIC_STRAPI_URL` | `https://cms.prof-peng.team/api` |

### 数据库

| 变量 | 示例 |
|------|------|
| `DATABASE_CLIENT` | `postgres` |
| `DATABASE_HOST` | `your-rds.aliyuncs.com` |
| `DATABASE_PORT` | `5432` |
| `DATABASE_NAME` | `strapi` |
| `DATABASE_USERNAME` | `strapi` |
| `DATABASE_SSL` | `true` |

### OSS

| 变量 | 示例 |
|------|------|
| `OSS_REGION` | `oss-cn-chengdu` |
| `OSS_BUCKET` | `your-bucket` |
| `OSS_BASE_URL` | `https://your-bucket.oss-cn-chengdu.aliyuncs.com` |
| `OSS_UPLOAD_PATH` | `uploads` |
| `OSS_SECURE` | `true` |
| `OSS_INTERNAL` | `false` |

## 生成密钥

使用以下命令生成随机密钥：

```bash
# 生成随机字符串
openssl rand -base64 32

# 生成 APP_KEYS (需要多个)
echo "$(openssl rand -base64 16),$(openssl rand -base64 16)"
```

## 本地开发

复制 `.env.example` 并修改：

```bash
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```
