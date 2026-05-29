import type { Window } from '../types'

export const windows: Window[] = [
  // 一餐厅
  {
    id: 'w1', canteenId: 'c1', name: '家常菜窗口', floor: 1,
    description: '每日现炒家常菜，妈妈的味道', status: 'open',
    tags: ['现炒', '家常'], dishIds: ['d1', 'd2', 'd3', 'd4'],
  },
  {
    id: 'w2', canteenId: 'c1', name: '面食窗口', floor: 1,
    description: '手工拉面、刀削面、拌面', status: 'open',
    tags: ['手工', '面食'], dishIds: ['d5', 'd6', 'd7'],
  },
  {
    id: 'w3', canteenId: 'c1', name: '小吃窗口', floor: 2,
    description: '煎饼果子、烤冷面、炸串', status: 'open',
    tags: ['小吃', '快捷'], dishIds: ['d8', 'd9', 'd10'],
  },
  {
    id: 'w4', canteenId: 'c1', name: '饮品窗口', floor: 2,
    description: '鲜榨果汁、奶茶、豆浆', status: 'open',
    tags: ['饮品', '鲜榨'], dishIds: ['d11', 'd12'],
  },
  // 二餐厅
  {
    id: 'w5', canteenId: 'c2', name: '川湘菜窗口', floor: 1,
    description: '正宗川湘风味，辣得过瘾', status: 'open',
    tags: ['辣', '川湘'], dishIds: ['d13', 'd14', 'd15'],
  },
  {
    id: 'w6', canteenId: 'c2', name: '蒸菜窗口', floor: 1,
    description: '健康蒸菜，少油少盐', status: 'open',
    tags: ['健康', '蒸菜'], dishIds: ['d16', 'd17', 'd18'],
  },
  {
    id: 'w7', canteenId: 'c2', name: '凉菜窗口', floor: 1,
    description: '爽口凉菜，开胃必备', status: 'open',
    tags: ['凉菜', '开胃'], dishIds: ['d19', 'd20'],
  },
  // 民族餐厅
  {
    id: 'w8', canteenId: 'c3', name: '拉面窗口', floor: 1,
    description: '正宗兰州拉面，汤鲜面筋', status: 'open',
    tags: ['拉面', '清真'], dishIds: ['d21', 'd22', 'd23'],
  },
  {
    id: 'w9', canteenId: 'c3', name: '烤肉窗口', floor: 1,
    description: '炭火烤肉，香气四溢', status: 'open',
    tags: ['烤肉', '清真'], dishIds: ['d24', 'd25', 'd26'],
  },
  {
    id: 'w10', canteenId: 'c3', name: '特色菜窗口', floor: 1,
    description: '大盘鸡、手抓饭等民族特色', status: 'open',
    tags: ['特色', '大盘鸡'], dishIds: ['d27', 'd28'],
  },
]
