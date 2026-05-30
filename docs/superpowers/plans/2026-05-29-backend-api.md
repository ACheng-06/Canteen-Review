# Backend API Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为食堂点评 Web App 构建后端服务（Express + Prisma + PostgreSQL + JWT），并改造前端从 mock 数据切换到真实 API。

**Architecture:** 后端为 Express REST API，Prisma ORM 连接 PostgreSQL，JWT 认证。前端通过 axios + Vite proxy 调用后端 API，逐页替换 mock 数据。收藏和浏览记录继续 localStorage。

**Tech Stack:** Node.js, Express, TypeScript, Prisma, PostgreSQL, JWT, bcryptjs, axios

---

## File Structure

### 后端新增

```
backend/
  src/
    app.ts              # Express 应用配置
    server.ts           # 服务器启动入口
    routes/
      auth.ts           # 认证路由（注册/登录）
      users.ts          # 用户路由（me, my reviews）
      canteens.ts       # 食堂路由
      windows.ts        # 窗口路由
      dishes.ts         # 菜品路由（含评价）
      ranking.ts        # 排行榜路由
    middleware/
      auth.ts           # JWT 认证中间件
    utils/
      jwt.ts            # JWT 工具函数
      password.ts       # 密码哈希工具函数
  prisma/
    schema.prisma       # 数据模型
    seed.ts             # 种子数据
  .env                  # 环境变量
  package.json
  tsconfig.json
```

### 前端新增/修改

```
frontend/src/
  api/
    client.ts           # axios 实例
    auth.ts             # 认证 API
    canteens.ts         # 食堂 API
    dishes.ts           # 菜品 API
    ranking.ts          # 排行榜 API
  stores/
    useAuthStore.ts     # 认证状态管理
  pages/
    LoginPage.tsx       # 登录页（新建）
    RegisterPage.tsx    # 注册页（新建）
    HomePage.tsx        # 改造
    RankingPage.tsx     # 改造
    CanteenListPage.tsx # 改造
    CanteenDetailPage.tsx # 改造
    DishDetailPage.tsx  # 改造
    ProfilePage.tsx     # 改造
  router/index.tsx      # 添加登录/注册路由
  layouts/MainLayout.tsx # 登录/注册页隐藏 tab 栏
  vite.config.ts        # 添加 proxy 配置
```

---

## Task 1: 初始化后端项目

**Files:**
- Create: `backend/package.json`
- Create: `backend/tsconfig.json`
- Create: `backend/.env`
- Create: `backend/src/app.ts`
- Create: `backend/src/server.ts`
- Modify: `.gitignore`

- [ ] **Step 1: 创建后端目录并初始化**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
mkdir backend
cd backend
npm init -y
```

- [ ] **Step 2: 安装生产依赖**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npm install express @prisma/client jsonwebtoken bcryptjs cors dotenv
```

- [ ] **Step 3: 安装开发依赖**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npm install -D typescript tsx @types/express @types/jsonwebtoken @types/bcryptjs @types/cors prisma
```

- [ ] **Step 4: 创建 tsconfig.json**

Create `backend/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 5: 创建 .env**

Create `backend/.env`:

```
DATABASE_URL="postgresql://postgres:123456@localhost:5432/canteen_review"
JWT_SECRET="canteen-review-jwt-secret-2026"
PORT=3000
```

> 注意：把 `123456` 改成你本地 PostgreSQL 的实际密码。

- [ ] **Step 6: 创建 app.ts**

Create `backend/src/app.ts`:

```typescript
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// 路由将在后续任务中挂载
// app.use('/api/auth', authRoutes)
// app.use('/api/users', usersRoutes)
// app.use('/api/canteens', canteensRoutes)
// app.use('/api/windows', windowsRoutes)
// app.use('/api/dishes', dishesRoutes)
// app.use('/api/ranking', rankingRoutes)

// 健康检查
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
```

- [ ] **Step 7: 创建 server.ts**

Create `backend/src/server.ts`:

```typescript
import dotenv from 'dotenv'
dotenv.config()

import app from './app'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
```

- [ ] **Step 8: 配置 package.json scripts**

