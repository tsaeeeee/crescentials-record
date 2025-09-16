import type { Artist, ArtistData } from '~/types/artist'

// Simulate API delay for realistic caching behavior
const simulateNetworkDelay = (ms: number = 100) => 
  new Promise(resolve => setTimeout(resolve, ms))

export class ArtistService {
  private static instance: ArtistService
  private cachedData: ArtistData | null = null

  static getInstance(): ArtistService {
    if (!ArtistService.instance) {
      ArtistService.instance = new ArtistService()
    }
    return ArtistService.instance
  }

  async fetchArtists(): Promise<ArtistData> {
    // Simulate network delay
    await simulateNetworkDelay()

    try {
      // Import the JSON data statically
      const { default: artistsData } = await import('~/data/artists.json')
      
      // Validate and transform the data if needed
      const validatedData: ArtistData = (artistsData as unknown[]).map((artist: unknown): Artist => {
        const artistObj = artist as Record<string, unknown>
        return {
          name: (artistObj.name as string) || 'Unknown Artist',
          bio: (artistObj.bio as string) || 'No bio available',
          image: (artistObj.image as string) || '/assets/images/default-artist.png',
          socials: {
            instagram: (artistObj.socials as Record<string, unknown>)?.instagram as string,
            spotify: (artistObj.socials as Record<string, unknown>)?.spotify as string,
            youtube: (artistObj.socials as Record<string, unknown>)?.youtube as string,
          },
          tracks: Array.isArray(artistObj.tracks) ? (artistObj.tracks as string[]) : [],
        }
      })

      this.cachedData = validatedData
      return validatedData
    } catch (error) {
      console.error('Failed to fetch artists:', error)
      throw new Error('Failed to load artist data')
    }
  }

  async fetchArtistById(id: number): Promise<Artist | null> {
    const artists = await this.fetchArtists()
    return artists[id] || null
  }

  // Preload images for better performance
  async preloadArtistImages(artists: ArtistData): Promise<void> {
    const imagePromises = artists.map((artist) => {
      return new Promise<void>((resolve) => {
        const img = new Image()
        img.onload = () => resolve()
        img.onerror = () => resolve() // Continue even if image fails
        img.src = artist.image
      })
    })

    await Promise.all(imagePromises)
  }

  getCachedData(): ArtistData | null {
    return this.cachedData
  }
}

export const artistService = ArtistService.getInstance()