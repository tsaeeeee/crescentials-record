// Import components
import { Navigation } from '../components/layout/navigation'
import { Preloader } from '../components/layout/preloader'
import { LandingSection } from '../components/sections/landing'
import { AboutSection } from '../components/sections/about'
import { ArtistsSection } from '../components/sections/artists'
import { PricelistSection } from '../components/sections/pricelist'
import { ContactSection } from '../components/sections/contact'
import { SectionProvider } from '../contexts/SectionContext'
// Import data
import artistsData from '../data/artists.json'
import contactData from '../data/contact.json'
import pricelistData from '../data/pricelist.json'
import siteMetaData from '../data/site-meta.json'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: siteMetaData.title },
    { name: 'description', content: siteMetaData.description },
    { name: 'keywords', content: siteMetaData.keywords.join(', ') },
    { property: 'og:title', content: siteMetaData.title },
    { property: 'og:description', content: siteMetaData.description },
    { property: 'og:image', content: siteMetaData.ogImage },
  ]
}

export async function loader({}: Route.LoaderArgs) {
  return {
    artists: artistsData,
    siteMeta: siteMetaData,
    contact: contactData,
    pricelist: pricelistData,
  }
}

export default function Home() {
  return (
    <SectionProvider>
      <div className="crescentials-app">
        {/* Preloader with SVG line drawing animation */}
        <Preloader />

        {/* Navigation */}
        <Navigation />

        {/* Side Label for Copyright */}
        <div className="side-label">Crescentials Record © 2025</div>

        {/* Main Content */}
        <main className="landing">
          {/* Landing Section with Animations */}
          <LandingSection />

          {/* About Section */}
          <AboutSection />

          {/* Artists Section */}
          <ArtistsSection />

          {/* Pricelist Section */}
          <PricelistSection />

          {/* Contact Section */}
          <ContactSection />
        </main>
      </div>
    </SectionProvider>
  )
}
