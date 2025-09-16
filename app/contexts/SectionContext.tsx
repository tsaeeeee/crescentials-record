import { createContext, type ReactNode, useContext, useState } from 'react'

interface SectionContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  navigateToSection: (section: string) => void
}

const SectionContext = createContext<SectionContextType | undefined>(undefined)

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('Home')

  const navigateToSection = (section: string) => {
    setActiveSection(section)
  }

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
