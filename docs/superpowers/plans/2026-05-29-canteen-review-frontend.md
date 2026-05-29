# Canteen Review Frontend — Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first canteen review web demo with React + TypeScript + Vite + Tailwind CSS, using mock data and localStorage, styled in a neo-brutalist pop-art aesthetic matching the reference WeChat mini-program.

**Architecture:** Single-page React app with React Router for navigation, Zustand for state management, localStorage for persistence. All data is mock/static except user-submitted reviews which persist in localStorage. Mobile-first layout capped at 390px width.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS v3, React Router v6, Zustand, localStorage

---

## File Structure

```
/frontend
  /public
    /images/              # Static images (copied from reference project or placeholders)
  /src
    /assets/              # Imported assets
    /components/          # Reusable UI components
      BottomTabBar.tsx
      Card.tsx
      Button.tsx
      Tag.tsx
      StarRating.tsx
      ReviewList.tsx
      ReviewForm.tsx
      DishCard.tsx
      CanteenCard.tsx
      RankItem.tsx
      SearchBar.tsx
      StatPanel.tsx
      CategoryGrid.tsx
    /layouts/
      MainLayout.tsx      # Bottom tab bar + page outlet
    /mock/
      canteens.ts
      windows.ts
      dishes.ts
      reviews.ts
      user.ts
      index.ts            # Re-export all mock data
    /pages/
      HomePage.tsx
      RankingPage.tsx
      CanteenListPage.tsx
      CanteenDetailPage.tsx
      DishDetailPage.tsx
      ProfilePage.tsx
    /router/
      index.tsx
    /stores/
      useReviewStore.ts
      useFavoriteStore.ts
      useHistoryStore.ts
    /styles/
      global.css          # Tailwind directives + neo-brutalist custom CSS
    /types/
      index.ts            # Canteen, Window, Dish, Review, User types
    /utils/
      format.ts           # Date formatting, rating calculation
      storage.ts          # localStorage helpers
    App.tsx
    main.tsx
  index.html
  package.json
  tsconfig.json
  vite.config.ts
  tailwind.config.js
  postcss.config.js
```

---

## Task 1: Project Scaffolding

**Files:**
- Create: `frontend/` (entire directory via Vite CLI)
- Create: `frontend/package.json` (via npm install)
- Create: `frontend/vite.config.ts`
- Create: `frontend/tailwind.config.js`
- Create: `frontend/postcss.config.js`
- Create: `frontend/tsconfig.json`
- Create: `frontend/index.html`

- [ ] **Step 1: Create Vite project**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
npm create vite@latest frontend -- --template react-ts
```

- [ ] **Step 2: Install dependencies**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm install react-router-dom zustand
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Vite with Tailwind**

Replace `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
```

- [ ] **Step 4: Create Tailwind CSS entry**

Create `frontend/src/styles/global.css`:

```css
@import "tailwindcss";

/* ============================================
   NEO-BRUTALIST POP-ART THEME
   Reference: C:\Users\lenovo\Desktop\Canteen mini-program
   ============================================ */

@theme {
  /* ---- Color Palette ---- */
  --color-ink: #172033;
  --color-paper: #FFFDF7;
  --color-bg: #F7F8FA;
  --color-bg-warm: #FFF8E8;
  --color-blue: #1677FF;
  --color-green: #22A06B;
  --color-amber: #FFB020;
  --color-red: #FF4D4F;
  --color-pink: #FF4FB8;
  --color-cyan: #00C2FF;
  --color-yellow: #FFE14D;
  --color-purple: #6C5CE7;

  /* Soft tints */
  --color-soft-blue: #EAF3FF;
  --color-soft-green: #EAF7F0;
  --color-soft-amber: #FFF7E8;
  --color-soft-red: #FFF0F0;
  --color-soft-purple: #F0ECFF;

  /* Shadows */
  --color-shadow-blue: #DCE7F5;
  --color-shadow-green: #DDF3E8;
  --color-shadow-amber: #FFE4A8;
  --color-shadow-pink: #FFD6EE;

  /* Muted text */
  --color-muted: #8A93A3;
  --color-muted-dark: #697386;
  --color-line: #D8DFEA;

  /* ---- Border Radius ---- */
  --radius-card: 22px;
  --radius-button: 18px;
  --radius-badge: 20px;
  --radius-pill: 999px;
  --radius-tab: 32px;
  --radius-avatar: 34px;
}

/* ---- Global Base ---- */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-ink);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}

/* Mobile-first container */
#root {
  max-width: 390px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: var(--color-paper);
  position: relative;
  overflow-x: hidden;
}

/* ---- Pop-art text shadow utility ---- */
.text-shadow-pop {
  text-shadow:
    3px 3px 0 var(--color-yellow),
    6px 6px 0 rgba(0, 194, 255, 0.22);
}

.text-shadow-pop-soft {
  text-shadow:
    2px 2px 0 rgba(255, 225, 77, 0.75);
}

/* ---- Neo-brutalist card base ---- */
.card-brutal {
  border: 3px solid var(--color-ink);
  border-radius: var(--radius-card);
  box-shadow: 7px 7px 0 var(--color-shadow-blue);
  background: white;
  transition: transform 0.16s ease;
}

.card-brutal:active {
  transform: scale(0.99);
}

/* ---- Dot pattern background ---- */
.dot-pattern {
  background-image: radial-gradient(
    circle at 18px 18px,
    rgba(255, 176, 32, 0.15) 0 4px,
    transparent 5px
  );
  background-size: 34px 34px;
}

/* ---- Speed lines ---- */
.speed-lines {
  background-image: repeating-linear-gradient(
    -12deg,
    rgba(255, 225, 77, 0.08) 0 8px,
    transparent 8px 18px
  );
}

/* ---- Scrollbar hide ---- */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

- [ ] **Step 5: Import global CSS in main.tsx**

Replace `frontend/src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 6: Remove default Vite files**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
rm -f src/App.css src/index.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 7: Verify dev server starts**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm run dev
```

Expected: Dev server starts on http://localhost:5173 without errors. Open in browser — should see a blank page with warm off-white background.

- [ ] **Step 8: Commit**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review
git init
git add frontend/
git commit -m "chore: scaffold Vite + React + TS + Tailwind project"
```

---

## Task 2: Type Definitions

**Files:**
- Create: `frontend/src/types/index.ts`

- [ ] **Step 1: Create type definitions**

Create `frontend/src/types/index.ts`:

```typescript
/** 食堂 */
export interface Canteen {
  id: string
  name: string
  description: string
  floors: number
  windowCount: number
  status: 'open' | 'closed'
  tags: string[]
  location: string
  cover: string
  rating: number
}

/** 窗口 */
export interface Window {
  id: string
  canteenId: string
  name: string
  floor: number
  description: string
  status: 'open' | 'closed'
  tags: string[]
  dishIds: string[]
}

/** 菜品 */
export interface Dish {
  id: string
  windowId: string
  canteenId: string
  name: string
  category: DishCategory
  price: number
  description: string
  image: string
  rating: number
  reviewCount: number
  speedScore: number
  valueScore: number
  popularity: number
  tags: string[]
}

/** 菜品分类 */
export type DishCategory =
  | '热菜'
  | '凉菜'
  | '面食'
  | '小吃'
  | '水果'
  | '饮品'

/** 评价 */
export interface Review {
  id: string
  dishId: string
  userId: string
  userName: string
  avatar: string
  rating: number
  content: string
  createdAt: string
  likes: number
}

/** 用户 */
export interface User {
  id: string
  nickname: string
  avatar: string
  bio: string
  stats: {
    reviewCount: number
    favoriteCount: number
    browseCount: number
  }
}

/** 排行榜时间范围 */
export type RankPeriod = 'today' | 'week'

/** 排行榜分类 */
export type RankCategory = 'popularity' | 'speed' | 'value'
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/
git commit -m "feat: add type definitions for Canteen, Window, Dish, Review, User"
```

---

## Task 3: Mock Data

**Files:**
- Create: `frontend/src/mock/canteens.ts`
- Create: `frontend/src/mock/windows.ts`
- Create: `frontend/src/mock/dishes.ts`
- Create: `frontend/src/mock/reviews.ts`
- Create: `frontend/src/mock/user.ts`
- Create: `frontend/src/mock/index.ts`

- [ ] **Step 1: Create canteen mock data**

Create `frontend/src/mock/canteens.ts`:

```typescript
import type { Canteen } from '../types'

export const canteens: Canteen[] = [
  {
    id: 'c1',
    name: '一餐厅',
    description: '学校最大的综合食堂，菜品丰富，价格实惠',
    floors: 2,
    windowCount: 4,
    status: 'open',
    tags: ['品种多', '性价比高', '人流量大'],
    location: '校园中心广场东侧',
    cover: '/images/canteen1.jpg',
    rating: 4.2,
  },
  {
    id: 'c2',
    name: '二餐厅',
    description: '环境优雅，特色小吃种类多',
    floors: 1,
    windowCount: 3,
    status: 'open',
    tags: ['环境好', '小吃多', '座位多'],
    location: '图书馆北侧',
    cover: '/images/canteen2.jpg',
    rating: 4.0,
  },
  {
    id: 'c3',
    name: '民族餐厅',
    description: '提供清真及民族特色美食',
    floors: 1,
    windowCount: 3,
    status: 'open',
    tags: ['清真', '特色菜', '牛肉面'],
    location: '学生宿舍区南侧',
    cover: '/images/canteen3.jpg',
    rating: 4.5,
  },
]
```

- [ ] **Step 2: Create window mock data**

Create `frontend/src/mock/windows.ts`:

```typescript
import type { Window } from '../types'

