<script setup lang="ts">
const { toasts } = useToast()
</script>

<template>
  <div class="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4" aria-live="polite">
    <TransitionGroup
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-200"
      leave-to-class="opacity-0"
    >
      <div v-for="t in toasts" :key="t.id" class="flex items-center gap-2 rounded-xl border border-line bg-card-2 px-4 py-3 text-sm shadow-2xl">
        <AppIcon name="check" :size="16" class="text-accent" />
        {{ t.text }}
      </div>
    </TransitionGroup>
  </div>
</template>
