<template>
  <div :class="['header-banner', { 'dark-theme': activeSection !== 0, 'white-background': activeSection !== 0 }]">
    <button class="burger-button" @click="toggleMenu">
      Menu<span :class="{ 'burger-active': menuOpen }"></span>
    </button>
    <div :class="['tabs', { 'tabs-hidden': !menuOpen && isMobileView, 'tabs-visible': menuOpen && isMobileView }]">
      <span 
        v-for="(tab, index) in tabs" 
        :key="tab" 
        class="tab" 
        :class="{ active: activeSection === index }"
        @click="scrollToSection(index)">
        {{ tab }}
        <span v-if="activeSection === index" v-html="heartSvg"></span>
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
      tabs: ['Home', 'Parler d amour', '...dans les années 80 ', '...et aujourd hui?', 'L equipe'],
      heartSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#A7CF90"/></svg>',
      menuOpen: false,
      isMobileView: window.innerWidth <= 768
    }
  },
  methods: {
    scrollToSection(index) {
      this.$emit('scroll-to-section', index);
      if (this.isMobileView) {
        this.menuOpen = false;
      }
    },
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    handleResize() {
      this.isMobileView = window.innerWidth <= 768;
      if (!this.isMobileView) {
        this.menuOpen = false;
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
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

.tabs-hidden {
  display: none;
}

.tabs-visible {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  background-color: white;
  text-align: center;
  animation: slideIn 0.3s forwards;
  z-index: 1000000001;
}

.tab {
  margin-right: 20px;
  cursor: pointer;
}

.tab.active, .tab:hover {
  font-weight: bold;
  font-size: larger;
  color: #A7CF90;
}

.header-button {
  background-color: #A7CF90;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 8px;
}

.header-button:hover {
  background-color: #68a146;
}

.burger-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 100000001;
  padding: 10px;
}

.burger-button span,
.burger-button span::before,
.burger-button span::after {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: black;
  transition: all 0.3s ease-in-out;
}

.burger-button span::before,
.burger-button span::after {
  content: '';
}

.burger-active span::before {
  transform: rotate(45deg) translate(5px, 5px);
}

.burger-active span::after {
  transform: rotate(-45deg) translate(5px, -5px);
}

@media (max-width: 768px) {
  .tabs {
    display: none;
  }

  .tabs.tabs-visible {
    display: flex;
  }

  .tab {
    margin: 10px 0;
  }

  .burger-button {
    display: block;
  }

  .header-button {
    margin-right: 20px;
  }
}

@keyframes slideIn {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes slideOut {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
</style>