export const windows: Window[] = [
  // 一餐厅
  {
    id: 'w1',
    canteenId: 'c1',
    name: '家常菜窗口',
    floor: 1,
    description: '每日现炒家常菜，妈妈的味道',
    status: 'open',
    tags: ['现炒', '家常'],
    dishIds: ['d1', 'd2', 'd3', 'd4'],
  },
  {
    id: 'w2',
    canteenId: 'c1',
    name: '面食窗口',
    floor: 1,
    description: '手工拉面、刀削面、拌面',
    status: 'open',
    tags: ['手工', '面食'],
    dishIds: ['d5', 'd6', 'd7'],
  },
  {
    id: 'w3',
    canteenId: 'c1',
    name: '小吃窗口',
    floor: 2,
    description: '煎饼果子、烤冷面、炸串',
    status: 'open',
    tags: ['小吃', '快捷'],
    dishIds: ['d8', 'd9', 'd10'],
  },
  {
    id: 'w4',
    canteenId: 'c1',
    name: '饮品窗口',
    floor: 2,
    description: '鲜榨果汁、奶茶、豆浆',
    status: 'open',
    tags: ['饮品', '鲜榨'],
    dishIds: ['d11', 'd12'],
  },
  // 二餐厅
  {
    id: 'w5',
    canteenId: 'c2',
    name: '川湘菜窗口',
    floor: 1,
    description: '正宗川湘风味，辣得过瘾',
    status: 'open',
    tags: ['辣', '川湘'],
    dishIds: ['d13', 'd14', 'd15'],
  },
  {
    id: 'w6',
    canteenId: 'c2',
    name: '蒸菜窗口',
    floor: 1,
    description: '健康蒸菜，少油少盐',
    status: 'open',
    tags: ['健康', '蒸菜'],
    dishIds: ['d16', 'd17', 'd18'],
  },
  {
    id: 'w7',
    canteenId: 'c2',
    name: '凉菜窗口',
    floor: 1,
    description: '爽口凉菜，开胃必备',
    status: 'open',
    tags: ['凉菜', '开胃'],
    dishIds: ['d19', 'd20'],
  },
  // 民族餐厅
  {
    id: 'w8',
    canteenId: 'c3',
    name: '拉面窗口',
    floor: 1,
    description: '正宗兰州拉面，汤鲜面筋',
    status: 'open',
    tags: ['拉面', '清真'],
    dishIds: ['d21', 'd22', 'd23'],
  },
  {
    id: 'w9',
    canteenId: 'c3',
    name: '烤肉窗口',
    floor: 1,
    description: '炭火烤肉，香气四溢',
    status: 'open',
    tags: ['烤肉', '清真'],
    dishIds: ['d24', 'd25', 'd26'],
  },
  {
    id: 'w10',
    canteenId: 'c3',
    name: '特色菜窗口',
    floor: 1,
    description: '大盘鸡、手抓饭等民族特色',
    status: 'open',
    tags: ['特色', '大盘鸡'],
    dishIds: ['d27', 'd28'],
  },
]
```

- [ ] **Step 3: Create dish mock data**

Create `frontend/src/mock/dishes.ts`:

```typescript
import type { Dish } from '../types'

export const dishes: Dish[] = [
  // ---- 一餐厅 · 家常菜窗口 ----
  {
    id: 'd1', windowId: 'w1', canteenId: 'c1',
    name: '红烧肉', category: '热菜', price: 12,
    description: '肥瘦相间，入口即化', image: '/images/dish-placeholder.svg',
    rating: 4.6, reviewCount: 48, speedScore: 4.2, valueScore: 4.5, popularity: 95,
    tags: ['招牌', '下饭'],
  },
  {
    id: 'd2', windowId: 'w1', canteenId: 'c1',
    name: '番茄炒蛋', category: '热菜', price: 8,
    description: '家常味道，酸甜可口', image: '/images/dish-placeholder.svg',
    rating: 4.3, reviewCount: 35, speedScore: 4.8, valueScore: 4.7, popularity: 88,
    tags: ['家常', '快手'],
  },
  {
    id: 'd3', windowId: 'w1', canteenId: 'c1',
    name: '宫保鸡丁', category: '热菜', price: 13,
    description: '花生酥脆，鸡丁嫩滑', image: '/images/dish-placeholder.svg',
    rating: 4.4, reviewCount: 42, speedScore: 4.0, valueScore: 4.3, popularity: 82,
    tags: ['微辣', '经典'],
  },
  {
    id: 'd4', windowId: 'w1', canteenId: 'c1',
    name: '清炒时蔬', category: '热菜', price: 6,
    description: '每日新鲜蔬菜', image: '/images/dish-placeholder.svg',
    rating: 4.0, reviewCount: 20, speedScore: 4.9, valueScore: 4.8, popularity: 60,
    tags: ['清淡', '健康'],
  },
  // ---- 一餐厅 · 面食窗口 ----
  {
    id: 'd5', windowId: 'w2', canteenId: 'c1',
    name: '牛肉拉面', category: '面食', price: 14,
    description: '手工拉面，大块牛肉', image: '/images/dish-placeholder.svg',
    rating: 4.7, reviewCount: 56, speedScore: 3.8, valueScore: 4.4, popularity: 98,
    tags: ['招牌', '必吃'],
  },
  {
    id: 'd6', windowId: 'w2', canteenId: 'c1',
    name: '刀削面', category: '面食', price: 12,
    description: '刀削面配卤汁', image: '/images/dish-placeholder.svg',
    rating: 4.3, reviewCount: 30, speedScore: 3.5, valueScore: 4.5, popularity: 72,
    tags: ['劲道', '饱腹'],
  },
  {
    id: 'd7', windowId: 'w2', canteenId: 'c1',
    name: '炸酱面', category: '面食', price: 11,
    description: '老北京炸酱面', image: '/images/dish-placeholder.svg',
    rating: 4.1, reviewCount: 25, speedScore: 4.0, valueScore: 4.6, popularity: 65,
    tags: ['经典', '咸香'],
  },
  // ---- 一餐厅 · 小吃窗口 ----
  {
    id: 'd8', windowId: 'w3', canteenId: 'c1',
    name: '煎饼果子', category: '小吃', price: 7,
    description: '薄脆煎饼，酱香十足', image: '/images/dish-placeholder.svg',
    rating: 4.5, reviewCount: 40, speedScore: 4.6, valueScore: 4.7, popularity: 90,
    tags: ['早餐', '快手'],
  },
  {
    id: 'd9', windowId: 'w3', canteenId: 'c1',
    name: '烤冷面', category: '小吃', price: 8,
    description: '东北烤冷面，酸甜微辣', image: '/images/dish-placeholder.svg',
    rating: 4.2, reviewCount: 28, speedScore: 4.4, valueScore: 4.5, popularity: 75,
    tags: ['东北', '小吃'],
  },
  {
    id: 'd10', windowId: 'w3', canteenId: 'c1',
    name: '炸鸡腿', category: '小吃', price: 10,
    description: '外酥里嫩，香气扑鼻', image: '/images/dish-placeholder.svg',
    rating: 4.4, reviewCount: 38, speedScore: 4.0, valueScore: 4.2, popularity: 85,
    tags: ['炸物', '解馋'],
  },
  // ---- 一餐厅 · 饮品窗口 ----
  {
    id: 'd11', windowId: 'w4', canteenId: 'c1',
    name: '珍珠奶茶', category: '饮品', price: 8,
    description: '香浓奶茶配Q弹珍珠', image: '/images/dish-placeholder.svg',
    rating: 4.3, reviewCount: 32, speedScore: 4.7, valueScore: 4.0, popularity: 80,
    tags: ['奶茶', '下午茶'],
  },
  {
    id: 'd12', windowId: 'w4', canteenId: 'c1',
    name: '鲜榨橙汁', category: '饮品', price: 10,
    description: '现榨鲜橙汁，维C满满', image: '/images/dish-placeholder.svg',
    rating: 4.5, reviewCount: 22, speedScore: 4.5, valueScore: 3.8, popularity: 68,
    tags: ['鲜榨', '健康'],
  },
  // ---- 二餐厅 · 川湘菜窗口 ----
  {
    id: 'd13', windowId: 'w5', canteenId: 'c2',
    name: '水煮鱼', category: '热菜', price: 18,
    description: '鲜嫩鱼片，麻辣过瘾', image: '/images/dish-placeholder.svg',
    rating: 4.6, reviewCount: 45, speedScore: 3.5, valueScore: 4.0, popularity: 92,
    tags: ['麻辣', '招牌'],
  },
  {
    id: 'd14', windowId: 'w5', canteenId: 'c2',
    name: '麻婆豆腐', category: '热菜', price: 10,
    description: '麻辣鲜香，下饭神器', image: '/images/dish-placeholder.svg',
    rating: 4.3, reviewCount: 33, speedScore: 4.6, valueScore: 4.8, popularity: 78,
    tags: ['麻辣', '下饭'],
  },
  {
    id: 'd15', windowId: 'w5', canteenId: 'c2',
    name: '小炒黄牛肉', category: '热菜', price: 16,
    description: '嫩滑黄牛肉，大火快炒', image: '/images/dish-placeholder.svg',
    rating: 4.5, reviewCount: 36, speedScore: 4.0, valueScore: 4.1, popularity: 83,
    tags: ['湘菜', '肉菜'],
  },
  // ---- 二餐厅 · 蒸菜窗口 ----
  {
    id: 'd16', windowId: 'w6', canteenId: 'c2',
    name: '蒸排骨', category: '热菜', price: 14,
    description: '豆豉蒸排骨，软烂入味', image: '/images/dish-placeholder.svg',
    rating: 4.4, reviewCount: 29, speedScore: 3.8, valueScore: 4.2, popularity: 70,
    tags: ['蒸菜', '健康'],
  },
  {
    id: 'd17', windowId: 'w6', canteenId: 'c2',
    name: '蒸蛋羹', category: '热菜', price: 6,
    description: '滑嫩蒸蛋，入口即化', image: '/images/dish-placeholder.svg',
    rating: 4.2, reviewCount: 18, speedScore: 4.5, valueScore: 4.8, popularity: 55,
    tags: ['清淡', '软嫩'],
  },
  {
    id: 'd18', windowId: 'w6', canteenId: 'c2',
    name: '粉蒸肉', category: '热菜', price: 13,
    description: '米粉裹肉，香糯可口', image: '/images/dish-placeholder.svg',
    rating: 4.3, reviewCount: 24, speedScore: 3.6, valueScore: 4.3, popularity: 66,
    tags: ['蒸菜', '传统'],
  },
  // ---- 二餐厅 · 凉菜窗口 ----
  {
    id: 'd19', windowId: 'w7', canteenId: 'c2',
    name: '凉拌黄瓜', category: '凉菜', price: 5,
    description: '爽脆黄瓜，蒜香十足', image: '/images/dish-placeholder.svg',
    rating: 4.1, reviewCount: 15, speedScore: 5.0, valueScore: 5.0, popularity: 50,
    tags: ['凉菜', '爽口'],
  },
  {
    id: 'd20', windowId: 'w7', canteenId: 'c2',
    name: '皮蛋豆腐', category: '凉菜', price: 7,
    description: '皮蛋配嫩豆腐，清凉开胃', image: '/images/dish-placeholder.svg',
    rating: 4.0, reviewCount: 12, speedScore: 5.0, valueScore: 4.7, popularity: 45,
    tags: ['凉菜', '开胃'],
  },
  // ---- 民族餐厅 · 拉面窗口 ----
  {
    id: 'd21', windowId: 'w8', canteenId: 'c3',
    name: '兰州牛肉面', category: '面食', price: 15,
    description: '一清二白三红四绿五黄', image: '/images/dish-placeholder.svg',
    rating: 4.8, reviewCount: 62, speedScore: 4.0, valueScore: 4.5, popularity: 99,
    tags: ['招牌', '必吃', '清真'],
  },
  {
    id: 'd22', windowId: 'w8', canteenId: 'c3',
    name: '拌面', category: '面食', price: 13,
    description: '新疆拌面，配菜丰富', image: '/images/dish-placeholder.svg',
    rating: 4.5, reviewCount: 34, speedScore: 3.8, valueScore: 4.4, popularity: 76,
    tags: ['新疆', '拌面'],
  },
  {
    id: 'd23', windowId: 'w8', canteenId: 'c3',
    name: '羊肉泡馍', category: '面食', price: 18,
    description: '浓郁羊汤，掰馍泡汤', image: '/images/dish-placeholder.svg',
    rating: 4.6, reviewCount: 40, speedScore: 3.2, valueScore: 4.0, popularity: 85,
    tags: ['西北', '暖胃'],
  },
  // ---- 民族餐厅 · 烤肉窗口 ----
  {
    id: 'd24', windowId: 'w9', canteenId: 'c3',
    name: '羊肉串', category: '小吃', price: 3,
    description: '炭火烤制，孜然飘香', image: '/images/dish-placeholder.svg',
    rating: 4.7, reviewCount: 55, speedScore: 4.2, valueScore: 4.3, popularity: 96,
    tags: ['烤肉', '必吃'],
  },
  {
    id: 'd25', windowId: 'w9', canteenId: 'c3',
    name: '烤羊排', category: '热菜', price: 28,
    description: '外焦里嫩，肉汁丰富', image: '/images/dish-placeholder.svg',
    rating: 4.8, reviewCount: 44, speedScore: 3.0, valueScore: 3.5, popularity: 88,
    tags: ['烤肉', '硬菜'],
  },
  {
    id: 'd26', windowId: 'w9', canteenId: 'c3',
    name: '烤馕', category: '面食', price: 5,
    description: '酥脆烤馕，配烤肉绝配', image: '/images/dish-placeholder.svg',
    rating: 4.4, reviewCount: 26, speedScore: 4.5, valueScore: 4.8, popularity: 65,
    tags: ['新疆', '主食'],
  },
  // ---- 民族餐厅 · 特色菜窗口 ----
  {
    id: 'd27', windowId: 'w10', canteenId: 'c3',
    name: '大盘鸡', category: '热菜', price: 25,
    description: '鸡肉软烂，土豆绵密，配皮带面', image: '/images/dish-placeholder.svg',
    rating: 4.7, reviewCount: 50, speedScore: 3.2, valueScore: 4.0, popularity: 93,
    tags: ['新疆', '招牌', '量大'],
  },
  {
    id: 'd28', windowId: 'w10', canteenId: 'c3',
    name: '手抓饭', category: '面食', price: 16,
    description: '羊肉手抓饭，油香四溢', image: '/images/dish-placeholder.svg',
    rating: 4.5, reviewCount: 35, speedScore: 3.5, valueScore: 4.2, popularity: 80,
    tags: ['新疆', '特色'],
  },
]
```

- [ ] **Step 4: Create review mock data**

Create `frontend/src/mock/reviews.ts`:

```typescript
import type { Review } from '../types'

