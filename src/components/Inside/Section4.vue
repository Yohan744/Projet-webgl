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
        left: '/src/assets/img/section-2/pb1.png',
        center: '/src/assets/img/section-2/pb2.png',
        right: '/src/assets/img/section-2/pb3.png'
      }
    }
  }
}
</script>
