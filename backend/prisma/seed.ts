import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

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

  // 创建菜品 (30 dishes)
  const dishes = [
    // ---- 一餐厅 · 家常菜窗口 ----
    { id: 'd1', windowId: 'w1', canteenId: 'c1', name: '红烧肉', category: '热菜', price: 12, description: '肥瘦相间，入口即化', rating: 4.6, reviewCount: 48, speedScore: 4.2, valueScore: 4.5, popularity: 95, tags: ['招牌', '下饭'] },
    { id: 'd2', windowId: 'w1', canteenId: 'c1', name: '番茄炒蛋', category: '热菜', price: 8, description: '家常味道，酸甜可口', rating: 4.3, reviewCount: 35, speedScore: 4.8, valueScore: 4.7, popularity: 88, tags: ['家常', '快手'] },
    { id: 'd3', windowId: 'w1', canteenId: 'c1', name: '宫保鸡丁', category: '热菜', price: 13, description: '花生酥脆，鸡丁嫩滑', rating: 4.4, reviewCount: 42, speedScore: 4.0, valueScore: 4.3, popularity: 82, tags: ['微辣', '经典'] },
    { id: 'd4', windowId: 'w1', canteenId: 'c1', name: '清炒时蔬', category: '热菜', price: 6, description: '每日新鲜蔬菜', rating: 4.0, reviewCount: 20, speedScore: 4.9, valueScore: 4.8, popularity: 60, tags: ['清淡', '健康'] },
    // ---- 一餐厅 · 面食窗口 ----
    { id: 'd5', windowId: 'w2', canteenId: 'c1', name: '牛肉拉面', category: '面食', price: 14, description: '手工拉面，大块牛肉', rating: 4.7, reviewCount: 56, speedScore: 3.8, valueScore: 4.4, popularity: 98, tags: ['招牌', '必吃'] },
    { id: 'd6', windowId: 'w2', canteenId: 'c1', name: '刀削面', category: '面食', price: 12, description: '刀削面配卤汁', rating: 4.3, reviewCount: 30, speedScore: 3.5, valueScore: 4.5, popularity: 72, tags: ['劲道', '饱腹'] },
    { id: 'd7', windowId: 'w2', canteenId: 'c1', name: '炸酱面', category: '面食', price: 11, description: '老北京炸酱面', rating: 4.1, reviewCount: 25, speedScore: 4.0, valueScore: 4.6, popularity: 65, tags: ['经典', '咸香'] },
    // ---- 一餐厅 · 小吃窗口 ----
    { id: 'd8', windowId: 'w3', canteenId: 'c1', name: '煎饼果子', category: '小吃', price: 7, description: '薄脆煎饼，酱香十足', rating: 4.5, reviewCount: 40, speedScore: 4.6, valueScore: 4.7, popularity: 90, tags: ['早餐', '快手'] },
    { id: 'd9', windowId: 'w3', canteenId: 'c1', name: '烤冷面', category: '小吃', price: 8, description: '东北烤冷面，酸甜微辣', rating: 4.2, reviewCount: 28, speedScore: 4.4, valueScore: 4.5, popularity: 75, tags: ['东北', '小吃'] },
    { id: 'd10', windowId: 'w3', canteenId: 'c1', name: '炸鸡腿', category: '小吃', price: 10, description: '外酥里嫩，香气扑鼻', rating: 4.4, reviewCount: 38, speedScore: 4.0, valueScore: 4.2, popularity: 85, tags: ['炸物', '解馋'] },
    // ---- 一餐厅 · 饮品窗口 ----
    { id: 'd11', windowId: 'w4', canteenId: 'c1', name: '珍珠奶茶', category: '饮品', price: 8, description: '香浓奶茶配Q弹珍珠', rating: 4.3, reviewCount: 32, speedScore: 4.7, valueScore: 4.0, popularity: 80, tags: ['奶茶', '下午茶'] },
    { id: 'd12', windowId: 'w4', canteenId: 'c1', name: '鲜榨橙汁', category: '饮品', price: 10, description: '现榨鲜橙汁，维C满满', rating: 4.5, reviewCount: 22, speedScore: 4.5, valueScore: 3.8, popularity: 68, tags: ['鲜榨', '健康'] },
    // ---- 二餐厅 · 川湘菜窗口 ----
    { id: 'd13', windowId: 'w5', canteenId: 'c2', name: '水煮鱼', category: '热菜', price: 18, description: '鲜嫩鱼片，麻辣过瘾', rating: 4.6, reviewCount: 45, speedScore: 3.5, valueScore: 4.0, popularity: 92, tags: ['麻辣', '招牌'] },
    { id: 'd14', windowId: 'w5', canteenId: 'c2', name: '麻婆豆腐', category: '热菜', price: 10, description: '麻辣鲜香，下饭神器', rating: 4.3, reviewCount: 33, speedScore: 4.6, valueScore: 4.8, popularity: 78, tags: ['麻辣', '下饭'] },
    { id: 'd15', windowId: 'w5', canteenId: 'c2', name: '小炒黄牛肉', category: '热菜', price: 16, description: '嫩滑黄牛肉，大火快炒', rating: 4.5, reviewCount: 36, speedScore: 4.0, valueScore: 4.1, popularity: 83, tags: ['湘菜', '肉菜'] },
    // ---- 二餐厅 · 蒸菜窗口 ----
    { id: 'd16', windowId: 'w6', canteenId: 'c2', name: '蒸排骨', category: '热菜', price: 14, description: '豆豉蒸排骨，软烂入味', rating: 4.4, reviewCount: 29, speedScore: 3.8, valueScore: 4.2, popularity: 70, tags: ['蒸菜', '健康'] },
    { id: 'd17', windowId: 'w6', canteenId: 'c2', name: '蒸蛋羹', category: '热菜', price: 6, description: '滑嫩蒸蛋，入口即化', rating: 4.2, reviewCount: 18, speedScore: 4.5, valueScore: 4.8, popularity: 55, tags: ['清淡', '软嫩'] },
    { id: 'd18', windowId: 'w6', canteenId: 'c2', name: '粉蒸肉', category: '热菜', price: 13, description: '米粉裹肉，香糯可口', rating: 4.3, reviewCount: 24, speedScore: 3.6, valueScore: 4.3, popularity: 66, tags: ['蒸菜', '传统'] },
    // ---- 二餐厅 · 凉菜窗口 ----
    { id: 'd19', windowId: 'w7', canteenId: 'c2', name: '凉拌黄瓜', category: '凉菜', price: 5, description: '爽脆黄瓜，蒜香十足', rating: 4.1, reviewCount: 15, speedScore: 5.0, valueScore: 5.0, popularity: 50, tags: ['凉菜', '爽口'] },
    { id: 'd20', windowId: 'w7', canteenId: 'c2', name: '皮蛋豆腐', category: '凉菜', price: 7, description: '皮蛋配嫩豆腐，清凉开胃', rating: 4.0, reviewCount: 12, speedScore: 5.0, valueScore: 4.7, popularity: 45, tags: ['凉菜', '开胃'] },
    // ---- 民族餐厅 · 拉面窗口 ----
    { id: 'd21', windowId: 'w8', canteenId: 'c3', name: '兰州牛肉面', category: '面食', price: 15, description: '一清二白三红四绿五黄', rating: 4.8, reviewCount: 62, speedScore: 4.0, valueScore: 4.5, popularity: 99, tags: ['招牌', '必吃', '清真'] },
    { id: 'd22', windowId: 'w8', canteenId: 'c3', name: '拌面', category: '面食', price: 13, description: '新疆拌面，配菜丰富', rating: 4.5, reviewCount: 34, speedScore: 3.8, valueScore: 4.4, popularity: 76, tags: ['新疆', '拌面'] },
    { id: 'd23', windowId: 'w8', canteenId: 'c3', name: '羊肉泡馍', category: '面食', price: 18, description: '浓郁羊汤，掰馍泡汤', rating: 4.6, reviewCount: 40, speedScore: 3.2, valueScore: 4.0, popularity: 85, tags: ['西北', '暖胃'] },
    // ---- 民族餐厅 · 烤肉窗口 ----
    { id: 'd24', windowId: 'w9', canteenId: 'c3', name: '羊肉串', category: '小吃', price: 3, description: '炭火烤制，孜然飘香', rating: 4.7, reviewCount: 55, speedScore: 4.2, valueScore: 4.3, popularity: 96, tags: ['烤肉', '必吃'] },
    { id: 'd25', windowId: 'w9', canteenId: 'c3', name: '烤羊排', category: '热菜', price: 28, description: '外焦里嫩，肉汁丰富', rating: 4.8, reviewCount: 44, speedScore: 3.0, valueScore: 3.5, popularity: 88, tags: ['烤肉', '硬菜'] },
    { id: 'd26', windowId: 'w9', canteenId: 'c3', name: '烤馕', category: '面食', price: 5, description: '酥脆烤馕，配烤肉绝配', rating: 4.4, reviewCount: 26, speedScore: 4.5, valueScore: 4.8, popularity: 65, tags: ['新疆', '主食'] },
    // ---- 民族餐厅 · 特色菜窗口 ----
    { id: 'd27', windowId: 'w10', canteenId: 'c3', name: '大盘鸡', category: '热菜', price: 25, description: '鸡肉软烂，土豆绵密，配皮带面', rating: 4.7, reviewCount: 50, speedScore: 3.2, valueScore: 4.0, popularity: 93, tags: ['新疆', '招牌', '量大'] },
    { id: 'd28', windowId: 'w10', canteenId: 'c3', name: '手抓饭', category: '面食', price: 16, description: '羊肉手抓饭，油香四溢', rating: 4.5, reviewCount: 35, speedScore: 3.5, valueScore: 4.2, popularity: 80, tags: ['新疆', '特色'] },
    // ---- 补充菜品 ----
    { id: 'd29', windowId: 'w3', canteenId: 'c1', name: '铁板豆腐', category: '小吃', price: 6, description: '外焦里嫩，酱香浓郁', rating: 4.3, reviewCount: 22, speedScore: 4.5, valueScore: 4.8, popularity: 70, tags: ['小吃', '素食'] },
    { id: 'd30', windowId: 'w6', canteenId: 'c2', name: '蒸南瓜', category: '热菜', price: 5, description: '软糯香甜，营养健康', rating: 4.1, reviewCount: 14, speedScore: 4.8, valueScore: 5.0, popularity: 42, tags: ['清淡', '素食'] },
  ]
  for (const d of dishes) {
    await prisma.dish.create({ data: d })
  }

  // 创建评价 (20 reviews, 映射到 2 个用户)
  const reviews = [
    // 红烧肉
    { dishId: 'd1', userId: user1.id, rating: 5, content: '红烧肉真的绝了！肥而不腻，入口即化，每次来必点！', likes: 12 },
    { dishId: 'd1', userId: user2.id, rating: 4, content: '味道不错，就是有时候肉稍微有点肥，总体推荐。', likes: 5 },
    // 牛肉拉面
    { dishId: 'd5', userId: user1.id, rating: 5, content: '面条劲道，牛肉大块，汤底浓郁，一碗管饱！', likes: 15 },
    { dishId: 'd5', userId: user2.id, rating: 5, content: '作为北方人，这碗面让我找到了家的感觉。', likes: 20 },
    // 兰州牛肉面
    { dishId: 'd21', userId: user2.id, rating: 5, content: '民族餐厅的拉面yyds！一清二白三红四绿五黄，正宗！', likes: 25 },
    { dishId: 'd21', userId: user1.id, rating: 5, content: '每周至少吃三次，已经上瘾了。', likes: 18 },
    // 羊肉串
    { dishId: 'd24', userId: user1.id, rating: 5, content: '3块钱一串，这价格这味道，绝了！', likes: 22 },
    { dishId: 'd24', userId: user2.id, rating: 5, content: '孜然味太香了，晚上来几串配饮料，完美。', likes: 14 },
    // 大盘鸡
    { dishId: 'd27', userId: user2.id, rating: 5, content: '分量超大，两个人吃都够了，鸡肉很入味！', likes: 16 },
    { dishId: 'd27', userId: user1.id, rating: 4, content: '味道很好，就是等的时间比较长。', likes: 6 },
    // 水煮鱼
    { dishId: 'd13', userId: user2.id, rating: 5, content: '辣得过瘾！鱼片很嫩，豆芽也好吃。', likes: 11 },
    { dishId: 'd13', userId: user1.id, rating: 4, content: '味道不错，但不能吃辣的慎点。', likes: 4 },
    // 煎饼果子
    { dishId: 'd8', userId: user1.id, rating: 5, content: '早餐首选！薄脆很酥，酱料调得好。', likes: 10 },
    { dishId: 'd8', userId: user2.id, rating: 4, content: '7块钱管一个上午，性价比之王。', likes: 8 },
    // 珍珠奶茶
    { dishId: 'd11', userId: user1.id, rating: 4, content: '珍珠Q弹，奶茶香浓，下午茶必备。', likes: 6 },
    // 烤羊排
    { dishId: 'd25', userId: user1.id, rating: 5, content: '外焦里嫩，羊肉一点都不膻，强烈推荐！', likes: 19 },
    // 番茄炒蛋
    { dishId: 'd2', userId: user2.id, rating: 4, content: '妈妈的味道，简单好吃。', likes: 5 },
    // 宫保鸡丁
    { dishId: 'd3', userId: user1.id, rating: 4, content: '花生很脆，鸡丁入味，微辣刚好。', likes: 7 },
    // 麻婆豆腐
    { dishId: 'd14', userId: user2.id, rating: 5, content: '下饭神器！麻辣鲜香，米饭杀手。', likes: 13 },
    // 烤馕
    { dishId: 'd26', userId: user2.id, rating: 4, content: '酥脆可口，配着羊肉串吃绝了！', likes: 9 },
  ]
  for (const r of reviews) {
    await prisma.review.create({ data: r })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
