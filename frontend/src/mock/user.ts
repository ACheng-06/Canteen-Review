// DEPRECATED: 数据已迁移到后端 API，此文件仅供参考
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
