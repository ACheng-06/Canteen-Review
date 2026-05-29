import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  className?: string
  disabled?: boolean
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center px-5 py-2.5 text-sm font-black transition-transform duration-150 active:scale-[0.97] disabled:opacity-50'

  const styles =
    variant === 'primary'
      ? {
          background: 'linear-gradient(135deg, #172033 0%, #172033 58%, #FF4FB8 58%, #FF4FB8 100%)',
          color: 'white',
          border: '3px solid var(--color-ink)',
          borderRadius: 'var(--radius-button)',
          boxShadow: '7px 7px 0 var(--color-amber)',
        }
      : {
          background: 'white',
          color: 'var(--color-ink)',
          border: '3px solid var(--color-ink)',
          borderRadius: 'var(--radius-button)',
          boxShadow: '7px 7px 0 var(--color-shadow-blue)',
        }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${className}`}
      style={styles}
    >
      {children}
    </button>
  )
}
