<script setup lang="ts" generic="T extends string">
/** Ряд стеклянных пилюль-фильтров. Пустая строка / пустой массив = «Все» */
const props = withDefaults(
  defineProps<{ options: readonly { id: T; name: string }[]; allLabel?: string | false; center?: boolean; multiple?: boolean }>(),
  { allLabel: 'Все', center: false, multiple: false },
)
const model = defineModel<T | '' | T[]>({ required: true })

const isActive = (id: T | '') => {
  if (props.multiple) {
    const list = (model.value as T[]) ?? []
    return id === '' ? list.length === 0 : list.includes(id as T)
  }
  return model.value === id
}

const select = (id: T | '') => {
  if (!props.multiple) return (model.value = id)
  const list = (model.value as T[]) ?? []
  if (id === '') return (model.value = [])
  model.value = list.includes(id as T) ? list.filter(x => x !== id) : [...list, id as T]
}
</script>

<template>
  <div class="scroll-x -mx-4 px-4 sm:mx-0 sm:flex-wrap sm:px-0" :class="center ? 'sm:justify-center' : ''" role="group">
    <button v-if="allLabel !== false" type="button" class="pill" :class="{ 'pill-active': isActive('') }" :aria-pressed="isActive('')" @click="select('')">
      {{ allLabel }}
    </button>
    <button
      v-for="o in options"
      :key="o.id"
      type="button"
      class="pill"
      :class="{ 'pill-active': isActive(o.id) }"
      :aria-pressed="isActive(o.id)"
      @click="select(o.id)"
    >
      {{ o.name }}
    </button>
  </div>
</template>
