<template>
  <section ref="experienceLayer" id="experience-layer">
    <div ref="goBack" @click="goBack" class="go-back-arrow" v-if="isCameraOnSpot">
      <img src="../assets/icons/arrow-left.svg" alt="Go back" />
    </div>
    <div ref="settings" @click="handleSettingsClick" class="settings">
      <img src="../assets/icons/settings.svg" alt="Settings" />
    </div>
    <div ref="settingsPanel" class="settings-panel">

    </div>
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
  },
  mounted() {
    watch(() => this.appStore.$state.isExperienceVisible, (state) => {
      if (state) {
        this.setExperienceLayerOpacity();
      }
    });
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
  }
}
</script>