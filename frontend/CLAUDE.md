# Canteen Review — Frontend

校园食堂点评应用前端。

## 技术栈

- React 19 + TypeScript
- Vite 8（bundler 为 rolldown）
- Tailwind CSS 4（`@import "tailwindcss"` + `@theme` 定义 token）
- react-router-dom 7（`createBrowserRouter`）
- Zustand（状态管理，stores/ 目录）
- Axios（API 请求，api/ 目录）
- Capacitor 7（Android 打包）

## 目录结构

```
frontend/src/
├── api/          # Axios 请求封装
├── assets/       # 静态资源
├── components/   # 可复用组件（DishCard, CanteenCard, StarRating, ReviewForm 等）
├── layouts/      # 布局组件（MainLayout 含底部导航）
├── pages/        # 页面组件（HomePage, ProfilePage, DishDetailPage 等）
├── router/       # 路由配置
├── stores/       # Zustand store
├── styles/       # 全局样式（global.css）
├── types/        # TypeScript 类型定义
└── utils/        # 工具函数
```

## 设计系统：Neo-Brutalist Pop-Art

所有 UI 必须遵循这套视觉风格，详见 `styles/global.css` 的 `@theme` 块。

### 核心 token

| token | 值 | 用途 |
|-------|------|------|
| `--color-ink` | #172033 | 边框、深色文字、深色头部背景 |
| `--color-paper` | #FFFDF7 | 页面背景 |
| `--color-bg` | #F7F8FA | 输入框、次级背景 |
| `--color-shadow-blue` | #DCE7F5 | 默认卡片阴影色 |

### 卡片风格

- 边框：`3px solid var(--color-ink)`
- 圆角：`22px`（卡片）/ `20px`（按钮）/ `28px`（Hero）
- 阴影：`7px 7px 0 var(--color-shadow-blue)`（偏移阴影，颜色随语义变）
- 按压反馈：`scale(0.95)` + 阴影收缩，弹性缓动 `cubic-bezier(0.34, 1.56, 0.64, 1)`

### 字体

- 系统字体栈，不引入外部字体
- 标题用 `font-black`（900），正文用 `font-bold`（700）

### 图标

- 当前用 emoji 作为占位（后续应替换为 SVG 图标库）
- **不要引入新的 emoji 作为结构性图标**

## 代码规范

### 文件格式

- 每个页面/组件一个文件，不拆分子文件夹
- LF 换行符（不要 CRLF）—— Vite 的 rolldown bundler 对 CRLF 敏感

### 样式写法

- Tailwind utility class 处理布局、间距、排版
- `style` prop 处理引用 CSS 变量的值（颜色、圆角、阴影）
- 不用 CSS Modules、styled-components、行内 `@keyframes`（动画放 global.css）

```tsx
// ✅ 正确
<div
  className="p-4 mt-4"
  style={{
    border: '3px solid var(--color-ink)',
    borderRadius: '22px',
    boxShadow: '7px 7px 0 var(--color-shadow-blue)',
  }}
>

// ❌ 错误：不要在 style 里写死颜色
<div style={{ border: '3px solid #172033' }}>
```

### 交互模式

- 按压反馈用 JS 事件（`onMouseDown`/`onMouseUp`/`onMouseLeave` + `onTouchStart`/`onTouchEnd`）
- 移动端必须同时绑定 touch 事件，否则触摸无反馈
- 弹性缓动用 `cubic-bezier(0.34, 1.56, 0.64, 1)`

### 安全区域

- 有深色头部的页面（ProfilePage、DishDetailPage、CanteenDetailPage）用 `paddingTop: 'max(Npx, calc(env(safe-area-inset-top, 0px) + Npx))'` 延伸到安全区
- 浅色首页用 `.safe-area-top` CSS 类

### 状态管理

- Zustand store 放 `stores/`，每个 store 一个文件
- 用 `useXxxStore((s) => s.xxx)` 选择器避免不必要的重渲染

### API 请求

- 封装在 `api/` 目录，使用 Axios
- 基础 URL 配置在 Axios 实例中

### 路由

- `router/index.tsx` 定义路由表
- MainLayout 包裹所有页面，底部导航在 MainLayout 中
- 详情页（`/canteens/:id`、`/dishes/:id`）隐藏底部导航

## 构建与验证

```bash
# 类型检查
cd frontend && npx tsc --noEmit

# 生产构建
cd frontend && npx vite build

# 开发服务器
cd frontend && npx vite dev
```

修改代码后必须通过 `tsc --noEmit` 和 `vite build`。

## 注意事项

- `#root` 背景为 `transparent`，页面背景由各页面自己控制（body 为 `var(--color-paper)`）
- 公告跑马灯动画 `@keyframes marquee` 定义在 global.css，不要在组件内用 `<style>` 标签
- 搜索历史存储在 `localStorage`，key 为 `canteen_recent_searches`
- 不要修改 `backend/` 目录下的任何文件
