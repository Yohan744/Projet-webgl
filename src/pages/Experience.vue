<template>
  <main ref="experienceWrapper" id="experienceWrapper">
    <Loading v-if="!isLoaded && isVideoIntroWatched"/>
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <ExperienceLayer/>
    <div ref="experienceContainer" class="experience"></div>
  </main>
</template>

<script>
import VideoIntro from "../components/VideoIntro.vue";
import Experience from '../experience/Experience';
import {useAppStore} from "../stores/appStore";
import Loading from "../components/Loading.vue";
import {useRouter} from "vue-router";
import ExperienceLayer from "../components/ExperienceLayer.vue";

export default {
  name: 'ExperiencePage',
  components: {ExperienceLayer, Loading, VideoIntro},
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
  watch: {
    'appStore.$state.isVideoIntroWatched': function() {
      if (this.isLoaded) {
        this.setExperienceOpacity();
      }
    }
  },
  mounted() {
    if (this.routeCheck) {

      this.$refs.videoElement?.load();

      this.$nextTick(() => {
        this.initExperience();
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
          this.setExperienceOpacity();
        }
      });
    },
    setExperienceOpacity() {
      if (this.$refs.experienceContainer) {
        this.appStore.setExperienceVisible()
        this.$refs.experienceContainer.style.opacity = 1;
      }
    },
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
    transition: opacity 2.5s ease-in-out;
  }

}

</style>
