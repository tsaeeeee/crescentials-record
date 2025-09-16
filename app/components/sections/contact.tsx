export function ContactSection() {
  const contactLinks = [
    {
      text: 'WhatsApp',
      href: 'https://wa.me/6281234567890',
      icon: 'ri-whatsapp-line'
    },
    {
      text: 'Instagram',
      href: 'https://instagram.com/crescentials',
      icon: 'ri-instagram-line'
    },
    {
      text: 'Email',
      href: 'mailto:contact@crescentials.com',
      icon: 'ri-mail-line'
    },
    {
      text: 'YouTube',
      href: 'https://youtube.com/@crescentials',
      icon: 'ri-youtube-line'
    },
    {
      text: 'Spotify',
      href: 'https://open.spotify.com/artist/crescentials',
      icon: 'ri-spotify-line'
    },
    {
      text: 'SoundCloud',
      href: 'https://soundcloud.com/crescentials',
      icon: 'ri-soundcloud-line'
    }
  ]

  return (
    <section id="Contact" className="section contact-section">
      <div className="subtitle">Ready to create?</div>
      <h1>Let&apos;s make music together.</h1>
      
      <div className="contact-items">
        <div className="row">
          <a href={contactLinks[0].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[0].icon}></i> {contactLinks[0].text}
          </a>
          <a href={contactLinks[1].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[1].icon}></i> {contactLinks[1].text}
          </a>
          <a href={contactLinks[2].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[2].icon}></i> {contactLinks[2].text}
          </a>
        </div>
        <div className="row">
          <a href={contactLinks[3].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[3].icon}></i> {contactLinks[3].text}
          </a>
          <a href={contactLinks[4].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[4].icon}></i> {contactLinks[4].text}
          </a>
          <a href={contactLinks[5].href} target="_blank" rel="noopener noreferrer">
            <i className={contactLinks[5].icon}></i> {contactLinks[5].text}
          </a>
        </div>
      </div>

      <div className="footer">
        © 2025 Crescentials Record. All rights reserved.
      </div>
    </section>
  )
}