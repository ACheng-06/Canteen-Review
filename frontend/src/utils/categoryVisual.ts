interface CategoryVisual {
  bg: string
  emoji: string
}

const categoryMap: Record<string, CategoryVisual> = {
  '热菜': { bg: 'linear-gradient(135deg, #FFE5E5 0%, #FFC1C1 100%)', emoji: '🍲' },
  '面食': { bg: 'linear-gradient(135deg, #FFF5E5 0%, #FFE0B2 100%)', emoji: '🌾' },
  '粉面': { bg: 'linear-gradient(135deg, #FFF0E0 0%, #FFDAB0 100%)', emoji: '🍜' },
  '小吃': { bg: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)', emoji: '🍢' },
  '饮品': { bg: 'linear-gradient(135deg, #FFE5EC 0%, #FFCDD2 100%)', emoji: '🧋' },
  '水果': { bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', emoji: '🍉' },
  '甜品': { bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', emoji: '🍰' },
}

const defaultVisual: CategoryVisual = {
  bg: 'linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%)',
  emoji: '🍽️',
}

export function getCategoryVisual(category: string): CategoryVisual {
  return categoryMap[category] || defaultVisual
}
