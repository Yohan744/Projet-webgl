<template>
  <section ref="experienceLayer" id="experience-layer">
    <div ref="goBack" @click="goBack" class="go-back-arrow" v-if="isCameraOnSpot">
      <img src="../assets/icons/arrow-left.svg" alt="Go back" />
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
    setExperienceLayerOpacity() {
      if (this.$refs.experienceLayer) {
        this.$refs.experienceLayer.style.opacity = 1;
      }
    },
  }
}
</script>