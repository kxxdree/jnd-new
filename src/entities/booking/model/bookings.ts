import { uid, usePersisted } from '@shared/lib'

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

/** Брони столиков текущего пользователя (демо - cookie) */
export const useBookings = () => {
  const bookings = usePersisted<Booking[]>('joined_bookings', () => [])
  const confirmed = computed(() => bookings.value.filter(b => b.status === 'confirmed'))

  const add = (b: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = { ...b, id: `BK-${uid()}`, status: 'confirmed' }
    bookings.value = [booking, ...bookings.value]
    return booking
  }

  const cancel = (id: string) => {
    bookings.value = bookings.value.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b))
  }

  return { bookings, confirmed, add, cancel }
}