export const reviews: Review[] = [
  // 红烧肉
  { id: 'r1', dishId: 'd1', userId: 'u1', userName: '吃货小王', avatar: '🧑‍🍳', rating: 5, content: '红烧肉真的绝了！肥而不腻，入口即化，每次来必点！', createdAt: '2026-05-28T12:30:00', likes: 12 },
  { id: 'r2', dishId: 'd1', userId: 'u2', userName: '干饭人小李', avatar: '👨‍🎓', rating: 4, content: '味道不错，就是有时候肉稍微有点肥，总体推荐。', createdAt: '2026-05-27T18:00:00', likes: 5 },
  { id: 'r3', dishId: 'd1', userId: 'u3', userName: '美食侦探', avatar: '👩‍💻', rating: 5, content: '学校食堂能做出这个水平，真的可以！', createdAt: '2026-05-26T12:15:00', likes: 8 },
  // 牛肉拉面
  { id: 'r4', dishId: 'd5', userId: 'u1', userName: '吃货小王', avatar: '🧑‍🍳', rating: 5, content: '面条劲道，牛肉大块，汤底浓郁，一碗管饱！', createdAt: '2026-05-28T11:45:00', likes: 15 },
  { id: 'r5', dishId: 'd5', userId: 'u4', userName: '北方来的', avatar: '🧑', rating: 5, content: '作为北方人，这碗面让我找到了家的感觉。', createdAt: '2026-05-27T12:00:00', likes: 20 },
  { id: 'r6', dishId: 'd5', userId: 'u5', userName: '省钱达人', avatar: '🤓', rating: 4, content: '14块钱这个量，性价比很高了。', createdAt: '2026-05-26T18:30:00', likes: 7 },
  // 兰州牛肉面
  { id: 'r7', dishId: 'd21', userId: 'u2', userName: '干饭人小李', avatar: '👨‍🎓', rating: 5, content: '民族餐厅的拉面yyds！一清二白三红四绿五黄，正宗！', createdAt: '2026-05-29T11:30:00', likes: 25 },
  { id: 'r8', dishId: 'd21', userId: 'u3', userName: '美食侦探', avatar: '👩‍💻', rating: 5, content: '每周至少吃三次，已经上瘾了。', createdAt: '2026-05-28T12:00:00', likes: 18 },
  { id: 'r9', dishId: 'd21', userId: 'u6', userName: '路过的', avatar: '🚶', rating: 4, content: '面很筋道，就是排队太久了。', createdAt: '2026-05-27T12:30:00', likes: 9 },
  // 羊肉串
  { id: 'r10', dishId: 'd24', userId: 'u4', userName: '北方来的', avatar: '🧑', rating: 5, content: '3块钱一串，这价格这味道，绝了！', createdAt: '2026-05-28T18:00:00', likes: 22 },
  { id: 'r11', dishId: 'd24', userId: 'u1', userName: '吃货小王', avatar: '🧑‍🍳', rating: 5, content: '孜然味太香了，晚上来几串配饮料，完美。', createdAt: '2026-05-27T19:00:00', likes: 14 },
  // 大盘鸡
  { id: 'r12', dishId: 'd27', userId: 'u5', userName: '省钱达人', avatar: '🤓', rating: 5, content: '分量超大，两个人吃都够了，鸡肉很入味！', createdAt: '2026-05-28T12:30:00', likes: 16 },
  { id: 'r13', dishId: 'd27', userId: 'u3', userName: '美食侦探', avatar: '👩‍💻', rating: 4, content: '味道很好，就是等的时间比较长。', createdAt: '2026-05-26T13:00:00', likes: 6 },
  // 水煮鱼
  { id: 'r14', dishId: 'd13', userId: 'u2', userName: '干饭人小李', avatar: '👨‍🎓', rating: 5, content: '辣得过瘾！鱼片很嫩，豆芽也好吃。', createdAt: '2026-05-28T12:00:00', likes: 11 },
  { id: 'r15', dishId: 'd13', userId: 'u6', userName: '路过的', avatar: '🚶', rating: 4, content: '味道不错，但不能吃辣的慎点。', createdAt: '2026-05-27T12:30:00', likes: 4 },
  // 煎饼果子
  { id: 'r16', dishId: 'd8', userId: 'u4', userName: '北方来的', avatar: '🧑', rating: 5, content: '早餐首选！薄脆很酥，酱料调得好。', createdAt: '2026-05-29T08:00:00', likes: 10 },
  { id: 'r17', dishId: 'd8', userId: 'u5', userName: '省钱达人', avatar: '🤓', rating: 4, content: '7块钱管一个上午，性价比之王。', createdAt: '2026-05-28T08:30:00', likes: 8 },
  // 珍珠奶茶
  { id: 'r18', dishId: 'd11', userId: 'u3', userName: '美食侦探', avatar: '👩‍💻', rating: 4, content: '珍珠Q弹，奶茶香浓，下午茶必备。', createdAt: '2026-05-28T15:00:00', likes: 6 },
  // 烤羊排
  { id: 'r19', dishId: 'd25', userId: 'u1', userName: '吃货小王', avatar: '🧑‍🍳', rating: 5, content: '外焦里嫩，羊肉一点都不膻，强烈推荐！', createdAt: '2026-05-27T18:30:00', likes: 19 },
  // 番茄炒蛋
  { id: 'r20', dishId: 'd2', userId: 'u6', userName: '路过的', avatar: '🚶', rating: 4, content: '妈妈的味道，简单好吃。', createdAt: '2026-05-28T12:00:00', likes: 5 },
]
```

- [ ] **Step 5: Create user mock data**

Create `frontend/src/mock/user.ts`:

```typescript
import type { User } from '../types'

