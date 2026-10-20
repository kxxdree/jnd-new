<script setup lang="ts">
import { ph } from "@shared/lib";
import { UiPhoto } from "@shared/ui";

defineProps<{ title: string; subtitle: string }>();
</script>

<template>
  <section class="container-x grid gap-4 py-8 lg:min-h-[calc(100vh-6rem)] lg:grid-cols-2 lg:py-10">
    <div class="card hidden p-2 lg:block">
      <UiPhoto :src="ph('concert,crowd', 77, 1200, 1400)" class="h-full rounded-[1.4rem]">
        <div class="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
        <p class="h-display absolute right-10 bottom-10 left-10 text-4xl xl:text-5xl">Музыка лучше,<br />когда вы вместе</p>
      </UiPhoto>
    </div>
    <div class="flex items-center justify-center">
      <div class="card w-full max-w-lg p-6 sm:p-10">
        <!-- Unbounded широкий: размер подобран под самое длинное слово («Присоединяйтесь») -->
        <h1 class="h-display text-2xl wrap-break-word sm:text-4xl">{{ title }}</h1>
        <p class="mt-3 mb-8 text-soft">{{ subtitle }}</p>
        <slot />
      </div>
    </div>
  </section>
</template>
