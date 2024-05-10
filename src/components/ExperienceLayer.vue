<template>
  <section ref="experienceLayer" id="experience-layer">

    <div ref="goBack" @click="goBack" class="go-back-arrow">
      <img :src="goBackIcon" alt="Go back"/>
    </div>

    <div ref="settings" @click="handleSettingsClick" class="settings visible">
      <img src="../assets/icons/settings.svg" alt="Settings"/>
    </div>

    <div ref="settingsPanel" class="settings-panel">

      <p class="mute" @click="toggleMuted">{{ isMuted }} sound</p>

      <div class="volume-wrapper">
        <p>Global volume</p>
        <input ref="globalVolumeInput" type="range" min="0" max="1" step="0.01" v-model="smoothGlobalVolume">
        <p>{{globalVolume}}</p>
      </div>

      <router-link to="/">Go back to home</router-link>
      <router-link to="/" @click="() => this.appStore.resetAll()">Reset experience</router-link>

    </div>

  </section>
</template>

<script>
import {useAppStore} from "../stores/appStore";
import homeIcon from '../assets/icons/home.svg';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';

export default {
  name: 'ExperienceLayer',
  props: {
    soundManager: Object,
  },
  setup() {
    const appStore = useAppStore();
    return {
      appStore,
      isSettingsVisible: false,
    };
  },
  data() {
    return {
      goBackIcon: homeIcon,
      globalVolume: this.appStore.$state.globalVolume,
      smoothGlobalVolume: this.appStore.$state.globalVolume,
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
  watch: {
    smoothGlobalVolume(newVal) {
      this.globalVolume = (Math.round(newVal * 10) / 10).toFixed(1);
      this.appStore.setGlobalVolume(parseFloat(this.globalVolume));
    },
    'appStore.$state.isExperienceVisible': function(state) {
      state ? this.setExperienceLayerOpacity() : null;
    },
    'appStore.$state.isCameraOnSpot': function() {
      this.animateGoBackIcon();
    },
    'appStore.$state.isInteractingWithObject': function(state) {
      this.animateGoBackIcon();
      setTimeout(() => {
        if (state) {
          this.goBackIcon = arrowLeftIcon;
        } else {
          this.goBackIcon = homeIcon;
        }
        this.animateGoBackIcon();
      }, 800);
    },
  },
  mounted() {
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
      this.$refs.goBack.classList.toggle('visible');
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
        this.$refs.experienceLayer.classList.add('visible');
      }
    },
    toggleMuted() {
      this.appStore.$state.muted ? this.soundManager.unmute() : this.soundManager.mute();
    },
  }
}
</script>