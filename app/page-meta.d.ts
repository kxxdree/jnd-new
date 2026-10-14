import type { Role } from '~/data/types'

declare module '#app' {
  interface PageMeta {
    /** Роли, которым доступна страница (вместе с middleware: 'auth') */
    roles?: Role[]
  }
}

export {}
