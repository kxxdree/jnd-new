<script setup lang="ts">
import UiIcon from './UiIcon.vue'

const props = withDefaults(defineProps<{ modelValue?: number; size?: number; editable?: boolean }>(), {
  modelValue: 0,
  size: 16,
  editable: false,
})
const emit = defineEmits<{ 'update:modelValue': [number] }>()
const hover = ref(0)
const shown = computed(() => hover.value || props.modelValue)
</script>

<template>
  <div class="inline-flex items-center gap-0.5" @mouseleave="hover = 0">
    <component
      :is="editable ? 'button' : 'span'"
      v-for="i in 5"
      :key="i"
      :type="editable ? 'button' : undefined"
      :aria-label="editable ? `${i} из 5` : undefined"
      class="transition-transform"
      :class="[i <= Math.round(shown) ? 'text-accent drop-shadow-[0_0_6px_rgb(255_77_0/0.6)]' : 'text-white/20', editable ? 'cursor-pointer p-0.5 hover:scale-110' : '']"
      @mouseenter="editable && (hover = i)"
      @click="editable && emit('update:modelValue', i)"
    >
      <UiIcon name="star" filled :size="size" />
    </component>
  </div>
</template>
