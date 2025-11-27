# CDN 加速（可选）

使用 CDN 加速静态资源访问，提升用户体验。

## 是否需要 CDN

### 推荐使用

- 静态资源（图片、CSS、JS）较多
- 用户分布在全国各地
- 对访问速度要求高

### 可以不用

- 网站流量较小
- OSS 已能满足需求
- 成本敏感

## 架构方案

### 方案一：CDN + OSS

```
用户 → CDN → OSS（源站）
```

适合：静态资源加速

### 方案二：CDN + FC

```
用户 → CDN → FC（源站）
```

适合：全站加速（需处理动态内容）

## 创建 CDN 域名

### 控制台操作

1. 登录 [CDN 控制台](https://cdn.console.aliyun.com)
2. 点击"添加域名"

### 配置信息

| 配置项 | 值 |
|--------|-----|
| 加速域名 | `static.prof-peng.team` |
| 业务类型 | 图片小文件 |
| 加速区域 | 仅中国内地（需备案）|
| 源站类型 | OSS 域名 |
| 源站地址 | `pxy-team-site-media.oss-cn-chengdu.aliyuncs.com` |
| 端口 | 443 |

### DNS 配置

添加 CNAME 记录：

```
主机记录: static
记录类型: CNAME
记录值: static.prof-peng.team.w.cdngslb.com
```

## 缓存配置

### 缓存规则

| 规则 | 匹配 | 过期时间 |
|------|------|----------|
| 图片 | `.jpg,.png,.gif,.webp,.svg` | 30 天 |
| 文档 | `.pdf,.doc,.docx` | 7 天 |
| 字体 | `.woff,.woff2,.ttf` | 365 天 |
| 其他 | `*` | 1 天 |

### 配置方法

1. 进入域名管理 → 缓存配置
2. 添加缓存规则

```
目录规则:
/uploads/images/ → 2592000秒（30天）
/uploads/documents/ → 604800秒（7天）

文件后缀规则:
.jpg,.png,.gif,.webp → 2592000秒
.pdf → 604800秒
```

### 缓存 Header

源站设置 `Cache-Control`：

```
Cache-Control: public, max-age=2592000
```

## HTTPS 配置

### 绑定证书

1. 进入域名管理 → HTTPS 配置
2. 选择已有证书或上传
3. 开启 HTTPS

### 强制 HTTPS

启用"强制跳转 HTTPS"

### HTTP/2

默认开启，提升加载速度

## 性能优化

### 智能压缩

启用 Gzip/Brotli 压缩：

1. 进入性能优化 → 智能压缩
2. 开启压缩功能
3. 选择压缩类型

### 图片处理

CDN 支持实时图片处理：

```
# 缩放
https://static.prof-peng.team/image.jpg?x-oss-process=image/resize,w_300

# WebP 转换
?x-oss-process=image/format,webp

# 质量压缩
?x-oss-process=image/quality,q_80
```

### 页面优化

- HTML 压缩
- CSS/JS 压缩
- 参数过滤

## 访问控制

### Referer 防盗链

```
白名单:
prof-peng.team
*.prof-peng.team
localhost
```

### IP 黑白名单

限制特定 IP 访问

### URL 鉴权

对敏感资源启用鉴权：

```
Type A: 
http://xxx.com/path?auth_key=timestamp-rand-uid-md5hash
```

## 刷新预热

### 刷新

清除 CDN 缓存：

```bash
# URL 刷新
aliyun cdn RefreshObjectCaches --ObjectPath "https://static.prof-peng.team/uploads/image.jpg"

# 目录刷新
aliyun cdn RefreshObjectCaches --ObjectPath "https://static.prof-peng.team/uploads/" --ObjectType Directory
```

### 预热

提前缓存内容到节点：

```bash
aliyun cdn PushObjectCache --ObjectPath "https://static.prof-peng.team/uploads/new-image.jpg"
```

## 监控统计

### 关键指标

| 指标 | 说明 |
|------|------|
| 带宽峰值 | 最大带宽使用 |
| 流量 | 总流量消耗 |
| 请求数 | HTTP 请求次数 |
| 命中率 | CDN 缓存命中比例 |
| 回源带宽 | 回源流量 |

### 命中率优化

目标命中率 > 90%

优化方法：
1. 增加缓存时间
2. 合理设置缓存规则
3. 减少动态参数

## 与前端集成

### 配置 CDN 域名

```bash
# 前端环境变量
NEXT_PUBLIC_CDN_URL=https://static.prof-peng.team
```

### 使用 CDN URL

```tsx
// 图片组件
const imageUrl = process.env.NEXT_PUBLIC_CDN_URL 
  ? `${process.env.NEXT_PUBLIC_CDN_URL}${path}`
  : getStrapiMedia(path);

<Image src={imageUrl} alt="..." />
```

## 成本估算

| 计费项 | 单价（约） |
|--------|-----------|
| 流量 | ¥0.24/GB |
| HTTPS 请求 | ¥0.05/万次 |
| 回源流量 | ¥0.15/GB |

### 节省成本

1. 提高缓存命中率，减少回源
2. 启用压缩，减少流量
3. 使用流量包预付费
