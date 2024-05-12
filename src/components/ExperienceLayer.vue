<template>
  <section ref="experienceLayer" id="experience-layer">
    <div ref="goBack" @click="goBack" class="go-back-arrow" v-if="isCameraOnSpot">
      <img src="../assets/icons/arrow-left.svg" alt="Go back"/>
    </div>
    <div ref="settings" @click="handleSettingsClick" class="settings">
      <img src="../assets/icons/settings.svg" alt="Settings"/>
    </div>
    <div ref="settingsPanel" class="settings-panel">
      <p class="mute" @click="toggleMuted">{{isMuted}} sound</p>
      <div class="volume-wrapper">
        <p>Global volume</p>
        <input ref="globalVolumeInput" type="range" min="0" max="1" step="0.1" value="0.5">
      </div>
      <router-link to="/">Go back to home</router-link>
      <router-link to="/" @click="() => this.appStore.resetAll()">Reset experience</router-link>
    </div>
    <button id="btn-left">Gauche</button>
<button id="btn-right">Droite</button>

  </section>
</template>

<script>
import {useAppStore} from "../stores/appStore";
import {watch} from "vue";

export default {
  name: 'ExperienceLayer',
  data() {
    const appStore = useAppStore();
    return {
      appStore,
      isSettingsVisible: false,
    };
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
    watch(() => this.appStore.$state.isExperienceVisible, (state) => {
      if (state) {
        this.setExperienceLayerOpacity();
      }
    });

    if (this.appStore.$state.isExperienceVisible) {
      this.setExperienceLayerOpacity();
    }

  },
  methods: {
    goBack() {
      this.appStore.updateCameraOnSpot(false)
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