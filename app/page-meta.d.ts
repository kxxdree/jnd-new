import type { Role } from '@entities/session'

declare module '#app' {
  interface PageMeta {
    /** Роли, которым доступна страница (вместе с middleware: 'auth') */
    roles?: Role[]
  }
}

export {}