Modify `backend/package.json` scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  },
  "prisma": {
    "seed": "npx tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 9: 更新 .gitignore**

Append to `.gitignore`:

```
# Backend
backend/node_modules/
backend/.env
backend/dist/
```

- [ ] **Step 10: 验证项目结构**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx tsc --noEmit
```

Expected: 无错误。

- [ ] **Step 11: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/package.json backend/package-lock.json backend/tsconfig.json backend/src/ .gitignore
git commit -m "feat: initialize backend project with Express + TypeScript"
```

> 注意：不提交 `backend/.env`。

---

## Task 2: Prisma Schema 与数据库迁移

**Files:**
- Create: `backend/prisma/schema.prisma`

- [ ] **Step 1: 初始化 Prisma**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx prisma init
```

- [ ] **Step 2: 创建 schema.prisma**

Replace `backend/prisma/schema.prisma`:

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

- [ ] **Step 3: 创建数据库**

先确保 PostgreSQL 已运行，然后创建数据库：

```bash
psql -U postgres -c "CREATE DATABASE canteen_review;"
```

- [ ] **Step 4: 执行数据库迁移**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx prisma migrate dev --name init
```

Expected: 建表成功，生成 Prisma Client。

- [ ] **Step 5: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/prisma/
git commit -m "feat: add Prisma schema and initial migration"
```

---

## Task 3: 种子数据脚本

**Files:**
- Create: `backend/prisma/seed.ts`

- [ ] **Step 1: 创建 seed.ts**

Create `backend/prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 清空数据（按外键依赖倒序）
  await prisma.review.deleteMany()
  await prisma.dish.deleteMany()
  await prisma.window.deleteMany()
  await prisma.canteen.deleteMany()
  await prisma.user.deleteMany()

  // 创建用户
  const password = await bcrypt.hash('123456', 10)
  const user1 = await prisma.user.create({
    data: { email: 'xiaowang@test.com', password, nickname: '吃货小王', avatar: '🧑‍🍳', bio: '探索校园每一道美食 🍜' },
  })
  const user2 = await prisma.user.create({
    data: { email: 'xiaoli@test.com', password, nickname: '干饭人小李', avatar: '👨‍🎓', bio: '干饭不积极，思想有问题' },
  })

  // 创建食堂
  const canteen1 = await prisma.canteen.create({
    data: { id: 'c1', name: '一餐厅', description: '学校最大的综合食堂，菜品丰富，价格实惠', floors: 2, status: 'open', tags: ['品种多', '性价比高', '人流量大'], location: '校园中心广场东侧', rating: 4.2 },
  })
  const canteen2 = await prisma.canteen.create({
    data: { id: 'c2', name: '二餐厅', description: '环境优雅，特色小吃种类多', floors: 1, status: 'open', tags: ['环境好', '小吃多', '座位多'], location: '图书馆北侧', rating: 4.0 },
  })
  const canteen3 = await prisma.canteen.create({
    data: { id: 'c3', name: '民族餐厅', description: '提供清真及民族特色美食', floors: 1, status: 'open', tags: ['清真', '特色菜', '牛肉面'], location: '学生宿舍区南侧', rating: 4.5 },
  })

  // 创建窗口
  const windows = [
    { id: 'w1', canteenId: 'c1', name: '家常菜窗口', floor: 1, description: '每日现炒家常菜，妈妈的味道', tags: ['现炒', '家常'] },
    { id: 'w2', canteenId: 'c1', name: '面食窗口', floor: 1, description: '手工拉面、刀削面、拌面', tags: ['手工', '面食'] },
    { id: 'w3', canteenId: 'c1', name: '小吃窗口', floor: 2, description: '煎饼果子、烤冷面、炸串', tags: ['小吃', '快捷'] },
    { id: 'w4', canteenId: 'c1', name: '饮品窗口', floor: 2, description: '鲜榨果汁、奶茶、豆浆', tags: ['饮品', '鲜榨'] },
    { id: 'w5', canteenId: 'c2', name: '川湘菜窗口', floor: 1, description: '正宗川湘风味，辣得过瘾', tags: ['辣', '川湘'] },
    { id: 'w6', canteenId: 'c2', name: '蒸菜窗口', floor: 1, description: '健康蒸菜，少油少盐', tags: ['健康', '蒸菜'] },
    { id: 'w7', canteenId: 'c2', name: '凉菜窗口', floor: 1, description: '爽口凉菜，开胃必备', tags: ['凉菜', '开胃'] },
    { id: 'w8', canteenId: 'c3', name: '拉面窗口', floor: 1, description: '正宗兰州拉面，汤鲜面筋', tags: ['拉面', '清真'] },
    { id: 'w9', canteenId: 'c3', name: '烤肉窗口', floor: 1, description: '炭火烤肉，香气四溢', tags: ['烤肉', '清真'] },
    { id: 'w10', canteenId: 'c3', name: '特色菜窗口', floor: 1, description: '大盘鸡、手抓饭等民族特色', tags: ['特色', '大盘鸡'] },
  ]
  for (const w of windows) {
    await prisma.window.create({ data: w })
  }

  // 创建菜品
  const dishes = [
    { id: 'd1', windowId: 'w1', canteenId: 'c1', name: '红烧肉', category: '热菜', price: 12, description: '肥瘦相间，入口即化', rating: 4.6, reviewCount: 48, speedScore: 4.2, valueScore: 4.5, popularity: 95, tags: ['招牌', '下饭'] },
    { id: 'd2', windowId: 'w1', canteenId: 'c1', name: '番茄炒蛋', category: '热菜', price: 8, description: '家常味道，酸甜可口', rating: 4.3, reviewCount: 35, speedScore: 4.8, valueScore: 4.7, popularity: 88, tags: ['家常', '快手'] },
    { id: 'd3', windowId: 'w1', canteenId: 'c1', name: '宫保鸡丁', category: '热菜', price: 13, description: '花生酥脆，鸡丁嫩滑', rating: 4.4, reviewCount: 42, speedScore: 4.0, valueScore: 4.3, popularity: 82, tags: ['微辣', '经典'] },
    { id: 'd4', windowId: 'w1', canteenId: 'c1', name: '清炒时蔬', category: '热菜', price: 6, description: '每日新鲜蔬菜', rating: 4.0, reviewCount: 20, speedScore: 4.9, valueScore: 4.8, popularity: 60, tags: ['清淡', '健康'] },
    { id: 'd5', windowId: 'w2', canteenId: 'c1', name: '牛肉拉面', category: '面食', price: 14, description: '手工拉面，大块牛肉', rating: 4.7, reviewCount: 56, speedScore: 3.8, valueScore: 4.4, popularity: 98, tags: ['招牌', '必吃'] },
    { id: 'd6', windowId: 'w2', canteenId: 'c1', name: '刀削面', category: '面食', price: 12, description: '刀削面配卤汁', rating: 4.3, reviewCount: 30, speedScore: 3.5, valueScore: 4.5, popularity: 72, tags: ['劲道', '饱腹'] },
    { id: 'd7', windowId: 'w2', canteenId: 'c1', name: '炸酱面', category: '面食', price: 11, description: '老北京炸酱面', rating: 4.1, reviewCount: 25, speedScore: 4.0, valueScore: 4.6, popularity: 65, tags: ['经典', '咸香'] },
    { id: 'd8', windowId: 'w3', canteenId: 'c1', name: '煎饼果子', category: '小吃', price: 7, description: '薄脆煎饼，酱香十足', rating: 4.5, reviewCount: 40, speedScore: 4.6, valueScore: 4.7, popularity: 90, tags: ['早餐', '快手'] },
    { id: 'd9', windowId: 'w3', canteenId: 'c1', name: '烤冷面', category: '小吃', price: 8, description: '东北烤冷面，酸甜微辣', rating: 4.2, reviewCount: 28, speedScore: 4.4, valueScore: 4.5, popularity: 75, tags: ['东北', '小吃'] },
    { id: 'd10', windowId: 'w3', canteenId: 'c1', name: '炸鸡腿', category: '小吃', price: 10, description: '外酥里嫩，香气扑鼻', rating: 4.4, reviewCount: 38, speedScore: 4.0, valueScore: 4.2, popularity: 85, tags: ['炸物', '解馋'] },
    { id: 'd11', windowId: 'w4', canteenId: 'c1', name: '珍珠奶茶', category: '饮品', price: 8, description: '香浓奶茶配Q弹珍珠', rating: 4.3, reviewCount: 32, speedScore: 4.7, valueScore: 4.0, popularity: 80, tags: ['奶茶', '下午茶'] },
    { id: 'd12', windowId: 'w4', canteenId: 'c1', name: '鲜榨橙汁', category: '饮品', price: 10, description: '现榨鲜橙汁，维C满满', rating: 4.5, reviewCount: 22, speedScore: 4.5, valueScore: 3.8, popularity: 68, tags: ['鲜榨', '健康'] },
    { id: 'd13', windowId: 'w5', canteenId: 'c2', name: '水煮鱼', category: '热菜', price: 18, description: '鲜嫩鱼片，麻辣过瘾', rating: 4.6, reviewCount: 45, speedScore: 3.5, valueScore: 4.0, popularity: 92, tags: ['麻辣', '招牌'] },
    { id: 'd14', windowId: 'w5', canteenId: 'c2', name: '麻婆豆腐', category: '热菜', price: 10, description: '麻辣鲜香，下饭神器', rating: 4.3, reviewCount: 33, speedScore: 4.6, valueScore: 4.8, popularity: 78, tags: ['麻辣', '下饭'] },
    { id: 'd15', windowId: 'w5', canteenId: 'c2', name: '小炒黄牛肉', category: '热菜', price: 16, description: '嫩滑黄牛肉，大火快炒', rating: 4.5, reviewCount: 36, speedScore: 4.0, valueScore: 4.1, popularity: 83, tags: ['湘菜', '肉菜'] },
    { id: 'd16', windowId: 'w6', canteenId: 'c2', name: '蒸排骨', category: '热菜', price: 14, description: '豆豉蒸排骨，软烂入味', rating: 4.4, reviewCount: 29, speedScore: 3.8, valueScore: 4.2, popularity: 70, tags: ['蒸菜', '健康'] },
    { id: 'd17', windowId: 'w6', canteenId: 'c2', name: '蒸蛋羹', category: '热菜', price: 6, description: '滑嫩蒸蛋，入口即化', rating: 4.2, reviewCount: 18, speedScore: 4.5, valueScore: 4.8, popularity: 55, tags: ['清淡', '软嫩'] },
    { id: 'd18', windowId: 'w6', canteenId: 'c2', name: '粉蒸肉', category: '热菜', price: 13, description: '米粉裹肉，香糯可口', rating: 4.3, reviewCount: 24, speedScore: 3.6, valueScore: 4.3, popularity: 66, tags: ['蒸菜', '传统'] },
    { id: 'd19', windowId: 'w7', canteenId: 'c2', name: '凉拌黄瓜', category: '凉菜', price: 5, description: '爽脆黄瓜，蒜香十足', rating: 4.1, reviewCount: 15, speedScore: 5.0, valueScore: 5.0, popularity: 50, tags: ['凉菜', '爽口'] },
    { id: 'd20', windowId: 'w7', canteenId: 'c2', name: '皮蛋豆腐', category: '凉菜', price: 7, description: '皮蛋配嫩豆腐，清凉开胃', rating: 4.0, reviewCount: 12, speedScore: 5.0, valueScore: 4.7, popularity: 45, tags: ['凉菜', '开胃'] },
    { id: 'd21', windowId: 'w8', canteenId: 'c3', name: '兰州牛肉面', category: '面食', price: 15, description: '一清二白三红四绿五黄', rating: 4.8, reviewCount: 62, speedScore: 4.0, valueScore: 4.5, popularity: 99, tags: ['招牌', '必吃', '清真'] },
    { id: 'd22', windowId: 'w8', canteenId: 'c3', name: '拌面', category: '面食', price: 13, description: '新疆拌面，配菜丰富', rating: 4.5, reviewCount: 34, speedScore: 3.8, valueScore: 4.4, popularity: 76, tags: ['新疆', '拌面'] },
    { id: 'd23', windowId: 'w8', canteenId: 'c3', name: '羊肉泡馍', category: '面食', price: 18, description: '浓郁羊汤，掰馍泡汤', rating: 4.6, reviewCount: 40, speedScore: 3.2, valueScore: 4.0, popularity: 85, tags: ['西北', '暖胃'] },
    { id: 'd24', windowId: 'w9', canteenId: 'c3', name: '羊肉串', category: '小吃', price: 3, description: '炭火烤制，孜然飘香', rating: 4.7, reviewCount: 55, speedScore: 4.2, valueScore: 4.3, popularity: 96, tags: ['烤肉', '必吃'] },
    { id: 'd25', windowId: 'w9', canteenId: 'c3', name: '烤羊排', category: '热菜', price: 28, description: '外焦里嫩，肉汁丰富', rating: 4.8, reviewCount: 44, speedScore: 3.0, valueScore: 3.5, popularity: 88, tags: ['烤肉', '硬菜'] },
    { id: 'd26', windowId: 'w9', canteenId: 'c3', name: '烤馕', category: '面食', price: 5, description: '酥脆烤馕，配烤肉绝配', rating: 4.4, reviewCount: 26, speedScore: 4.5, valueScore: 4.8, popularity: 65, tags: ['新疆', '主食'] },
    { id: 'd27', windowId: 'w10', canteenId: 'c3', name: '大盘鸡', category: '热菜', price: 25, description: '鸡肉软烂，土豆绵密，配皮带面', rating: 4.7, reviewCount: 50, speedScore: 3.2, valueScore: 4.0, popularity: 93, tags: ['新疆', '招牌', '量大'] },
    { id: 'd28', windowId: 'w10', canteenId: 'c3', name: '手抓饭', category: '面食', price: 16, description: '羊肉手抓饭，油香四溢', rating: 4.5, reviewCount: 35, speedScore: 3.5, valueScore: 4.2, popularity: 80, tags: ['新疆', '特色'] },
    { id: 'd29', windowId: 'w3', canteenId: 'c1', name: '红豆双皮奶', category: '甜品', price: 8, description: '香甜嫩滑，奶味浓郁', rating: 4.5, reviewCount: 28, speedScore: 4.5, valueScore: 4.3, popularity: 72, tags: ['甜品', '下午茶'] },
    { id: 'd30', windowId: 'w4', canteenId: 'c1', name: '杨枝甘露', category: '甜品', price: 12, description: '芒果椰汁西米露，清凉解暑', rating: 4.6, reviewCount: 32, speedScore: 4.3, valueScore: 3.8, popularity: 78, tags: ['甜品', '解暑'] },
  ]
  for (const d of dishes) {
    await prisma.dish.create({ data: d })
  }

  // 创建评价
  const reviews = [
    { dishId: 'd1', userId: user1.id, rating: 5, content: '红烧肉真的绝了！肥而不腻，入口即化，每次来必点！', likes: 12 },
    { dishId: 'd1', userId: user2.id, rating: 4, content: '味道不错，就是有时候肉稍微有点肥，总体推荐。', likes: 5 },
    { dishId: 'd5', userId: user1.id, rating: 5, content: '面条劲道，牛肉大块，汤底浓郁，一碗管饱！', likes: 15 },
    { dishId: 'd5', userId: user2.id, rating: 5, content: '作为北方人，这碗面让我找到了家的感觉。', likes: 20 },
    { dishId: 'd21', userId: user1.id, rating: 5, content: '民族餐厅的拉面yyds！一清二白三红四绿五黄，正宗！', likes: 25 },
    { dishId: 'd21', userId: user2.id, rating: 5, content: '每周至少吃三次，已经上瘾了。', likes: 18 },
    { dishId: 'd24', userId: user1.id, rating: 5, content: '3块钱一串，这价格这味道，绝了！', likes: 22 },
    { dishId: 'd24', userId: user2.id, rating: 5, content: '孜然味太香了，晚上来几串配饮料，完美。', likes: 14 },
    { dishId: 'd27', userId: user1.id, rating: 5, content: '分量超大，两个人吃都够了，鸡肉很入味！', likes: 16 },
    { dishId: 'd27', userId: user2.id, rating: 4, content: '味道很好，就是等的时间比较长。', likes: 6 },
    { dishId: 'd13', userId: user1.id, rating: 5, content: '辣得过瘾！鱼片很嫩，豆芽也好吃。', likes: 11 },
    { dishId: 'd13', userId: user2.id, rating: 4, content: '味道不错，但不能吃辣的慎点。', likes: 4 },
    { dishId: 'd8', userId: user1.id, rating: 5, content: '早餐首选！薄脆很酥，酱料调得好。', likes: 10 },
    { dishId: 'd8', userId: user2.id, rating: 4, content: '7块钱管一个上午，性价比之王。', likes: 8 },
    { dishId: 'd11', userId: user1.id, rating: 4, content: '珍珠Q弹，奶茶香浓，下午茶必备。', likes: 6 },
    { dishId: 'd25', userId: user2.id, rating: 5, content: '外焦里嫩，羊肉一点都不膻，强烈推荐！', likes: 19 },
    { dishId: 'd2', userId: user1.id, rating: 4, content: '妈妈的味道，简单好吃。', likes: 5 },
    { dishId: 'd14', userId: user2.id, rating: 4, content: '够辣够味，配米饭一绝。', likes: 7 },
    { dishId: 'd10', userId: user1.id, rating: 4, content: '外酥里嫩，就是油稍微大了点。', likes: 3 },
    { dishId: 'd22', userId: user2.id, rating: 5, content: '新疆拌面就是好吃，面条劲道配菜丰富。', likes: 9 },
  ]
  for (const r of reviews) {
    await prisma.review.create({ data: r })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2: 运行种子数据**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx prisma db seed
```

Expected: "Seed data created successfully!"

- [ ] **Step 3: 验证数据**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx prisma studio
```

Expected: 浏览器打开 Prisma Studio，能看到 3 个食堂、10 个窗口、30 个菜品、2 个用户、20 条评价。

- [ ] **Step 4: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/prisma/seed.ts backend/package.json
git commit -m "feat: add seed data for canteens, windows, dishes, users, reviews"
```

---

## Task 4: JWT 工具函数与认证中间件

**Files:**
- Create: `backend/src/utils/jwt.ts`
- Create: `backend/src/utils/password.ts`
- Create: `backend/src/middleware/auth.ts`

- [ ] **Step 1: 创建 jwt.ts**

Create `backend/src/utils/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'fallback-secret'

export function signToken(payload: { userId: string; email: string }): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): { userId: string; email: string } {
  return jwt.verify(token, SECRET) as { userId: string; email: string }
}
```

- [ ] **Step 2: 创建 password.ts**

Create `backend/src/utils/password.ts`:

```typescript
import bcrypt from 'bcryptjs'

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10)
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed)
}
```

- [ ] **Step 3: 创建 auth.ts 中间件**

Create `backend/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt'

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string }
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未认证' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = verifyToken(token)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'token 无效或已过期' })
  }
}
```

- [ ] **Step 4: 验证编译**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npx tsc --noEmit
```

