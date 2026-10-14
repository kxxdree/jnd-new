import type { TicketTypeId } from '~/data/types'

export interface Ticket {
  id: string
  eventId: string
  type: TicketTypeId
  qty: number
  total: number
  status: 'active' | 'refunded'
  purchasedAt: string
}

export interface Booking {
  id: string
  venue: string
  date: string
  time: string
  guests: number
  deposit: number
  comment?: string
  status: 'confirmed' | 'cancelled'
}

export interface MyReview {
  id: string
  venue: string
  rating: number
  text: string
  date: string
}

/** Билеты, брони и отзывы текущего пользователя (демо — хранятся в cookie) */
export const useTickets = () => {
  const tickets = usePersisted<Ticket[]>('joined_tickets', () => [])
  const bookings = usePersisted<Booking[]>('joined_bookings', () => [])
  const myReviews = usePersisted<MyReview[]>('joined_reviews', () => [])

  const buy = (t: Omit<Ticket, 'id' | 'status' | 'purchasedAt'>) => {
    const ticket: Ticket = { ...t, id: `JN-${uid()}`, status: 'active', purchasedAt: new Date().toISOString() }
    tickets.value = [ticket, ...tickets.value]
    return ticket
  }

  const refund = (id: string) => {
    tickets.value = tickets.value.map(t => (t.id === id ? { ...t, status: 'refunded' } : t))
  }

  const book = (b: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = { ...b, id: `BK-${uid()}`, status: 'confirmed' }
    bookings.value = [booking, ...bookings.value]
    return booking
  }

  const cancelBooking = (id: string) => {
    bookings.value = bookings.value.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  const addReview = (r: Omit<MyReview, 'id' | 'date'>) => {
    myReviews.value = [{ ...r, id: uid(), date: new Date().toISOString().slice(0, 10) }, ...myReviews.value]
  }

  return { tickets, bookings, myReviews, buy, refund, book, cancelBooking, addReview }
}
