import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '-80px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const delayClass = delay > 0 ? `reveal-d${Math.min(Math.round(delay / 100), 7)}` : ''

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${delayClass} ${className}`}
    >
      {children}
    </div>
  )
}
