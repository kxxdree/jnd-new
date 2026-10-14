const toDate = (iso: string) => new Date(`${iso}T12:00:00`)

export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

/** «23 мая» */
export const formatDay = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

/** «23 мая 2025» */
export const formatDate = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** «пт» */
export const formatWeekday = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { weekday: 'short' })

/** «пятница» */
export const formatWeekdayLong = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { weekday: 'long' })

export const dayNumber = (iso: string) => toDate(iso).getDate()

export const monthShort = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')

export const isWeekend = (iso: string) => {
  const d = toDate(iso).getDay()
  return d === 0 || d === 5 || d === 6
}

export const addDays = (iso: string, n: number) => {
  const d = toDate(iso)
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** plural(5, ['отзыв', 'отзыва', 'отзывов']) → «отзывов» */
export const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return forms[0]
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1]
  return forms[2]
}

export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',')}K` : String(n)

export const uid = () => Math.random().toString(36).slice(2, 10).toUpperCase()