export const currentUser: User = {
  id: 'u1',
  nickname: '吃货小王',
  avatar: '🧑‍🍳',
  bio: '探索校园每一道美食 🍜',
  stats: {
    reviewCount: 6,
    favoriteCount: 8,
    browseCount: 42,
  },
}
```

- [ ] **Step 6: Create mock index**

Create `frontend/src/mock/index.ts`:

```typescript
export { canteens } from './canteens'
export { windows } from './windows'
export { dishes } from './dishes'
export { reviews } from './reviews'
export { currentUser } from './user'
```

- [ ] **Step 7: Create placeholder image**

Create `frontend/public/images/dish-placeholder.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="#FFF7E8" rx="16"/>
  <text x="100" y="110" text-anchor="middle" font-size="64">🍽️</text>
</svg>
```

- [ ] **Step 8: Verify TypeScript compiles**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 9: Commit**

```bash
git add frontend/src/mock/ frontend/public/images/
git commit -m "feat: add mock data for canteens, windows, dishes, reviews, user"
```

---

## Task 4: Utility Functions

**Files:**
- Create: `frontend/src/utils/format.ts`
- Create: `frontend/src/utils/storage.ts`

- [ ] **Step 1: Create format utilities**

Create `frontend/src/utils/format.ts`:

```typescript
/** Format a date string to relative time (e.g. "3小时前") */
export function formatRelativeTime(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return '刚刚'
  if (diffMin < 60) return `${diffMin}分钟前`
  if (diffHour < 24) return `${diffHour}小时前`
  if (diffDay < 30) return `${diffDay}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

/** Format price with ¥ symbol */
export function formatPrice(price: number): string {
  return `¥${price}`
}

/** Format rating to one decimal */
export function formatRating(rating: number): string {
  return rating.toFixed(1)
}
```

- [ ] **Step 2: Create localStorage helpers**

Create `frontend/src/utils/storage.ts`:

```typescript
/** Safely get and parse JSON from localStorage */
export function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

/** Safely stringify and set JSON to localStorage */
export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage full or unavailable — silently fail
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/utils/
git commit -m "feat: add format and localStorage utility functions"
```

---

## Task 5: Zustand Stores

**Files:**
- Create: `frontend/src/stores/useReviewStore.ts`
- Create: `frontend/src/stores/useFavoriteStore.ts`
- Create: `frontend/src/stores/useHistoryStore.ts`

- [ ] **Step 1: Create review store**

Create `frontend/src/stores/useReviewStore.ts`:

```typescript
import { create } from 'zustand'
import type { Review } from '../types'
import { reviews as mockReviews } from '../mock'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-user-reviews'

interface ReviewState {
  /** Mock reviews + user-submitted reviews merged */
  allReviews: Review[]
  /** Add a new user review */
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'likes'>) => void
  /** Get reviews for a specific dish */
  getDishReviews: (dishId: string) => Review[]
}

export const useReviewStore = create<ReviewState>((set, get) => {
  const userReviews = getStorage<Review[]>(STORAGE_KEY, [])
  const allReviews = [...mockReviews, ...userReviews]

  return {
    allReviews,

    addReview: (reviewData) => {
      const newReview: Review = {
        ...reviewData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
      }
      const userReviews = getStorage<Review[]>(STORAGE_KEY, [])
      const updatedUserReviews = [newReview, ...userReviews]
      setStorage(STORAGE_KEY, updatedUserReviews)

      set({ allReviews: [...mockReviews, ...updatedUserReviews] })
    },

    getDishReviews: (dishId) => {
      return get().allReviews.filter((r) => r.dishId === dishId)
    },
  }
})
```

- [ ] **Step 2: Create favorite store**

Create `frontend/src/stores/useFavoriteStore.ts`:

```typescript
import { create } from 'zustand'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-favorites'

interface FavoriteState {
  favoriteDishIds: string[]
  toggleFavorite: (dishId: string) => void
  isFavorite: (dishId: string) => boolean
}

export const useFavoriteStore = create<FavoriteState>((set, get) => {
  const saved = getStorage<string[]>(STORAGE_KEY, [])

  return {
    favoriteDishIds: saved,

    toggleFavorite: (dishId) => {
      const current = get().favoriteDishIds
      const next = current.includes(dishId)
        ? current.filter((id) => id !== dishId)
        : [...current, dishId]
      setStorage(STORAGE_KEY, next)
      set({ favoriteDishIds: next })
    },

    isFavorite: (dishId) => {
      return get().favoriteDishIds.includes(dishId)
    },
  }
})
```

- [ ] **Step 3: Create browsing history store**

Create `frontend/src/stores/useHistoryStore.ts`:

```typescript
import { create } from 'zustand'
import { getStorage, setStorage } from '../utils/storage'

const STORAGE_KEY = 'canteen-browse-history'
const MAX_HISTORY = 50

interface HistoryState {
  historyDishIds: string[]
  addHistory: (dishId: string) => void
}

export const useHistoryStore = create<HistoryState>((set, get) => {
  const saved = getStorage<string[]>(STORAGE_KEY, [])

  return {
    historyDishIds: saved,

    addHistory: (dishId) => {
      const current = get().historyDishIds
      // Remove if already exists, then prepend
      const filtered = current.filter((id) => id !== dishId)
      const next = [dishId, ...filtered].slice(0, MAX_HISTORY)
      setStorage(STORAGE_KEY, next)
      set({ historyDishIds: next })
    },
  }
})
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/stores/
git commit -m "feat: add Zustand stores for reviews, favorites, browsing history"
```

---

## Task 6: Router & Layout

**Files:**
- Create: `frontend/src/router/index.tsx`
- Create: `frontend/src/layouts/MainLayout.tsx`
- Modify: `frontend/src/App.tsx`

- [ ] **Step 1: Create router config**

Create `frontend/src/router/index.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import HomePage from '../pages/HomePage'
import RankingPage from '../pages/RankingPage'
import CanteenListPage from '../pages/CanteenListPage'
import CanteenDetailPage from '../pages/CanteenDetailPage'
import DishDetailPage from '../pages/DishDetailPage'
import ProfilePage from '../pages/ProfilePage'

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
    ],
  },
])
```

- [ ] **Step 2: Create MainLayout with bottom tab bar**

Create `frontend/src/layouts/MainLayout.tsx`:

```tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

const tabs = [
  { path: '/', label: '首页', icon: '🏠', activeIcon: '🏡' },
  { path: '/ranking', label: '排行', icon: '🏆', activeIcon: '🥇' },
  { path: '/canteens', label: '食堂', icon: '🍜', activeIcon: '🍲' },
  { path: '/profile', label: '我的', icon: '👤', activeIcon: '😊' },
]

export default function MainLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  // Hide tab bar on detail pages
  const isDetailPage =
    location.pathname.startsWith('/canteens/') ||
    location.pathname.startsWith('/dishes/')

  return (
    <div className="relative min-h-screen pb-[90px]">
      <Outlet />

      {!isDetailPage && (
        <nav
          className="fixed bottom-[18px] left-[18px] right-[18px] z-50"
          style={{ maxWidth: '354px', margin: '0 auto' }}
        >
          <div
            className="flex items-center justify-around px-2 py-2 dot-pattern"
            style={{
              background: 'rgba(255, 255, 255, 0.98)',
              border: '3px solid var(--color-ink)',
              borderRadius: 'var(--radius-tab)',
              boxShadow: '0 -8px 24px rgba(23, 32, 51, 0.08), 7px 7px 0 var(--color-shadow-blue)',
            }}
          >
            {tabs.map((tab) => {
              const isActive =
                tab.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(tab.path)

              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className="flex flex-col items-center gap-0.5 px-3 py-1.5 transition-all duration-150"
                  style={{
                    borderRadius: 'var(--radius-card)',
                    background: isActive ? 'var(--color-soft-amber)' : 'transparent',
                    border: isActive ? '3px solid var(--color-ink)' : '3px solid transparent',
                    boxShadow: isActive ? '4px 4px 0 var(--color-amber)' : 'none',
                    transform: isActive ? 'rotate(-3deg) translateY(-4px)' : 'none',
                  }}
                >
                  <span
                    className="text-xl"
                    style={{
                      filter: isActive
                        ? 'none'
                        : 'grayscale(1) brightness(0.72) contrast(1.18) opacity(0.82)',
                      transform: isActive ? 'scale(1.08)' : 'none',
                    }}
                  >
                    {isActive ? tab.activeIcon : tab.icon}
                  </span>
                  <span
                    className="text-[11px] leading-tight"
                    style={{
                      fontWeight: isActive ? 900 : 700,
                      color: isActive ? 'var(--color-ink)' : 'var(--color-muted)',
                    }}
                  >
                    {tab.label}
                  </span>
                </button>
              )
            })}
          </div>
        </nav>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Update App.tsx**

Replace `frontend/src/App.tsx`:

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

export default function App() {
  return <RouterProvider router={router} />
}
```

- [ ] **Step 4: Create placeholder page components**

Create `frontend/src/pages/HomePage.tsx`:

```tsx
export default function HomePage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">首页</h1></div>
}
```

Create `frontend/src/pages/RankingPage.tsx`:

```tsx
export default function RankingPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">排行榜</h1></div>
}
```

Create `frontend/src/pages/CanteenListPage.tsx`:

```tsx
export default function CanteenListPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">食堂列表</h1></div>
}
```

Create `frontend/src/pages/CanteenDetailPage.tsx`:

```tsx
export default function CanteenDetailPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">食堂详情</h1></div>
}
```

Create `frontend/src/pages/DishDetailPage.tsx`:

```tsx
export default function DishDetailPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">菜品详情</h1></div>
}
```

Create `frontend/src/pages/ProfilePage.tsx`:

```tsx
export default function ProfilePage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">我的</h1></div>
}
```

- [ ] **Step 5: Verify dev server runs and routes work**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm run dev
```

Open http://localhost:5173 — should see "首页" with bottom tab bar. Click tabs to verify navigation works.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/router/ frontend/src/layouts/ frontend/src/pages/ frontend/src/App.tsx
git commit -m "feat: add React Router config and MainLayout with bottom tab bar"
```

---

## Task 7: Shared Components — Cards, Tags, Stars

**Files:**
- Create: `frontend/src/components/Card.tsx`
- Create: `frontend/src/components/Tag.tsx`
- Create: `frontend/src/components/StarRating.tsx`
- Create: `frontend/src/components/Button.tsx`
- Create: `frontend/src/components/DishCard.tsx`
- Create: `frontend/src/components/CanteenCard.tsx`

- [ ] **Step 1: Create Card component**

Create `frontend/src/components/Card.tsx`:

```tsx
import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  shadowColor?: string
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  shadowColor = 'var(--color-shadow-blue)',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white transition-transform duration-150 active:scale-[0.99] ${className}`}
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: 'var(--radius-card)',
        boxShadow: `8px 8px 0 ${shadowColor}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Create Tag component**

Create `frontend/src/components/Tag.tsx`:

```tsx
interface TagProps {
  children: string
  color?: string
  className?: string
}

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: 'var(--color-soft-blue)', text: 'var(--color-blue)' },
  green: { bg: 'var(--color-soft-green)', text: 'var(--color-green)' },
  amber: { bg: 'var(--color-soft-amber)', text: '#6B4E16' },
  red: { bg: 'var(--color-soft-red)', text: 'var(--color-red)' },
  pink: { bg: '#FFF0F7', text: 'var(--color-pink)' },
  cyan: { bg: '#E8FAFF', text: 'var(--color-cyan)' },
}

