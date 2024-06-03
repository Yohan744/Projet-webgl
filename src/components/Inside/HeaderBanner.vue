<template>
  <div :class="['header-banner', { 'dark-theme': activeSection !== 0, 'white-background': activeSection !== 0 }]">
    <div class="tabs">
      <span 
        v-for="(tab, index) in tabs" 
        :key="tab" 
        class="tab" 
        :class="{ active: activeSection === index }"
        @click="scrollToSection(index)">
        {{ tab }}
      </span>
    </div>
    <button class="header-button">LANCER L'EXPERIENCE</button>
  </div>
</template>

<script>
export default {
  name: 'HeaderBanner',
  props: {
    activeSection: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      tabs: ['Home', 'Parler d amour', '...dans les années 80 ', '...et aujourd hui?', 'L equipe']
    }
  },
  methods: {
    scrollToSection(index) {
      this.$emit('scroll-to-section', index);
    }
  }
}
</script>

<style scoped>
.header-banner {
  position: fixed;
  top: 30px;
  left: 50px;
  right: 50px;
  margin: 0 auto;
  width: calc(100% - 100px);
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  z-index: 3;
  color: white;
  transition: background-color 0.3s;
  align-items: center;
  border-radius: 12px;
  z-index: 100000000;
}

.header-banner.dark-theme {
  color: black;
}

.header-banner.white-background {
  background-color: white;
  color: black;
}

.tabs {
  display: flex;
  width: 80%;
}

.tab {
  margin-right: 20px;
  cursor: pointer;
}

.tab.active {
  font-weight: bold;
  color: #A7CF90;
  text-decoration: overline;
}

.header-button {
  background-color: #A7CF90;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
}

.header-button:hover {
  background-color:  #68a146;
}
</style>
