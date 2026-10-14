<script setup lang="ts">
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
      :class="[i <= Math.round(shown) ? 'text-accent' : 'text-[#3a3a3a]', editable ? 'cursor-pointer p-0.5' : '']"
      @mouseenter="editable && (hover = i)"
      @click="editable && emit('update:modelValue', i)"
    >
      <AppIcon name="star" filled :size="size" />
    </component>
  </div>
</template>
