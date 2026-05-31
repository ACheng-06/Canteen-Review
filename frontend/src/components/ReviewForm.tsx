import { useState } from 'react'
import StarRating from './StarRating'
import Button from './Button'

interface ReviewFormProps {
  onSubmit: (rating: number, speedRating: number, valueRating: number, content: string) => void
}

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [speedRating, setSpeedRating] = useState(0)
  const [valueRating, setValueRating] = useState(0)
  const [content, setContent] = useState('')

  const handleSubmit = () => {
    if (rating === 0 || speedRating === 0 || valueRating === 0) return
    onSubmit(rating, speedRating, valueRating, content)
    setRating(0)
    setSpeedRating(0)
    setValueRating(0)
    setContent('')
  }

  const isValid = rating > 0 && speedRating > 0 && valueRating > 0

  return (
    <div
      className="p-4 bg-white"
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: '22px',
        boxShadow: '7px 7px 0 var(--color-shadow-amber)',
      }}
    >
      <h3 className="font-black text-sm mb-3">写评价 ✍️</h3>

      <div className="mb-3">
        <label className="text-xs font-bold block mb-1">总体评分</label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      <div className="flex gap-3 mb-3">
        <div className="flex-1">
          <label className="text-xs font-bold block mb-1">⚡ 出餐速度</label>
          <StarRating rating={speedRating} size="md" interactive onChange={setSpeedRating} />
        </div>
        <div className="flex-1">
          <label className="text-xs font-bold block mb-1">💰 性价比</label>
          <StarRating rating={valueRating} size="md" interactive onChange={setValueRating} />
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs font-bold block mb-1">评价内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="说说你对这道菜的看法..."
          rows={3}
          className="w-full px-3 py-2 text-sm outline-none resize-none"
          style={{
            background: 'var(--color-bg)',
            border: '3px solid var(--color-ink)',
            borderRadius: '16px',
          }}
        />
      </div>

      <Button onClick={handleSubmit} disabled={!isValid}>
        提交评价
      </Button>
    </div>
  )
}
