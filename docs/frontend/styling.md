# 样式系统

前端使用 TailwindCSS 4.x 作为样式框架。

## 配置

### `globals.css`

```css
@import "tailwindcss";
@plugin "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --border: oklch(0.922 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... */
}
```

## 常用类

### 布局

```html
<!-- 容器 -->
<div class="max-w-screen-xl mx-auto px-4 md:px-6">

<!-- Flex 布局 -->
<div class="flex items-center justify-between">

<!-- Grid 布局 -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
```

### 响应式

```html
<!-- 移动端隐藏，桌面端显示 -->
<div class="hidden md:flex">

<!-- 移动端显示，桌面端隐藏 -->
<div class="md:hidden">
```

### 间距

```html
<section class="py-16">      <!-- 上下 padding -->
<div class="mb-12">          <!-- 下边距 -->
<div class="space-y-4">      <!-- 子元素垂直间距 -->
```

### 文字

```html
<h2 class="text-3xl font-bold tracking-tight">
<p class="text-muted-foreground">
<span class="text-sm text-primary">
```

## shadcn/ui 组件

基于 Radix UI 的组件库，已配置：

- `Button` - 按钮
- `Card` - 卡片
- `Input` - 输入框
- `Label` - 标签
- `Select` - 选择器

### 使用示例

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

<Button variant="outline" size="sm">
  点击
</Button>

<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
  </CardHeader>
  <CardContent>内容</CardContent>
</Card>
```

## 工具函数

### cn - 类名合并

```typescript
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 使用
cn("px-4 py-2", isActive && "bg-primary", className)
```
