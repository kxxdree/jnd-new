<script setup lang="ts">
import { drinks, formats } from '@entities/venue'
import { UiPills, UiSelect } from '@shared/ui'
import type { VenueFilterState } from '../model/filters'

const model = defineModel<VenueFilterState>({ required: true })

const times = [
  { id: 'evening' as const, name: 'Вечер, до 22:00' },
  { id: 'night' as const, name: 'Ночь, после 22:00' },
]
const sorts = [
  { id: 'popular' as const, name: 'Сначала популярные' },
  { id: 'name' as const, name: 'По алфавиту' },
]
</script>

<template>
  <!-- Нумерованные разделы в стиле афиши -->
  <div class="grid gap-6">
    <div class="grid gap-3 md:grid-cols-[12rem_1fr] md:gap-6">
      <span class="text-xs tracking-widest text-muted uppercase"><span class="text-white tabular-nums">01</span> · Формат</span>
      <UiPills v-model="model.formats" :options="formats" multiple :all-label="false" variant="text" />
    </div>
    <div class="grid gap-3 border-t border-line pt-6 md:grid-cols-[12rem_1fr] md:gap-6">
      <span class="text-xs tracking-widest text-muted uppercase"><span class="text-white tabular-nums">02</span> · Бар и кухня</span>
      <UiPills v-model="model.drinks" :options="drinks" multiple :all-label="false" variant="text" />
    </div>
    <div class="grid gap-3 border-t border-line pt-6 md:grid-cols-[12rem_1fr] md:gap-6">
      <span class="text-xs tracking-widest text-muted uppercase"><span class="text-white tabular-nums">03</span> · Когда</span>
      <div class="grid gap-3 sm:grid-cols-3">
        <label>
          <span class="label">Дата выступления</span>
          <input v-model="model.date" type="date" class="field py-2.5">
        </label>
        <div>
          <span class="label">Время</span>
          <UiSelect v-model="model.time" :options="times" all-label="Любое" label="Время" />
        </div>
        <div>
          <span class="label">Сортировка</span>
          <UiSelect v-model="model.sort" :options="sorts" :all-label="false" label="Сортировка" />
        </div>
      </div>
    </div>
  </div>
</template>
