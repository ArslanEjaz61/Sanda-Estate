import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const numericValue = parseFloat(target)
    if (isNaN(numericValue)) {
      setDisplay(target)
      return
    }

    const hasDecimal = String(target).includes('.')
    const startTime = Date.now()
    const durationMs = duration * 1000

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / durationMs, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = numericValue * eased

      if (hasDecimal) {
        setDisplay(current.toFixed(1))
      } else {
        setDisplay(Math.floor(current).toLocaleString())
      }

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        if (hasDecimal) setDisplay(parseFloat(target).toFixed(1))
        else setDisplay(Math.floor(numericValue).toLocaleString())
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, target, duration])

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  )
}
