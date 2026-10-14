import type { Role } from '~/data/types'

/**
 * Защита маршрутов. На странице: definePageMeta({ middleware: 'auth', roles: ['admin'] })
 */
export default defineNuxtRouteMiddleware((to) => {
  const { user } = useAuth()
  if (!user.value) return navigateTo({ path: '/login', query: { redirect: to.fullPath } })

  const roles = to.meta.roles as Role[] | undefined
  if (roles?.length && !roles.includes(user.value.role)) {
    return abortNavigation(createError({ statusCode: 403, message: 'Недостаточно прав для просмотра этой страницы' }))
  }
})
