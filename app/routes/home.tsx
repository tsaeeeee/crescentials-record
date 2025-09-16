import type { Route } from "./+types/home";

// Import data
import artistsData from "../data/artists.json";
import siteMetaData from "../data/site-meta.json";
import contactData from "../data/contact.json";
import pricelistData from "../data/pricelist.json";

// Import components
import { Navigation } from "../components/layout/navigation";
import { SectionProvider } from "../contexts/SectionContext";
import { LandingSection } from "../components/sections/landing";
import { Preloader } from "../components/layout/preloader";

// Import components (will be created)
// import { HeroSection } from "../components/sections/hero";
// import { AboutSection } from "../components/sections/about";
// import { ArtistsSection } from "../components/sections/artists";
// import { PricelistSection } from "../components/sections/pricelist";
// import { ContactSection } from "../components/sections/contact";
// import { Preloader } from "../components/layout/preloader";

export function meta({}: Route.MetaArgs) {
  return [
    { title: siteMetaData.title },
    { name: "description", content: siteMetaData.description },
    { name: "keywords", content: siteMetaData.keywords.join(", ") },
    { property: "og:title", content: siteMetaData.title },
    { property: "og:description", content: siteMetaData.description },
    { property: "og:image", content: siteMetaData.ogImage },
  ];
}

export async function loader({}: Route.LoaderArgs) {
  return {
    artists: artistsData,
    siteMeta: siteMetaData,
    contact: contactData,
    pricelist: pricelistData,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { artists, siteMeta, contact, pricelist } = loaderData;

  return (
    <SectionProvider>
      <div className="crescentials-app">
        {/* Preloader with SVG line drawing animation */}
        <Preloader />
        
        {/* Navigation */}
        <Navigation />
        
        {/* Side Label for Copyright */}
        <div className="side-label">
          Crescentials Record © 2025
        </div>

        {/* Main Content - Preserving existing structure */}
        <main className="landing">
          {/* Landing Section with Animations */}
          <LandingSection />

          {/* About Section */}
          <section id="About" className="section">
            <div className="about-container">
              <div className="about-left"></div>
              <div className="about-right">
                <h2>About section - Coming Soon</h2>
              </div>
            </div>
          </section>
          
          {/* Artists Section */}
          <section id="Artists" className="section">
            <div>
              <h2>Our Artists</h2>
              <p>{artists.length} talented artists working with us</p>
            </div>
          </section>
          
          {/* Pricelist Section */}
          <section id="Pricelist" className="section">
            <div>
              <h2>Our Services</h2>
              <p>{pricelist.length} professional packages available</p>
            </div>
          </section>
          
          {/* Contact Section */}
          <section id="Contact" className="section">
            <div>
              <h2>Get In Touch</h2>
              <p>Contact section - Coming Soon</p>
            </div>
          </section>

        {/* Other sections will be implemented */}
        {/* <HeroSection tagline={siteMeta.tagline} /> */}
        {/* <AboutSection /> */}
        {/* <ArtistsSection artists={artists} /> */}
        {/* <PricelistSection packages={pricelist} /> */}
        {/* <ContactSection contact={contact} /> */}
      </main>
    </div>
    </SectionProvider>
  );
}
