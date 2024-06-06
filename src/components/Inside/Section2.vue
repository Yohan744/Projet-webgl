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
        left: './assets/images/transition/Biarritz.png',
        center: './assets/images/transition/CartePostale.png',
        right: './assets/images/transition/Gouville.png'
      }
    }
  }
}
</script>
