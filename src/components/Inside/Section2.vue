<template>
  <div>
    <ThreeColumns :images="imagesSection2" />
  </div>
</template>

<script>
import ThreeColumns from './ThreeColumns.vue';

export default {
  name: 'Section2',
  components: {
    ThreeColumns
  },
  data() {
    return {
      imagesSection2: {
        left: '/src/assets/img/section-2/Biarritz.png',
        center: '/src/assets/img/section-2/CartePostale.png',
        right: '/src/assets/img/section-2/Gouville.png'
      }
    }
  }
}
</script>
