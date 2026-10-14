/**
 * Глобальное состояние, синхронизированное с cookie (работает и при SSR).
 * Все вызовы с одним ключом получают один и тот же ref.
 */
export const usePersisted = <T>(key: string, init: () => T, maxAge = 60 * 60 * 24 * 365) => {
  const cookie = useCookie<T>(key, { default: init, maxAge })
  const state = useState<T>(`persist:${key}`, () => cookie.value)

  const nuxtApp = useNuxtApp() as unknown as Record<string, boolean>
  const flag = `__persist_${key}`
  if (!nuxtApp[flag]) {
    nuxtApp[flag] = true
    // detached scope — watcher переживает размонтирование компонента
    effectScope(true).run(() => {
      watch(state, (v) => { cookie.value = v }, { deep: true })
    })
  }
  return state
}
