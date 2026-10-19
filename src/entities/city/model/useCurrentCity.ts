import { usePersisted } from '@shared/lib'
import { cities } from './cities'

/** Текущий город пользователя (cookie) + определение ближайшего по геолокации */
export const useCurrentCity = () => {
  const cityId = usePersisted<string>('joined_city', () => 'moscow')
  const city = computed(() => cities.find(c => c.id === cityId.value) ?? cities[0]!)
  const locating = useState('city-locating', () => false)

  const detect = () =>
    new Promise<string | null>((resolve) => {
      if (!import.meta.client || !navigator.geolocation) return resolve(null)
      locating.value = true
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const nearest = [...cities].sort((a, b) =>
            Math.hypot(a.lat - coords.latitude, a.lng - coords.longitude)
            - Math.hypot(b.lat - coords.latitude, b.lng - coords.longitude),
          )[0]!
          cityId.value = nearest.id
          locating.value = false
          resolve(nearest.id)
        },
        () => {
          locating.value = false
          resolve(null)
        },
        { timeout: 8000 },
      )
    })

  return { cityId, city, cities, detect, locating }
}
