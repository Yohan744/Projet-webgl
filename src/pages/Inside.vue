<template>
  <div>
    <HeaderBanner :active-section="activeTab" @scroll-to-section="scrollToSection"/>
    <MainContent ref="mainContent" @update-active-section="updateActiveSection"/>
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
  data() {
    return {
      activeTab: 0
    };
  },
  methods: {
    scrollToSection(index) {
      this.$refs.mainContent.scrollToSection(index);
    },
    updateActiveSection(tabIndex) {
      this.activeTab = tabIndex;
    }
  }
}
</script>

