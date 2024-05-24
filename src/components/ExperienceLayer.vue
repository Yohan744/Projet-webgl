<template>
  <section ref="experienceLayer" id="experience-layer">

    <div ref="goBack" @click="goBack" class="go-back-icon">
      <img :src="goBackIcon" alt="Go back"/>
    </div>

    <div ref="settings" @click="handleSettingsIconClick" class="settings-icon visible">
      <img src="../assets/icons/settings.svg" alt="Settings"/>
    </div>

    <div ref="settingsWrapper" class="settings-wrapper" @click="handleClickSettingsWrapper">

      <div class="settings-panel">

        <p class="mute" @click="toggleMuted">{{ isMuted }} sound</p>

        <div class="volume-wrapper">
          <p>Global volume</p>
          <input ref="globalVolumeInput" type="range" min="0" max="1" step="0.01" v-model="smoothGlobalVolume">
          <p>{{globalVolume}}</p>
        </div>

        <router-link to="/">Go back to home</router-link>
        <router-link to="/" @click="resetExperience">Reset experience</router-link>

      </div>

    </div>

    <div class="pocket-button" @click="handlePocketButtonClick" :class="{ visible: gameManager.state.isPocketButtonVisible }" >
      <p>Mettre dans la poche</p>
    </div>

    <div class="carousel">
      <button class="left-button">left</button>
      <button class="right-button">right</button>
    </div>

    <div class="inventory-wrapper" v-if="isAnyItemInInventory">

      <div v-if="gameManager.inventory.cassette" @click="handleInventoryObjectClick('cassette')">
        <img src="../assets/icons/objects/CASSETTE_VIGNETTE.png" alt="Cassette"/>
      </div>

      <div v-if="gameManager.inventory.pencil" @click="handleInventoryObjectClick('pencil')">
        <img src="../assets/icons/objects/icn_crayon.svg" alt="Pencil"/>
      </div>

    </div>

  </section>
</template>

<script>
import { useAppStore } from "../stores/appStore";
import homeIcon from '../assets/icons/home.svg';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';
import {useGameManager} from "../assets/js/GameManager";

export default {
  name: 'ExperienceLayer',
  props: {
    soundManager: Object,
  },
  setup() {
    const appStore = useAppStore();
    const gameManager = useGameManager();
    return {
      appStore,
      gameManager,
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
    isMuted() {
      return this.appStore.$state.muted ? 'Unmute' : 'Mute'
    },
    isAnyItemInInventory() {
      return Object.values(this.gameManager.inventory).some(value => value);
    }
  },
  watch: {
    smoothGlobalVolume(newVal) {
      this.globalVolume = (Math.round(newVal * 10) / 10).toFixed(1);
      this.appStore.setGlobalVolume(parseFloat(this.globalVolume));
    },
    'gameManager.state.isExperienceVisible': function(state) {
      state ? this.setExperienceLayerOpacity() : null;
    },
    'gameManager.state.isCameraOnSpot': function() {
      this.animateGoBackIcon();
    },
    'gameManager.state.isInteractingWithObject': function(state) {
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
    if (this.gameManager.state.isExperienceVisible) {
      this.setExperienceLayerOpacity();
    }
  },
  methods: {
    goBack() {
      if (this.gameManager.state.isInteractingWithObject) {
        this.gameManager.updateInteractingState(false)
      } else {
        this.gameManager.updateCameraOnSpot(false)
      }
    },
    animateGoBackIcon() {
      this.$refs.goBack.classList.toggle('visible');
    },
    handleSettingsIconClick() {
      this.isSettingsVisible = !this.isSettingsVisible;
      if (this.$refs.settingsWrapper) {
        this.$refs.settingsWrapper.classList.toggle('visible');
        this.gameManager.toggleSettings()
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
    handleClickSettingsWrapper(e) {
      if (e.target === this.$refs.settingsWrapper) {
        this.handleSettingsIconClick();
      }
    },
    handlePocketButtonClick() {
      this.gameManager.updateObjectToPocket(true);
    },
    handleInventoryObjectClick(name) {
      this.gameManager.setInventoryObjectInFrontOfCamera(name);
    },
    resetExperience() {
      this.appStore.resetAll();
      this.gameManager.resetAll();
    }
  }
}
</script>