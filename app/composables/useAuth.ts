import type { Role } from '~/data/types'

export interface User {
  name: string
  email: string
  role: Role
}

export const roleNames: Record<Role, string> = {
  user: 'Пользователь',
  venue: 'Владелец заведения',
  artist: 'Музыкальная группа',
  admin: 'Администратор',
}

/** Демо-авторизация: пользователь хранится в cookie, без бэкенда */
export const useAuth = () => {
  const user = usePersisted<User | null>('joined_user', () => null, 60 * 60 * 24 * 30)

  const router = useRouter()
  const isLoggedIn = computed(() => !!user.value)

  const login = (payload: { email: string; name?: string; role?: Role }) => {
    user.value = {
      email: payload.email,
      name: payload.name || payload.email.split('@')[0] || 'Гость',
      role: payload.role ?? 'user',
    }
  }

  const logout = () => {
    user.value = null
    return router.push('/')
  }

  /** Требует авторизацию: если её нет — уводит на логин и возвращает false */
  const requireAuth = () => {
    if (user.value) return true
    router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
    return false
  }

  return { user, isLoggedIn, login, logout, requireAuth }
}
