<template>
  <main ref="experienceWrapper" id="experienceWrapper">
    <div ref="startButton" class="start-button" @click="handleClickStartButton" v-bind:class="{visible: showStartButton}">
      <div class="rubik-container">
        <div class="glowing-circle"></div>
        <img src="/src/assets/img/objects/object8.png" alt="Rubik's Cube" class="rubik-cube">
        <p class="rubik-text">Cliquez sur le Rubik's Cube pour découvrir les objets de Mona dans le grenier</p>
      </div>
    </div>

    <Loading v-if="!isLoaded && isVideoIntroWatched" v-bind:class="{visible: !isLoaded && isVideoIntroWatched}" :progress="progress"/>
    <VideoIntro v-if="!isVideoIntroWatched"/>
    <ExperienceLayer :soundManager="soundManager"/>
    <VideoOutro v-if="showVideoOutro"/>

    <div ref="experienceContainer" class="experience"></div>
    <img id="cursor" ref="cursor" src="../assets/icons/cursor.svg" alt="Cursor" v-if="!isMobile()">
  </main>
</template>

<script>
import VideoIntro from "../components/VideoIntro.vue";
import Experience from '../experience/Experience';
import { useAppStore } from "../stores/appStore";
import Loading from "../components/Loading.vue";
import { useRouter } from "vue-router";
import ExperienceLayer from "../components/ExperienceLayer.vue";
import { useSoundManager } from "../main";
import { useGameManager } from "../assets/js/GameManager";
import gsap from "gsap";
import { useCursor } from "../assets/js/Cursor";
import { isMobile } from "../assets/js/utils";
import { useGlobalEvents } from "../assets/js/GlobalEvents";
import { useVideoManager } from "../assets/js/VideoManager";
import VideoOutro from "../components/VideoOutro.vue";

export default {
  name: 'ExperiencePage',
  components: { VideoOutro, ExperienceLayer, Loading, VideoIntro },
  data() {
    const appStore = useAppStore();
    const gameManager = useGameManager();
    const globalEvents = useGlobalEvents();
    const router = useRouter();
    const videoManager = useVideoManager();

    return {
      appStore,
      gameManager,
      globalEvents,
      router,
      videoManager,
      routeCheck: false,
      isLoaded: false,
      experience: null,
      soundManager: useSoundManager,
      progress: 0,
      isVideoIntroWatched: appStore.$state.isVideoIntroWatched,
      showStartButton: false,
      showVideoOutro: false,
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
    this.cursor?.destroy();
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
        this.showStartButton = this.gameManager.state.lastVisitedRoute === null && this.appStore.$state.isVideoIntroWatched;
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

      this.setVideoOutro();
    },
    setVideoOutro() {
      this.soundManager.sounds['final'].once('play', () => {
            setTimeout(() => {
              console.log("Starting final sound and fade out");
              this.fadeOutExperience();
            }, 38000);
      });

      this.soundManager.sounds['final'].once('end', () => {
        setTimeout(() => {
          this.playOutroVideo();
        }, 500);
      });
    },
    fadeOutExperience() {
      gsap.to(this.$refs.experienceContainer, {
        opacity: 0,
        duration: 17,
        ease: 'power2.inOut',
        onComplete: () => {
          console.log("Experience container faded out");
        }
      });
    },
    playOutroVideo() {
      this.videoManager.preloadOutroVideo();
      const checkVideoLoaded = setInterval(() => {
        if (this.videoManager.state.outroVideoReady) {
          clearInterval(checkVideoLoaded);
          this.showVideoOutro = true;
        }
      }, 500);
    },
    setExperienceOpacity() {
      if (this.$refs.experienceContainer) {
        this.gameManager.setExperienceVisible();
        this.$refs.experienceContainer.style.opacity = 1;
        this.showStartButton = false;
        this.soundManager?.play('background');
        gsap.delayedCall(2, () => {
          this.globalEvents?.trigger('experienceIsVisible');
        });
      }
    },
    handleClickStartButton() {
      this.$refs.startButton.classList.remove('visible');
      this.videoManager.preloadOutroVideo();
      setTimeout(() => {
        this.setExperienceOpacity();
      }, 1000);
    }
  },
}
</script>
