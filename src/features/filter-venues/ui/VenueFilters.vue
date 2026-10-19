<script setup lang="ts">
import { drinks, formats } from '@entities/venue'
import { UiPills } from '@shared/ui'
import type { VenueFilterState } from '../model/filters'

const model = defineModel<VenueFilterState>({ required: true })

const times = [
  { id: 'evening' as const, name: 'Вечер, до 22:00' },
  { id: 'night' as const, name: 'Ночь, после 22:00' },
]
const sorts = [
  { id: 'rating' as const, name: 'По рейтингу' },
  { id: 'reviews' as const, name: 'По отзывам' },
  { id: 'price' as const, name: 'Сначала доступные' },
]
</script>

<template>
  <div class="grid gap-6">
    <div>
      <span class="label">Формат заведения</span>
      <UiPills v-model="model.formats" :options="formats" multiple :all-label="false" />
    </div>
    <div>
      <span class="label">Бар и кухня</span>
      <UiPills v-model="model.drinks" :options="drinks" multiple :all-label="false" />
    </div>
    <div class="grid gap-4 sm:grid-cols-3">
      <label>
        <span class="label">Дата выступления</span>
        <input v-model="model.date" type="date" class="field">
      </label>
      <label>
        <span class="label">Время</span>
        <select v-model="model.time" class="field appearance-none">
          <option value="">Любое</option>
          <option v-for="t in times" :key="t.id" :value="t.id">{{ t.name }}</option>
        </select>
      </label>
      <label>
        <span class="label">Сортировка</span>
        <select v-model="model.sort" class="field appearance-none">
          <option v-for="s in sorts" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </label>
    </div>
  </div>
</template>
