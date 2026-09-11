import { useState, useEffect } from 'react'

/**
 * IntroAnimation Component
 * A subtle, tactile fiscal stamp reveal on initial website visit.
 * Fast, restrained (1.1s total), non-intrusive, and stored in sessionStorage.
 */
export function IntroAnimation() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasSeenIntro = sessionStorage.getItem('catatcuan_intro_viewed')
    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
    return !hasSeenIntro && !prefersReducedMotion
  })

  const [isFading, setIsFading] = useState(false)
  const [stampActive, setStampActive] = useState(false)

  useEffect(() => {
    if (!isVisible) return

    // 1. Trigger the tactile stamp appearance (after 100ms)
    const tStamp = setTimeout(() => {
      setStampActive(true)
    }, 100)

    // 2. Begin smooth curtain fade-out (after 850ms)
    const tFade = setTimeout(() => {
      setIsFading(true)
    }, 850)

    // 3. Complete and unmount (after 1250ms)
    const tFinish = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('catatcuan_intro_viewed', 'true')
    }, 1250)

    return () => {
      clearTimeout(tStamp)
      clearTimeout(tFade)
      clearTimeout(tFinish)
    }
  }, [isVisible])

  const handleSkip = () => {
    setIsFading(true)
    setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem('catatcuan_intro_viewed', 'true')
    }, 150)
  }

  if (!isVisible) return null

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f5f6f4] cursor-pointer select-none transition-all duration-300 ease-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden="true"
    >
      {/* Central Clean Imprint */}
      <div className="flex flex-col items-center gap-3">
        {/* Brand Lockup */}
        <div
          className={`flex items-center gap-3 transition-all duration-300 ease-out ${
            stampActive
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-1 scale-98'
          }`}
        >
          {/* Emerald Mark */}
          <div className="w-10 h-10 rounded-base bg-emerald-700 text-white font-mono font-bold text-sm flex items-center justify-center shadow-sm">
            CC
          </div>

          {/* Typography */}
          <div className="flex flex-col">
            <span className="font-heading font-bold text-2xl text-[#121a15] tracking-tight leading-none">
              CatatCuan
            </span>
            <span className="text-[10px] font-sans font-medium uppercase tracking-wider text-[#526356] mt-1">
              Billing & Invoicing Workspace
            </span>
          </div>
        </div>

        {/* Subtle Expanding Line */}
        <div
          className={`h-[1px] bg-emerald-600/40 transition-all duration-400 ease-out ${
            stampActive ? 'w-36 opacity-100' : 'w-0 opacity-0'
          }`}
        />
      </div>
    </div>
  )
}

export default IntroAnimation