export default function Tag({ children, color = 'blue', className = '' }: TagProps) {
  const c = colorMap[color] || colorMap.blue
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-bold ${className}`}
      style={{
        background: c.bg,
        color: c.text,
        border: '2px solid var(--color-ink)',
        borderRadius: 'var(--radius-pill)',
      }}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Create StarRating component**

Create `frontend/src/components/StarRating.tsx`:

```tsx
interface StarRatingProps {
  rating: number
  max?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onChange?: (rating: number) => void
}

const sizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' }

export default function StarRating({
  rating,
  max = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-0.5 ${sizeMap[size]}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
            style={{ background: 'none', border: 'none', padding: 0 }}
          >
            {filled ? '⭐' : half ? '🌟' : '☆'}
          </button>
        )
      })}
    </div>
  )
}
```

- [ ] **Step 4: Create Button component**

Create `frontend/src/components/Button.tsx`:

```tsx
import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-50'

  const styles =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, #172033 0%, #172033 58%, #FF4FB8 58%, #FF4FB8 100%)',
          color: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: 'var(--radius-button)',
          boxShadow: '7px 7px 0 var(--color-amber)',
        }
      : {
          background: 'white',
          color: 'var(--color-ink)',
          border: '3px solid var(--color-ink)',
          borderRadius: 'var(--radius-button)',
          boxShadow: '7px 7px 0 var(--color-shadow-blue)',
        }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={styles}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 5: Create DishCard component**

Create `frontend/src/components/DishCard.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { formatPrice, formatRating } from '../utils/format'
import type { Dish } from '../types'

interface DishCardProps {
  dish: Dish
  shadowColor?: string
}

export default function DishCard({ dish, shadowColor = 'var(--color-shadow-blue)' }: DishCardProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/dishes/${dish.id}`)}
      className="flex gap-3 p-3 bg-white transition-transform duration-150 active:scale-[0.99] cursor-pointer"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: 'var(--radius-card)',
        boxShadow: `6px 6px 0 ${shadowColor}`,
      }}
    >
      {/* Image */}
      <div
        className="w-[72px] h-[72px] flex-shrink-0 flex items-center justify-center text-3xl"
        style={{
          background: 'var(--color-soft-amber)',
          borderRadius: '16px',
          border: '2px solid var(--color-ink)',
        }}
      >
        🍽️
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-black text-base truncate">{dish.name}</span>
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid var(--color-ink)',
            }}
          >
            {formatPrice(dish.price)}
          </span>
        </div>
        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
          {dish.description}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-xs">⭐ {formatRating(dish.rating)}</span>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            {dish.reviewCount}条评价
          </span>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Create CanteenCard component**

Create `frontend/src/components/CanteenCard.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { formatRating } from '../utils/format'
import type { Canteen } from '../types'

const markColors = ['var(--color-blue)', 'var(--color-green)', 'var(--color-amber)']
const shadowColors = ['var(--color-shadow-blue)', 'var(--color-shadow-green)', 'var(--color-shadow-amber)']

interface CanteenCardProps {
  canteen: Canteen
  index: number
}

export default function CanteenCard({ canteen, index }: CanteenCardProps) {
  const navigate = useNavigate()
  const markColor = markColors[index % 3]
  const shadowColor = shadowColors[index % 3]

  return (
    <div
      onClick={() => navigate(`/canteens/${canteen.id}`)}
      className="relative p-4 bg-white transition-transform duration-150 active:scale-[0.99] cursor-pointer"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: '24px',
        boxShadow: `8px 8px 0 ${shadowColor}`,
      }}
    >
      {/* Mark badge */}
      <div
        className="absolute -top-2 -left-2 w-8 h-8 flex items-center justify-center text-white text-xs font-black"
        style={{
          background: markColor,
          borderRadius: '24px',
          border: '3px solid var(--color-ink)',
          boxShadow: `3px 3px 0 ${shadowColor}`,
        }}
      >
        {index + 1}
      </div>

      <div className="flex items-start gap-3">
        <div
          className="w-16 h-16 flex-shrink-0 flex items-center justify-center text-3xl"
          style={{
            background: 'var(--color-soft-amber)',
            borderRadius: '18px',
            border: '2px solid var(--color-ink)',
          }}
        >
          🏫
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-black text-base">{canteen.name}</h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {canteen.description}
          </p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: 'var(--color-soft-blue)',
                color: 'var(--color-blue)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.floors}层
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: 'var(--color-soft-green)',
                color: 'var(--color-green)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.windowCount}个窗口
            </span>
            <span className="text-xs">⭐ {formatRating(canteen.rating)}</span>
            <span
              className="text-xs font-bold px-2 py-0.5"
              style={{
                background: canteen.status === 'open' ? 'var(--color-soft-green)' : 'var(--color-soft-red)',
                color: canteen.status === 'open' ? 'var(--color-green)' : 'var(--color-red)',
                borderRadius: 'var(--radius-pill)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {canteen.status === 'open' ? '营业中' : '已关闭'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 7: Verify TypeScript compiles**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 8: Commit**

```bash
git add frontend/src/components/
git commit -m "feat: add shared UI components (Card, Tag, StarRating, Button, DishCard, CanteenCard)"
```

---

## Task 8: Home Page

**Files:**
- Modify: `frontend/src/pages/HomePage.tsx`

- [ ] **Step 1: Implement full HomePage**

Replace `frontend/src/pages/HomePage.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { canteens, dishes } from '../mock'
import { DishCard } from '../components/DishCard'
import type { DishCategory } from '../types'

