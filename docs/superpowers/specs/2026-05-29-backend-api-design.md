# Backend API Design Spec

## 1. 概述

为食堂点评 Web App 第二阶段构建后端服务。目标：将前端 mock 数据替换为真实 API，实现用户注册登录、评价持久化、跨用户数据共享。

### 1.1 范围

**MVP 必做：**
- Express + TypeScript 后端服务
- Prisma ORM + PostgreSQL 数据库
- JWT 用户认证（注册/登录）
- 食堂/窗口/菜品/评价 RESTful API
- 排行榜后端聚合查询
- 种子数据（迁移现有 mock 数据）
- 前端对接改造（axios 替换 mock）

**MVP 不做：**
- 图片上传（继续使用占位图/静态 URL）
- 管理后台（手动操作数据库或 seed 脚本）
- 收藏后端化（继续 localStorage）
- 浏览记录后端化（继续 localStorage）
- 点赞功能（Review likes 字段暂不交互）
- 评论回复
- Capacitor 打包

### 1.2 技术栈

| 技术 | 用途 |
|------|------|
| Node.js + Express | 后端 Web 框架 |
| TypeScript | 类型安全 |
| Prisma | ORM |
| PostgreSQL | 关系型数据库 |
| JWT | 认证令牌 |
| bcrypt | 密码哈希 |
| axios | 前端 HTTP 客户端 |

---

## 2. 数据模型

### 2.1 Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  nickname  String
  avatar    String   @default("🧑‍🍳")
  bio       String   @default("")
  reviews   Review[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Canteen {
  id          String   @id @default(cuid())
  name        String
  description String
  floors      Int
  status      String   @default("open")
  tags        String[]
  location    String
  cover       String   @default("")
  rating      Float    @default(0)
  windows     Window[]
  dishes      Dish[]
}

model Window {
  id          String   @id @default(cuid())
  canteenId   String
  canteen     Canteen  @relation(fields: [canteenId], references: [id])
  name        String
  floor       Int
  description String
  status      String   @default("open")
  tags        String[]
  dishes      Dish[]
}

model Dish {
  id           String   @id @default(cuid())
  windowId     String
  window       Window   @relation(fields: [windowId], references: [id])
  canteenId    String
  canteen      Canteen  @relation(fields: [canteenId], references: [id])
  name         String
  category     String
  price        Float
  description  String
  image        String   @default("/images/dish-placeholder.svg")
  rating       Float    @default(0)
  reviewCount  Int      @default(0)
  speedScore   Float    @default(0)
  valueScore   Float    @default(0)
  popularity   Int      @default(0)
  tags         String[]
  reviews      Review[]
}

model Review {
  id        String   @id @default(cuid())
  dishId    String
  dish      Dish     @relation(fields: [dishId], references: [id])
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  rating    Int
  content   String
  likes     Int      @default(0)
  createdAt DateTime @default(now())
}
```

### 2.2 实体关系

```
Canteen 1 --< N Window 1 --< N Dish >-- N Review >-- 1 User
```

- Canteen 通过 Window 和 Dish 两级关联到 Review
- Dish 的 `rating`/`reviewCount`/`speedScore`/`valueScore`/`popularity` 由后端在 Review 写入时自动聚合计算
- `windowCount` 不存表，由 Window 表 COUNT 派生

---

## 3. API 设计

### 3.1 统一响应格式

```json
// 成功
{ "data": { ... } }

// 列表
{ "data": [...], "total": 100, "page": 1, "limit": 10 }

// 错误
{ "error": "错误信息" }
```

### 3.2 HTTP 状态码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 / token 过期 |
| 404 | 资源不存在 |
| 409 | 冲突（如邮箱已注册） |
| 500 | 服务器内部错误 |

### 3.3 认证接口

#### POST /api/auth/register

注册新用户。

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "吃货小王"
}
```

**成功响应 (201)：**
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "clxxx...",
      "email": "user@example.com",
      "nickname": "吃货小王",
      "avatar": "🧑‍🍳",
      "bio": ""
    }
  }
}
```

**错误响应：**
- `400` — 缺少必填字段
- `409` — 邮箱已注册

#### POST /api/auth/login

**请求体：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功响应 (200)：** 同注册响应格式

**错误响应：**
- `401` — 邮箱或密码错误

#### GET /api/users/me

获取当前登录用户信息。

**请求头：**
```
Authorization: Bearer <token>
```

**成功响应 (200)：**
```json
{
  "data": {
    "id": "clxxx...",
    "email": "user@example.com",
    "nickname": "吃货小王",
    "avatar": "🧑‍🍳",
    "bio": "探索校园每一道美食",
    "createdAt": "2026-05-29T12:00:00.000Z"
  }
}
```

**错误响应：**
- `401` — 未认证

### 3.4 食堂/窗口/菜品接口（只读）

#### GET /api/canteens

食堂列表。

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "...",
      "name": "一餐厅",
      "description": "...",
      "floors": 2,
      "status": "open",
      "tags": ["品种多", "性价比高"],
      "location": "校园中心广场东侧",
      "cover": "",
      "rating": 4.2,
      "windowCount": 4
    }
  ]
}
```

