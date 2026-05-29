import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  shadowColor?: string
  onClick?: () => void
}

export default function Card({
  children,
  className = '',
  shadowColor = 'var(--color-shadow-blue)',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative bg-white transition-transform duration-150 active:scale-[0.99] ${className}`}
      style={{
        border: '3px solid var(--color-ink)',
        borderRadius: 'var(--radius-card)',
        boxShadow: `8px 8px 0 ${shadowColor}`,
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {children}
    </div>
  )
}
