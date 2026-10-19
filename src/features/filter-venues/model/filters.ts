import type { EventItem } from '@entities/event'
import type { DrinkId, FormatId, Venue } from '@entities/venue'
import type { GenreId } from '@shared/config'

export interface VenueFilterState {
  q: string
  genres: GenreId[]
  formats: FormatId[]
  drinks: DrinkId[]
  date: string
  time: '' | 'evening' | 'night'
  sort: 'popular' | 'name'
}

export const emptyFilters = (): VenueFilterState => ({
  q: '', genres: [], formats: [], drinks: [], date: '', time: '', sort: 'popular',
})

/** Сколько «доп.» фильтров включено (без поиска и жанров - они всегда на виду) */
export const countExtra = (f: VenueFilterState) =>
  f.formats.length + f.drinks.length + (f.date ? 1 : 0) + (f.time ? 1 : 0)

const sorters: Record<VenueFilterState['sort'], (a: Venue, b: Venue) => number> = {
  popular: (a, b) => b.popularity - a.popularity,
  name: (a, b) => a.name.localeCompare(b.name, 'ru'),
}

export const applyVenueFilters = (list: Venue[], events: EventItem[], f: VenueFilterState) => {
  const needle = f.q.trim().toLowerCase()

  // заведения, где есть выступления в выбранную дату/время
  const withShows = f.date || f.time
    ? new Set(events
        .filter(e => (!f.date || e.date === f.date)
          && (!f.time || (f.time === 'evening' ? e.time < '22:00' : e.time >= '22:00')))
        .map(e => e.venue))
    : null

  return list
    .filter(v =>
      (!needle || [v.name, v.short, v.address, v.metro ?? ''].some(s => s.toLowerCase().includes(needle)))
      && (!f.genres.length || f.genres.some(g => v.genres.includes(g)))
      && (!f.formats.length || f.formats.includes(v.format))
      && (!f.drinks.length || f.drinks.every(d => v.drinks.includes(d)))
      && (!withShows || withShows.has(v.slug)))
    .sort(sorters[f.sort])
}
