import { useState, useEffect } from 'react'

/**
 * useCountUp Hook
 * Animates a numeric value from 0 to target with an ease-out curve.
 *
 * @param {number} targetValue Target numeric value
 * @param {number} duration Duration in milliseconds (default: 800ms)
 * @returns {number} Current animated value
 */
export function useCountUp(targetValue, duration = 800) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const end = Number(targetValue) || 0
    if (end === 0) return

    let startTimestamp = null
    let animationFrameId

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp
      const progress = Math.min((timestamp - startTimestamp) / duration, 1)

      // Ease-out cubic: 1 - (1 - t)^3
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(easeOut * end))

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step)
      } else {
        setCount(end)
      }
    }

    animationFrameId = requestAnimationFrame(step)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [targetValue, duration])

  return count
}

export default useCountUp

