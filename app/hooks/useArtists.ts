import { useQuery, useQueryClient } from '@tanstack/react-query'
import { artistService } from '~/services/artist.service'
import type { ArtistData } from '~/types/artist'

// Query keys for React Query
export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: (filters: string) => [...artistKeys.lists(), { filters }] as const,
  details: () => [...artistKeys.all, 'detail'] as const,
  detail: (id: number) => [...artistKeys.details(), id] as const,
}

// Hook to fetch all artists
export function useArtists() {
  return useQuery({
    queryKey: artistKeys.lists(),
    queryFn: () => artistService.fetchArtists(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  })
}

// Hook to fetch specific artist by index
export function useArtist(id: number) {
  return useQuery({
    queryKey: artistKeys.detail(id),
    queryFn: () => artistService.fetchArtistById(id),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    enabled: id >= 0, // Only run query if valid id
  })
}

// Hook to preload artist images
export function usePreloadArtistImages() {
  const queryClient = useQueryClient()
  
  const preloadImages = async (artists: ArtistData) => {
    try {
      await artistService.preloadArtistImages(artists)
      // Optionally mark images as preloaded in cache
      queryClient.setQueryData(['images', 'preloaded'], true)
    } catch (error) {
      console.warn('Failed to preload some artist images:', error)
    }
  }

  return { preloadImages }
}

// Hook to manage artist navigation with prefetching
export function useArtistNavigation(currentIndex: number, totalArtists: number) {
  const queryClient = useQueryClient()

  const prefetchArtist = (index: number) => {
    if (index >= 0 && index < totalArtists) {
      queryClient.prefetchQuery({
        queryKey: artistKeys.detail(index),
        queryFn: () => artistService.fetchArtistById(index),
        staleTime: 1000 * 60 * 10,
      })
    }
  }

  // Prefetch next and previous artists
  const prefetchAdjacentArtists = () => {
    const nextIndex = (currentIndex + 1) % totalArtists
    const prevIndex = (currentIndex - 1 + totalArtists) % totalArtists
    
    prefetchArtist(nextIndex)
    prefetchArtist(prevIndex)
  }

  return {
    prefetchArtist,
    prefetchAdjacentArtists,
  }
}