import { gsap } from 'gsap'

// Register GSAP plugins (add more as needed)
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// gsap.registerPlugin(ScrollTrigger)

// GSAP configuration for consistent easing and timing
export const GSAPConfig = {
  // Standard easing functions (matching existing animations)
  ease: {
    power2InOut: "power2.inOut",
    power2Out: "power2.out", 
    power3Out: "power3.out",
    back: "back.out(1.7)",
    elastic: "elastic.out(1, 0.3)"
  },
  
  // Standard durations (matching existing animations)
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.2,
    tagline: 1.5
  },
  
  // Stagger timings (matching existing animations)
  stagger: {
    default: 0.1,
    text: 0.3,
    cards: 0.2
  }
}

// Animation presets (preserving existing GSAP patterns)
export const AnimationPresets = {
  // Tagline flicker animation (from existing main.js)
  taglineFlicker: {
    from: { opacity: 0, y: 100 },
    to: { 
      opacity: 1, 
      y: 0, 
      duration: GSAPConfig.duration.tagline,
      ease: GSAPConfig.ease.power2Out,
      stagger: GSAPConfig.stagger.text
    }
  },
  
  // Artist carousel transition (from existing artist.js)  
  artistTransition: {
    current: {
      x: '-100%',
      opacity: 0,
      duration: GSAPConfig.duration.normal,
      ease: GSAPConfig.ease.power2InOut
    },
    next: {
      from: { x: '100%', opacity: 0 },
      to: { 
        x: '0%', 
        opacity: 1, 
        duration: GSAPConfig.duration.normal,
        ease: GSAPConfig.ease.power2InOut
      }
    }
  },
  
  // Preloader fade out (from existing main.js)
  preloaderFade: {
    from: { opacity: 1 },
    to: {
      opacity: 0,
      duration: 1,
      delay: 4,
      ease: GSAPConfig.ease.power2Out
    }
  },
  
  // Section reveal animation
  sectionReveal: {
    from: { opacity: 0, y: 20 },
    to: {
      opacity: 1,
      y: 0,
      duration: GSAPConfig.duration.normal,
      ease: GSAPConfig.ease.power2Out
    }
  }
}

// Helper function to create consistent timelines
export const createTimeline = (options?: gsap.TimelineVars) => {
  return gsap.timeline({
    ease: GSAPConfig.ease.power2InOut,
    ...options
  })
}

// Helper function for stagger animations
export const staggerAnimation = (
  selector: string | Element[],
  animation: gsap.TweenVars,
  stagger: number = GSAPConfig.stagger.default
) => {
  return gsap.fromTo(selector, 
    { opacity: 0, y: 20 },
    {
      opacity: 1,
      y: 0,
      stagger,
      ease: GSAPConfig.ease.power2Out,
      ...animation
    }
  )
}

export default gsap