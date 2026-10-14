<script setup lang="ts">
withDefaults(defineProps<{ title?: string; wide?: boolean }>(), { wide: false })
const open = defineModel<boolean>({ required: true })

const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}
watch(open, (v) => {
  if (!import.meta.client) return
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[100] flex items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-6" @click.self="open = false">
        <div
          role="dialog"
          aria-modal="true"
          class="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl border border-line bg-surface p-5 sm:rounded-3xl sm:p-8"
          :class="wide ? 'sm:max-w-3xl' : 'sm:max-w-lg'"
        >
          <div class="mb-6 flex items-start justify-between gap-4">
            <h2 class="text-2xl font-medium tracking-tight">{{ title }}</h2>
            <button class="grid size-9 shrink-0 place-items-center rounded-full bg-card-2 hover:bg-card-3" aria-label="Закрыть" @click="open = false">
              <AppIcon name="x" :size="18" />
            </button>
          </div>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
