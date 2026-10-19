<script setup lang="ts">
/**
 * Фон-абстракция: тёплые пятна света, «размазанные» по горизонтали.
 * Пятна → смещение полосами шума (только по X) → анизотропное размытие = эффект motion blur.
 * Слой fixed и статичный: фильтр растеризуется один раз, при скролле не пересчитывается.
 */
const grain = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.2"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;
</script>

<template>
  <div class="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink [transform:translateZ(0)]" aria-hidden="true">
    <!-- <svg class="absolute inset-0 h-full w-full" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
      <defs>
        <filter id="bg-streak" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="34" result="soft" />
          <feTurbulence type="fractalNoise" baseFrequency="0.0007 0.075" numOctaves="3" seed="11" result="noise" />
          <feColorMatrix in="noise" type="matrix" values="1.6 0 0 0 -0.3  0 0 0 0 0.5  0 0 0 0 0  0 0 0 0 1" result="xnoise" />
          <feDisplacementMap in="soft" in2="xnoise" scale="340" xChannelSelector="R" yChannelSelector="G" result="smear" />
          <feGaussianBlur in="smear" stdDeviation="46 0.6" result="streak" />

          <feComponentTransfer in="streak">
            <feFuncR type="gamma" exponent="0.95" amplitude="1.08" />
            <feFuncG type="gamma" exponent="1.1" amplitude="1.04" />
            <feFuncB type="gamma" exponent="1.3" amplitude="1" />
          </feComponentTransfer>
        </filter>
        <radialGradient id="bg-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff3d6" />
          <stop offset="35%" stop-color="#ffc277" />
          <stop offset="70%" stop-color="#ff7a26" />
          <stop offset="100%" stop-color="#ff5a10" stop-opacity="0" />
        </radialGradient>
      </defs>

      <g filter="url(#bg-streak)">
        <rect width="1600" height="1000" fill="#050201" />

        <ellipse cx="1000" cy="470" rx="640" ry="430" fill="#ff4f0a" />
        <ellipse cx="1250" cy="110" rx="620" ry="110" fill="#ff5a14" />
        <ellipse cx="560" cy="560" rx="360" ry="140" fill="#e8400a" />

        <ellipse cx="420" cy="250" rx="760" ry="70" fill="#050201" transform="rotate(-5 420 250)" />
        <ellipse cx="1180" cy="330" rx="420" ry="46" fill="#050201" transform="rotate(8 1180 330)" />
        <ellipse cx="120" cy="820" rx="520" ry="420" fill="#050201" />
        <ellipse cx="1640" cy="720" rx="240" ry="420" fill="#050201" />
        <ellipse cx="900" cy="1080" rx="500" ry="90" fill="#050201" />

        <ellipse cx="990" cy="610" rx="270" ry="340" fill="url(#bg-core)" />
      </g>
    </svg>

    <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_60%_45%,transparent_30%,rgb(5_2_1/0.75)_100%)]" />
    <div class="absolute inset-0 bg-black/20" />

    <div class="absolute inset-0 opacity-[0.16] mix-blend-overlay" :style="{ backgroundImage: grain }" /> -->
  </div>
</template>
