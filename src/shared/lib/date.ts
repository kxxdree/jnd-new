const toDate = (iso: string) => new Date(`${iso}T12:00:00`)

const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

/** Дата относительно сегодняшнего дня, YYYY-MM-DD */
export const isoDay = (offset = 0) => {
  const d = new Date()
  d.setHours(12, 0, 0, 0)
  d.setDate(d.getDate() + offset)
  return toISO(d)
}

export const todayISO = () => isoDay(0)

export const addDays = (iso: string, n: number) => {
  const d = toDate(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

/** Пятница, суббота, воскресенье */
export const isWeekend = (iso: string) => [0, 5, 6].includes(toDate(iso).getDay())

/** Индекс дня недели, где 0 = понедельник */
export const weekdayIndex = (date = new Date()) => (date.getDay() + 6) % 7

/** «23 мая» */
export const formatDay = (iso: string) => toDate(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })

/** «23 мая 2025» */
export const formatDate = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

/** «пт» */
export const formatWeekday = (iso: string) => toDate(iso).toLocaleDateString('ru-RU', { weekday: 'short' })

/** «пятница» */
export const formatWeekdayLong = (iso: string) => toDate(iso).toLocaleDateString('ru-RU', { weekday: 'long' })

export const dayNumber = (iso: string) => toDate(iso).getDate()

export const monthShort = (iso: string) =>
  toDate(iso).toLocaleDateString('ru-RU', { month: 'short' }).replace('.', '')

/** Сетка месяца (пн - первый день); null - пустые ячейки до 1-го числа */
export const monthGrid = (iso: string, offset = 0) => {
  const base = toDate(iso)
  base.setDate(1)
  base.setMonth(base.getMonth() + offset)
  const first = toISO(base)
  const lead = weekdayIndex(base)
  const days = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const cells: (string | null)[] = Array(lead).fill(null)
  for (let i = 0; i < days; i++) cells.push(addDays(first, i))
  return { title: base.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }), cells }
}