#### GET /api/canteens/:id

食堂详情，包含窗口列表。

**成功响应 (200)：**
```json
{
  "data": {
    "id": "...",
    "name": "一餐厅",
    "description": "...",
    "floors": 2,
    "status": "open",
    "tags": ["品种多", "性价比高"],
    "location": "校园中心广场东侧",
    "cover": "",
    "rating": 4.2,
    "windows": [
      {
        "id": "...",
        "name": "家常菜窗口",
        "floor": 1,
        "description": "...",
        "status": "open",
        "tags": ["现炒", "家常"]
      }
    ]
  }
}
```

**错误响应：**
- `404` — 食堂不存在

#### GET /api/windows/:id

窗口详情，包含菜品列表。

**成功响应 (200)：**
```json
{
  "data": {
    "id": "...",
    "name": "家常菜窗口",
    "floor": 1,
    "description": "...",
    "status": "open",
    "tags": ["现炒", "家常"],
    "canteenId": "...",
    "dishes": [
      {
        "id": "...",
        "name": "红烧肉",
        "category": "热菜",
        "price": 12,
        "description": "...",
        "image": "/images/dish-placeholder.svg",
        "rating": 4.6,
        "reviewCount": 48,
        "tags": ["招牌", "下饭"]
      }
    ]
  }
}
```

**错误响应：**
- `404` — 窗口不存在

#### GET /api/dishes/:id

菜品详情。

**成功响应 (200)：**
```json
{
  "data": {
    "id": "...",
    "name": "红烧肉",
    "category": "热菜",
    "price": 12,
    "description": "...",
    "image": "/images/dish-placeholder.svg",
    "rating": 4.6,
    "reviewCount": 48,
    "speedScore": 4.2,
    "valueScore": 4.5,
    "popularity": 95,
    "tags": ["招牌", "下饭"],
    "windowId": "...",
    "windowName": "家常菜窗口",
    "canteenId": "...",
    "canteenName": "一餐厅"
  }
}
```

**错误响应：**
- `404` — 菜品不存在

#### GET /api/dishes/:id/reviews

菜品评价列表（分页）。

**查询参数：**
- `page` — 页码，默认 1
- `limit` — 每页条数，默认 10

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "...",
      "rating": 5,
      "content": "红烧肉真的绝了！",
      "likes": 12,
      "createdAt": "2026-05-28T12:30:00.000Z",
      "userId": "...",
      "userName": "吃货小王",
      "userAvatar": "🧑‍🍳"
    }
  ],
  "total": 20,
  "page": 1,
  "limit": 10
}
```

### 3.5 评价接口（需登录）

#### POST /api/dishes/:id/reviews

提交评价。

**请求头：**
```
Authorization: Bearer <token>
```

**请求体：**
```json
{
  "rating": 5,
  "content": "很好吃"
}
```

**成功响应 (201)：**
```json
{
  "data": {
    "id": "...",
    "rating": 5,
    "content": "很好吃",
    "likes": 0,
    "createdAt": "2026-05-29T12:00:00.000Z",
    "userId": "...",
    "userName": "吃货小王",
    "userAvatar": "🧑‍🍳"
  }
}
```

**错误响应：**
- `400` — rating 必须为 1-5
- `401` — 未认证
- `404` — 菜品不存在

### 3.6 排行榜接口（只读）

#### GET /api/ranking

**查询参数：**
- `category` — 排行类别：`popularity` | `speed` | `value`，默认 `popularity`
- `period` — 时间范围：`today` | `week`，默认 `today`
- `limit` — 返回条数，默认 30

**成功响应 (200)：**
```json
{
  "data": [
    {
      "id": "...",
      "name": "兰州牛肉面",
      "category": "面食",
      "price": 15,
      "rating": 4.8,
      "reviewCount": 62,
      "speedScore": 4.0,
      "valueScore": 4.5,
      "popularity": 99,
      "image": "/images/dish-placeholder.svg",
      "canteenName": "民族餐厅",
      "windowName": "拉面窗口"
    }
  ]
}
```

---

## 4. 认证方案

### 4.1 JWT 实现

- 注册/登录成功后返回 JWT token
- Token 有效期：7 天
- Token 载荷：`{ userId, email }`
- 密钥：环境变量 `JWT_SECRET`

### 4.2 密码安全

- 使用 bcrypt 哈希密码，salt rounds = 10
- 数据库只存哈希后的密码

### 4.3 前端认证流程

1. 用户在登录/注册页提交表单
2. 前端调用 API，收到 token
3. Token 存入 localStorage
4. axios 拦截器自动在请求头附加 `Authorization: Bearer <token>`
5. 401 响应时清除 token，跳转登录页

---

## 5. 前端改造

### 5.1 新增文件

```
/frontend/src
  /api
    client.ts       # axios 实例（baseURL、token 拦截器）
    auth.ts         # register、login、getMe
    canteens.ts     # getCanteens、getCanteenById
    windows.ts      # getWindowById
    dishes.ts       # getDishById、getDishReviews、submitReview
    ranking.ts      # getRanking
  /stores
    useAuthStore.ts # 认证状态（token、用户、登录/退出）
  /pages
    LoginPage.tsx   # 登录页
    RegisterPage.tsx # 注册页
