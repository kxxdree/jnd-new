import type { Option } from '@shared/config'
import type { DrinkId, FormatId } from './types'

export const formats: Option<FormatId>[] = [
  { id: 'bar', name: 'Бар' },
  { id: 'pub', name: 'Паб' },
  { id: 'lounge', name: 'Лаунж' },
  { id: 'club', name: 'Клуб' },
  { id: 'concert', name: 'Концертная площадка' },
]

export const drinks: Option<DrinkId>[] = [
  { id: 'cocktails', name: 'Авторские коктейли' },
  { id: 'craft', name: 'Крафтовое пиво' },
  { id: 'wine', name: 'Винная карта' },
  { id: 'snacks', name: 'Закуски' },
  { id: 'kitchen', name: 'Полноценная кухня' },
]

export const formatName = (id: string) => formats.find(f => f.id === id)?.name ?? id
export const drinkName = (id: string) => drinks.find(d => d.id === id)?.name ?? id