Expected: 无错误。

- [ ] **Step 5: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/src/utils/ backend/src/middleware/
git commit -m "feat: add JWT utilities and auth middleware"
```

---

## Task 5: 认证 API（注册/登录/获取当前用户）

**Files:**
- Create: `backend/src/routes/auth.ts`
- Create: `backend/src/routes/users.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: 创建 auth.ts 路由**

Create `backend/src/routes/auth.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { hashPassword, comparePassword } from '../utils/password'
import { signToken } from '../utils/jwt'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { email, password, nickname } = req.body

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: '邮箱、密码、昵称均为必填' })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return res.status(409).json({ error: '邮箱已注册' })
  }

  const hashed = await hashPassword(password)
  const user = await prisma.user.create({
    data: { email, password: hashed, nickname },
    select: { id: true, email: true, nickname: true, avatar: true, bio: true, createdAt: true },
  })

  const token = signToken({ userId: user.id, email: user.email })
  res.status(201).json({ data: { token, user } })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: '邮箱和密码为必填' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: '邮箱或密码错误' })
  }

  const valid = await comparePassword(password, user.password)
  if (!valid) {
    return res.status(401).json({ error: '邮箱或密码错误' })
  }

  const token = signToken({ userId: user.id, email: user.email })
  const { password: _, ...userWithoutPassword } = user
  res.json({ data: { token, user: userWithoutPassword } })
})

export default router
```

