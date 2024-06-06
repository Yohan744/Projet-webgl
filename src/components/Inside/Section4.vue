<template>
  <div>
    <ThreeColumns :images="imagesSection4" />
  </div>
</template>

<script>
import ThreeColumns from './ThreeColumns.vue';

export default {
  name: 'Section4',
  
  components: {
    ThreeColumns
  },
  data() {
    return {
      imagesSection4: {
        left: './assets/images/transition/pb1.png',
        center: './assets/images/transition/pb2.png',
        right: './assets/images/transition/pb3.png'
      }
    }
  }
}
</script>
