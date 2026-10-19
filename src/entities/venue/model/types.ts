import type { GenreId } from '@shared/config'

export type FormatId = 'bar' | 'pub' | 'lounge' | 'concert'

export type DrinkId = 'cocktails' | 'craft' | 'wine' | 'kitchen' | 'snacks'

export interface MenuItem {
  name: string
  desc?: string
  price: number
}

export interface Venue {
  slug: string
  name: string
  city: string
  format: FormatId
  genres: GenreId[]
  drinks: DrinkId[]
  address: string
  metro?: string
  directions: string
  lat: number
  lng: number
  rating: number
  reviewsCount: number
  avgCheck: number
  short: string
  description: string
  phone: string
  instagram: string
  telegram: string
  hours: { day: string; time: string }[]
  photo: string
  gallery: string[]
  menu: { bar: MenuItem[]; kitchen: MenuItem[] }
  booking: { deposit: number; minGuests: number; maxGuests: number; conditions: string[] }
  rules: string[]
}
