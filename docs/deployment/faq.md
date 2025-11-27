# 常见问题

## 构建问题

### Q: pnpm install 报错

**A:** 尝试清除缓存重新安装：

```bash
pnpm store prune
rm -rf node_modules packages/*/node_modules
pnpm install
```

### Q: Next.js 构建失败

**A:** 检查以下几点：

1. 环境变量是否正确配置
2. TypeScript 类型错误
3. 清除 `.next` 缓存

```bash
rm -rf packages/frontend/.next
pnpm frontend:build
```

### Q: Strapi 构建失败

**A:** 检查数据库连接和环境变量：

```bash
rm -rf packages/backend/.cache packages/backend/dist
pnpm backend:build
```

## 部署问题

### Q: GitHub Actions 部署失败

**A:** 检查：

1. GitHub Secrets 是否正确配置
2. 阿里云 AccessKey 权限
3. 查看 Actions 日志定位错误

### Q: 函数计算冷启动慢

**A:** 已配置预留实例 (`provisionConfig.target: 1`)，确保始终有一个实例运行。

### Q: 域名无法访问

**A:** 检查：

1. 域名解析是否正确
2. SSL 证书是否有效
3. FC 域名配置是否正确

## 开发问题

### Q: 前端获取不到数据

**A:** 检查：

1. Strapi 是否启动
2. `NEXT_PUBLIC_STRAPI_URL` 是否正确
3. Strapi Public 角色权限是否开启

### Q: 图片无法显示

**A:** 检查：

1. OSS 配置是否正确
2. 图片 URL 是否完整
3. `next.config.ts` 的 `remotePatterns` 配置

### Q: 国际化不生效

**A:** 检查：

1. Cookie `NEXT_LOCALE` 是否设置
2. `messages/` 目录下翻译文件是否存在
3. 组件是否正确使用 `useTranslations` 或 `getTranslations`

## Strapi 问题

### Q: status 字段报错

**A:** Strapi 保留了 `status` 字段名，使用 `status_field` 替代。

### Q: 管理面板打不开

**A:** 检查：

1. 端口 1337 是否被占用
2. 数据库是否正常连接
3. 查看 Strapi 启动日志

### Q: API 返回 403

**A:** 在 Strapi 管理面板配置 Public 角色权限：

Settings → Users & Permissions → Roles → Public → 勾选需要的权限
