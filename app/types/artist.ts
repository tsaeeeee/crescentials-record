export interface ArtistSocials {
  instagram?: string
  spotify?: string
  youtube?: string
}

export interface Artist {
  name: string
  bio: string
  image: string
  socials: ArtistSocials
  tracks: string[]
}

export type ArtistData = Artist[]