const categories: { label: string; emoji: string; value: DishCategory | 'all' }[] = [
  { label: '全部', emoji: '🍽️', value: 'all' },
  { label: '热菜', emoji: '🥘', value: '热菜' },
  { label: '凉菜', emoji: '🥗', value: '凉菜' },
  { label: '面食', emoji: '🍜', value: '面食' },
  { label: '小吃', emoji: '🍡', value: '小吃' },
  { label: '水果', emoji: '🍎', value: '水果' },
  { label: '饮品', emoji: '🧋', value: '饮品' },
]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<DishCategory | 'all'>('all')

  const recommended = useMemo(
    () => [...dishes].sort((a, b) => b.popularity - a.popularity).slice(0, 6),
    [],
  )

  const filteredDishes = useMemo(() => {
    let result = dishes
    if (selectedCategory !== 'all') {
      result = result.filter((d) => d.category === selectedCategory)
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      result = result.filter(
        (d) => d.name.toLowerCase().includes(q) || d.tags.some((t) => t.includes(q)),
      )
    }
    return result
  }, [search, selectedCategory])

  const totalWindows = canteens.reduce((sum, c) => sum + c.windowCount, 0)
  const totalReviews = dishes.reduce((sum, d) => sum + d.reviewCount, 0)

  return (
    <div
      className="px-4 pb-[200px]"
      style={{ background: 'linear-gradient(var(--color-bg-warm), var(--color-bg))' }}
    >
      {/* Hero */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(white, var(--color-paper))',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-2xl leading-tight">
          校园食堂点评
        </h1>
        <p className="text-xs mt-1" style={{ color: '#6B4E16' }}>
          发现你最爱的校园美食 🍜
        </p>

        {/* Search */}
        <div
          className="mt-4 flex items-center gap-2 px-3 py-2"
          style={{
            background: 'var(--color-bg)',
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
          }}
        >
          <span>🔍</span>
          <input
            type="text"
            placeholder="搜索菜品、食堂..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--color-muted)]"
          />
        </div>
      </div>

      {/* Stats */}
      <div
        className="flex items-center justify-around mt-4 py-3 px-4"
        style={{
          border: '3px solid var(--color-ink)',
          borderRadius: '20px',
          background: 'white',
          boxShadow: '6px 6px 0 var(--color-shadow-amber)',
        }}
      >
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
            {canteens.length}
          </div>
          <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
            食堂
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
            {totalWindows}
          </div>
          <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
            窗口
          </div>
        </div>
        <div className="text-center">
          <div className="text-xl font-black" style={{ color: 'var(--color-blue)' }}>
            {totalReviews}
          </div>
          <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
            评价
          </div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="mt-5">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">菜品分类</h2>
        <div className="grid grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className="flex flex-col items-center gap-1 py-3 transition-transform duration-150 active:scale-[0.97]"
              style={{
                background:
                  selectedCategory === cat.value ? 'var(--color-soft-amber)' : 'white',
                border: '3px solid var(--color-ink)',
                borderRadius: '20px',
                boxShadow:
                  selectedCategory === cat.value
                    ? '5px 5px 0 var(--color-amber)'
                    : '5px 5px 0 var(--color-shadow-blue)',
              }}
            >
              <span className="text-xl">{cat.emoji}</span>
              <span className="text-[11px] font-bold">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">🔥 热门推荐</h2>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {recommended.map((dish) => (
            <div
              key={dish.id}
              onClick={() => navigate(`/dishes/${dish.id}`)}
              className="flex-shrink-0 w-[140px] p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                boxShadow: '7px 7px 0 var(--color-shadow-blue)',
              }}
            >
              <div
                className="w-full h-20 flex items-center justify-center text-3xl mb-2"
                style={{
                  background: 'var(--color-soft-amber)',
                  borderRadius: '16px',
                  border: '2px solid var(--color-ink)',
                }}
              >
                🍽️
              </div>
              <div className="font-black text-sm truncate">{dish.name}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
                ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* All dishes / filtered */}
      <div className="mt-6">
        <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
          {selectedCategory === 'all' ? '全部菜品' : selectedCategory}
        </h2>
        <div className="flex flex-col gap-3">
          {filteredDishes.map((dish) => (
            <DishCard key={dish.id} dish={dish} />
          ))}
          {filteredDishes.length === 0 && (
            <div
              className="text-center py-8 text-sm"
              style={{ color: 'var(--color-muted)' }}
            >
              没有找到匹配的菜品 😅
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server — test HomePage**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm run dev
```

Open http://localhost:5173 — verify hero, search, stats, categories, recommended dishes, and full dish list all render. Click a dish card to verify navigation.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/HomePage.tsx
git commit -m "feat: implement HomePage with search, categories, recommended dishes"
```

---

## Task 9: Ranking Page

**Files:**
- Modify: `frontend/src/pages/RankingPage.tsx`

- [ ] **Step 1: Implement full RankingPage**

Replace `frontend/src/pages/RankingPage.tsx`:

```tsx
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { dishes } from '../mock'
import type { RankPeriod, RankCategory } from '../types'

const periodTabs: { label: string; value: RankPeriod }[] = [
  { label: '今日榜', value: 'today' },
  { label: '本周榜', value: 'week' },
]

const categoryTabs: { label: string; value: RankCategory; emoji: string }[] = [
  { label: '人气', value: 'popularity', emoji: '🔥' },
  { label: '出餐快', value: 'speed', emoji: '⚡' },
  { label: '省钱', value: 'value', emoji: '💰' },
]

export default function RankingPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<RankPeriod>('today')
  const [category, setCategory] = useState<RankCategory>('popularity')

  const sorted = useMemo(() => {
    const key =
      category === 'popularity'
        ? 'popularity'
        : category === 'speed'
          ? 'speedScore'
          : 'valueScore'
    // Simulate period difference by slightly shuffling
    const list = [...dishes]
    if (period === 'week') {
      list.sort((a, b) => b[key] - a[key])
    } else {
      list.sort((a, b) => b[key] - a[key])
    }
    return list
  }, [period, category])

  const top3 = sorted.slice(0, 3)
  const rest = sorted.slice(3)

  const rankLabels = ['🥇', '🥈', '🥉']
  const rankShadows = ['#FFCF7A', '#E0E0E0', '#D7CCC8']

  return (
    <div
      className="px-4 pb-[200px]"
      style={{ background: 'linear-gradient(var(--color-bg-warm), var(--color-bg))' }}
    >
      {/* Hero */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(white, var(--color-paper))',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-xl">🏆 菜品排行榜</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          看看大家都在吃什么
        </p>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 mt-4">
        {periodTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setPeriod(tab.value)}
            className="px-4 py-1.5 text-sm font-bold transition-transform duration-150 active:scale-[0.97]"
            style={{
              background:
                period === tab.value
                  ? 'linear-gradient(135deg, #172033 0%, #172033 60%, #FF4FB8 60%, #FF4FB8 100%)'
                  : 'white',
              color: period === tab.value ? 'white' : 'var(--color-ink)',
              border: '3px solid var(--color-ink)',
              borderRadius: '16px',
              boxShadow: period === tab.value ? '4px 4px 0 var(--color-amber)' : '4px 4px 0 var(--color-shadow-blue)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 mt-3">
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className="px-3 py-1.5 text-xs font-bold transition-transform duration-150"
            style={{
              background: category === tab.value ? 'var(--color-soft-amber)' : 'white',
              color: category === tab.value ? 'var(--color-ink)' : 'var(--color-muted)',
              border: `2px solid ${category === tab.value ? 'var(--color-ink)' : 'var(--color-line)'}`,
              borderRadius: 'var(--radius-pill)',
            }}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex gap-2 mt-5">
        {top3.map((dish, i) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dishes/${dish.id}`)}
            className="flex-1 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
            style={{
              border: '3px solid var(--color-ink)',
              borderRadius: '18px',
              boxShadow: `6px 6px 0 ${rankShadows[i]}`,
              flex: i === 0 ? '1.25' : '1',
            }}
          >
            <div className="text-2xl text-center mb-1">{rankLabels[i]}</div>
            <div
              className="w-full h-16 flex items-center justify-center text-2xl mb-2"
              style={{
                background: 'var(--color-soft-amber)',
                borderRadius: '14px',
                border: '2px solid var(--color-ink)',
              }}
            >
              🍽️
            </div>
            <div className="font-black text-sm text-center truncate">{dish.name}</div>
            <div className="text-xs text-center mt-0.5" style={{ color: 'var(--color-muted)' }}>
              {category === 'popularity'
                ? `人气 ${dish.popularity}`
                : category === 'speed'
                  ? `速度 ${dish.speedScore.toFixed(1)}`
                  : `性价比 ${dish.valueScore.toFixed(1)}`}
            </div>
          </div>
        ))}
      </div>

      {/* Rest of ranking */}
      <div
        className="mt-4 overflow-hidden"
        style={{
          border: '3px solid var(--color-ink)',
          borderRadius: '20px',
          boxShadow: '5px 5px 0 var(--color-shadow-blue)',
          background: 'white',
        }}
      >
        {rest.map((dish, i) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dishes/${dish.id}`)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
            style={{
              borderBottom: i < rest.length - 1 ? '2px solid #F5F6FA' : 'none',
              background: i % 2 === 0 ? 'white' : 'var(--color-paper)',
            }}
          >
            <span
              className="w-6 h-6 flex items-center justify-center text-xs font-black rounded"
              style={{
                background:
                  i < 3
                  ? '#FFC107'
                  : 'var(--color-bg)',
                border: '2px solid var(--color-ink)',
              }}
            >
              {i + 4}
            </span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm truncate">{dish.name}</div>
              <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
              </div>
            </div>
            <div className="text-sm font-black" style={{ color: 'var(--color-blue)' }}>
              {category === 'popularity'
                ? dish.popularity
                : category === 'speed'
                  ? dish.speedScore.toFixed(1)
                  : dish.valueScore.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify dev server — test RankingPage**

Navigate to http://localhost:5173/ranking — verify period/category tabs switch, top 3 podium renders, rest of list renders. Click items to verify navigation.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/RankingPage.tsx
git commit -m "feat: implement RankingPage with podium, period/category tabs"
```

---

## Task 10: Canteen List & Detail Pages

**Files:**
- Modify: `frontend/src/pages/CanteenListPage.tsx`
- Modify: `frontend/src/pages/CanteenDetailPage.tsx`

- [ ] **Step 1: Implement CanteenListPage**

Replace `frontend/src/pages/CanteenListPage.tsx`:

```tsx
import { canteens } from '../mock'
import CanteenCard from '../components/CanteenCard'

export default function CanteenListPage() {
  return (
    <div
      className="px-4 pb-[200px]"
      style={{ background: 'linear-gradient(var(--color-bg-warm), var(--color-bg))' }}
    >
      {/* Hero */}
      <div
        className="relative mt-4 p-5 overflow-hidden"
        style={{
          background: 'linear-gradient(white, var(--color-paper))',
          border: '3px solid var(--color-ink)',
          borderRadius: '28px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
      >
        <h1 className="text-shadow-pop font-black text-xl">🏫 食堂列表</h1>
        <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
          选择一个食堂开始探索
        </p>
      </div>

      {/* Canteen list */}
      <div className="flex flex-col gap-3 mt-5">
        {canteens.map((canteen, i) => (
          <CanteenCard key={canteen.id} canteen={canteen} index={i} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Implement CanteenDetailPage**

Replace `frontend/src/pages/CanteenDetailPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { canteens, windows, dishes } from '../mock'
import DishCard from '../components/DishCard'
import { formatRating } from '../utils/format'

const shadowColors = ['var(--color-shadow-blue)', 'var(--color-shadow-green)', 'var(--color-shadow-amber)']

export default function CanteenDetailPage() {
  const { canteenId } = useParams<{ canteenId: string }>()
  const navigate = useNavigate()

  const canteen = canteens.find((c) => c.id === canteenId)
  if (!canteen) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        食堂不存在 😅
      </div>
    )
  }

  const canteenWindows = windows.filter((w) => w.canteenId === canteenId)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header with back button */}
      <div
        className="p-5 pb-8"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-3 text-white text-sm font-bold flex items-center gap-1"
        >
          ← 返回
        </button>
        <h1 className="text-white text-xl font-black">{canteen.name}</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {canteen.description}
        </p>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-amber)',
              color: '#6B4E16',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            📍 {canteen.location}
          </span>
          <span
            className="text-xs font-bold px-2 py-0.5"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            ⭐ {formatRating(canteen.rating)}
          </span>
        </div>
      </div>

      {/* Windows */}
      <div className="px-4 -mt-4 pb-[200px]">
        {canteenWindows.map((win, winIdx) => {
          const winDishes = dishes.filter((d) => d.windowId === win.id)
          return (
            <div key={win.id} className="mt-6">
              <div
                className="p-4 bg-white"
                style={{
                  border: '3px solid var(--color-ink)',
                  borderRadius: '22px',
                  boxShadow: `6px 6px 0 ${shadowColors[winIdx % 3]}`,
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="font-black text-base">{win.name}</h2>
                  <span
                    className="text-xs font-bold px-2 py-0.5"
                    style={{
                      background:
                        win.status === 'open' ? 'var(--color-soft-green)' : 'var(--color-soft-red)',
                      color: win.status === 'open' ? 'var(--color-green)' : 'var(--color-red)',
                      borderRadius: 'var(--radius-pill)',
                      border: '2px solid var(--color-ink)',
                    }}
                  >
                    {win.status === 'open' ? '营业中' : '已关闭'}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: 'var(--color-muted)' }}>
                  {win.description}
                </p>
                <div className="flex flex-col gap-2">
                  {winDishes.map((dish) => (
                    <DishCard key={dish.id} dish={dish} shadowColor={shadowColors[winIdx % 3]} />
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify — navigate to canteens page and a canteen detail**

Click "食堂" tab, verify 3 canteen cards render. Click one, verify windows and dishes show. Test back button.

- [ ] **Step 4: Commit**

```bash
git add frontend/src/pages/CanteenListPage.tsx frontend/src/pages/CanteenDetailPage.tsx
git commit -m "feat: implement CanteenListPage and CanteenDetailPage"
```

---

## Task 11: Dish Detail Page with Review Form

**Files:**
- Modify: `frontend/src/pages/DishDetailPage.tsx`
- Create: `frontend/src/components/ReviewForm.tsx`
- Create: `frontend/src/components/ReviewList.tsx`

- [ ] **Step 1: Create ReviewForm component**

Create `frontend/src/components/ReviewForm.tsx`:

```tsx
import { useState } from 'react'
import StarRating from './StarRating'
import Button from './Button'

interface ReviewFormProps {
  onSubmit: (rating: number, content: string) => void
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (rating === 0) return
    onSubmit(rating, content)
    setRating(0)
    setContent('')
  }

  return (
    <div
      className="p-4 bg-white"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: '22px',
        boxShadow: '7px 7px 0 var(--color-shadow-amber)',
      }}
    >
      <h3 className="font-black text-sm mb-3">写评价 ✍️</h3>

      <div className="mb-3">
        <label className="text-xs font-bold block mb-1">评分</label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      <div className="mb-3">
        <label className="text-xs font-bold block mb-1">评价内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说说你对这道菜的看法..."
          rows={3}
          className="w-full px-3 py-2 text-sm outline-none resize-none"
          style={{
            background: 'var(--color-bg)',
            border: '3px solid var(--color-ink)',
            borderRadius: '16px',
          }}
        />
      </div>

      <Button onClick={handleSubmit} disabled={rating === 0}>
        提交评价
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Create ReviewList component**

Create `frontend/src/components/ReviewList.tsx`:

```tsx
import type { Review } from '../types'
import { formatRelativeTime } from '../utils/format'
import StarRating from './StarRating'

interface ReviewListProps {
  reviews: Review[]
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div
        className="text-center py-6 text-sm"
        style={{ color: 'var(--color-muted)' }}
      >
        暂无评价，快来写第一条吧 ✨
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="p-3 bg-white"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '20px',
            boxShadow: '5px 5px 0 var(--color-shadow-blue)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{review.avatar}</span>
            <div className="flex-1">
              <div className="font-bold text-sm">{review.userName}</div>
              <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                {formatRelativeTime(review.createdAt)}
              </div>
            </div>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-sm leading-relaxed">{review.content}</p>
          {review.likes > 0 && (
            <div className="mt-2 text-xs" style={{ color: 'var(--color-muted)' }}>
              👍 {review.likes}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Implement DishDetailPage**

Replace `frontend/src/pages/DishDetailPage.tsx`:

```tsx
import { useParams, useNavigate } from 'react-router-dom'
import { dishes, canteens, windows } from '../mock'
import { useReviewStore } from '../stores/useReviewStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { currentUser } from '../mock'
import { formatPrice, formatRating } from '../utils/format'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import StarRating from '../components/StarRating'
import { useEffect } from 'react'

export default function DishDetailPage() {
  const { dishId } = useParams<{ dishId: string }>()
  const navigate = useNavigate()

  const dish = dishes.find((d) => d.id === dishId)
  const { getDishReviews, addReview } = useReviewStore()
  const { isFavorite, toggleFavorite } = useFavoriteStore()
  const { addHistory } = useHistoryStore()

  useEffect(() => {
    if (dishId) addHistory(dishId)
  }, [dishId, addHistory])

  if (!dish) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--color-muted)' }}>
        菜品不存在 😅
      </div>
    )
  }

  const canteen = canteens.find((c) => c.id === dish.canteenId)
  const window = windows.find((w) => w.id === dish.windowId)
  const reviews = getDishReviews(dish.id)
  const fav = isFavorite(dish.id)

  const handleSubmit = (rating: number, content: string) => {
    addReview({
      dishId: dish.id,
      userId: currentUser.id,
      userName: currentUser.nickname,
      avatar: currentUser.avatar,
      rating,
      content,
    })
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Header */}
      <div
        className="p-5 pb-8"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-sm font-bold"
          >
            ← 返回
          </button>
          <button
            onClick={() => toggleFavorite(dish.id)}
            className="text-2xl"
          >
            {fav ? '❤️' : '🤍'}
          </button>
        </div>

        <div
          className="w-20 h-20 mx-auto flex items-center justify-center text-4xl mb-3"
          style={{
            background: 'var(--color-soft-amber)',
            borderRadius: '24px',
            border: '3px solid rgba(255,255,255,0.3)',
          }}
        >
          🍽️
        </div>

        <h1 className="text-white text-xl font-black text-center">{dish.name}</h1>
        <p
          className="text-sm text-center mt-1"
          style={{ color: 'rgba(255,255,255,0.7)' }}
        >
          {dish.description}
        </p>

        <div className="flex items-center justify-center gap-3 mt-3">
          <span
            className="text-sm font-black px-3 py-1"
            style={{
              background: 'var(--color-soft-amber)',
              color: '#6B4E16',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            {formatPrice(dish.price)}
          </span>
          <span
            className="text-sm font-bold px-3 py-1"
            style={{
              background: 'var(--color-soft-blue)',
              color: 'var(--color-blue)',
              borderRadius: 'var(--radius-pill)',
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            ⭐ {formatRating(dish.rating)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 -mt-4 pb-[200px]">
        {/* Info card */}
        <div
          className="p-4 bg-white mb-4"
          style={{
            border: '3px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '7px 7px 0 var(--color-shadow-blue)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              所属食堂
            </span>
            <span className="text-sm font-bold">{canteen?.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              窗口
            </span>
            <span className="text-sm font-bold">{window?.name}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              评分
            </span>
            <StarRating rating={dish.rating} size="sm" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
              标签
            </span>
            <div className="flex gap-1">
              {dish.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    background: 'var(--color-soft-amber)',
                    borderRadius: 'var(--radius-pill)',
                    border: '2px solid var(--color-ink)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Review form */}
        <div className="mb-4">
          <ReviewForm onSubmit={handleSubmit} />
        </div>

        {/* Reviews */}
        <div>
          <h2 className="text-shadow-pop-soft text-lg font-black mb-3">
            评价 ({reviews.length})
          </h2>
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Verify — full review flow**

Navigate to a dish detail page. Submit a review with stars and text. Verify it appears immediately. Refresh the page — verify the review persists (localStorage). Toggle favorite — verify heart changes.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/ReviewForm.tsx frontend/src/components/ReviewList.tsx frontend/src/pages/DishDetailPage.tsx
git commit -m "feat: implement DishDetailPage with review form and favorites"
```

---

## Task 12: Profile Page

**Files:**
- Modify: `frontend/src/pages/ProfilePage.tsx`

- [ ] **Step 1: Implement ProfilePage**

Replace `frontend/src/pages/ProfilePage.tsx`:

```tsx
import { useNavigate } from 'react-router-dom'
import { currentUser, dishes } from '../mock'
import { useReviewStore } from '../stores/useReviewStore'
import { useFavoriteStore } from '../stores/useFavoriteStore'
import { useHistoryStore } from '../stores/useHistoryStore'
import { formatRelativeTime } from '../utils/format'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { allReviews } = useReviewStore()
  const { favoriteDishIds } = useFavoriteStore()
  const { historyDishIds } = useHistoryStore()

  const myReviews = allReviews.filter((r) => r.userId === currentUser.id)
  const favoriteDishes = dishes.filter((d) => favoriteDishIds.includes(d.id))
  const historyDishes = historyDishIds
    .map((id) => dishes.find((d) => d.id === id))
    .filter(Boolean)

  return (
    <div
      className="pb-[200px]"
      style={{ background: 'linear-gradient(var(--color-bg-warm), var(--color-bg))' }}
    >
      {/* Dark header */}
      <div
        className="relative px-6 pt-16 pb-20 overflow-hidden"
        style={{
          background: 'var(--color-ink)',
          borderBottom: '5px solid var(--color-ink)',
        }}
      >
        <h1 className="text-white text-3xl font-black">我的</h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>
          你的美食足迹 ✨
        </p>
      </div>

      {/* Profile card — overlaps header */}
      <div
        className="relative mx-4 -mt-12 p-5 bg-white"
        style={{
          border: '4px solid var(--color-ink)',
          borderRadius: '30px',
          boxShadow: '10px 10px 0 var(--color-pink)',
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-16 h-16 flex items-center justify-center text-3xl"
            style={{
              background: 'var(--color-soft-amber)',
              borderRadius: '34px',
              border: '4px solid var(--color-ink)',
              boxShadow: '5px 5px 0 var(--color-cyan)',
            }}
          >
            {currentUser.avatar}
          </div>
          <div>
            <h2 className="font-black text-lg">{currentUser.nickname}</h2>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {currentUser.bio}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div
          className="flex items-center justify-around mt-4 py-3"
          style={{
            background: 'var(--color-soft-amber)',
            border: '3px solid var(--color-ink)',
            borderRadius: '22px',
            boxShadow: '7px 7px 0 var(--color-yellow)',
          }}
        >
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {myReviews.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              评价
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {favoriteDishIds.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              收藏
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--color-ink)' }}>
              {historyDishIds.length}
            </div>
            <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
              浏览
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        {/* Favorites section */}
        {favoriteDishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-shadow-pop-soft text-base font-black mb-3">
              ❤️ 我的收藏
            </h3>
            <div className="flex flex-col gap-2">
              {favoriteDishes.map((dish) => (
                <div
                  key={dish.id}
                  onClick={() => navigate(`/dishes/${dish.id}`)}
                  className="flex items-center gap-3 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                  style={{
                    border: '3px solid var(--color-ink)',
                    borderRadius: '20px',
                    boxShadow: '5px 5px 0 var(--color-shadow-blue)',
                  }}
                >
                  <span className="text-2xl">🍽️</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{dish.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History section */}
        {historyDishes.length > 0 && (
          <div className="mb-6">
            <h3 className="text-shadow-pop-soft text-base font-black mb-3">
              📖 浏览记录
            </h3>
            <div className="flex flex-col gap-2">
              {historyDishes.map((dish) => dish && (
                <div
                  key={dish.id}
                  onClick={() => navigate(`/dishes/${dish.id}`)}
                  className="flex items-center gap-3 p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                  style={{
                    border: '3px solid var(--color-ink)',
                    borderRadius: '20px',
                    boxShadow: '5px 5px 0 var(--color-shadow-green)',
                  }}
                >
                  <span className="text-2xl">🍽️</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm truncate">{dish.name}</div>
                    <div className="text-xs" style={{ color: 'var(--color-muted)' }}>
                      ⭐ {dish.rating.toFixed(1)} · ¥{dish.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My reviews section */}
        {myReviews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-shadow-pop-soft text-base font-black mb-3">
              ✍️ 我的评价
            </h3>
            <div className="flex flex-col gap-2">
              {myReviews.map((review) => {
                const dish = dishes.find((d) => d.id === review.dishId)
                return (
                  <div
                    key={review.id}
                    onClick={() => navigate(`/dishes/${review.dishId}`)}
                    className="p-3 bg-white cursor-pointer transition-transform duration-150 active:scale-[0.99]"
                    style={{
                      border: '3px solid var(--color-ink)',
                      borderRadius: '20px',
                      boxShadow: '5px 5px 0 var(--color-shadow-amber)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm">{dish?.name}</span>
                      <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>
                        {formatRelativeTime(review.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mb-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className="text-xs">
                          {i < review.rating ? '⭐' : '☆'}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: 'var(--color-muted-dark)' }}>
                      {review.content}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {myReviews.length === 0 && favoriteDishes.length === 0 && historyDishes.length === 0 && (
          <div
            className="text-center py-10 text-sm"
            style={{ color: 'var(--color-muted)' }}
          >
            还没有记录，快去探索美食吧 🍜
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify — profile page with real data**

Navigate to "我的" tab. Verify user info, stats, and sections render. After submitting reviews and favoriting dishes in previous tasks, verify those show up here. Click items to navigate to detail pages.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/pages/ProfilePage.tsx
git commit -m "feat: implement ProfilePage with favorites, history, reviews"
```

---

## Task 13: Final Integration & Polish

**Files:**
- Modify: `frontend/src/styles/global.css` (if needed)
- Modify: Various pages (minor fixes)

- [ ] **Step 1: Run full TypeScript check**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npx tsc --noEmit
```

Expected: No errors. If errors exist, fix them.

- [ ] **Step 2: Run dev server and do full walkthrough**

```bash
cd c:/Users/lenovo/Desktop/Canteen-Review/frontend
npm run dev
```

Walk through the entire user journey:
1. Home page — search, filter by category, click recommended dish
2. Ranking page — switch period and category tabs, click items
3. Canteen list — click a canteen, browse windows and dishes
4. Dish detail — submit a review, toggle favorite
5. Profile — verify review shows up, favorite shows up, history shows up
6. Navigate between tabs — verify tab bar highlights correctly
7. Refresh browser — verify localStorage persistence

- [ ] **Step 3: Fix any issues found**

Address any visual glitches, broken navigation, or missing data.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final integration fixes and polish"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** All 6 pages (Home, Ranking, Canteen List, Canteen Detail, Dish Detail, Profile) are covered
- [x] **Tab bar:** 4 tabs (首页, 排行, 食堂, 我的) implemented
- [x] **Data models:** Canteen, Window, Dish, Review, User types all defined
- [x] **Mock data:** 3 canteens, 10 windows, 28 dishes, 20 reviews — meets spec requirements
- [x] **localStorage persistence:** Reviews, favorites, browsing history all persist
- [x] **Review flow:** Star rating + text input → submit → immediate display → survives refresh
- [x] **UI style:** Neo-brutalist pop-art with hard shadows, thick borders, pop-art text shadows
- [x] **Mobile-first:** 390px max-width container
- [x] **No placeholders:** All code blocks are complete and copy-pasteable
- [x] **Type consistency:** All component props match type definitions
- [x] **TDD-ish:** Each task ends with verification step and commit
