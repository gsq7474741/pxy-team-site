# 云数据库 RDS PostgreSQL

本文档详细介绍 RDS PostgreSQL 的配置和使用。

## 创建实例

### 控制台

1. 登录 [RDS 控制台](https://rdsnext.console.aliyun.com)
2. 点击"创建实例"
3. 选择 PostgreSQL

### 实例配置

#### 基础版（开发环境）

| 配置项 | 值 |
|--------|-----|
| 数据库类型 | PostgreSQL |
| 版本 | 14.0 |
| 系列 | 基础版 |
| 规格 | 1核 1GB |
| 存储类型 | ESSD 云盘 |
| 存储空间 | 20GB |
| 地域 | 华西1（成都） |

#### Serverless（推荐）

| 配置项 | 值 |
|--------|-----|
| 数据库类型 | PostgreSQL Serverless |
| 最小 RCU | 0.5 |
| 最大 RCU | 8 |
| 存储空间 | 20GB（自动扩容） |
| 自动暂停 | 启用 |
| 暂停延迟 | 10 分钟 |

::: tip Serverless 优势
- 按使用量付费，空闲时几乎不产生费用
- 自动扩缩容，应对流量波动
- 无需管理实例规格
:::

## 网络配置

### VPC 配置

1. 使用与 FC 相同的 VPC
2. 或创建新 VPC 并配置对等连接

### 安全组

允许 FC 访问 RDS：

```
入方向规则:
- 协议: TCP
- 端口: 5432
- 源: FC 函数所在 VPC 的 CIDR (如 172.16.0.0/12)
```

### 白名单

在 RDS 实例安全设置中添加：

```
# 生产环境 - 限制为 FC VPC CIDR
172.16.0.0/12

# 开发环境 - 允许所有（不推荐）
0.0.0.0/0
```

## 数据库初始化

### 创建数据库

通过 DMS 或 psql 执行：

```sql
-- 创建数据库
CREATE DATABASE strapi
  WITH ENCODING='UTF8'
       LC_COLLATE='en_US.UTF-8'
       LC_CTYPE='en_US.UTF-8'
       TEMPLATE=template0;

-- 创建用户
CREATE USER strapi WITH ENCRYPTED PASSWORD 'your-secure-password';

-- 授权
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;

-- 如果需要扩展
\c strapi
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 连接测试

```bash
psql "host=pgm-xxx.pg.rds.aliyuncs.com port=5432 dbname=strapi user=strapi sslmode=require"
```

## Strapi 配置

### 环境变量

```bash
DATABASE_CLIENT=postgres
DATABASE_HOST=pgm-xxxxx.pg.rds.aliyuncs.com
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-secure-password
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### 配置文件

```typescript
// packages/backend/config/database.ts
export default ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    pool: {
      min: env.int('DATABASE_POOL_MIN', 2),
      max: env.int('DATABASE_POOL_MAX', 10),
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      idleTimeoutMillis: 30000,
    },
  },
});
```

## 备份与恢复

### 自动备份

RDS 默认开启自动备份：

- 备份周期：每天
- 保留天数：7 天（可调整）
- 备份时间：凌晨业务低峰期

### 手动备份

```bash
# 使用 pg_dump
pg_dump -h pgm-xxx.pg.rds.aliyuncs.com -U strapi -d strapi -F c -f backup.dump

# 恢复
pg_restore -h pgm-xxx.pg.rds.aliyuncs.com -U strapi -d strapi backup.dump
```

### 克隆实例

用于创建测试环境：

1. 在控制台选择"克隆实例"
2. 选择备份点
3. 配置新实例规格

## 监控告警

### 关键指标

| 指标 | 告警阈值 |
|------|----------|
| CPU 使用率 | > 80% |
| 内存使用率 | > 80% |
| 连接数 | > 80% |
| 磁盘使用率 | > 80% |
| IOPS | 接近上限 |

### 配置告警

1. 进入云监控控制台
2. 创建告警规则
3. 配置通知方式（短信/邮件/钉钉）

## 性能优化

### 连接池

```typescript
pool: {
  min: 2,   // 最小连接数
  max: 10,  // 最大连接数
}
```

### 慢查询

启用慢查询日志：

1. 在 RDS 参数设置中启用
2. 设置阈值（如 1 秒）
3. 在日志管理中查看

### 索引优化

```sql
-- 查看缺失索引
SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;

-- 查看表大小
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## 成本优化

### Serverless 自动暂停

空闲 10 分钟后自动暂停，暂停期间不计费。

### 存储优化

```sql
-- 清理无用数据
VACUUM FULL;

-- 分析表
ANALYZE;
```

### 购买资源包

预付费资源包可享折扣，适合稳定负载。
