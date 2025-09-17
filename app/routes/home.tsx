// Import components
import { Navigation } from '../components/layout/navigation'
import { Preloader } from '../components/layout/preloader'
import { AboutSection } from '../components/sections/about'
import { ArtistsSection } from '../components/sections/artists'
import { ContactSection } from '../components/sections/contact'
import { LandingSection } from '../components/sections/landing'
import { PricelistSection } from '../components/sections/pricelist'
import { SectionProvider, useSectionContext } from '../contexts/SectionContext'
// Import data
import artistsData from '../data/artists.json'
import contactData from '../data/contact.json'
import pricelistData from '../data/pricelist.json'
import siteMetaData from '../data/site-meta.json'
import { useCursor } from '../hooks/useCursor'
import type { Route } from './+types/home'

export function meta(_: Route.MetaArgs) {
  return [
    { title: siteMetaData.title },
    { name: 'description', content: siteMetaData.description },
    { name: 'keywords', content: siteMetaData.keywords.join(', ') },
    { name: 'author', content: 'Crescentials Record' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: siteMetaData.primaryColor },

    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: siteMetaData.title },
    { property: 'og:description', content: siteMetaData.description },
    { property: 'og:image', content: siteMetaData.ogImage },
    { property: 'og:url', content: 'https://crescentials-record.com' },
    { property: 'og:site_name', content: 'Crescentials Record' },
    { property: 'og:locale', content: 'id_ID' },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: siteMetaData.title },
    { name: 'twitter:description', content: siteMetaData.description },
    { name: 'twitter:image', content: siteMetaData.ogImage },

    // Additional SEO
    { name: 'application-name', content: 'Crescentials Record' },
    { name: 'apple-mobile-web-app-title', content: 'Crescentials Record' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'msapplication-TileColor', content: siteMetaData.primaryColor },
    { name: 'msapplication-TileImage', content: siteMetaData.favicon },
  ]
}

export async function loader(_: Route.LoaderArgs) {
  return {
    artists: artistsData,
    siteMeta: siteMetaData,
    contact: contactData,
    pricelist: pricelistData,
  }
}

function MainContent() {
  const { activeSection } = useSectionContext()

  return (
    <main className="landing">
      {/* Landing Section with Animations */}
      <div
        className={`section landing-section home-section ${activeSection === 'Home' ? 'active' : ''}`}
      >
        <LandingSection />
      </div>

      {/* About Section */}
      <div className={`section about-section ${activeSection === 'About' ? 'active' : ''}`}>
        <AboutSection />
      </div>

      {/* Artists Section */}
      <div className={`section ${activeSection === 'Artists' ? 'active' : ''}`}>
        <ArtistsSection />
      </div>

      {/* Pricelist Section */}
      <div className={`section ${activeSection === 'Pricelist' ? 'active' : ''}`}>
        <PricelistSection />
      </div>

      {/* Contact Section */}
      <div className={`section contact-section ${activeSection === 'Contact' ? 'active' : ''}`}>
        <ContactSection />
      </div>
    </main>
  )
}

export default function Home() {
  useCursor() // Add cursor tracking

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://crescentials-record.com/#organization',
        name: 'Crescentials Record',
        url: 'https://crescentials-record.com',
        logo: {
          '@type': 'ImageObject',
          url: siteMetaData.ogImage,
        },
        foundingDate: siteMetaData.established.toString(),
        description: siteMetaData.description,
        address: {
          '@type': 'PostalAddress',
          addressLocality: contactData.address,
          addressCountry: 'Indonesia',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: contactData.phone,
          email: contactData.email,
          contactType: 'customer service',
          availableLanguage: ['Indonesian', 'English'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://crescentials-record.com/#website',
        url: 'https://crescentials-record.com',
        name: 'Crescentials Record',
        description: siteMetaData.description,
        publisher: {
          '@id': 'https://crescentials-record.com/#organization',
        },
        inLanguage: 'id-ID',
      },
      {
        '@type': 'LocalBusiness',
        name: 'Crescentials Record',
        image: siteMetaData.ogImage,
        description: siteMetaData.description,
        url: 'https://crescentials-record.com',
        telephone: contactData.phone,
        email: contactData.email,
        priceRange: '$$',
        address: {
          '@type': 'PostalAddress',
          addressLocality: contactData.address,
          addressCountry: 'Indonesia',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          reviewCount: '100',
        },
        sameAs: [
          contactData.social.instagram,
          contactData.social.youtube,
          contactData.social.spotify,
        ],
      },
    ],
  }

  return (
    <SectionProvider>
      <div className="crescentials-app">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Preloader with SVG line drawing animation */}
        <Preloader />

        {/* Navigation */}
        <Navigation />

        {/* Side Label for Copyright */}
        <div className="side-label">Crescentials Record © 2025</div>

        {/* Main Content */}
        <MainContent />
      </div>
    </SectionProvider>
  )
}
