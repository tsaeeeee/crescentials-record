// Artist Data Types (Based on existing structure)
export interface Artist {
  name: string
  bio: string
  image: string
  socials: {
    instagram: string
    spotify: string
    youtube: string
  }
  tracks: string[] // Spotify embed URLs
}

// Pricing Package Types  
export interface PricingPackage {
  id: string
  name: string
  description: string
  features: string[]
  price: {
    amount: number
    currency: "IDR" | "USD"
    period?: "per song" | "per project"
  }
  popular?: boolean
}

// Contact Information Types
export interface ContactInfo {
  email: string
  phone: string
  socialLinks: {
    instagram: string
    youtube: string
    spotify: string
  }
  businessHours: string
  location: string
  address: string
  timezone: string
}

// Site Meta Types
export interface SiteMeta {
  title: string
  tagline: string
  description: string
  keywords: string[]
  ogImage: string
  favicon: string
  established: number
  location: string
  primaryColor: string
  backgroundColor: string
}

// Navigation Types
export interface NavItem {
  id: string
  href: string
  label: string
  icon: string
  ariaLabel: string
}

// Animation Props Types
export interface GSAPTimelineProps {
  duration?: number
  ease?: string
  delay?: number
  stagger?: number
}

export interface WaveCanvasProps {
  color?: string
  amplitude?: number
  section?: string
  className?: string
}

// Component Props Types
export interface ArtistCarouselProps {
  artists: Artist[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export interface PricingCardProps {
  package: PricingPackage
  featured?: boolean
}

export interface ContactFormData {
  name: string
  email: string
  message: string
  projectType?: string
}