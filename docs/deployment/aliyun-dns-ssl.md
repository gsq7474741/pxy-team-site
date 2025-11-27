# DNS 与 SSL 证书

本文档介绍域名解析和 SSL 证书的配置。

## 域名注册

### 购买域名

1. 登录 [阿里云域名](https://wanwang.aliyun.com)
2. 搜索可用域名
3. 加入购物车并支付
4. 完成实名认证（必需）

### 域名规划

| 域名 | 用途 | 指向 |
|------|------|------|
| `prof-peng.team` | 主站 | FC 前端函数 |
| `www.prof-peng.team` | WWW | 重定向到主站 |
| `cms.prof-peng.team` | 后端 CMS | FC 后端函数 |
| `static.prof-peng.team` | 静态资源 | CDN（可选） |

## DNS 云解析

### 添加域名

1. 登录 [云解析 DNS](https://dns.console.aliyun.com)
2. 添加域名
3. 修改域名 DNS 服务器（如不是阿里云注册）

### 解析记录

#### 前端域名

```
主机记录: @
记录类型: CNAME
记录值: xxxxxxx.cn-chengdu.fc.aliyuncs.com
TTL: 10 分钟
```

#### WWW 重定向

```
主机记录: www
记录类型: CNAME
记录值: prof-peng.team
TTL: 10 分钟
```

#### 后端域名

```
主机记录: cms
记录类型: CNAME
记录值: xxxxxxx.cn-chengdu.fc.aliyuncs.com
TTL: 10 分钟
```

### 获取 FC 域名

1. 登录 FC 控制台
2. 进入函数详情
3. 查看"触发器" → "自定义域名"
4. 复制分配的域名

## SSL 证书

### 免费证书申请

阿里云每年提供 20 个免费 DV 证书。

1. 登录 [数字证书管理](https://yundunnext.console.aliyun.com)
2. 选择"免费证书"
3. 创建证书

### 申请步骤

#### 1. 填写信息

| 字段 | 值 |
|------|-----|
| 证书类型 | 免费版 DV SSL |
| 域名 | `prof-peng.team` |
| 域名验证方式 | DNS 验证 |
| 联系人邮箱 | your-email@example.com |

#### 2. DNS 验证

添加 TXT 记录：

```
主机记录: _dnsauth
记录类型: TXT
记录值: 202405xxxxxxxxxxxxxxxx
```

#### 3. 等待签发

- 验证通过后自动签发
- 通常几分钟内完成
- 收到邮件通知

### 多域名证书

如需一个证书覆盖多个子域名：

- 购买付费通配符证书 `*.prof-peng.team`
- 或分别申请免费证书

## 证书部署到 FC

### 方式一：控制台部署

1. 在 SSL 证书控制台找到已签发证书
2. 点击"部署"
3. 选择"云产品" → "函数计算"
4. 选择区域和函数
5. 确认部署

### 方式二：Serverless Devs

```yaml
# s.ci.yaml
fc3_domain_fe:
  component: fc3-domain
  props:
    region: ${vars.region}
    domainName: prof-peng.team
    protocol: HTTP,HTTPS
    certConfig:
      certId: 21130608  # 证书 ID
    routeConfig:
      routes:
        - path: /*
          functionName: ${vars.feFunctionName}
```

### 获取证书 ID

1. 在 SSL 证书控制台
2. 点击证书详情
3. 复制证书 ID（数字）

## HTTPS 配置

### 强制 HTTPS

在 FC 域名配置中启用：

```yaml
props:
  protocol: HTTPS  # 仅 HTTPS
```

或在应用层重定向：

```typescript
// middleware.ts
if (request.headers.get('x-forwarded-proto') !== 'https') {
  return NextResponse.redirect(
    `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
    301
  );
}
```

### HSTS

添加安全响应头：

```typescript
// next.config.ts
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains'
      }
    ]
  }
]
```

## 证书续期

### 免费证书

- 有效期 1 年
- 到期前 30 天可续期
- 续期需重新验证域名

### 自动续期

1. 购买付费证书（支持自动续期）
2. 或设置日历提醒手动续期

## 常见问题

### 证书验证失败

1. 检查 DNS TXT 记录是否正确
2. 等待 DNS 生效（最长 48 小时）
3. 使用 `dig` 命令验证：

```bash
dig TXT _dnsauth.prof-peng.team
```

### 证书不被信任

1. 确认使用完整证书链
2. 检查证书是否过期
3. 清除浏览器缓存

### 混合内容警告

页面 HTTPS 但加载 HTTP 资源：

1. 将所有资源 URL 改为 HTTPS
2. 使用协议相对 URL `//example.com/image.jpg`
