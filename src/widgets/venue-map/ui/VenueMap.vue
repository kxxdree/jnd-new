<script setup lang="ts">
import type * as Leaflet from 'leaflet'
import type { Venue } from '~/data/types'

/** Карта заведений (Leaflet + тёмные тайлы CARTO). Использовать внутри <ClientOnly>. */
const props = withDefaults(
  defineProps<{ venues: Venue[]; center: { lat: number; lng: number }; zoom?: number; active?: string | null; interactive?: boolean }>(),
  { zoom: 12, active: null, interactive: true },
)
const emit = defineEmits<{ select: [slug: string] }>()

const el = ref<HTMLElement>()
let L: typeof Leaflet
let map: Leaflet.Map | null = null
let layer: Leaflet.LayerGroup | null = null
let resizeObserver: ResizeObserver | null = null
let fitted = false
const markers = new Map<string, Leaflet.Marker>()

const icon = (v: Venue, i: number) =>
  L.divIcon({
    className: '',
    html: `<div class="joined-pin ${props.active === v.slug ? 'is-active' : ''}">${i + 1}</div>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })

const escape = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

const render = () => {
  if (!map || !layer) return
  layer.clearLayers()
  markers.clear()
  props.venues.forEach((v, i) => {
    const m = L.marker([v.lat, v.lng], { icon: icon(v, i) })
      .bindPopup(`<a href="/venues/${v.slug}" style="color:#fff;text-decoration:none">
        <strong style="font-size:14px">${escape(v.name)}</strong><br>
        <span style="color:#8c8c8c;font-size:12px">${escape(v.address)}</span><br>
        <span style="color:#ff7a3d;font-size:12px">★ ${v.rating} · подробнее →</span></a>`)
      .on('click', () => emit('select', v.slug))
    m.addTo(layer!)
    markers.set(v.slug, m)
  })
  if (props.venues.length > 1) {
    map.fitBounds(L.latLngBounds(props.venues.map(v => [v.lat, v.lng])), { padding: [50, 50], maxZoom: 14 })
  }
  else if (props.venues.length === 1) {
    map.setView([props.venues[0]!.lat, props.venues[0]!.lng], 15)
  }
  else {
    map.setView([props.center.lat, props.center.lng], props.zoom)
  }
}

onMounted(async () => {
  L = (await import('leaflet')).default
  if (!el.value) return // компонент успели размонтировать, пока грузился Leaflet

  map = L.map(el.value, {
    center: [props.center.lat, props.center.lng],
    zoom: props.zoom,
    zoomControl: props.interactive,
    scrollWheelZoom: false,
    dragging: props.interactive,
  })
  // OSM-тайлы, затемнённые CSS-фильтром (.joined-tiles в main.css). Для продакшена — свой тайл-провайдер.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'joined-tiles',
    maxZoom: 19,
  }).addTo(map)
  layer = L.layerGroup().addTo(map)
  render()

  // карта могла смонтироваться в скрытом контейнере (мобильный режим «Список»)
  resizeObserver = new ResizeObserver(() => {
    if (!map || !el.value) return
    map.invalidateSize()
    if (!fitted && el.value.offsetWidth > 0) {
      fitted = true
      render()
    }
  })
  resizeObserver.observe(el.value)
})

watch(() => props.venues.map(v => v.slug).join(), render)
watch(() => [props.center.lat, props.center.lng], () => props.venues.length || render())

watch(() => props.active, () => {
  if (!map) return
  props.venues.forEach((v, i) => markers.get(v.slug)?.setIcon(icon(v, i)))
  const m = props.active ? markers.get(props.active) : null
  if (m) map.panTo(m.getLatLng(), { animate: true })
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  map?.remove()
  map = null
})
</script>

<template>
  <div ref="el" class="h-full w-full bg-surface" />
</template>
