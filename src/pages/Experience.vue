<template>
  <div ref="experienceContainer" class="experience"></div>
</template>

<script>
import Experience from '../experience/Experience';

export default {
  name: 'ExperiencePage',
  data() {
    return {
      experience: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initExperience();
      this.$nextTick(() => {
        if (this.experience.camera) {
          this.experience.camera.updateLerpCameraAfterFirstFrame()
        }
      });
    });
  },
  beforeUnmount() {
    if (this.experience) {
      this.experience.destroy();
      this.experience = null;
    }
  },
  methods: {
    initExperience() {
      if (this.experience) {
        this.experience.destroy();
      }
      this.experience = new Experience({
        targetElement: this.$refs.experienceContainer
      });
    }
  },
  activated() {
    this.initExperience();
  },
  deactivated() {
    if (this.experience) {
      this.experience.destroy();
      this.experience = null;
    }
  }
}
</script>

<style>
.experience {
  position: fixed;
  width: 100vw;
  height: 100vh;
}
</style>