- [ ] **Step 2: 创建 users.ts 路由**

Create `backend/src/routes/users.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/users/me
router.get('/me', authMiddleware, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, nickname: true, avatar: true, bio: true, createdAt: true },
  })

  if (!user) {
    return res.status(404).json({ error: '用户不存在' })
  }

  res.json({ data: user })
})

// GET /api/users/me/reviews
router.get('/me/reviews', authMiddleware, async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { userId: req.user!.userId },
    include: {
      dish: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = reviews.map((r) => ({
    id: r.id,
    dishId: r.dishId,
    dishName: r.dish.name,
    rating: r.rating,
    content: r.content,
    likes: r.likes,
    createdAt: r.createdAt,
  }))

  res.json({ data })
})

export default router
```

- [ ] **Step 3: 挂载路由到 app.ts**

Modify `backend/src/app.ts`，添加路由导入和挂载：

```typescript
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
```

- [ ] **Step 4: 测试认证 API**

启动后端：

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npm run dev
```

测试注册：

```bash
curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"123456","nickname":"测试用户"}'
```

Expected: 返回 `{ data: { token: "...", user: { ... } } }`

测试登录：

```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"xiaowang@test.com","password":"123456"}'
```

Expected: 返回 token 和用户信息。

- [ ] **Step 5: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/src/routes/ backend/src/app.ts
git commit -m "feat: add auth API (register, login, me, my reviews)"
```

