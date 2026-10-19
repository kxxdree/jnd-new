<template>
  <!-- SVG-фильтр преломления для .lg-refract (используется в backdrop-filter) -->
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
    <filter id="lg-refract" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.011 0.016" numOctaves="2" seed="4" result="noise" />
      <feGaussianBlur in="noise" stdDeviation="2.5" result="map" />
      <feDisplacementMap in="SourceGraphic" in2="map" scale="38" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </svg>
</template>
