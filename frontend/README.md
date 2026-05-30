# 食堂点评 Frontend

校园食堂点评 Web App 第一版前端。当前版本是纯前端演示版，用于验证移动端页面结构、导航流程、食堂/窗口/菜品/评价交互，以及整体视觉风格。

## 当前阶段

第一版已完成：

- React + TypeScript + Vite 前端
- Tailwind CSS 4 主题样式
- React Router 页面路由
- Zustand 本地状态
- mock 食堂、窗口、菜品、评价、用户数据
- localStorage 持久化用户评价、收藏、浏览记录
- 移动端优先布局，最大宽度约 390px

当前仍然是纯前端版本：

- 暂无真实后端
- 暂无真实数据库
- 暂无真实登录注册
- 暂无图片上传
- 暂无管理后台

## 功能页面

- 首页：搜索、快速标签、菜品分类、热门推荐、菜品分页
- 排行榜：今日/本周、人气/出餐快/省钱、排行榜分页
- 食堂列表：展示所有 mock 食堂
- 食堂详情：展示食堂窗口与窗口菜品
- 菜品详情：展示菜品信息、历史评价、提交本地评价、收藏
- 我的：展示 mock 用户、我的收藏、浏览记录、我的评价

## 安装依赖

```bash
npm install
```

## 开发预览

```bash
npm run dev
```

> 第一版样式已通过开发预览人工验收。后续质量收尾阶段不把 `npm run dev` 作为必须重复执行的验收命令。

## 质量检查

生产构建：

```bash
npm run build
```

代码检查：

```bash
npm run lint
```

`npm run build` 会先运行 TypeScript 构建检查，再运行 Vite 生产打包。

## Android 手机预览（Capacitor）

首次接入后，常用命令如下：

```bash
npm run build
npx cap sync android
npx cap open android
```

如果已经配置了便捷脚本，也可以使用：

```bash
npm run cap:sync
npm run cap:open
```

Android Studio 打开后，可以选择安卓真机或模拟器运行。

真机预览要求：

1. 安卓手机开启开发者模式
2. 开启 USB 调试
3. 用数据线连接电脑
4. Android Studio 中选择设备并点击 Run
5. 手机端允许 USB 调试授权

## 第一版手动验收清单

- 首页能搜索和筛选菜品
- 首页分页按钮可正常切换
- 排行榜能切换时间和分类
- 排行榜分页按钮可正常切换
- 食堂列表能进入食堂详情
- 食堂详情能进入菜品详情
- 菜品详情能提交评价
- 提交评价后立即出现在评价列表
- 刷新后本地评价仍保留
- 收藏菜品后，我的页面能看到收藏
- 浏览菜品详情后，我的页面能看到浏览记录
- 底部 Tab 切换正常

## 下一阶段方向

当前计划先完成 Android Capacitor 手机预览。后续再设计真实后端：Express + TypeScript + Prisma + PostgreSQL。

## Android Studio 常见问题

如果 `npm run cap:open` 或 Android Studio 首次打开失败，优先检查环境：

- 是否已安装 Android Studio
- Android Studio SDK Manager 中是否安装 Android SDK Platform
- 是否安装 Android SDK Build-Tools
- 是否安装 Android SDK Platform-Tools
- 是否能完成 Gradle Sync
- 是否开启代理或镜像以保证 Gradle 依赖下载成功

首次 Gradle Sync 失败通常是本机 Android 环境或网络下载问题，不一定是前端代码问题。

如果安卓真机无法识别：

1. 确认手机已开启开发者模式
2. 确认已开启 USB 调试
3. 重新插拔 USB 数据线
4. 手机弹出 USB 调试授权时选择允许
5. 在 Android Studio 顶部设备列表中重新选择设备