---

## Task 6: 食堂/窗口/菜品只读 API

**Files:**
- Create: `backend/src/routes/canteens.ts`
- Create: `backend/src/routes/windows.ts`
- Create: `backend/src/routes/dishes.ts`
- Create: `backend/src/routes/ranking.ts`
- Modify: `backend/src/app.ts`

- [ ] **Step 1: 创建 canteens.ts**

Create `backend/src/routes/canteens.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/canteens
router.get('/', async (_req, res) => {
  const canteens = await prisma.canteen.findMany({
    include: { _count: { select: { windows: true } } },
  })

  const data = canteens.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    floors: c.floors,
    status: c.status,
    tags: c.tags,
    location: c.location,
    cover: c.cover,
    rating: c.rating,
    windowCount: c._count.windows,
  }))

  res.json({ data })
})

// GET /api/canteens/:id
router.get('/:id', async (req, res) => {
  const canteen = await prisma.canteen.findUnique({
    where: { id: req.params.id },
    include: { windows: { include: { dishes: true } } },
  })

  if (!canteen) {
    return res.status(404).json({ error: '食堂不存在' })
  }

  res.json({ data: canteen })
})

export default router
```

- [ ] **Step 2: 创建 windows.ts**

Create `backend/src/routes/windows.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/windows/:id
router.get('/:id', async (req, res) => {
  const window = await prisma.window.findUnique({
    where: { id: req.params.id },
    include: { dishes: true },
  })

  if (!window) {
    return res.status(404).json({ error: '窗口不存在' })
  }

  res.json({ data: window })
})

export default router
```

- [ ] **Step 3: 创建 dishes.ts**

Create `backend/src/routes/dishes.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// GET /api/dishes（列表，支持 category/search/page/limit）
router.get('/', async (req, res) => {
  const { category, search, page = '1', limit = '20' } = req.query
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const where: any = {}
  if (category && category !== 'all') {
    where.category = category
  }
  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { tags: { has: search as string } },
    ]
  }

  const [dishes, total] = await Promise.all([
    prisma.dish.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { popularity: 'desc' },
      include: {
        window: { select: { name: true } },
        canteen: { select: { name: true } },
      },
    }),
    prisma.dish.count({ where }),
  ])

  const data = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.price,
    description: d.description,
    image: d.image,
    rating: d.rating,
    reviewCount: d.reviewCount,
    speedScore: d.speedScore,
    valueScore: d.valueScore,
    popularity: d.popularity,
    tags: d.tags,
    windowId: d.windowId,
    windowName: d.window.name,
    canteenId: d.canteenId,
    canteenName: d.canteen.name,
  }))

  res.json({ data, total, page: pageNum, limit: limitNum })
})

// GET /api/dishes/:id
router.get('/:id', async (req, res) => {
  const dish = await prisma.dish.findUnique({
    where: { id: req.params.id },
    include: {
      window: { select: { name: true } },
      canteen: { select: { name: true } },
    },
  })

  if (!dish) {
    return res.status(404).json({ error: '菜品不存在' })
  }

  res.json({
    data: {
      ...dish,
      windowName: dish.window.name,
      canteenName: dish.canteen.name,
    },
  })
})

// GET /api/dishes/:id/reviews
router.get('/:id/reviews', async (req, res) => {
  const { page = '1', limit = '10' } = req.query
  const pageNum = parseInt(page as string, 10)
  const limitNum = parseInt(limit as string, 10)
  const skip = (pageNum - 1) * limitNum

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { dishId: req.params.id },
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { nickname: true, avatar: true } } },
    }),
    prisma.review.count({ where: { dishId: req.params.id } }),
  ])

  const data = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    content: r.content,
    likes: r.likes,
    createdAt: r.createdAt,
    userId: r.userId,
    userName: r.user.nickname,
    userAvatar: r.user.avatar,
  }))

  res.json({ data, total, page: pageNum, limit: limitNum })
})

// POST /api/dishes/:id/reviews（需登录）
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, content } = req.body

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: '评分必须为 1-5' })
  }
  if (!content || !content.trim()) {
    return res.status(400).json({ error: '评价内容不能为空' })
  }

  const dish = await prisma.dish.findUnique({ where: { id: req.params.id } })
  if (!dish) {
    return res.status(404).json({ error: '菜品不存在' })
  }

  const review = await prisma.review.create({
    data: {
      dishId: req.params.id,
      userId: req.user!.userId,
      rating,
      content: content.trim(),
    },
    include: { user: { select: { nickname: true, avatar: true } } },
  })

  // 聚合更新 dish 的 rating 和 reviewCount
  const agg = await prisma.review.aggregate({
    where: { dishId: req.params.id },
    _avg: { rating: true },
    _count: true,
  })

  await prisma.dish.update({
    where: { id: req.params.id },
    data: {
      rating: agg._avg.rating || 0,
      reviewCount: agg._count,
    },
  })

  res.status(201).json({
    data: {
      id: review.id,
      rating: review.rating,
      content: review.content,
      likes: review.likes,
      createdAt: review.createdAt,
      userId: review.userId,
      userName: review.user.nickname,
      userAvatar: review.user.avatar,
    },
  })
})

export default router
```