```

### 5.2 改造范围

**直接替换（读取 mock → 调 API）：**
- 首页：食堂列表、菜品列表
- 排行榜：从 API 获取排行数据
- 食堂列表/详情：从 API 获取
- 菜品详情：从 API 获取菜品信息 + 评价列表

**保持 localStorage：**
- 收藏（useFavoriteStore）
- 浏览记录（useHistoryStore）

**需要改造：**
- 提交评价：从写 localStorage 改为 POST /api/dishes/:id/reviews
- 用户信息：从 mock currentUser 改为 GET /api/users/me
- 新增登录/注册页面

### 5.3 认证状态管理

useAuthStore：
- `token` — JWT token（同步写入 localStorage）
- `user` — 当前用户信息
- `login(email, password)` — 调用 API 登录
- `register(email, password, nickname)` — 调用 API 注册
- `logout()` — 清除 token 和用户信息
- `fetchMe()` — 用 token 获取用户信息

### 5.4 前端路由变化

新增路由：
- `/login` — 登录页
- `/register` — 注册页

未登录时访问"我的"页面，跳转到登录页。

---

## 6. 种子数据

将当前 mock 数据迁移为 Prisma seed 脚本：

- 3 个食堂（一餐厅、二餐厅、民族餐厅）
- 10 个窗口
- 30 个菜品
- 2 个测试用户（密码 bcrypt 哈希）
- 20 条历史评价

运行方式：`npx prisma db seed`

---

## 7. 后端目录结构

```
/backend
  /src
    /routes
      auth.ts         # 认证路由
      canteens.ts     # 食堂路由
      windows.ts      # 窗口路由
      dishes.ts       # 菜品路由
      ranking.ts      # 排行榜路由
      users.ts        # 用户路由
    /middleware
      auth.ts         # JWT 认证中间件
    /utils
      jwt.ts          # JWT 工具函数
      password.ts     # 密码哈希工具函数
    app.ts            # Express 应用配置
    server.ts         # 服务器启动入口
  /prisma
    schema.prisma     # 数据模型定义
    seed.ts           # 种子数据脚本
  .env                # 环境变量（DATABASE_URL, JWT_SECRET）
  package.json
  tsconfig.json
```

---

## 8. 验收标准

### 后端验收

- `npm run build` 通过
- `npx prisma migrate dev` 建表成功
- `npx prisma db seed` 种子数据写入成功
- `npm run dev` 启动服务器
- 所有 API 端点返回正确数据

### 前端验收

- 登录/注册页面可操作
- 登录后 token 持久化，刷新不丢失
- 首页/排行榜/食堂/菜品详情数据从 API 加载
- 提交评价后立即出现在评价列表
- 退出登录后跳转到登录页
- 收藏/浏览记录继续 localStorage 工作

---

## 9. Self-Review Checklist

- [x] 覆盖所有前端页面的数据需求
- [x] API 设计与前端 mock 数据模型一致
- [x] 认证流程完整（注册/登录/token/中间件）
- [x] 种子数据覆盖现有 mock 数据
- [x] 明确 MVP 不做的功能
- [x] 错误处理统一
- [x] 无 TBD/TODO/占位内容
