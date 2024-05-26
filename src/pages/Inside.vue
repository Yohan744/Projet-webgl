<template>
  <div>
    <HeaderBanner @scroll-to-section="scrollToSection"/>
    <MainContent ref="mainContent"/>
    <ScrollButton/>
  </div>
</template>

<script>
import HeaderBanner from '../components/Inside/HeaderBanner.vue';
import MainContent from '../components/Inside/MainContent.vue';
import ScrollButton from '../components/Inside/ScrollButton.vue';

export default {
  name: 'Inside',
  components: {
    HeaderBanner,
    MainContent,
    ScrollButton
  },
  methods: {
    scrollToSection(index) {
      this.$refs.mainContent.scrollToSection(index);
    }
  }
}
</script>

<style scoped>
</style>
