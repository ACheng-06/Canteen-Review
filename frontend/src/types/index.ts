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
  | '粉面'
  | '面食'
  | '小吃'
  | '水果'
  | '饮品'
  | '甜品'

/** 评价 */
export interface Review {
  id: string
  dishId: string
  userId: string
  userName: string
  avatar: string
  rating: number
  speedRating: number
  valueRating: number
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
export type RankPeriod = 'today' | 'week' | 'month'

/** 排行榜分类 */
export type RankCategory = 'popularity' | 'speed' | 'value'
