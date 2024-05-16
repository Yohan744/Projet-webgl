<template>
  <main ref="experienceWrapper" id="experienceWrapper">
    <div ref="startButton" class="start-button" @click="handleClickStartButton" v-bind:class="{ visible: showStartButton }">
      <p>start experience</p>
    </div>
    <Loading v-if="!isLoaded && isVideoIntroWatched" v-bind:class="{visible: !isLoaded && isVideoIntroWatched}" :progress="progress"/>
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <ExperienceLayer :soundManager="soundManager"/>
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
import {useSoundManager} from "../main";

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
      soundManager: useSoundManager,
      progress: 0,
      isVideoIntroWatched: appStore.isVideoIntroWatched,
      showStartButton: false
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
    'appStore.$state.isVideoIntroWatched': function () {
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
        this.showStartButton = this.appStore.$state.lastVisitedRoute === null && this.appStore.$state.isVideoIntroWatched
        if (this.isVideoIntroWatched && !this.showStartButton) {
          this.setExperienceOpacity();
        }
      });

      this.experience.on('assetLoading', (value) => {
        const progress = Math.round(value * 100);
        if (progress > this.progress) {
          this.progress = progress;
        }
      });

    },
    setExperienceOpacity() {
      if (this.$refs.experienceContainer) {
        this.appStore.setExperienceVisible()
        this.$refs.experienceContainer.style.opacity = 1;
        this.showStartButton = false;
        this.soundManager?.play('background')
      }
    },
    handleClickStartButton() {
      this.$refs.startButton.classList.remove('visible');
      setTimeout(() => {
        this.setExperienceOpacity();
      }, 1000);
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

  .start-button {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0;
    z-index: -1;
    cursor: pointer;
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.8s ease-in-out;

    p {
      position: relative;
      font-size: 30px;
      color: white;
    }

    &.visible {
      pointer-events: all;
      z-index: 1;
      opacity: 1;
    }

  }

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