- [ ] **Step 4: 创建 ranking.ts**

Create `backend/src/routes/ranking.ts`:

```typescript
import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const router = Router()
const prisma = new PrismaClient()

// GET /api/ranking
router.get('/', async (req, res) => {
  const { category = 'popularity', limit = '30' } = req.query
  const limitNum = parseInt(limit as string, 10)

  const orderByMap: Record<string, any> = {
    popularity: { popularity: 'desc' },
    speed: { speedScore: 'desc' },
    value: { valueScore: 'desc' },
  }

  const orderBy = orderByMap[category as string] || orderByMap.popularity

  const dishes = await prisma.dish.findMany({
    orderBy,
    take: limitNum,
    include: {
      window: { select: { name: true } },
      canteen: { select: { name: true } },
    },
  })

  const data = dishes.map((d) => ({
    id: d.id,
    name: d.name,
    category: d.category,
    price: d.price,
    rating: d.rating,
    reviewCount: d.reviewCount,
    speedScore: d.speedScore,
    valueScore: d.valueScore,
    popularity: d.popularity,
    image: d.image,
    windowName: d.window.name,
    canteenName: d.canteen.name,
  }))

  res.json({ data })
})

export default router
```

- [ ] **Step 5: 挂载所有路由**

Modify `backend/src/app.ts`:

```typescript
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import usersRoutes from './routes/users'
import canteensRoutes from './routes/canteens'
import windowsRoutes from './routes/windows'
import dishesRoutes from './routes/dishes'
import rankingRoutes from './routes/ranking'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/canteens', canteensRoutes)
app.use('/api/windows', windowsRoutes)
app.use('/api/dishes', dishesRoutes)
app.use('/api/ranking', rankingRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

export default app
```

- [ ] **Step 6: 测试所有 API**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/backend
npm run dev
```

测试：

```bash
curl http://localhost:3000/api/canteens
curl http://localhost:3000/api/canteens/c1
curl http://localhost:3000/api/windows/w1
curl http://localhost:3000/api/dishes/d1
curl http://localhost:3000/api/dishes/d1/reviews
curl http://localhost:3000/api/dishes?category=面食
curl http://localhost:3000/api/ranking?category=popularity
```

Expected: 所有接口返回正确数据。

- [ ] **Step 7: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add backend/src/routes/ backend/src/app.ts
git commit -m "feat: add canteen, window, dish, ranking API routes"
```

---

## Task 7: 前端 axios 客户端与 API 模块

**Files:**
- Create: `frontend/src/api/client.ts`
- Create: `frontend/src/api/auth.ts`
- Create: `frontend/src/api/canteens.ts`
- Create: `frontend/src/api/dishes.ts`
- Create: `frontend/src/api/ranking.ts`
- Modify: `frontend/vite.config.ts`

- [ ] **Step 1: 安装 axios**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm install axios
```

- [ ] **Step 2: 创建 client.ts**

Create `frontend/src/api/client.ts`:

```typescript
import axios from 'axios'

const client = axios.create({
  baseURL: '/api',
})

