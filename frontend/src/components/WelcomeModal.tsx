import { useState, useEffect } from 'react'
import { getStorage, setStorage } from '../utils/storage'

const WELCOME_KEY = 'canteen-welcomed'

const sections = [
  {
    icon: '👋',
    title: '欢迎使用',
    content:
      '感谢你使用「华航小助手」！在这里你可以浏览食堂菜品、查看他人评价、发表自己的用餐体验。你的每一次评价都在帮助大家找到更好的美食！\n提供建议欢迎添加QQ：2011024577，感谢你的支持！',
  },
  {
    icon: '📖',
    title: '使用指南',
    content:
      '• 首页可搜索菜品、浏览推荐\n• 排行榜查看热门菜品\n• 食堂页按食堂筛选菜品\n• 点击菜品可查看详情和评价\n• 登录后即可发表你的评价',
  },
  {
    icon: '⚠️',
    title: '信息说明',
    content:
      'APP 中展示的菜品价格、口味等信息可能存在偏差，仅供参考。我们会尽力保持信息准确，但实际情况请以食堂当日供应为准。',
  },
  {
    icon: '📸',
    title: '照片征集',
    content:
      '菜品暂时缺少实拍照片，对此我们深表歉意。由于人力有限，无法短期内收集齐全。\n如果你愿意提供菜品照片，欢迎添加QQ：2011024577，感谢你的支持！',
  },
  {
    icon: '📋',
    title: '免责声明',
    content:
      '本 APP 仅提供信息参考服务，不对菜品质量、食品安全等承担任何责任。用户发布的评价代表个人观点，不代表本平台立场。使用本 APP 即表示你已阅读并同意以上条款。',
  },
]

export default function WelcomeModal() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const welcomed = getStorage<boolean>(WELCOME_KEY, false)
    if (!welcomed) setOpen(true)
  }, [])

  const handleClose = () => {
    setStorage(WELCOME_KEY, true)
    setOpen(false)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={handleClose}
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
      <div
        className="relative w-full max-w-[360px] flex flex-col"
        style={{
          maxHeight: '80vh',
          background: 'var(--color-paper)',
          border: '3px solid var(--color-ink)',
          borderRadius: '24px',
          boxShadow: '10px 10px 0 var(--color-shadow-blue)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-5 pt-5 pb-3 text-center"
          style={{ borderBottom: '3px solid var(--color-ink)' }}
        >
          <p className="text-2xl mb-1">🎉</p>
          <h2 className="font-black text-lg" style={{ color: 'var(--color-ink)' }}>
            欢迎来到华航小助手
          </h2>
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            使用前请先了解以下信息
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 hide-scrollbar" style={{ minHeight: 0 }}>
          {sections.map((s, i) => (
            <div key={i} className={i < sections.length - 1 ? 'mb-4' : ''}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base">{s.icon}</span>
                <h3 className="font-black text-sm" style={{ color: 'var(--color-ink)' }}>
                  {s.title}
                </h3>
              </div>
              <p
                className="text-xs leading-relaxed whitespace-pre-line"
                style={{ color: 'var(--color-muted)' }}
              >
                {s.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-2">
          <button
            onClick={handleClose}
            className="w-full py-2.5 text-sm font-black text-white transition-transform duration-150 active:scale-[0.97]"
            style={{
              background: 'var(--color-ink)',
              border: '3px solid var(--color-ink)',
              borderRadius: '14px',
              boxShadow: '4px 4px 0 var(--color-shadow-blue)',
            }}
          >
            我知道了
          </button>
        </div>
      </div>
    </div>
  )
}
