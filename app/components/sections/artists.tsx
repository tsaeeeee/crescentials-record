import { useCallback, useEffect, useRef, useState } from 'react'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '~/components/ui/carousel' // Adjust this path to match your project
import { useArtistNavigation, useArtists, usePreloadArtistImages } from '~/hooks/useArtists'
import type { Artist } from '~/types/artist'
import gsap from '~/utils/gsap-config'

interface ArtistContentProps {
  artist: Artist
}

function ArtistContent({ artist }: ArtistContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)

  const iconMap: Record<string, string> = {
    instagram: 'ri-instagram-line',
    youtube: 'ri-youtube-line',
    spotify: 'ri-spotify-line',
  }

  const updateContent = useCallback((newArtist: Artist) => {
    if (!contentRef.current) return

    const detailsContainer = contentRef.current

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
    artistName.textContent = newArtist.name
    contentWrapper.appendChild(artistName)

    // Artist bio
    const artistBio = document.createElement('p')
    artistBio.textContent = newArtist.bio
    contentWrapper.appendChild(artistBio)

    // Social links
    const socialsContainer = document.createElement('div')
    socialsContainer.className = 'socials'

    Object.entries(newArtist.socials)
      .filter(([, url]) => url)
      .forEach(([platform, url]) => {
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
    if (newArtist.tracks && newArtist.tracks.length > 0) {
      const releasesLabel = document.createElement('div')
      releasesLabel.className = 'releases-label'
      releasesLabel.textContent = 'Latest Releases'
      releasesLabel.style.marginBottom = '20px'
      contentWrapper.appendChild(releasesLabel)

      const tracksContainer = document.createElement('div')
      tracksContainer.className = 'spotify-tracks'

      newArtist.tracks.forEach((track, trackIndex) => {
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
        iframe.title = `${newArtist.name} Track ${trackIndex + 1}`
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
  }, [])

  // Initialize content when component mounts or artist changes
  useEffect(() => {
    if (artist && contentRef.current) {
      updateContent(artist)
    }
  }, [artist, updateContent])

  return <div className="artist-content" ref={contentRef}></div>
}

interface ArtistStateProps {
  type: 'loading' | 'error' | 'empty'
  message?: string
}

function ArtistState({ type, message }: ArtistStateProps) {
  const content = {
    loading: {
      element: <div className="loading-spinner"></div>,
      text: 'Loading artists...',
    },
    error: {
      element: <h3>Failed to load artists</h3>,
      text: 'Please try refreshing the page.',
    },
    empty: {
      element: <h3>No artists found</h3>,
      text: 'Check back later for artist updates.',
    },
  }

  const { element, text } = content[type]

  return (
    <div className="artist-container">
      <div className={`artist-${type}`}>
        {element}
        <p>{message || text}</p>
      </div>
    </div>
  )
}

export function ArtistsSection() {
  const [currentArtist, setCurrentArtist] = useState(0)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  // React Query hooks
  const { data: artists, isLoading, error } = useArtists()
  const { preloadImages } = usePreloadArtistImages()
  const { prefetchAdjacentArtists } = useArtistNavigation(currentArtist, artists?.length || 0)

  // Carousel API setup - syncs image carousel with content
  useEffect(() => {
    if (!carouselApi) return

    const handleSelect = () => {
      const selected = carouselApi.selectedScrollSnap()
      if (selected !== currentArtist) {
        setCurrentArtist(selected)
      }
    }

    carouselApi.on('select', handleSelect)

    return () => {
      carouselApi.off('select', handleSelect)
    }
  }, [carouselApi, currentArtist])

  // Update content when currentArtist changes (keeps existing behavior)
  useEffect(() => {
    if (artists?.[currentArtist]) {
      // Content will update via the ArtistContent component's useEffect
    }
  }, [currentArtist, artists])

  // Preload images when artists data is available
  useEffect(() => {
    if (artists?.length) {
      preloadImages(artists)
      prefetchAdjacentArtists()
    }
  }, [artists, preloadImages, prefetchAdjacentArtists])

  // Update prefetch when currentArtist changes
  useEffect(() => {
    if (artists?.length) {
      prefetchAdjacentArtists()
    }
  }, [artists, prefetchAdjacentArtists])

  // Navigation function for keyboard controls - simplified
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (!carouselApi || !artists?.length) return

      if (direction === 'next') {
        carouselApi.scrollNext()
      } else {
        carouselApi.scrollPrev()
      }
    },
    [carouselApi, artists],
  )

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate('prev')
      if (e.key === 'ArrowRight') navigate('next')
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [navigate])

  // Handle different states
  if (isLoading) return <ArtistState type="loading" />
  if (error) return <ArtistState type="error" />
  if (!artists?.length) return <ArtistState type="empty" />

  return (
    <div className="artist-container">
      {/* Left Panel - Artist Info */}
      <div className="artist-left">
        <ArtistContent artist={artists[currentArtist]} />
      </div>

      {/* Right Panel - Artist Images with Carousel */}
      <div className="artist-right">
        <Carousel
          className="artist-image-carousel"
          setApi={setCarouselApi}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent className="artist-carousel-content">
            {artists.map((artist, index) => (
              <CarouselItem key={`${artist.name}-${index}`} className="artist-carousel-item">
                <img src={artist.image} alt={artist.name} className="artist-carousel-image" />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Custom navigation buttons that match your original design */}
          <div className="artist-nav">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous Artist"
              className="artist-nav-btn artist-nav-prev"
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next Artist"
              className="artist-nav-btn artist-nav-next"
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          </div>
        </Carousel>
      </div>
    </div>
  )
}
