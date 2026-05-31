# Backend 开发指南

## 项目概述

食堂点评系统后端服务，提供 RESTful API 支持前端应用。

## 技术栈

- **运行时**: Node.js + Express 5
- **语言**: TypeScript (strict mode)
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: JWT (jsonwebtoken) + bcryptjs 密码加密
- **开发工具**: tsx (热重载)

## 目录结构

```
backend/
├── src/
│   ├── server.ts          # 入口文件，启动服务
│   ├── app.ts             # Express 配置，中间件和路由注册
│   ├── middleware/
│   │   └── auth.ts        # JWT 认证中间件
│   ├── utils/
│   │   ├── jwt.ts         # JWT 工具函数
│   │   └── password.ts    # 密码加密工具
│   ├── routes/
│   │   ├── auth.ts        # 认证路由 (注册/登录)
│   │   ├── users.ts       # 用户路由
│   │   ├── canteens.ts    # 食堂路由
│   │   ├── windows.ts     # 窗口路由
│   │   ├── dishes.ts      # 菜品路由
│   │   └── ranking.ts     # 排行榜路由
│   └── generated/prisma/  # Prisma 自动生成的客户端
├── prisma/
│   ├── schema.prisma      # 数据库模型定义
│   ├── seed.ts            # 种子数据
│   └── migrations/        # 数据库迁移
├── .env                   # 环境变量 (不提交到 git)
├── package.json
└── tsconfig.json
```

## 常用命令

```bash
# 开发模式 (热重载)
npm run dev

# 构建 TypeScript
npm run build

# 运行生产版本
npm start

# 数据库迁移
npx prisma migrate dev

# 生成 Prisma Client
npx prisma generate

# 填充种子数据
npx prisma seed

# 查看数据库 (Prisma Studio)
npx prisma studio
```

## 数据模型

### User (用户)
- id, email, password, nickname, avatar, bio
- 关联: reviews (多个评价)

### Canteen (食堂)
- id, name, description, floors, status, tags, location, cover, rating
- 关联: windows (多个窗口), dishes (多个菜品)

### Window (窗口)
- id, canteenId, name, floor, description, status, tags
- 关联: canteen (所属食堂), dishes (多个菜品)

### Dish (菜品)
- id, windowId, canteenId, name, category, price, description, image
- rating, reviewCount, speedScore, valueScore, popularity, tags
- 关联: window (所属窗口), canteen (所属食堂), reviews (多个评价)

### Review (评价)
- id, dishId, userId, rating, content, likes, createdAt
- 关联: dish (评价的菜品), user (评价的用户)

## API 路由

### 认证相关
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户相关 (需要认证)
- `GET /api/users/me` - 获取当前用户信息
- `GET /api/users/me/reviews` - 获取用户的评价列表

### 食堂相关
- `GET /api/canteens` - 获取所有食堂
- `GET /api/canteens/:id` - 获取食堂详情

### 窗口相关
- `GET /api/windows/:id` - 获取窗口详情

### 菜品相关
- `GET /api/dishes` - 菜品列表 (支持分页/筛选/搜索)
- `GET /api/dishes/:id` - 菜品详情
- `GET /api/dishes/:id/reviews` - 菜品评价列表
- `POST /api/dishes/:id/reviews` - 提交评价 (需要认证)

### 排行榜
- `GET /api/ranking` - 菜品排行 (支持 popularity/speed/value)

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 路由处理函数使用 async/await
- 错误统一使用 try/catch 捕获
- 返回格式统一使用 `{ success: boolean, data?: any, error?: string }`

### 认证中间件
- 需要认证的路由使用 `authMiddleware`
- Token 通过 `Authorization: Bearer <token>` 传递
- Token 有效期 7 天

### 数据库操作
- 使用 Prisma Client 进行数据库操作
- 复杂查询使用 `include` 或 `select` 优化
- 分页使用 `skip` 和 `take`

## 环境变量

```env
DATABASE_URL="postgresql://user:password@localhost:5432/canteen_review"
JWT_SECRET="your-secret-key"
PORT=3000
```

## 注意事项

1. **不要修改 frontend/ 目录** - 前后端分离，各司其职
2. **.env 文件不提交** - 包含敏感信息
3. **Prisma Client 位置** - 生成在 `src/generated/prisma/`
4. **Express 5 语法** - 路由参数使用 `req.params.id`，查询使用 `req.query`
5. **错误处理** - 所有路由都需要 try/catch，返回合适的 HTTP 状态码
