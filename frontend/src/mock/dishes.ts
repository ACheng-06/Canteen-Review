import type { Dish } from '../types'

export const dishes: Dish[] = [
  // ---- 一餐厅 · 家常菜窗口 ----
  { id: 'd1', windowId: 'w1', canteenId: 'c1', name: '红烧肉', category: '热菜', price: 12, description: '肥瘦相间，入口即化', image: '/images/dish-placeholder.svg', rating: 4.6, reviewCount: 48, speedScore: 4.2, valueScore: 4.5, popularity: 95, tags: ['招牌', '下饭'] },
  { id: 'd2', windowId: 'w1', canteenId: 'c1', name: '番茄炒蛋', category: '热菜', price: 8, description: '家常味道，酸甜可口', image: '/images/dish-placeholder.svg', rating: 4.3, reviewCount: 35, speedScore: 4.8, valueScore: 4.7, popularity: 88, tags: ['家常', '快手'] },
  { id: 'd3', windowId: 'w1', canteenId: 'c1', name: '宫保鸡丁', category: '热菜', price: 13, description: '花生酥脆，鸡丁嫩滑', image: '/images/dish-placeholder.svg', rating: 4.4, reviewCount: 42, speedScore: 4.0, valueScore: 4.3, popularity: 82, tags: ['微辣', '经典'] },
  { id: 'd4', windowId: 'w1', canteenId: 'c1', name: '清炒时蔬', category: '热菜', price: 6, description: '每日新鲜蔬菜', image: '/images/dish-placeholder.svg', rating: 4.0, reviewCount: 20, speedScore: 4.9, valueScore: 4.8, popularity: 60, tags: ['清淡', '健康'] },
  // ---- 一餐厅 · 面食窗口 ----
  { id: 'd5', windowId: 'w2', canteenId: 'c1', name: '牛肉拉面', category: '面食', price: 14, description: '手工拉面，大块牛肉', image: '/images/dish-placeholder.svg', rating: 4.7, reviewCount: 56, speedScore: 3.8, valueScore: 4.4, popularity: 98, tags: ['招牌', '必吃'] },
  { id: 'd6', windowId: 'w2', canteenId: 'c1', name: '刀削面', category: '面食', price: 12, description: '刀削面配卤汁', image: '/images/dish-placeholder.svg', rating: 4.3, reviewCount: 30, speedScore: 3.5, valueScore: 4.5, popularity: 72, tags: ['劲道', '饱腹'] },
  { id: 'd7', windowId: 'w2', canteenId: 'c1', name: '炸酱面', category: '面食', price: 11, description: '老北京炸酱面', image: '/images/dish-placeholder.svg', rating: 4.1, reviewCount: 25, speedScore: 4.0, valueScore: 4.6, popularity: 65, tags: ['经典', '咸香'] },
  // ---- 一餐厅 · 小吃窗口 ----
  { id: 'd8', windowId: 'w3', canteenId: 'c1', name: '煎饼果子', category: '小吃', price: 7, description: '薄脆煎饼，酱香十足', image: '/images/dish-placeholder.svg', rating: 4.5, reviewCount: 40, speedScore: 4.6, valueScore: 4.7, popularity: 90, tags: ['早餐', '快手'] },
  { id: 'd9', windowId: 'w3', canteenId: 'c1', name: '烤冷面', category: '小吃', price: 8, description: '东北烤冷面，酸甜微辣', image: '/images/dish-placeholder.svg', rating: 4.2, reviewCount: 28, speedScore: 4.4, valueScore: 4.5, popularity: 75, tags: ['东北', '小吃'] },
  { id: 'd10', windowId: 'w3', canteenId: 'c1', name: '炸鸡腿', category: '小吃', price: 10, description: '外酥里嫩，香气扑鼻', image: '/images/dish-placeholder.svg', rating: 4.4, reviewCount: 38, speedScore: 4.0, valueScore: 4.2, popularity: 85, tags: ['炸物', '解馋'] },
  // ---- 一餐厅 · 饮品窗口 ----
  { id: 'd11', windowId: 'w4', canteenId: 'c1', name: '珍珠奶茶', category: '饮品', price: 8, description: '香浓奶茶配Q弹珍珠', image: '/images/dish-placeholder.svg', rating: 4.3, reviewCount: 32, speedScore: 4.7, valueScore: 4.0, popularity: 80, tags: ['奶茶', '下午茶'] },
  { id: 'd12', windowId: 'w4', canteenId: 'c1', name: '鲜榨橙汁', category: '饮品', price: 10, description: '现榨鲜橙汁，维C满满', image: '/images/dish-placeholder.svg', rating: 4.5, reviewCount: 22, speedScore: 4.5, valueScore: 3.8, popularity: 68, tags: ['鲜榨', '健康'] },
  // ---- 二餐厅 · 川湘菜窗口 ----
  { id: 'd13', windowId: 'w5', canteenId: 'c2', name: '水煮鱼', category: '热菜', price: 18, description: '鲜嫩鱼片，麻辣过瘾', image: '/images/dish-placeholder.svg', rating: 4.6, reviewCount: 45, speedScore: 3.5, valueScore: 4.0, popularity: 92, tags: ['麻辣', '招牌'] },
  { id: 'd14', windowId: 'w5', canteenId: 'c2', name: '麻婆豆腐', category: '热菜', price: 10, description: '麻辣鲜香，下饭神器', image: '/images/dish-placeholder.svg', rating: 4.3, reviewCount: 33, speedScore: 4.6, valueScore: 4.8, popularity: 78, tags: ['麻辣', '下饭'] },
  { id: 'd15', windowId: 'w5', canteenId: 'c2', name: '小炒黄牛肉', category: '热菜', price: 16, description: '嫩滑黄牛肉，大火快炒', image: '/images/dish-placeholder.svg', rating: 4.5, reviewCount: 36, speedScore: 4.0, valueScore: 4.1, popularity: 83, tags: ['湘菜', '肉菜'] },
  // ---- 二餐厅 · 蒸菜窗口 ----
  { id: 'd16', windowId: 'w6', canteenId: 'c2', name: '蒸排骨', category: '热菜', price: 14, description: '豆豉蒸排骨，软烂入味', image: '/images/dish-placeholder.svg', rating: 4.4, reviewCount: 29, speedScore: 3.8, valueScore: 4.2, popularity: 70, tags: ['蒸菜', '健康'] },
  { id: 'd17', windowId: 'w6', canteenId: 'c2', name: '蒸蛋羹', category: '热菜', price: 6, description: '滑嫩蒸蛋，入口即化', image: '/images/dish-placeholder.svg', rating: 4.2, reviewCount: 18, speedScore: 4.5, valueScore: 4.8, popularity: 55, tags: ['清淡', '软嫩'] },
  { id: 'd18', windowId: 'w6', canteenId: 'c2', name: '粉蒸肉', category: '热菜', price: 13, description: '米粉裹肉，香糯可口', image: '/images/dish-placeholder.svg', rating: 4.3, reviewCount: 24, speedScore: 3.6, valueScore: 4.3, popularity: 66, tags: ['蒸菜', '传统'] },
  // ---- 二餐厅 · 凉菜窗口 ----
  { id: 'd19', windowId: 'w7', canteenId: 'c2', name: '凉拌黄瓜', category: '凉菜', price: 5, description: '爽脆黄瓜，蒜香十足', image: '/images/dish-placeholder.svg', rating: 4.1, reviewCount: 15, speedScore: 5.0, valueScore: 5.0, popularity: 50, tags: ['凉菜', '爽口'] },
  { id: 'd20', windowId: 'w7', canteenId: 'c2', name: '皮蛋豆腐', category: '凉菜', price: 7, description: '皮蛋配嫩豆腐，清凉开胃', image: '/images/dish-placeholder.svg', rating: 4.0, reviewCount: 12, speedScore: 5.0, valueScore: 4.7, popularity: 45, tags: ['凉菜', '开胃'] },
  // ---- 民族餐厅 · 拉面窗口 ----
  { id: 'd21', windowId: 'w8', canteenId: 'c3', name: '兰州牛肉面', category: '面食', price: 15, description: '一清二白三红四绿五黄', image: '/images/dish-placeholder.svg', rating: 4.8, reviewCount: 62, speedScore: 4.0, valueScore: 4.5, popularity: 99, tags: ['招牌', '必吃', '清真'] },
  { id: 'd22', windowId: 'w8', canteenId: 'c3', name: '拌面', category: '面食', price: 13, description: '新疆拌面，配菜丰富', image: '/images/dish-placeholder.svg', rating: 4.5, reviewCount: 34, speedScore: 3.8, valueScore: 4.4, popularity: 76, tags: ['新疆', '拌面'] },
  { id: 'd23', windowId: 'w8', canteenId: 'c3', name: '羊肉泡馍', category: '面食', price: 18, description: '浓郁羊汤，掰馍泡汤', image: '/images/dish-placeholder.svg', rating: 4.6, reviewCount: 40, speedScore: 3.2, valueScore: 4.0, popularity: 85, tags: ['西北', '暖胃'] },
  // ---- 民族餐厅 · 烤肉窗口 ----
  { id: 'd24', windowId: 'w9', canteenId: 'c3', name: '羊肉串', category: '小吃', price: 3, description: '炭火烤制，孜然飘香', image: '/images/dish-placeholder.svg', rating: 4.7, reviewCount: 55, speedScore: 4.2, valueScore: 4.3, popularity: 96, tags: ['烤肉', '必吃'] },
  { id: 'd25', windowId: 'w9', canteenId: 'c3', name: '烤羊排', category: '热菜', price: 28, description: '外焦里嫩，肉汁丰富', image: '/images/dish-placeholder.svg', rating: 4.8, reviewCount: 44, speedScore: 3.0, valueScore: 3.5, popularity: 88, tags: ['烤肉', '硬菜'] },
  { id: 'd26', windowId: 'w9', canteenId: 'c3', name: '烤馕', category: '面食', price: 5, description: '酥脆烤馕，配烤肉绝配', image: '/images/dish-placeholder.svg', rating: 4.4, reviewCount: 26, speedScore: 4.5, valueScore: 4.8, popularity: 65, tags: ['新疆', '主食'] },
  // ---- 民族餐厅 · 特色菜窗口 ----
  { id: 'd27', windowId: 'w10', canteenId: 'c3', name: '大盘鸡', category: '热菜', price: 25, description: '鸡肉软烂，土豆绵密，配皮带面', image: '/images/dish-placeholder.svg', rating: 4.7, reviewCount: 50, speedScore: 3.2, valueScore: 4.0, popularity: 93, tags: ['新疆', '招牌', '量大'] },
  { id: 'd28', windowId: 'w10', canteenId: 'c3', name: '手抓饭', category: '面食', price: 16, description: '羊肉手抓饭，油香四溢', image: '/images/dish-placeholder.svg', rating: 4.5, reviewCount: 35, speedScore: 3.5, valueScore: 4.2, popularity: 80, tags: ['新疆', '特色'] },
]
