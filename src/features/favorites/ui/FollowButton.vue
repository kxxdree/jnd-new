<script setup lang="ts">
import { UiIcon } from '@shared/ui'
import { useFavorites } from '../model/favorites'

const props = defineProps<{ artist: string }>()
const { has, toggle } = useFavorites()
const active = computed(() => has('follows', props.artist))
</script>

<template>
  <button type="button" class="flex-1 py-3.5" :class="active ? 'btn-dark' : 'btn-primary'" :aria-pressed="active" @click="toggle('follows', artist)">
    <UiIcon :name="active ? 'check' : 'bell'" :size="18" />
    {{ active ? 'Вы подписаны' : 'Подписаться на обновления' }}
  </button>
</template>
