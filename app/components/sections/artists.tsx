import { gsap } from 'gsap'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useArtistNavigation, useArtists, usePreloadArtistImages } from '~/hooks/useArtists'

export function ArtistsSection() {
  const [currentArtist, setCurrentArtist] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [lastNavigationTime, setLastNavigationTime] = useState(0)

  // Refs for GSAP animations
  const detailsRef = useRef<HTMLDivElement>(null)
  const imagesRef = useRef<HTMLDivElement>(null)
  const navigationThrottle = 800

  // React Query hooks
  const { data: artists, isLoading, error } = useArtists()
  const { preloadImages } = usePreloadArtistImages()
  const { prefetchAdjacentArtists } = useArtistNavigation(currentArtist, artists?.length || 0)

  // Preload images when artists data is available
  useEffect(() => {
    if (artists && artists.length > 0) {
      preloadImages(artists)
      prefetchAdjacentArtists()
    }
  }, [artists, preloadImages, prefetchAdjacentArtists])

  // Update prefetch when currentArtist changes
  useEffect(() => {
    if (artists && artists.length > 0) {
      prefetchAdjacentArtists()
    }
  }, [artists, prefetchAdjacentArtists])

  const updateContent = useCallback(
    (index: number) => {
      if (!artists || !detailsRef.current) return

      const artist = artists[index]
      const detailsContainer = detailsRef.current

      // Clean up existing iframes to prevent memory leaks
      const existingIframes = detailsContainer.querySelectorAll('iframe')
      existingIframes.forEach(iframe => {
        iframe.src = 'about:blank'
        iframe.remove()
      })

      // Create content elements using DOM methods instead of innerHTML
      const contentWrapper = document.createElement('div')

      // Artist name
      const artistName = document.createElement('h2')
      artistName.textContent = artist.name
      contentWrapper.appendChild(artistName)

      // Artist bio
      const artistBio = document.createElement('p')
      artistBio.textContent = artist.bio
      contentWrapper.appendChild(artistBio)

      // Social links
      const socialsContainer = document.createElement('div')
      socialsContainer.className = 'socials'

      Object.entries(artist.socials)
        .filter(([, url]) => url)
        .forEach(([platform, url]) => {
          const iconMap: Record<string, string> = {
            instagram: 'ri-instagram-line',
            youtube: 'ri-youtube-line',
            spotify: 'ri-spotify-line',
          }

          const socialLink = document.createElement('a')
          socialLink.href = url || '#'
          socialLink.target = '_blank'
          socialLink.rel = 'noopener noreferrer'

          const socialIcon = document.createElement('i')
          socialIcon.className = iconMap[platform] || ''
          socialLink.appendChild(socialIcon)

          socialsContainer.appendChild(socialLink)
        })

      contentWrapper.appendChild(socialsContainer)

      // Tracks section
      if (artist.tracks && artist.tracks.length > 0) {
        const releasesLabel = document.createElement('div')
        releasesLabel.className = 'releases-label'
        releasesLabel.textContent = 'Latest Releases'
        releasesLabel.style.marginBottom = '20px'
        contentWrapper.appendChild(releasesLabel)

        const tracksContainer = document.createElement('div')
        tracksContainer.className = 'spotify-tracks'

        artist.tracks.forEach((track, trackIndex) => {
          const trackWrapper = document.createElement('div')
          trackWrapper.className = 'spotify-track-wrapper'
          trackWrapper.style.opacity = '0'
          trackWrapper.style.transform = 'translateY(20px)'

          // Create skeleton loader
          const skeleton = document.createElement('div')
          skeleton.className = 'spotify-skeleton'
          skeleton.style.display = 'flex'
          skeleton.innerHTML = `
          <div class="skeleton-album-art"></div>
          <div class="skeleton-details">
            <div class="skeleton-track-title"></div>
            <div class="skeleton-artist-name"></div>
            <div class="skeleton-playback-bar"></div>
          </div>
        `
          trackWrapper.appendChild(skeleton)

          // Create iframe
          const iframe = document.createElement('iframe')
          iframe.src = track
          iframe.width = '100%'
          iframe.height = '152'
          iframe.frameBorder = '0'
          iframe.setAttribute('allowtransparency', 'true')
          iframe.allow = 'encrypted-media'
          iframe.title = `${artist.name} Track ${trackIndex + 1}`
          iframe.loading = 'lazy'
          iframe.style.opacity = '0'
          iframe.style.transition = 'opacity 0.4s ease'

          iframe.onload = () => {
            iframe.style.opacity = '1'
            skeleton.style.display = 'none'
          }

          iframe.onerror = () => {
            console.warn(`Failed to load Spotify track: ${track}`)
            skeleton.style.display = 'none'
            trackWrapper.style.display = 'none'
          }

          trackWrapper.appendChild(iframe)
          tracksContainer.appendChild(trackWrapper)
        })

        contentWrapper.appendChild(tracksContainer)
      }

      // Animate content transition
      const currentElements = detailsContainer.querySelectorAll(
        'h2, p, .socials, .releases-label, .spotify-track-wrapper',
      )

      if (currentElements.length > 0) {
        gsap.to(currentElements, {
          opacity: 0,
          y: -10,
          duration: 0.15,
          ease: 'power2.in',
          onComplete: () => {
            detailsContainer.innerHTML = ''
            detailsContainer.appendChild(contentWrapper)
            animateNewContent()
          },
        })
      } else {
        detailsContainer.innerHTML = ''
        detailsContainer.appendChild(contentWrapper)
        animateNewContent()
      }

      function animateNewContent() {
        const textElements = detailsContainer.querySelectorAll('h2, p, .socials, .releases-label')
        const spotifyWrappers = detailsContainer.querySelectorAll('.spotify-track-wrapper')

        gsap.set(textElements, { opacity: 0, y: 20 })
        gsap.set(spotifyWrappers, { opacity: 0, y: 30 })

        gsap.to(textElements, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.out',
        })

        gsap.to(spotifyWrappers, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power2.out',
        })
      }
    },
    [artists],
  )

  const showImage = useCallback(
    (index: number, direction: 'next' | 'prev') => {
      if (!imagesRef.current || isTransitioning || index === currentArtist || !artists) return

      setIsTransitioning(true)
      const images = imagesRef.current.querySelectorAll('img')
      const current = images[currentArtist]
      const next = images[index]

      // Update content immediately when transition starts
      updateContent(index)

      // Check if we're on mobile (1024px breakpoint from CSS)
      const isMobile = window.innerWidth <= 1024

      // Smooth image transition
      const tl = gsap.timeline({
        onComplete: () => {
          current?.classList.remove('active')
          next?.classList.add('active')
          setCurrentArtist(index)
          setIsTransitioning(false)
          // Clear any GSAP-applied transforms
          gsap.set([current, next], { clearProps: 'x,y,xPercent,yPercent' })
        },
      })

      if (isMobile) {
        // Mobile: Use xPercent for relative positioning
        tl.to(current, {
          xPercent: direction === 'next' ? -100 : 100,
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }).fromTo(
          next,
          {
            xPercent: direction === 'next' ? 100 : -100,
            opacity: 0,
          },
          {
            xPercent: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          '-=0.3',
        )
      } else {
        // Desktop: Use absolute x positioning (original working method)
        tl.to(current, {
          x: direction === 'next' ? '-100%' : '100%',
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }).fromTo(
          next,
          {
            x: direction === 'next' ? '100%' : '-100%',
            opacity: 0,
          },
          {
            x: '0%',
            opacity: 1,
            duration: 0.6,
            ease: 'power2.inOut',
          },
          '-=0.3',
        )
      }
    },
    [currentArtist, isTransitioning, artists, updateContent],
  )

  const nextArtist = useCallback(() => {
    const now = Date.now()
    if (now - lastNavigationTime < navigationThrottle || isTransitioning || !artists) return

    setLastNavigationTime(now)
    const nextIndex = (currentArtist + 1) % artists.length
    showImage(nextIndex, 'next')
  }, [currentArtist, lastNavigationTime, isTransitioning, artists, showImage])

  const prevArtist = useCallback(() => {
    const now = Date.now()
    if (now - lastNavigationTime < navigationThrottle || isTransitioning || !artists) return

    setLastNavigationTime(now)
    const prevIndex = (currentArtist - 1 + artists.length) % artists.length
    showImage(prevIndex, 'prev')
  }, [currentArtist, lastNavigationTime, isTransitioning, artists, showImage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevArtist()
      if (e.key === 'ArrowRight') nextArtist()
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [nextArtist, prevArtist])

  // Initialize content when component mounts or data changes
  useEffect(() => {
    if (artists && artists.length > 0 && detailsRef.current) {
      updateContent(0)

      // Ensure all images have clean transforms on mount
      if (imagesRef.current) {
        const images = imagesRef.current.querySelectorAll('img')
        gsap.set(images, { clearProps: 'transform' })
      }
    }
  }, [artists, updateContent])

  if (isLoading) {
    return (
      <section id="Artists" className="section">
        <div className="artist-container">
          <div className="artist-loading">
            <div className="loading-spinner"></div>
            <p>Loading artists...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section id="Artists" className="section">
        <div className="artist-container">
          <div className="artist-error">
            <h3>Failed to load artists</h3>
            <p>Please try refreshing the page.</p>
          </div>
        </div>
      </section>
    )
  }

  if (!artists || artists.length === 0) {
    return (
      <section id="Artists" className="section">
        <div className="artist-container">
          <div className="artist-empty">
            <h3>No artists found</h3>
            <p>Check back later for artist updates.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="Artists" className="section">
      <div className="artist-container">
        {/* Left Panel - Artist Info */}
        <div className="artist-left">
          <div className="artist-content" ref={detailsRef}>
            {/* Content will be populated by updateContent function */}
          </div>
        </div>

        {/* Right Panel - Artist Images */}
        <div className="artist-right">
          <div className="artist-image-container" ref={imagesRef}>
            {artists.map((artist, index) => (
              <img
                key={`${artist.name}-${index}`}
                src={artist.image}
                alt={artist.name}
                className={index === currentArtist ? 'active' : ''}
                style={{ opacity: index === 0 ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="artist-nav">
            <button
              type="button"
              onClick={prevArtist}
              disabled={isTransitioning}
              aria-label="Previous Artist"
              style={{ opacity: isTransitioning ? 0.5 : 1 }}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button
              type="button"
              onClick={nextArtist}
              disabled={isTransitioning}
              aria-label="Next Artist"
              style={{ opacity: isTransitioning ? 0.5 : 1 }}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
