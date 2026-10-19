import type { TicketTypeId } from '@entities/event/@x/ticket'
import { uid, usePersisted } from '@shared/lib'

export interface Ticket {
  id: string
  eventId: string
  type: TicketTypeId
  qty: number
  total: number
  status: 'active' | 'refunded'
  purchasedAt: string
}

export const ticketTypeNames: Record<TicketTypeId, string> = { standard: 'Стандарт', vip: 'VIP', table: 'Столик' }

/** Купленные билеты текущего пользователя (демо - cookie) */
export const useTickets = () => {
  const tickets = usePersisted<Ticket[]>('joined_tickets', () => [])
  const active = computed(() => tickets.value.filter(t => t.status === 'active'))

  const add = (t: Omit<Ticket, 'id' | 'status' | 'purchasedAt'>) => {
    const ticket: Ticket = { ...t, id: `JN-${uid()}`, status: 'active', purchasedAt: new Date().toISOString() }
    tickets.value = [ticket, ...tickets.value]
    return ticket
  }

  const markRefunded = (id: string) => {
    tickets.value = tickets.value.map(t => (t.id === id ? { ...t, status: 'refunded' } : t))
  }

  return { tickets, active, add, markRefunded }
}
