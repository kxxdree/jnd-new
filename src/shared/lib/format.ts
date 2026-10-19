export const formatPrice = (value: number) => `${value.toLocaleString('ru-RU')} ₽`

/** plural(5, ['билет', 'билета', 'билетов']) → «билетов» */
export const plural = (n: number, forms: [string, string, string]) => {
  const n10 = n % 10
  const n100 = n % 100
  if (n10 === 1 && n100 !== 11) return forms[0]
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1]
  return forms[2]
}

/** 24800 → «24,8K» */
export const compact = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.', ',')}K` : String(n)

export const uid = () => Math.random().toString(36).slice(2, 10).toUpperCase()

export const isEmail = (s: string) => /^\S+@\S+\.\S+$/.test(s)
