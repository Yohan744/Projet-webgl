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
        left: '/src/assets/img/transition/Biarritz.png',
        center: '/src/assets/img/transition/CartePostale.png',
        right: '/src/assets/img/transition/Gouville.png'
      }
    }
  }
}
</script>
