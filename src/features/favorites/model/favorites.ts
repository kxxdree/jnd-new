import { useSession } from '@entities/session'
import { usePersisted, useToast } from '@shared/lib'

export interface Favorites {
  venues: string[]
  artists: string[]
}

export type FavoriteKind = keyof Favorites

export const useFavorites = () => {
  const favs = usePersisted<Favorites>('joined_favs', () => ({ venues: [], artists: [] }))
  const { requireAuth } = useSession()
  const { push } = useToast()

  const has = (kind: FavoriteKind, id: string) => favs.value[kind].includes(id)

  const toggle = (kind: FavoriteKind, id: string) => {
    if (!requireAuth()) return
    const list = favs.value[kind]
    const added = !list.includes(id)
    favs.value = { ...favs.value, [kind]: added ? [...list, id] : list.filter(x => x !== id) }
    push(added ? 'Добавлено в избранное' : 'Удалено из избранного')
  }

  return { favs, has, toggle }
}
