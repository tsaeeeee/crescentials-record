import { useSectionContext } from '../../contexts/SectionContext'

export const Navigation = () => {
  const { activeSection, navigateToSection } = useSectionContext()

  const handleNavClick = (href: string) => {
    navigateToSection(href.replace('#', ''))
  }

  return (
    <nav className="nav" role="navigation" aria-label="Main navigation">
      <ul className="nav__list">
        <li>
          <a
            href="#Home"
            className={`nav__link ${activeSection === 'Home' ? 'active-link' : ''}`}
            aria-label="Home"
            onClick={e => {
              e.preventDefault()
              handleNavClick('#Home')
            }}
          >
            <i className="ri-moon-line" aria-hidden="true"></i>
            <span className="nav__name">Home</span>
          </a>
        </li>
        <li>
          <a
            href="#About"
            className={`nav__link ${activeSection === 'About' ? 'active-link' : ''}`}
            aria-label="About us"
            onClick={e => {
              e.preventDefault()
              handleNavClick('#About')
            }}
          >
            <i className="ri-eye-2-line" aria-hidden="true"></i>
            <span className="nav__name">Preambul</span>
          </a>
        </li>
        <li>
          <a
            href="#Artists"
            className={`nav__link ${activeSection === 'Artists' ? 'active-link' : ''}`}
            aria-label="Artists and Releases"
            onClick={e => {
              e.preventDefault()
              handleNavClick('#Artists')
            }}
          >
            <i className="ri-disc-line" aria-hidden="true"></i>
            <span className="nav__name">Artists & Releases</span>
          </a>
        </li>
        <li>
          <a
            href="#Pricelist"
            className={`nav__link ${activeSection === 'Pricelist' ? 'active-link' : ''}`}
            aria-label="Pricelist"
            onClick={e => {
              e.preventDefault()
              handleNavClick('#Pricelist')
            }}
          >
            <i className="ri-money-dollar-circle-line" aria-hidden="true"></i>
            <span className="nav__name">Pricelist</span>
          </a>
        </li>
        <li>
          <a
            href="#Contact"
            className={`nav__link ${activeSection === 'Contact' ? 'active-link' : ''}`}
            aria-label="Contact"
            onClick={e => {
              e.preventDefault()
              handleNavClick('#Contact')
            }}
          >
            <i className="ri-chat-voice-line" aria-hidden="true"></i>
            <span className="nav__name">Contact</span>
          </a>
        </li>
      </ul>
    </nav>
  )
}
