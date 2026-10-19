<script setup lang="ts">
import { UiIcon } from '@shared/ui'
import { type FavoriteKind, useFavorites } from '../model/favorites'

/** Кнопка-сердечко. variant="label" - широкая кнопка с подписью */
const props = withDefaults(defineProps<{ kind: Exclude<FavoriteKind, 'follows'>; id: string; variant?: 'icon' | 'label' }>(), {
  variant: 'icon',
})
const { has, toggle } = useFavorites()
const active = computed(() => has(props.kind, props.id))
</script>

<template>
  <button
    v-if="variant === 'icon'"
    type="button"
    class="btn-icon"
    :class="active ? 'text-accent-text' : ''"
    :aria-pressed="active"
    :aria-label="active ? 'Убрать из избранного' : 'В избранное'"
    @click.prevent.stop="toggle(kind, id)"
  >
    <UiIcon name="heart" :filled="active" :size="18" class="transition-transform duration-300" :class="active ? 'scale-110' : ''" />
  </button>
  <button v-else type="button" class="btn-dark py-3.5" :class="active ? 'text-accent-text' : ''" :aria-pressed="active" @click="toggle(kind, id)">
    <UiIcon name="heart" :filled="active" :size="18" /> {{ active ? 'В избранном' : 'В избранное' }}
  </button>
</template>
