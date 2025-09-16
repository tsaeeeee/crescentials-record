import { gsap } from 'gsap'
import { useLayoutEffect, useRef } from 'react'

/**
 * Custom hook for GSAP animations with proper React lifecycle
 * Preserves existing GSAP animation patterns while ensuring cleanup
 */
export const useGSAP = (
  callback: (context: gsap.Context, ref: React.RefObject<HTMLElement>) => void,
  deps: React.DependencyList = [],
) => {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (ref.current) {
        callback(ctx, ref)
      }
    }, ref)

    // Cleanup: revert all animations created in this context
    return () => ctx.revert()
  }, deps)

  return ref
}

/**
 * Hook for creating GSAP timelines with automatic cleanup
 */
export const useGSAPTimeline = (options?: gsap.TimelineVars, deps: React.DependencyList = []) => {
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  useLayoutEffect(() => {
    timelineRef.current = gsap.timeline(options)

    return () => {
      timelineRef.current?.kill()
    }
  }, deps)

  return timelineRef.current
}

/**
 * Hook for scroll-triggered animations (when ScrollTrigger is needed)
 */
export const useScrollTrigger = (
  trigger: string | Element,
  animation: gsap.TweenVars,
  scrollTriggerOptions?: any,
  deps: React.DependencyList = [],
) => {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: trigger || ref.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            ...scrollTriggerOptions,
          },
          ...animation,
        },
      )
    }, ref)

    return () => ctx.revert()
  }, deps)

  return ref
}
