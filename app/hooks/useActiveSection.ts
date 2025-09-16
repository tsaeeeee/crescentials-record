import { useState, useEffect } from 'react'

/**
 * Hook to track which section is currently active based on scroll position
 * Mimics the original navigation behavior
 */
export const useActiveSection = () => {
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const sections = [
      { id: 'home', element: document.getElementById('Home') },
      { id: 'about', element: document.getElementById('About') },
      { id: 'artists', element: document.getElementById('Artists') },
      { id: 'pricelist', element: document.getElementById('Pricelist') },
      { id: 'contact', element: document.getElementById('contact') }
    ]

    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id.toLowerCase()
          const mappedId = sectionId === 'home' ? 'home' : 
                          sectionId === 'about' ? 'about' :
                          sectionId === 'artists' ? 'artists' :
                          sectionId === 'pricelist' ? 'pricelist' :
                          sectionId === 'contact' ? 'contact' : 'home'
          setActiveSection(mappedId)
        }
      })
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions)

    // Observe all sections
    sections.forEach(({ element }) => {
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    activeSection,
    setActiveSection
  }
}

/**
 * Hook for responsive breakpoints
 */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)

    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}