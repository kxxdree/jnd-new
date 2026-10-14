interface Favorites {
  venues: string[]
  artists: string[]
  follows: string[]
}

export const useFavorites = () => {
  const favs = usePersisted<Favorites>('joined_favs', () => ({ venues: [], artists: [], follows: [] }))
  const { requireAuth } = useAuth()
  const { push } = useToast()

  const has = (kind: keyof Favorites, id: string) => favs.value[kind].includes(id)

  const toggle = (kind: keyof Favorites, id: string) => {
    if (!requireAuth()) return
    const list = favs.value[kind]
    const added = !list.includes(id)
    favs.value = { ...favs.value, [kind]: added ? [...list, id] : list.filter(x => x !== id) }
    if (kind === 'follows') push(added ? 'Вы подписались на обновления' : 'Подписка отменена')
    else push(added ? 'Добавлено в избранное' : 'Удалено из избранного')
  }

  return { favs, has, toggle }
}
