<template>
  <section ref="experienceLayer" id="experience-layer">

    <div ref="goBack" @click="goBack" class="go-back-arrow">
      <img :src="goBackIcon" alt="Go back"/>
    </div>

    <div ref="settings" @click="handleSettingsClick" class="settings">
      <img src="../assets/icons/settings.svg" alt="Settings"/>
    </div>

    <div ref="settingsPanel" class="settings-panel">

      <p class="mute" @click="toggleMuted">{{ isMuted }} sound</p>

      <div class="volume-wrapper">
        <p>Global volume</p>
        <input ref="globalVolumeInput" type="range" min="0" max="1" step="0.1" value="0.5">
      </div>

      <router-link to="/">Go back to home</router-link>
      <router-link to="/" @click="() => this.appStore.resetAll()">Reset experience</router-link>

    </div>

  </section>
</template>

<script>
import {useAppStore} from "../stores/appStore";
import {watch, computed} from "vue";
import homeIcon from '../assets/icons/home.svg';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';

export default {
  name: 'ExperienceLayer',
  setup() {
    const appStore = useAppStore();

    // const goBackIcon = computed(() => appStore.$state.isInteractingWithObject ? arrowLeftIcon : homeIcon)

    return {
      appStore,
      isSettingsVisible: false,
    };
  },
  data() {
    return {
      goBackIcon: homeIcon,
    }
  },
  computed: {
    isCameraOnSpot() {
      return this.appStore.$state.isCameraOnSpot;
    },
    isMuted() {
      return this.appStore.$state.muted ? 'Unmute' : 'Mute'
    }
  },
  mounted() {
    watch(() => this.appStore.$state.isExperienceVisible, (state) => state ? this.setExperienceLayerOpacity() : null);

    watch(() => this.appStore.$state.isCameraOnSpot, () => {
      this.animateGoBackIcon()
    })

    watch(() => this.appStore.$state.isInteractingWithObject, (state) => {
      this.animateGoBackIcon()
      setTimeout(() => {
        if (state) {
          this.goBackIcon = arrowLeftIcon;
        } else {
          this.goBackIcon = homeIcon;
        }
        this.animateGoBackIcon()
      }, 650)
    })

    if (this.appStore.$state.isExperienceVisible) {
      this.setExperienceLayerOpacity();
    }

  },
  methods: {
    goBack() {
      if (this.appStore.$state.isInteractingWithObject) {
        this.appStore.updateInteractingState(false)
      } else {
        this.appStore.updateCameraOnSpot(false)
      }
    },
    animateGoBackIcon() {
      this.$refs.goBack.classList.toggle('animate');
    },
    handleSettingsClick() {
      this.isSettingsVisible = !this.isSettingsVisible;
      if (this.$refs.settingsPanel) {
        this.$refs.settingsPanel.classList.toggle('visible');
        this.appStore.toggleSettings()
      }
    },
    setExperienceLayerOpacity() {
      if (this.$refs.experienceLayer) {
        this.$refs.experienceLayer.style.opacity = 1;
      }
    },
    toggleMuted() {
      this.appStore.toggleMute(!this.appStore.$state.muted);
    },
  }
}
</script>