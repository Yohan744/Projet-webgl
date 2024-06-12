<template>
  <section ref="experienceLayer" id="experience-layer">
    <div ref="goBack" @click="goBack" class="go-back-icon">
      <img :src="goBackIcon" alt="Go back"/>
    </div>

    <div class="instruction-text">
      <p v-html="displayedText"></p>
    </div>

    <div ref="settings" @click="handleSettingsIconClick" class="settings-icon visible">
      <img src="../assets/icons/settings.svg" alt="Settings"/>
    </div>

    <div ref="settingsWrapper" class="settings-wrapper" @click="handleClickSettingsWrapper">
      <div class="settings-panel">
        <h3>Paramètres</h3>
        <div class="mute-wrapper">
          <p class="mute" @click="toggleMuted">{{ isMuted }} le son</p>
        </div>
        <div class="volume-wrapper">
          <p>Volume : </p>
          <input ref="globalVolumeInput" type="range" min="0" max="1" step="0.01" v-model="smoothGlobalVolume">
          <p>{{globalVolume}}</p>
        </div>
        <div class="route-wrapper">
          <router-link to="/">Retour à l'accueil</router-link>
        <router-link to="/" @click="resetExperience">Recommencer l'expérience</router-link>
        </div>
      </div>
    </div>

    <Inventory/>

  </section>
</template>

<script>
import { useAppStore } from "../stores/appStore";
import homeIcon from '../assets/icons/home.svg';
import arrowLeftIcon from '../assets/icons/arrow-left.svg';
import { useGameManager } from "../assets/js/GameManager";
import Inventory from "./Inventory.vue";

export default {
  name: 'ExperienceLayer',
  components: { Inventory },
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
      instructions: [
        "",
        "Explorer les <strong>diapositives</strong>",
        "Fouiller dans la <strong>commode</strong>",
        "Découvrir la <strong>cassette</strong> cachée dans <strong>l'enveloppe</strong>",
        "Trouver le <strong>crayon</strong> pour rembobiner les souvenirs",
        "Dénicher le <strong>walkman</strong>",
      ],
      currentInstruction: "Dépoussiérer les souvenirs sur la <strong>photo</strong>",
      displayedText: "",
      typingSpeed: 50
    };
  },
  computed: {
    isMuted() {
      return this.appStore.$state.muted ? 'Activer' : 'Couper';
    },
  },
  watch: {
    smoothGlobalVolume(newVal) {
      this.globalVolume = (Math.round(newVal * 10) / 10).toFixed(1);
      this.appStore.setGlobalVolume(parseFloat(this.globalVolume));
    },
    'gameManager.state.isExperienceVisible': function (state) {
      state ? this.setExperienceLayerOpacity() : null;
    },
    'gameManager.state.isCameraOnSpot': function () {
      this.animateGoBackIcon();
    },
    'gameManager.state.isInteractingWithObject': function (state) {
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
    'gameManager.state.gameStepId': function (newVal) {
      if (this.gameManager.state.gameStepId !== 3 && this.$refs.goBack.classList.contains('visible')) {
        this.animateArrow();
      }
      this.updateInstruction(newVal);
    }
  },
  mounted() {
    if (this.gameManager.state.isExperienceVisible) {
      this.setExperienceLayerOpacity();
    }
    this.typeWriterEffect(this.currentInstruction);
  },
  methods: {
    goBack() {
      if (this.gameManager.state.isInteractingWithObject) {
        this.gameManager.updateInteractingState(false);
      } else {
        this.gameManager.updateCameraOnSpot(false);
      }
      this.$refs.goBack.classList.remove('animate');
    },
    animateGoBackIcon() {
      this.$refs.goBack.classList.toggle('visible');
    },
    animateArrow() {
      if (this.$refs.goBack.classList.contains('visible')) {
        this.$refs.goBack.classList.add('animate');
      }
    },
    updateInstruction(stepId) {
      if (stepId >= 0 && stepId < this.instructions.length) {
        this.typeWriterEffect(this.instructions[stepId]);
      } else {
        this.typeWriterEffect("Aucune instruction disponible.");
      }
    },
    typeWriterEffect(text) {
      this.displayedText = "";
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          if (text[index] === "<") {
            const tagCloseIndex = text.indexOf(">", index);
            this.displayedText += text.slice(index, tagCloseIndex + 1);
            index = tagCloseIndex + 1;
          } else {
            this.displayedText += text[index];
            index++;
          }
        } else {
          clearInterval(interval);
        }
      }, this.typingSpeed);
    },
    handleSettingsIconClick() {
      this.isSettingsVisible = !this.isSettingsVisible;
      if (this.$refs.settingsWrapper) {
        this.$refs.settingsWrapper.classList.toggle('visible');
        this.gameManager.toggleSettings();
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
    resetExperience() {
      this.appStore.resetAll();
      this.gameManager.resetAll();
    }
  }
};
</script>
