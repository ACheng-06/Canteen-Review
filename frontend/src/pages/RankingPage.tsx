import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRanking } from '../api/ranking'
import { getCanteens } from '../api/canteens'
import { getDishes } from '../api/dishes'
import { getCategoryVisual } from '../utils/categoryVisual'
import type { RankPeriod, RankCategory } from '../types'

const periodTabs: { label: string; value: RankPeriod; icon: string }[] = [
  { label: '日榜', value: 'today', icon: '☀️' },
  { label: '周榜', value: 'week', icon: '📅' },
  { label: '月榜', value: 'month', icon: '🌙' },
]

const categoryTabs: { label: string; value: RankCategory; emoji: string }[] = [
  { label: '人气', value: 'popularity', emoji: '🔥' },
  { label: '出餐快', value: 'speed', emoji: '⚡' },
  { label: '省钱', value: 'value', emoji: '💰' },
]

const spring = 'cubic-bezier(0.34, 1.56, 0.64, 1)'

export default function RankingPage() {
  const navigate = useNavigate()
  const [period, setPeriod] = useState<RankPeriod>('today')
  const [category, setCategory] = useState<RankCategory>('popularity')
  const [rankedDishes, setRankedDishes] = useState<any[]>([])
  const [overview, setOverview] = useState({ windowCount: 0, reviewCount: 0, avgScore: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [data, canteens, dishesRes] = await Promise.all([
          getRanking(category, period),
          getCanteens(),
          getDishes({ limit: 200 }),
        ])
        setRankedDishes(data)
        const allDishes = dishesRes.data
        const totalWindows = canteens.reduce((s: number, c: any) => s + c.windowCount, 0)
        const totalReviews = allDishes.reduce((s: number, d: any) => s + d.reviewCount, 0)
        const avgScore = allDishes.length > 0
          ? (allDishes.reduce((s: number, d: any) => s + d.rating, 0) / allDishes.length).toFixed(1)
          : '0.0'
        setOverview({ windowCount: totalWindows, reviewCount: totalReviews, avgScore: Number(avgScore) })
      } catch (err) {
        console.error('Failed to fetch ranking:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [category, period])

  const sorted = useMemo(() => {
    const key =
      category === 'popularity'
        ? 'popularity'
        : category === 'speed'
          ? 'speedScore'
          : 'valueScore'
    const list = [...rankedDishes]
    list.sort((a, b) => {
      const diff = b[key] - a[key]
      if (period === 'week' || period === 'month') {
        return diff !== 0 ? diff : b.reviewCount - a.reviewCount
      }
      return diff
    })
    return list
  }, [rankedDishes, period, category])

  const champion = sorted[0]
  const top3 = sorted.slice(0, 3)

  const rankLabels = ['🥇', '🥈', '🥉']
  const rankShadows = ['#FFCF7A', '#E0E0E0', '#D7CCC8']

  const periodLabel = period === 'today' ? '今日' : period === 'week' ? '本周' : '本月'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ background: 'var(--color-paper)' }}>
        <div className="text-lg font-black" style={{ color: 'var(--color-muted)' }}>加载中...</div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--color-paper)' }}>
      <div className="safe-area-top" />
      <div className="px-4 pb-6">

        {/* ── Hero 战报 ── */}
        <div
          className="relative mt-4 p-5 overflow-hidden"
          style={{
            background: 'white',
            border: '3px solid var(--color-ink)',
            borderRadius: '28px',
            boxShadow: '10px 10px 0 var(--color-shadow-blue)',
          }}
        >
          {/* 装饰 RANKING 标签 */}
          <div
            className="absolute text-[10px] font-black px-2 py-0.5"
            style={{
              top: 14,
              right: 14,
              background: 'var(--color-amber)',
              color: 'var(--color-ink)',
              border: '2px solid var(--color-ink)',
              borderRadius: '6px',
              transform: 'rotate(7deg)',
              boxShadow: '2px 2px 0 var(--color-ink)',
            }}
          >
            RANKING
          </div>

          {/* 标题行 */}
          <div className="pr-20">
            <p className="text-xs font-bold" style={{ color: '#6B4E16' }}>
              校园美食数据
            </p>
            <h1 className="text-shadow-pop font-black text-xl leading-tight mt-0.5">
              {periodLabel}食堂战报
            </h1>
            <p className="text-[11px] mt-1" style={{ color: 'var(--color-muted)' }}>
              {sorted.length} 个菜品上榜 · {overview.reviewCount} 条评价
            </p>
          </div>

          {/* 热度徽章 */}
          <div
            className="absolute flex flex-col items-center justify-center"
            style={{
              top: 8,
              right: 80,
              width: 52,
              height: 52,
              background: 'var(--color-ink)',
              color: 'white',
              border: '2px solid var(--color-ink)',
              borderRadius: '14px',
              boxShadow: '3px 3px 0 var(--color-amber)',
            }}
          >
            <span className="text-sm font-black leading-none">{sorted.length > 0 ? sorted[0].rating.toFixed(1) : '—'}</span>
            <span className="text-[8px] mt-0.5 opacity-70">最高分</span>
          </div>

          {/* 时间切换 */}
          <div className="flex gap-2 mt-4">
            {periodTabs.map((tab) => {
              const active = period === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setPeriod(tab.value)}
                  className="flex-1 py-2 flex items-center justify-center gap-1 text-xs font-black"
                  style={{
                    background: active ? 'linear-gradient(135deg, var(--color-ink) 60%, var(--color-pink) 60%)' : 'white',
                    color: active ? 'white' : 'var(--color-ink)',
                    border: '2px solid var(--color-ink)',
                    borderRadius: '12px',
                    boxShadow: active ? '3px 3px 0 var(--color-amber)' : '2px 2px 0 var(--color-shadow-blue)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontSize: 11 }}>{tab.icon}</span>
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* 数据概览 */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            {[
              { num: overview.windowCount, label: '窗口' },
              { num: overview.reviewCount, label: '评价' },
              { num: overview.avgScore, label: '均分' },
            ].map((item) => (
              <div
                key={item.label}
                className="text-center py-2 rounded-xl"
                style={{
                  background: 'var(--color-bg)',
                  border: '2px solid var(--color-border)',
                }}
              >
                <div className="text-base font-black" style={{ color: 'var(--color-blue)' }}>
                  {item.num}
                </div>
                <div className="text-[10px] font-bold" style={{ color: 'var(--color-muted)' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 分类标签 — 横向滚动 pill ── */}
        <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar pb-1 -mx-4 px-4">
          {categoryTabs.map((tab) => {
            const active = category === tab.value
            return (
              <button
                key={tab.value + tab.label}
                onClick={() => setCategory(tab.value)}
                className="flex-shrink-0 flex items-center gap-1 px-4 py-1.5 text-xs font-bold"
                style={{
                  background: active ? 'linear-gradient(135deg, var(--color-ink) 60%, var(--color-pink) 60%)' : 'white',
                  color: active ? 'white' : 'var(--color-muted)',
                  border: `2px solid ${active ? 'var(--color-ink)' : 'var(--color-border)'}`,
                  borderRadius: '999px',
                  boxShadow: active ? '3px 3px 0 var(--color-amber)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: 12 }}>{tab.emoji}</span>
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* ── 冠军卡 ── */}
        {champion && (
          <div
            className="relative mt-4 flex gap-3 p-4 cursor-pointer"
            style={{
              background: 'white',
              border: '3px solid var(--color-ink)',
              borderRadius: '20px',
              boxShadow: '8px 8px 0 var(--color-amber)',
            }}
            onClick={() => navigate(`/dishes/${champion.id}`)}
          >
            {/* WINNER 标签 */}
            <div
              className="absolute text-[9px] font-black px-2 py-0.5"
              style={{
                top: -8,
                left: 16,
                background: '#FF4D4F',
                color: 'white',
                border: '2px solid var(--color-ink)',
                borderRadius: '6px',
                transform: 'rotate(-5deg)',
                boxShadow: '2px 2px 0 var(--color-ink)',
              }}
            >
              WINNER
            </div>

            {/* 图片 */}
            <div
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: 72,
                height: 72,
                borderRadius: '18px',
                border: '3px solid var(--color-ink)',
              }}
            >
              <img
                src={getCategoryVisual(champion.category).foodImage}
                alt={champion.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 信息 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span>👑</span>
                <span className="font-black text-base truncate">{champion.name}</span>
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                {champion.windowName} · {champion.canteenName}
              </div>
              <div className="flex gap-1.5 mt-2 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    background: '#FFF7E8',
                    color: '#B76A00',
                    border: '1.5px solid #FFCF7A',
                    borderRadius: '999px',
                  }}
                >
                  ⭐ {champion.rating.toFixed(1)} 分
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5"
                  style={{
                    background: 'var(--color-bg)',
                    color: 'var(--color-blue)',
                    border: '1.5px solid var(--color-blue)',
                    borderRadius: '999px',
                  }}
                >
                  💬 {champion.reviewCount} 评价
                </span>
              </div>
            </div>

            {/* 右侧分数 */}
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black" style={{ color: 'var(--color-blue)', lineHeight: 1 }}>
                {category === 'popularity'
                  ? champion.popularity
                  : category === 'speed'
                    ? champion.speedScore.toFixed(1)
                    : champion.valueScore.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold mt-1" style={{ color: 'var(--color-blue)' }}>
                去看看 ›
              </span>
            </div>
          </div>
        )}

        {/* ── Top 3 领奖台 ── */}
        {top3.length > 1 && (
          <div className="flex items-end gap-2 mt-4">
            {[1, 0, 2].map((idx) => {
              const dish = top3[idx]
              if (!dish) return null
              const podiumHeights = [170, 140, 120]
              const h = podiumHeights[idx]
              return (
                <div
                  key={dish.id}
                  onClick={() => navigate(`/dishes/${dish.id}`)}
                  className="relative bg-white cursor-pointer flex-1 flex flex-col"
                  style={{
                    border: '2px solid var(--color-ink)',
                    borderRadius: '16px',
                    boxShadow: `5px 5px 0 ${rankShadows[idx]}`,
                    height: h,
                    padding: '10px 8px',
                    justifyContent: 'center',
                    transition: `transform 0.2s ${spring}, box-shadow 0.2s ease`,
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'
                    e.currentTarget.style.boxShadow = `3px 3px 0 ${rankShadows[idx]}`
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = `5px 5px 0 ${rankShadows[idx]}`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = `5px 5px 0 ${rankShadows[idx]}`
                  }}
                  onTouchStart={(e) => {
                    e.currentTarget.style.transform = 'scale(0.95)'
                    e.currentTarget.style.boxShadow = `3px 3px 0 ${rankShadows[idx]}`
                  }}
                  onTouchEnd={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.boxShadow = `5px 5px 0 ${rankShadows[idx]}`
                  }}
                >
                  {/* 名次标签 */}
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-2 py-0.5"
                    style={{
                      background: idx === 0 ? '#FFC107' : idx === 1 ? '#E0E0E0' : '#BCAAA4',
                      color: idx === 0 ? '#172033' : idx === 1 ? '#555' : '#5D4037',
                      border: '2px solid var(--color-ink)',
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rankLabels[idx]} {idx === 0 ? '1st' : idx === 1 ? '2nd' : '3rd'}
                  </div>

                  <div
                    className="w-full mb-2 overflow-hidden"
                    style={{
                      aspectRatio: '1 / 1',
                      borderRadius: '14px',
                      border: '2px solid var(--color-ink)',
                    }}
                  >
                    <img
                      src={getCategoryVisual(dish.category).foodImage}
                      alt={dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-black text-center truncate" style={{ fontSize: idx === 0 ? '13px' : '11px' }}>
                    {dish.name}
                  </div>
                  <div className="text-center mt-0.5 font-bold" style={{ color: 'var(--color-blue)', fontSize: idx === 0 ? '12px' : '10px' }}>
                    {category === 'popularity'
                      ? dish.popularity
                      : category === 'speed'
                        ? dish.speedScore.toFixed(1)
                        : dish.valueScore.toFixed(1)}
                    {category === 'popularity' ? ' 热度' : ' 分'}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ── 完整排行 ── */}
        {sorted.length > 0 && (
          <div className="mt-4">
            {/* 标题行 */}
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-shadow-pop-soft text-base font-black">完整排行</h2>
              <span className="text-[11px] font-bold" style={{ color: 'var(--color-muted)' }}>
                共 {sorted.length} 个
              </span>
            </div>

            <div
              className="overflow-hidden"
              style={{
                border: '2px solid var(--color-ink)',
                borderRadius: '18px',
                boxShadow: '5px 5px 0 var(--color-shadow-blue)',
                background: 'white',
              }}
            >
              {sorted.map((dish, i) => {
                const rank = i + 1
                const isLast = i === sorted.length - 1
                const rankBg = rank === 1 ? '#FFC107' : rank === 2 ? '#E0E0E0' : rank === 3 ? '#BCAAA4' : 'var(--color-bg)'
                const rankColor = rank === 1 ? '#172033' : rank === 2 ? '#555' : rank === 3 ? '#5D4037' : 'var(--color-muted)'
                const rankBorderColor = rank <= 3 ? 'var(--color-ink)' : 'var(--color-border)'
                return (
                  <div
                    key={dish.id}
                    onClick={() => navigate(`/dishes/${dish.id}`)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                    style={{
                      borderBottom: isLast ? 'none' : '2px solid #F5F6FA',
                      background: i % 2 === 0 ? 'white' : '#FFFDF7',
                      transition: 'transform 0.2s ease, background 0.15s ease',
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)'
                      e.currentTarget.style.background = 'var(--color-bg)'
                    }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.98)'
                      e.currentTarget.style.background = 'var(--color-bg)'
                    }}
                    onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
                  >
                    {/* 排名徽章 — 正方形卡片 */}
                    <span
                      className="w-8 h-8 flex items-center justify-center text-xs font-black flex-shrink-0"
                      style={{
                        background: rankBg,
                        color: rankColor,
                        border: `2px solid ${rankBorderColor}`,
                        borderRadius: '10px',
                      }}
                    >
                      {rank}
                    </span>

                    {/* 菜品信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{dish.name}</div>
                      <div className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
                        <span style={{ color: 'var(--color-blue)' }}>⭐ {dish.rating.toFixed(1)}</span>
                        <span>·</span>
                        <span>{dish.reviewCount} 评价</span>
                        <span>·</span>
                        <span className="truncate">{dish.canteenName}</span>
                      </div>
                    </div>

                    {/* 右侧 */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                      <span className="text-sm font-black" style={{ color: 'var(--color-blue)' }}>
                        {category === 'popularity'
                          ? dish.popularity
                          : category === 'speed'
                            ? dish.speedScore.toFixed(1)
                            : dish.valueScore.toFixed(1)}
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-1"
                        style={{
                          background: '#FFF7E8',
                          color: 'var(--color-ink)',
                          border: '1.5px solid var(--color-ink)',
                          borderRadius: '999px',
                        }}
                      >
                        去看看
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── 空状态 ── */}
        {sorted.length === 0 && (
          <div className="mt-5">
            <div
              className="text-center py-8 px-4"
              style={{
                border: '3px solid var(--color-ink)',
                borderRadius: '22px',
                background: 'white',
                boxShadow: '7px 7px 0 var(--color-shadow-blue)',
              }}
            >
              <div
                className="inline-flex items-center justify-center mb-3"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '20px',
                  background: '#FFF7E8',
                  border: '3px solid var(--color-ink)',
                  boxShadow: '5px 5px 0 var(--color-amber)',
                  fontSize: 36,
                }}
              >
                🏆
              </div>
              <p className="font-black text-base mb-1" style={{ color: 'var(--color-ink)' }}>暂无排名数据</p>
              <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>需要同学评价后，榜单才会自动生成</p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div
                  className="p-3 text-center"
                  style={{
                    background: 'var(--color-bg)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '16px',
                  }}
                >
                  <div className="text-xl mb-1">🔥</div>
                  <div className="text-[11px] font-black" style={{ color: 'var(--color-ink)' }}>人气榜</div>
                  <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>按评价和热度计算</div>
                </div>
                <div
                  className="p-3 text-center"
                  style={{
                    background: 'var(--color-bg)',
                    border: '2px solid var(--color-border)',
                    borderRadius: '16px',
                  }}
                >
                  <div className="text-xl mb-1">⚡</div>
                  <div className="text-[11px] font-black" style={{ color: 'var(--color-ink)' }}>出餐快</div>
                  <div className="text-[10px]" style={{ color: 'var(--color-muted)' }}>按出餐速度排名</div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
