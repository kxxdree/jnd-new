export type GenreId =
  | 'classical' | 'electronic' | 'pop' | 'rock' | 'jazz'
  | 'live' | 'hiphop' | 'indie' | 'blues'

export type FormatId = 'bar' | 'pub' | 'lounge' | 'concert'

export type DrinkId = 'cocktails' | 'craft' | 'wine' | 'kitchen' | 'snacks'

export type Role = 'user' | 'venue' | 'artist' | 'admin'

export interface City {
  id: string
  name: string
  /** «в Москве» */
  where: string
  lat: number
  lng: number
}

export interface Option<T extends string = string> {
  id: T
  name: string
}

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

export interface Member {
  name: string
  role: string
}

export interface Track {
  title: string
  album: string
  year: number
  duration: string
}

export interface Artist {
  slug: string
  name: string
  city: string
  genres: GenreId[]
  short: string
  bio: string
  founded: number
  followers: number
  photo: string
  members: Member[]
  tracks: Track[]
  videos: { title: string; photo: string; duration: string }[]
}

export type TicketTypeId = 'standard' | 'vip' | 'table'

export interface TicketType {
  id: TicketTypeId
  name: string
  desc: string
  price: number
  left: number
}

export interface EventItem {
  id: string
  title: string
  venue: string
  artists: string[]
  genres: GenreId[]
  date: string
  time: string
  description: string
  photo: string
  tickets: TicketType[]
}

export interface Review {
  id: string
  venue: string
  author: string
  rating: number
  date: string
  text: string
}
