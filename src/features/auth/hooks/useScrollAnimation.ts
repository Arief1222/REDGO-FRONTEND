// features/auth/hooks/useScrollAnimation.ts
import { useEffect, useRef } from "react"

/**
 * Pasang ke container section.
 * Semua child dengan class anim-* di dalamnya akan dapat
 * class "is-visible" saat masuk viewport, dan hilang saat keluar
 * → animasi bolak-balik setiap scroll.
 */
export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const targets = container.querySelectorAll<HTMLElement>(
      ".anim-fade-up, .anim-fade-in, .anim-slide-left, .anim-slide-right, .anim-scale-in"
    )

    const observers: IntersectionObserver[] = []

    targets.forEach((el) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible")
          } else {
            el.classList.remove("is-visible")
          }
        },
        { threshold }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [threshold])

  return ref
}