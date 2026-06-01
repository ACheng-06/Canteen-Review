interface CategoryVisual {
  categoryImage: string
  foodImage: string
}

const categoryMap: Record<string, CategoryVisual> = {
  '热菜': { categoryImage: '/images/categories/hot.jpg', foodImage: '/images/food/hot.jpg' },
  '面食': { categoryImage: '/images/categories/noodle.jpg', foodImage: '/images/food/noodle.jpg' },
  '粉面': { categoryImage: '/images/categories/pasta.jpg', foodImage: '/images/food/pasta.jpg' },
  '小吃': { categoryImage: '/images/categories/snack.jpg', foodImage: '/images/food/snack.jpg' },
  '饮品': { categoryImage: '/images/categories/drink.jpg', foodImage: '/images/food/drink.jpg' },
  '水果': { categoryImage: '/images/categories/fruit.jpg', foodImage: '/images/food/fruit.jpg' },
  '甜品': { categoryImage: '/images/categories/dessert.jpg', foodImage: '/images/food/dessert.jpg' },
}

const defaultVisual: CategoryVisual = {
  categoryImage: '/images/categories/all.jpg',
  foodImage: '/images/food/hot.jpg',
}

export function getCategoryVisual(category: string): CategoryVisual {
  return categoryMap[category] || defaultVisual
}
