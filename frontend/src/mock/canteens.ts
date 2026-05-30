// DEPRECATED: 数据已迁移到后端 API，此文件仅供参考
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
