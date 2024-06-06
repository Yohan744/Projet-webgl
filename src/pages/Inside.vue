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
import {onBeforeRouteLeave} from "vue-router";
import {useGameManager} from "../assets/js/GameManager";

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
  setup() {
    onBeforeRouteLeave((to, from, next) => {
      const gameManager = useGameManager();
      gameManager.setLastVisitedRoute(from.fullPath);
      next();
    });
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

