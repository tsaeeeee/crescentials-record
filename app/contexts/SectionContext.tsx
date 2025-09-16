import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface SectionContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  navigateToSection: (section: string) => void
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('Home')

  const navigateToSection = (section: string) => {
    // Hide all sections
    const allSections = document.querySelectorAll('.section')
    allSections.forEach(s => s.classList.remove('active'))
    
    // Show target section
    const targetSection = document.getElementById(section)
    if (targetSection) {
      targetSection.classList.add('active')
      setActiveSection(section)
    }
  }

  useEffect(() => {
    // Set initial active section
    const homeSection = document.getElementById('Home')
    if (homeSection) {
      homeSection.classList.add('active')
    }
  }, [])

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection, navigateToSection }}>
      {children}
    </SectionContext.Provider>
  )
}

export function useSectionContext() {
  const context = useContext(SectionContext)
  if (context === undefined) {
    throw new Error('useSectionContext must be used within a SectionProvider')
  }
  return context
}