<template>
  <main ref="experienceWrapper" id="experienceWrapper">
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <div ref="experienceContainer" class="experience"></div>
  </main>
</template>

<script>
import VideoIntro from "../components/VideoIntro.vue";
import Experience from '../experience/Experience';
import {useAppStore} from "../stores/appStore";
import {watch} from "vue";

export default {
  name: 'ExperiencePage',
  components: {VideoIntro},
  data() {
    const appStore = useAppStore();
    return {
      appStore,
      experience: null,
      isVideoIntroWatched: appStore.isVideoIntroWatched
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initExperience();
      this.setExperienceOpacity(this.isVideoIntroWatched ? 1 : 0);

      watch(() => this.appStore.isVideoIntroWatched, (value) => {
        this.setExperienceOpacity(value ? 1 : 0);
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
    },
    setExperienceOpacity(opacity) {
      this.$refs.experienceContainer.style.opacity = opacity;
    }
  },
}
</script>

<style scoped lang="scss">

#experienceWrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;

  .experience {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }

}

</style>
