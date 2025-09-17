import { useContact } from '../../hooks/useContact'

export function ContactSection() {
  const { contact, loading, error } = useContact()

  if (loading) return <div>Loading contact information...</div>
  if (error) return <div>Error loading contact: {error}</div>
  if (!contact) return <div>No contact information available</div>

  return (
    <>
      <div className="subtitle">Let&apos;s Create!</div>
      <h1>
        Got a project in mind?<br />
        Production, mix &amp; master, or a custom idea<br />
        — I&apos;d love to hear from you.<br />
      </h1>
      
      <div className="contact-items">
        {/* Row 1 */}
        <div className="row">
          <a href={`mailto:${contact.email}`}>
            <i className="ri-mail-line"></i>
            <span>Email</span>
          </a>
          <a href={`https://wa.me/${contact.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
            <i className="ri-whatsapp-line"></i>
            <span>WhatsApp</span>
          </a>
        </div>
        {/* Row 2 */}
        <div className="row">
          <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer">
            <i className="ri-instagram-line"></i>
            <span>Instagram</span>
          </a>
          <a href={contact.social.youtube} target="_blank" rel="noopener noreferrer">
            <i className="ri-youtube-line"></i>
            <span>YouTube</span>
          </a>
          <a href={contact.social.spotify} target="_blank" rel="noopener noreferrer">
            <i className="ri-spotify-line"></i>
            <span>Spotify</span>
          </a>
        </div>
      </div>

      <div className="footer">
        © <span>{new Date().getFullYear()}</span> Crescentials Record. All rights reserved.
      </div>
    </>
  )
}