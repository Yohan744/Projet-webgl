<template>
  <main ref="experienceWrapper" id="experienceWrapper">

    <div ref="startButton" class="start-button" @click="handleClickStartButton" v-bind:class="{visible: showStartButton}">
      <p>start experience</p>
    </div>

    <Loading v-if="!isLoaded && isVideoIntroWatched" v-bind:class="{visible: !isLoaded && isVideoIntroWatched}" :progress="progress"/>
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <ExperienceLayer :soundManager="soundManager"/>

    <div ref="experienceContainer" class="experience"></div>

    <img id="cursor" ref="cursor" src="../assets/icons/cursor.svg" alt="Cursor" v-if="!isMobile()">

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
import {useGameManager} from "../assets/js/GameManager";
import gsap from "gsap";
import {useCursor} from "../assets/js/Cursor";
import {isMobile} from "../assets/js/utils";

export default {
  name: 'ExperiencePage',
  components: {ExperienceLayer, Loading, VideoIntro},
  data() {
    const appStore = useAppStore();
    const gameManager = useGameManager();
    const router = useRouter()
    return {
      appStore,
      gameManager,
      router,
      routeCheck: false,
      isLoaded: false,
      experience: null,
      soundManager: useSoundManager,
      progress: 0,
      isVideoIntroWatched: appStore.$state.isVideoIntroWatched,
      showStartButton: false
    };
  },
  beforeMount() {
    if (this.gameManager.state.lastVisitedRoute !== '/' && !this.appStore.$state.isVideoIntroWatched) {
      this.router.push('/');
    } else {
      this.routeCheck = true;
    }
  },
  watch: {
    'appStore.$state.isVideoIntroWatched': function () {
      if (this.isLoaded) {
        this.setExperienceOpacity();
        this.$refs.cursor?.classList.add('visible');
      }
    }
  },
  mounted() {

    this.cursor = useCursor();

    if (this.appStore.$state.isVideoIntroWatched) {
      this.$refs.cursor?.classList.add('visible');
    }

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
    this.cursor?.destroy()
  },
  methods: {
    isMobile,
    initExperience() {
      if (this.experience) {
        this.experience.destroy();
        this.experience = null;
      }

      this.experience = new Experience({
        targetElement: this.$refs.experienceContainer
      });

      this.experience.resources.on('ready', () => {
        this.isLoaded = true;
        this.showStartButton = this.gameManager.state.lastVisitedRoute === null && this.appStore.$state.isVideoIntroWatched
        if (this.isVideoIntroWatched && !this.showStartButton) {
          this.setExperienceOpacity();
        }
      });

      this.experience.on('assetLoading', (value) => {
        const p = Math.min(Math.round(value * 100), 100);
        if (p > this.progress) {
          gsap.to(this, {
            progress: p,
            duration: 0.5,
            ease: 'power2.out'
          });
        }
      });

    },
    setExperienceOpacity() {
      if (this.$refs.experienceContainer) {
        this.gameManager.setExperienceVisible()
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
