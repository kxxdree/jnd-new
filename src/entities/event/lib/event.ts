import { todayISO } from '@shared/lib'
import type { EventItem } from '../model/types'

export const isUpcoming = (e: EventItem) => e.date >= todayISO()

export const minPrice = (e: EventItem) => Math.min(...e.tickets.map(t => t.price))

export const byDateTime = (a: EventItem, b: EventItem) => (a.date + a.time).localeCompare(b.date + b.time)
