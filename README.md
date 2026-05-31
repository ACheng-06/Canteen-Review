# 🍽️ Canteen Review - 校园食堂点评应用

一个面向校园场景的食堂点评 Web App，支持移动端网页和 Android App。

## ✨ 功能特性

- 🏠 **首页** - 搜索、筛选、推荐菜品
- 🏆 **排行榜** - 人气/出餐快/省钱多维度榜单
- 🍜 **食堂浏览** - 食堂列表、窗口、菜品详情
- ⭐ **评价系统** - 1-5星评分、文字评价
- 👤 **个人中心** - 我的评价、收藏、浏览记录
- 📱 **移动优先** - 响应式设计，支持 Android 打包

## 🛠️ 技术栈

### 前端

- **React 19** + TypeScript
- **Vite 8** (bundler: rolldown)
- **Tailwind CSS 4** - 样式系统
- **react-router-dom 7** - 路由管理
- **Zustand** - 状态管理
- **Axios** - HTTP 请求
- **Capacitor 7** - Android 打包

### 后端

- **Express 5** + TypeScript
- **Prisma ORM** - 数据库 ORM
- **PostgreSQL** - 数据库
- **JWT** - 用户认证
- **bcryptjs** - 密码加密

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- PostgreSQL >= 14
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目**

```bash
git clone https://github.com/ACheng-06/Canteen-Review.git
cd canteen-review
```

2. **安装后端依赖**

```bash
cd backend
npm install
```

3. **配置环境变量**

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等
```

4. **数据库迁移**

```bash
npx prisma migrate dev
npx prisma seed  # 填充种子数据
```

5. **启动后端服务**

```bash
npm run dev
```

6. **安装前端依赖**

```bash
cd ../frontend
npm install
```

7. **启动前端开发服务器**

```bash
npm run dev
```

8. **访问应用**

- 前端: http://localhost:5173
- 后端 API: http://localhost:3000

## 📁 项目结构

```
canteen-review/
├── frontend/              # 前端应用
│   ├── src/
│   │   ├── api/          # API 请求封装
│   │   ├── components/   # 可复用组件
│   │   ├── layouts/      # 布局组件
│   │   ├── mock/         # 测试用 mock 数据 ⚠️
│   │   ├── pages/        # 页面组件
│   │   ├── router/       # 路由配置
│   │   ├── stores/       # Zustand 状态管理
│   │   ├── styles/       # 全局样式
│   │   ├── types/        # TypeScript 类型
│   │   └── utils/        # 工具函数
│   └── package.json
├── backend/               # 后端服务
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── middleware/   # 中间件
│   │   └── utils/        # 工具函数
│   ├── prisma/           # 数据库模型和迁移
│   └── package.json
└── README.md
```

> ⚠️ **注意**: `frontend/src/mock/` 目录包含测试用的 mock 数据，仅用于开发调试，不包含在生产环境中。

## 🎨 设计风格

采用 **Neo-Brutalist Pop-Art** 风格：

- 粗黑描边 + 错位阴影
- 胶囊状标签
- 弹性交互动效
- 移动端优先，最大宽度 390px

## 📱 Android 打包

```bash
cd frontend

# 构建前端
npm run build

# 同步到 Capacitor
npx cap sync android

# 打开 Android Studio
npx cap open android
```

## 🔧 开发命令

```bash
# 前端开发
cd frontend
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npx tsc --noEmit     # 类型检查

# 后端开发
cd backend
npm run dev          # 启动开发服务器（热重载）
npm run build        # 构建 TypeScript
npx prisma studio    # 打开数据库管理界面
npx prisma migrate dev  # 运行数据库迁移
```

## 📄 API 文档

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户相关

- `GET /api/users/me` - 获取当前用户信息
- `GET /api/users/me/reviews` - 获取用户评价列表

### 食堂相关

- `GET /api/canteens` - 获取所有食堂
- `GET /api/canteens/:id` - 获取食堂详情

### 菜品相关

- `GET /api/dishes` - 菜品列表（支持分页/筛选/搜索）
- `GET /api/dishes/:id` - 菜品详情
- `GET /api/dishes/:id/reviews` - 菜品评价列表
- `POST /api/dishes/:id/reviews` - 提交评价

### 排行榜

- `GET /api/ranking` - 菜品排行（支持 popularity/speed/value）

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📝 更新日志

### v1.0.0 (2026-05-31)

- ✨ 初始版本发布
- 🎨 Neo-Brutalist Pop-Art 设计风格
- 📱 移动端优先的响应式布局
- ⭐ 完整的评价系统
- 🏆 多维度排行榜

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👨‍💻 作者

- **JinCheng-06** - [GitHub](https://github.com/JinCheng-06)

## 🙏 致谢

- 感谢所有贡献者的支持
- 灵感来源于校园食堂的真实需求
