<template>
  <main ref="experienceWrapper" id="experienceWrapper">
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <Loading v-if="!isLoaded && isVideoIntroWatched"/>
    <div ref="experienceContainer" class="experience"></div>
  </main>
</template>

<script>
import VideoIntro from "../components/VideoIntro.vue";
import Experience from '../experience/Experience';
import {useAppStore} from "../stores/appStore";
import {watch} from "vue";
import Loading from "../components/Loading.vue";
import {useRouter} from "vue-router";

export default {
  name: 'ExperiencePage',
  components: {Loading, VideoIntro},
  data() {
    const appStore = useAppStore();
    const router = useRouter()
    return {
      appStore,
      router,
      routeCheck: false,
      isLoaded: false,
      experience: null,
      isVideoIntroWatched: appStore.isVideoIntroWatched,
    };
  },
  beforeMount() {
    if (this.appStore.lastVisitedRoute !== '/' && !this.appStore.isVideoIntroWatched) {
      this.router.push('/');
    } else {
      this.routeCheck = true;
    }
  },
  mounted() {

    if (this.routeCheck) {

      this.$refs.videoElement?.load();

      this.$nextTick(() => {
        this.initExperience();
        watch(() => this.appStore.isVideoIntroWatched, () => {
          if (this.isLoaded) {
            this.setExperienceOpacity(1);
          }
        });
      });

    }
  },
  beforeUnmount() {
    if (this.experience) {
      this.experience.destroy();
      this.experience = null;
    }
  },
  methods: {
    initExperience() {
      this.experience?.destroy();
      this.experience = new Experience({
        targetElement: this.$refs.experienceContainer
      });
      this.experience.resources.on('ready', () => {
        this.isLoaded = true;
        if (this.isVideoIntroWatched) {
          this.setExperienceOpacity(1);
        }
      });
    },
    setExperienceOpacity(opacity) {
      if (this.$refs.experienceContainer) {
        this.$refs.experienceContainer.style.opacity = opacity;
      }
    }
  },
}
</script>

<style scoped lang="scss">

#experienceWrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100dvw;

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
