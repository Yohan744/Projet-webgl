<template>
  <div class="header-banner">
    <div class="tabs">
      <span 
        v-for="(tab, index) in tabs" 
        :key="tab" 
        class="tab" 
        @click="scrollToSection(index)">
        {{ tab }}
      </span>
    </div>
    <button class="header-button">Lancer l'expérience</button>
  </div>
</template>

<script>
export default {
  name: 'HeaderBanner',
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
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  z-index: 3;
  color: white;
  mix-blend-mode: difference;
}

.tabs {
  display: flex;
}

.tab {
  margin-right: 20px;
  cursor: pointer;
}

.header-button {
  background: var(--button-background-color, #444);
  border: none;
  color: var(--button-text-color, #fff);
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background: var(--button-hover-background-color, #555);
}
</style>