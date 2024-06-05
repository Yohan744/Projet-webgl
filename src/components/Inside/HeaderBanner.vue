<template>
  <div ref="headerBanner" :class="['header-banner', { 'dark-theme': isDarkTheme, 'white-background': !isDarkTheme }]">
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
    <router-link
      :to="videoReady ? '/experience' : ''"
      class="header-button"
      :class="{ disabled: !videoReady }"
      @click.prevent="!videoReady">
      {{ textVideoReady }}
    </router-link>
    <button class="share-button" @click="toggleSharePopup">
      <span v-if="!isMobileView">Partager</span>
      <span v-else>
        <svg class="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.03-.47-.08-.7l7.11-4.05c.53.5 1.23.82 2.02.82 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.03.47.08.7L6.91 9.77C6.38 9.3 5.68 9 5 9 3.34 9 2 10.34 2 12s1.34 3 3 3c.68 0 1.38-.3 1.91-.77l7.12 4.05c-.05.22-.08.45-.08.69 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z"/>
        </svg>
      </span>
    </button>
    <div v-if="sharePopupVisible" class="share-popup">
      <button @click="copyURL">Copier le lien</button>
      <a href="https://www.instagram.com/lopf_2024?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank">Instagram</a>
    </div>
  </div>
</template>


<script>
import { useVideoManager } from "../../assets/js/VideoManager";
import { watch } from "vue";

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
      tabs: ['Home', 'Parler d\'amour', '...dans les années 80 ', '...et aujourd hui?', 'L\'équipe'],
      heartSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#A7CF90"/></svg>',
      menuOpen: false,
      isMobileView: window.innerWidth <= 768,
      isDarkTheme: true,
      videoManager: useVideoManager(),
      videoManagerState: useVideoManager().state,
      videoReady: useVideoManager().state.introVideoReady,
      sharePopupVisible: false,
    }
  },
  computed: {
    textVideoReady() {
      return this.videoReady ? 'LANCER L\'EXPERIENCE' : 'Chargement...';
    }
  },
  watch: {
    activeSection() {
      this.updateTheme();
    },
    'videoManagerState.introVideoReady'(newValue) {
      this.videoReady = newValue;
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
    },
    updateTheme() {
      this.isDarkTheme = this.activeSection === 0 && (window.scrollY || document.documentElement.scrollTop) <= 50;
    },
    toggleSharePopup() {
      this.sharePopupVisible = !this.sharePopupVisible;
    },
    copyURL() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Lien copié!');
      }).catch(err => {
        alert('Erreur lors de la copie du lien');
      });
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('scroll', this.updateTheme);
    this.videoManager.preloadIntroVideo();
    this.updateTheme();  // Initialize the theme
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('scroll', this.updateTheme);
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
  transition: background-color 0.3s, color 0.3s;
  align-items: center;
  border-radius: 20px;
  z-index: 100000000;
}

.header-banner.dark-theme {
  color: white;
  background-color: transparent;
}

.header-banner.white-background {
  background-color: white;
  color: black;
}

.tabs {
  display: flex;
  width: 80%;
  align-items: center;
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
  transition: color 0.3s, font-size 0.3s, font-weight 0.3s;
}

.tab.active, .tab:hover {
  font-weight: bold;
  font-size: larger;
  color: #A7CF90;
}

.tab span svg {
  transition: transform 0.3s;
}

.tab.active span svg {
  transform: scale(1.2);
}

.header-button {
  background-color: #A7CF90;
  color: white;
  text-decoration: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.header-button:hover {
  background-color: #68a146;
}

.header-button.disabled {
  pointer-events: none;
  color: grey;
  cursor: not-allowed;
}

.share-button {
  background-color: gray;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 20px;
  margin-left: 10px;
  transition: background-color 0.3s;
}

.share-button:hover {
  background-color: darkgray
}

.share-icon {
  width: 10px;
  height: 10px;
}

.share-popup {
  position: absolute;
  top: 70px;
  right: 0;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.share-popup button,
.share-popup a {
  background: none;
  border: none;
  color: #333;
  padding: 5px 10px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s;
}

.share-popup button:hover,
.share-popup a:hover {
  background-color: #f0f0f0;
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

  .share-button span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .share-button .share-icon {
    width: 24px;
    height: 24px;
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