// 请求拦截器：自动附加 token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('canteen-auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：401 时清除 token
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('canteen-auth-token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default client
```

- [ ] **Step 3: 创建 auth.ts**

Create `frontend/src/api/auth.ts`：

```typescript
import client from './client'

export async function register(email: string, password: string, nickname: string) {
  const res = await client.post('/auth/register', { email, password, nickname })
  return res.data.data
}

export async function login(email: string, password: string) {
  const res = await client.post('/auth/login', { email, password })
  return res.data.data
}

export async function getMe() {
  const res = await client.get('/users/me')
  return res.data.data
}

export async function getMyReviews() {
  const res = await client.get('/users/me/reviews')
  return res.data.data
}
```

- [ ] **Step 4: 创建 canteens.ts**

Create `frontend/src/api/canteens.ts`：

```typescript
import client from './client'

export async function getCanteens() {
  const res = await client.get('/canteens')
  return res.data.data
}

export async function getCanteenById(id: string) {
  const res = await client.get(`/canteens/${id}`)
  return res.data.data
}
```

- [ ] **Step 5: 创建 dishes.ts**

Create `frontend/src/api/dishes.ts`：

```typescript
import client from './client'

export async function getDishes(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  const res = await client.get('/dishes', { params })
  return res.data
}

export async function getDishById(id: string) {
  const res = await client.get(`/dishes/${id}`)
  return res.data.data
}

export async function getDishReviews(dishId: string, page = 1, limit = 10) {
  const res = await client.get(`/dishes/${dishId}/reviews`, { params: { page, limit } })
  return res.data
}

export async function submitReview(dishId: string, rating: number, content: string) {
  const res = await client.post(`/dishes/${dishId}/reviews`, { rating, content })
  return res.data.data
}
```

- [ ] **Step 6: 创建 ranking.ts**

Create `frontend/src/api/ranking.ts`：

```typescript
import client from './client'

export async function getRanking(category = 'popularity', limit = 30) {
  const res = await client.get('/ranking', { params: { category, limit } })
  return res.data.data
}
```

- [ ] **Step 7: 配置 Vite proxy**

Modify `frontend/vite.config.ts`，在 `server` 中添加 `proxy`：

```typescript
server: {
  host: '0.0.0.0',
  port: 5173,
  proxy: {
    '/api': 'http://localhost:3000',
  },
},
```

- [ ] **Step 8: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/api/ frontend/vite.config.ts frontend/package.json frontend/package-lock.json
git commit -m "feat: add frontend API layer with axios and Vite proxy"
```

---

## Task 8: 前端认证状态管理

**Files:**
- Create: `frontend/src/stores/useAuthStore.ts`

- [ ] **Step 1: 创建 useAuthStore**

Create `frontend/src/stores/useAuthStore.ts`：

```typescript
import { create } from 'zustand'
import * as authApi from '../api/auth'

interface User {
  id: string
  email: string
  nickname: string
  avatar: string
  bio: string
  createdAt: string
}

interface AuthState {
  token: string | null
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, nickname: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('canteen-auth-token'),
  user: null,
  isLoading: false,

  login: async (email, password) => {
    const { token, user } = await authApi.login(email, password)
    localStorage.setItem('canteen-auth-token', token)
    set({ token, user })
  },

  register: async (email, password, nickname) => {
    const { token, user } = await authApi.register(email, password, nickname)
    localStorage.setItem('canteen-auth-token', token)
    set({ token, user })
  },

  logout: () => {
    localStorage.removeItem('canteen-auth-token')
    set({ token: null, user: null })
  },

  fetchMe: async () => {
    set({ isLoading: true })
    try {
      const user = await authApi.getMe()
      set({ user, isLoading: false })
    } catch {
      localStorage.removeItem('canteen-auth-token')
      set({ token: null, user: null, isLoading: false })
    }
  },
}))
```

- [ ] **Step 2: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/stores/useAuthStore.ts
git commit -m "feat: add useAuthStore for authentication state"
```

---

## Task 9: 登录页与注册页

**Files:**
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/RegisterPage.tsx`
- Modify: `frontend/src/router/index.tsx`
- Modify: `frontend/src/layouts/MainLayout.tsx`

- [ ] **Step 1: 创建 LoginPage.tsx**

Create `frontend/src/pages/LoginPage.tsx`：

```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-paper)' }}>
      <div
        className="w-full max-w-[360px] p-6"
        style={{
          background: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-2xl text-center mb-6">登录</h1>

        {error && (
          <div
            className="mb-4 p-3 text-sm font-bold text-center"
            style={{
              background: 'var(--color-soft-red)',
              color: 'var(--color-red)',
              border: '2px solid var(--color-ink)',
              borderRadius: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold block mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '3px solid var(--color-ink)',
                borderRadius: '16px',
              }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{
                background: 'var(--color-bg)',
                border: '3px solid var(--color-ink)',
                borderRadius: '16px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #172033 0%, #172033 58%, #FF4FB8 58%, #FF4FB8 100%)',
              color: 'white',
              border: '3px solid var(--color-ink)',
              borderRadius: '18px',
              boxShadow: '7px 7px 0 var(--color-amber)',
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
          没有账号？{' '}
          <Link to="/register" className="font-bold" style={{ color: 'var(--color-blue)' }}>
            去注册
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: 创建 RegisterPage.tsx**

Create `frontend/src/pages/RegisterPage.tsx`（结构类似 LoginPage，多一个 nickname 字段）：

```tsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/useAuthStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, nickname)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--color-paper)' }}>
      <div
        className="w-full max-w-[360px] p-6"
        style={{
          background: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-2xl text-center mb-6">注册</h1>

        {error && (
          <div
            className="mb-4 p-3 text-sm font-bold text-center"
            style={{
              background: 'var(--color-soft-red)',
              color: 'var(--color-red)',
              border: '2px solid var(--color-ink)',
              borderRadius: '14px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold block mb-1">昵称</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="请输入昵称"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--color-bg)', border: '3px solid var(--color-ink)', borderRadius: '16px' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="请输入邮箱"
              required
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--color-bg)', border: '3px solid var(--color-ink)', borderRadius: '16px' }}
            />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码（至少6位）"
              required
              minLength={6}
              className="w-full px-3 py-2 text-sm outline-none"
              style={{ background: 'var(--color-bg)', border: '3px solid var(--color-ink)', borderRadius: '16px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #172033 0%, #172033 58%, #FF4FB8 58%, #FF4FB8 100%)',
              color: 'white',
              border: '3px solid var(--color-ink)',
              borderRadius: '18px',
              boxShadow: '7px 7px 0 var(--color-amber)',
            }}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>

        <p className="text-center text-xs mt-4" style={{ color: 'var(--color-muted)' }}>
          已有账号？{' '}
          <Link to="/login" className="font-bold" style={{ color: 'var(--color-blue)' }}>
            去登录
          </Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 添加路由**

Modify `frontend/src/router/index.tsx`，添加 `/login` 和 `/register` 路由：

```tsx
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import RankingPage from '../pages/RankingPage'
import CanteenListPage from '../pages/CanteenListPage'
import CanteenDetailPage from '../pages/CanteenDetailPage'
import DishDetailPage from '../pages/DishDetailPage'
import ProfilePage from '../pages/ProfilePage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'ranking', element: <RankingPage /> },
      { path: 'canteens', element: <CanteenListPage /> },
      { path: 'canteens/:canteenId', element: <CanteenDetailPage /> },
      { path: 'dishes/:dishId', element: <DishDetailPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
])
```

- [ ] **Step 4: 更新 MainLayout 隐藏 tab 栏**

Modify `frontend/src/layouts/MainLayout.tsx`，在 `isDetailPage` 判断中追加登录/注册：

```tsx
const isDetailPage =
  location.pathname.startsWith('/canteens/') ||
  location.pathname.startsWith('/dishes/') ||
  location.pathname === '/login' ||
  location.pathname === '/register'
```

- [ ] **Step 5: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx frontend/src/router/ frontend/src/layouts/
git commit -m "feat: add login and register pages with routes"
```

---

## Task 10: 改造首页和排行榜页

**Files:**
- Modify: `frontend/src/pages/HomePage.tsx`
- Modify: `frontend/src/pages/RankingPage.tsx`

- [ ] **Step 1: 改造 HomePage**

Replace mock imports with API calls in `frontend/src/pages/HomePage.tsx`：

- Remove: `import { canteens, dishes } from '../mock'`
- Add: `import { getCanteens } from '../api/canteens'` 和 `import { getDishes } from '../api/dishes'`
- 用 `useState` + `useEffect` 在组件挂载时调用 API
- `canteens` → `getCanteens()` 结果
- `dishes` → `getDishes({ page: 1, limit: 100 })` 结果（一次取全部，前端分页）
- `totalWindows` 从 canteens 数据中计算
- `totalReviews` 从 dishes 数据中累加 `reviewCount`
- 加 loading 状态

- [ ] **Step 2: 改造 RankingPage**

Replace mock imports with API calls in `frontend/src/pages/RankingPage.tsx`：

- Remove: `import { dishes } from '../mock'`
- Add: `import { getRanking } from '../api/ranking'`
- 用 `useState` + `useEffect` 在 `category`/`period` 变化时调用 `getRanking(category)`
- 前端继续做 UI 分页
- 加 loading 状态

- [ ] **Step 3: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/pages/HomePage.tsx frontend/src/pages/RankingPage.tsx
git commit -m "feat: migrate HomePage and RankingPage from mock to API"
```

---

## Task 11: 改造食堂和菜品详情页

**Files:**
- Modify: `frontend/src/pages/CanteenListPage.tsx`
- Modify: `frontend/src/pages/CanteenDetailPage.tsx`
- Modify: `frontend/src/pages/DishDetailPage.tsx`

- [ ] **Step 1: 改造 CanteenListPage**

Replace `import { canteens } from '../mock'` with `getCanteens()` API call.

- [ ] **Step 2: 改造 CanteenDetailPage**

Replace mock imports with `getCanteenById(canteenId)` API call. 后端返回的 canteen 已包含 windows（含 dishes），一次请求拿到所有数据。

- [ ] **Step 3: 改造 DishDetailPage**

- Replace mock imports with `getDishById(dishId)` API
- Replace `useReviewStore.getDishReviews()` with `getDishReviews(dishId)` API
- Replace `useReviewStore.addReview()` with `submitReview(dishId, rating, content)` API
- Replace `currentUser` with `useAuthStore` user
- 提交评价后重新拉取评价列表
- 收藏功能（useFavoriteStore）保持不变

- [ ] **Step 4: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/pages/CanteenListPage.tsx frontend/src/pages/CanteenDetailPage.tsx frontend/src/pages/DishDetailPage.tsx
git commit -m "feat: migrate canteen and dish detail pages from mock to API"
```

---

## Task 12: 改造 ProfilePage

**Files:**
- Modify: `frontend/src/pages/ProfilePage.tsx`
- Modify: `frontend/src/layouts/MainLayout.tsx`

- [ ] **Step 1: 改造 ProfilePage**

- Replace `currentUser` with `useAuthStore` user
- "我的评价"用 `getMyReviews()` API 获取
- "我的收藏"和"浏览记录"保持 localStorage
- 添加"退出登录"按钮
- 未登录时显示登录提示

- [ ] **Step 2: 未登录跳转**

在 `MainLayout.tsx` 中，点击"我的"tab 时检查登录状态，未登录跳转 `/login`。

- [ ] **Step 3: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/pages/ProfilePage.tsx frontend/src/layouts/MainLayout.tsx
git commit -m "feat: migrate ProfilePage from mock to API with auth"
```

---

## Task 13: 清理与收尾

**Files:**
- Modify: `frontend/src/mock/` (标注 deprecated)
- Modify: `frontend/README.md`

- [ ] **Step 1: 标注 mock 文件为 deprecated**

在 `frontend/src/mock/` 目录下每个文件头部加注释：

```typescript
// DEPRECATED: 数据已迁移到后端 API，此文件仅供参考
```

- [ ] **Step 2: 更新 README**

在 `frontend/README.md` 中添加后端启动说明：

```markdown
## 后端启动

```bash
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

后端运行在 http://localhost:3000

## 前后端联调

同时启动前端和后端：

```bash
# 终端 1
cd backend && npm run dev

# 终端 2
cd frontend && npm run dev
```

前端通过 Vite proxy 将 `/api` 请求转发到后端。
```

- [ ] **Step 3: 最终验证**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm run build
npm run lint
```

- [ ] **Step 4: 提交**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git add frontend/src/mock/ frontend/README.md
git commit -m "chore: mark mock data as deprecated, update README"
```

---

## Verification Section

最终验收：

```bash
# 后端
cd backend && npm run dev

# 前端（另一个终端）
cd frontend && npm run dev
```

手动验收清单：
1. 注册新用户
2. 登录
3. 首页数据从 API 加载
4. 排行榜数据从 API 加载
5. 食堂列表和详情从 API 加载
6. 菜品详情从 API 加载
7. 提交评价后立即显示
8. 退出登录
9. 收藏和浏览记录继续 localStorage 工作
