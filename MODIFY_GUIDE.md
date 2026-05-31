# 网站修改指南

## 目录

- [文字/界面内容修改](#1-文字界面内容修改)
- [添加新页面](#2-添加新页面)
- [发布新文章](#3-发布新文章)
- [配置 Memos API](#4-配置-memos-api)
- [配置 Giscus 评论](#5-配置-giscus-评论)
- [修改配色/样式](#6-修改配色样式)
- [修改个人信息](#7-修改个人信息)
- [部署到 GitHub Pages](#8-部署到-github-pages)
- [常见文件对应表](#常见文件对应表)

---

## 1. 文字/界面内容修改

### 网站标题

文件：`src/components/Header.astro` 第 7 行
```
const { title = "数字花园" } = Astro.props;
```
改为：
```
const { title = "Digital Garden" } = Astro.props;
```

### 导航菜单

文件：`src/components/Header.astro` 第 30-33 行
```html
<a href="/" class="nav-link active">首页</a>
<a href="/blog" class="nav-link">文章</a>
<a href="/thoughts" class="nav-link">动态</a>
<a href="/about" class="nav-link">关于</a>
```
改为你想要的任何文字，比如英文：
```html
<a href="/" class="nav-link active">Home</a>
<a href="/blog" class="nav-link">Blog</a>
<a href="/thoughts" class="nav-link">Thoughts</a>
<a href="/about" class="nav-link">About</a>
```

### 首页 Hero 区域

文件：`src/pages/index.astro` 第 25-26 行
```html
<h1 class="hero-title">数字花园</h1>
<p class="hero-desc">记录知识、思考与日常。一个持续生长的个人知识空间。</p>
```

### 页脚

文件：`src/components/Footer.astro` 第 8 行
```html
<p>&copy; {currentYear} <span>数字花园</span> &middot; 用 ❤️ 和 Astro 构建 &middot; 托管于 GitHub Pages</p>
```

### 关于页

文件：`src/pages/about.astro` 第 7-43 行，修改所有文字内容。

### 文章列表页标题

文件：`src/pages/blog/index.astro` 第 12 行 "文章" → "Blog"
文件：`src/pages/thoughts/index.astro` 第 12 行 "动态" → "Thoughts"

### 每页的 `<title>` 标签

每个页面的 `<Layout title="...">` 会同时设置浏览器标签页的标题和 Open Graph 标题。

---

## 2. 添加新页面

### 方法：在 `src/pages/` 下创建 `.astro` 文件

Astro 基于文件路由：
- `src/pages/xxx.astro` → 访问 `/xxx`
- `src/pages/xxx/index.astro` → 访问 `/xxx`

**示例：添加一个 "Projects" 页面**

1. 创建文件 `src/pages/projects.astro`：

```astro
---
import Layout from "../components/Layout.astro";
---

<Layout title="Projects — Digital Garden" description="My projects">
  <div class="container">
    <header class="page-header reveal">
      <h1>Projects</h1>
      <p class="page-desc">Things I've built</p>
    </header>

    <div class="prose">
      <p>Coming soon...</p>
    </div>
  </div>
</Layout>

<style>
  .page-header {
    margin-bottom: 2rem;
  }
  .page-header h1 {
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  .page-desc {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
</style>
```

2. 在导航栏 `src/components/Header.astro` 中添加链接：
```html
<a href="/projects" class="nav-link">Projects</a>
```

---

## 3. 发布新文章

### 步骤

1. 在 `src/content/blog/` 下创建 `.md` 或 `.mdx` 文件
2. 文件名格式：`YYYY-MM-DD-slug.md`（如 `2025-06-01-my-post.md`）

### Markdown 文件格式

```markdown
---
title: "文章标题"
description: "简短描述（会显示在文章列表卡片上）"
date: 2025-06-01
tags: ["Python", "教程"]
draft: false
---

这里是文章正文，支持 **Markdown** 语法。

## 二级标题

代码块（自动高亮）：
```python
def hello():
    print("Hello World")
```

数学公式：
行内 $E = mc^2$
块级 $$\int_0^\infty e^{-x} dx = 1$$
```

- `draft: true` 的文章不会出现在列表中（草稿模式）
- `tags` 可选，用于分类
- 支持 `.md` 和 `.mdx` 两种格式

### 文章中的代码和公式

- **代码高亮**：自动识别语言，用 ` ```python ` 等标记
- **数学公式**：自动 KaTeX 渲染，行内 `$...$`，块级 `$$...$$`
- 无需额外配置，开箱即用

---

## 4. 配置 Memos API

### 部署 Memos

在任意服务器上 Docker 部署：
```bash
docker run -d --name memos -p 5230:5230 -v ~/.memos:/var/opt/memos neosmemo/memos:latest
```

### 配置环境变量

**本地开发**：创建 `.env` 文件（项目根目录）
```
PUBLIC_MEMOS_HOST=https://your-memos-server.com
```

**生产部署（GitHub Actions）**：
在 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret：
- Name: `PUBLIC_MEMOS_HOST`
- Value: `https://your-memos-server.com`

### 代码位置

API 客户端：`src/lib/memos.ts`

使用页面的位置：
- `src/pages/index.astro` 第 15 行 —— 首页"最近动态"
- `src/pages/thoughts/index.astro` 第 8 行 —— 动态时间轴页面

**如果 Memos 服务不可用**，系统会自动使用模拟数据，不会导致构建失败。

### 如果不想部署 Memos

可以先不配置，网站正常使用，动态区会显示模拟数据。你也可以：
- 切换到 GitHub Issues 方案：`src/lib/memos.ts` 中有备用的 `fetchMemos` 函数
- 改为纯静态：直接在组件中写死数据

---

## 5. 配置 Giscus 评论

文件：`src/components/Giscus.astro` 第 23-26 行

```typescript
const {
  repo = "shucheng/mywebsite",  // ← 改为你的 GitHub 仓库
  repoId = "",                    // ← 填入 repo ID
  category = "Announcements",     // ← 填入 Discussions 分类名
  categoryId = "",                // ← 填入分类 ID
```

### 获取这些值

1. 访问 https://giscus.app
2. 填入你的仓库名
3. 选择 "Announcements" 或新建一个 Discussions 分类
4. 页面会自动生成 `repoId` 和 `categoryId`
5. 把值填到上面的文件中

**配置好之前**评论区域不会显示，不影响网站其他功能。

---

## 6. 修改配色/样式

### CSS 变量（全局配色）

文件：`src/styles/global.css` 第 3-26 行

```css
:root {
  --bg-base: #1a1b2e;       /* 主背景色 */
  --bg-surface: #232440;    /* 卡片背景色 */
  --bg-elevated: #2b2d4a;   /* 更高层级背景 */
  --text-primary: #e8e6f0;  /* 主文字色 */
  --text-secondary: #b4b2c4;/* 次要文字色 */
  --text-muted: #78778a;    /* 弱化文字色 */
  --accent: #a78bfa;        /* 主题色（紫色） */
  --accent-hover: #c4b5fd;  /* 主题色 hover */
  --warm: #f59e0b;          /* 暖色点缀 */
  --teal: #2dd4bf;          /* 青色点缀 */
  --rose: #fb7185;          /* 粉色点缀 */
  --sky: #7dd3fc;           /* 天蓝点缀 */
  /* ... */
}
```

只改这里就能调整全站配色。

### 字体

`--font-sans` 和 `--font-mono` 定义了中英文默认字体和等宽字体。

---

## 7. 修改个人信息

文件：`src/pages/about.astro`

- 头像、名字、简介在第 9-12 行
- 正文在第 14-40 行
- 社交媒体链接在第 42-47 行

```html
<a href="mailto:your-email@example.com" class="social-link">📧 Email</a>
<a href="https://github.com/你的用户名" class="social-link">🐙 GitHub</a>
```

---

## 8. 部署到 GitHub Pages

### 一次性配置

1. 在 GitHub 创建仓库（如 `mywebsite` 或 `<username>.github.io`）
2. 推送代码：
   ```bash
   git init
   git add .
   git commit -m "初始化数字花园"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```
3. 在 GitHub 仓库 → Settings → Pages → Source 选择 "GitHub Actions"
4. 如果使用自定义域名，开启 Settings → Pages → Custom domain
5. 记得在 `astro.config.mjs` 中修改 `site`：
   ```js
   site: "https://你的域名或username.github.io",
   ```

### 自动构建

推送代码后 GitHub Actions 会自动构建部署。工作流文件在 `.github/workflows/deploy.yml`。
**也设置了每 30 分钟自动构建一次**（用于同步 Memos 动态）。

---

## 常见文件对应表

| 你想改的 | 去哪改 |
|----------|--------|
| 网站标题/Logo 文字 | `src/components/Header.astro` |
| 导航菜单文字 | `src/components/Header.astro` |
| 页脚文字 | `src/components/Footer.astro` |
| 首页内容 | `src/pages/index.astro` |
| 关于页所有内容 | `src/pages/about.astro` |
| 文章列表页 | `src/pages/blog/index.astro` |
| 动态页面 | `src/pages/thoughts/index.astro` |
| 文章详情页布局 | `src/pages/blog/[...slug].astro` |
| 文章卡片样式 | `src/components/BlogCard.astro` |
| 时间轴样式 | `src/components/ThoughtTimeline.astro` |
| 全站配色/字体 | `src/styles/global.css` |
| 全局布局（HTML 结构） | `src/components/Layout.astro` |
| Memos API 逻辑 | `src/lib/memos.ts` |
| Giscus 评论配置 | `src/components/Giscus.astro` |
| Memos 地址 | `.env`（本地）/ GitHub Secrets（线上） |
| Astro 构建配置 | `astro.config.mjs` |
| GitHub Actions 部署 | `.github/workflows/deploy.yml` |
| 写新文章 | `src/content/blog/` 目录下新建 `.md` 文件 |
| RSS 配置 | `src/pages/rss.xml.js` |
