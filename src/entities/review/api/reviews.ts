import { isoDay as day } from '@shared/lib'
import type { Review } from '../model/types'

export const reviews: Review[] = [
  { id: 'r1', venue: 'red-velvet', author: 'Ольга К.', rating: 5, date: day(-3), text: 'Лучший джаз в Москве. Коктейли - отдельный вид искусства, бармены помогли выбрать под настроение.' },
  { id: 'r2', venue: 'red-velvet', author: 'Андрей', rating: 5, date: day(-9), text: 'Пришли на джем-сейшн и остались до закрытия. Атмосфера потрясающая, звук отличный.' },
  { id: 'r3', venue: 'red-velvet', author: 'Мила', rating: 4, date: day(-15), text: 'Очень уютно, но в пятницу без брони не попасть - бронируйте заранее.' },
  { id: 'r4', venue: 'garage-hall', author: 'Дима С.', rating: 5, date: day(-5), text: 'Звук мощный, бар работает быстро, гардероб без очередей. Отличная площадка.' },
  { id: 'r5', venue: 'garage-hall', author: 'Катя', rating: 4, date: day(-20), text: 'Хорошие концерты, но в зале бывает душно на солдаутах.' },
  { id: 'r6', venue: 'neon-lounge', author: 'Игорь', rating: 5, date: day(-2), text: 'Вид просто космос. Диджей держал танцпол до утра.' },
  { id: 'r7', venue: 'fonarik', author: 'Лена', rating: 5, date: day(-7), text: 'Душевный бар, классная акустика по средам.' },
  { id: 'r8', venue: 'jazz-philharmonic', author: 'Виктор П.', rating: 5, date: day(-11), text: 'Классика жанра. Обязательно к посещению, если вы в Петербурге.' },
]
