import type { GenreId } from '@shared/config'

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
