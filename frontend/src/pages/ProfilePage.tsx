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
