/** Экран уже брейкпоинта sm (640px) - телефон. Проверять в момент действия, на сервере всегда false */
export const isPhone = () => import.meta.client && window.matchMedia('(max-width: 639.98px)').matches
