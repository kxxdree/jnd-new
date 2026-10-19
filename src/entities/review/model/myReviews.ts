import { uid, usePersisted } from '@shared/lib'
import type { Review } from './types'

export type MyReview = Omit<Review, 'author'>

/** Отзывы, оставленные текущим пользователем (демо - cookie) */
export const useMyReviews = () => {
  const myReviews = usePersisted<MyReview[]>('joined_reviews', () => [])

  const add = (r: Omit<MyReview, 'id' | 'date'>) => {
    myReviews.value = [{ ...r, id: uid(), date: new Date().toISOString().slice(0, 10) }, ...myReviews.value]
  }

  return { myReviews, add }
}
