export interface Toast {
  id: number
  text: string
}

export const useToast = () => {
  const toasts = useState<Toast[]>('toasts', () => [])

  const push = (text: string) => {
    const id = Date.now() + Math.random()
    toasts.value = [...toasts.value, { id, text }]
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 2800)
  }

  return { toasts, push }
}
