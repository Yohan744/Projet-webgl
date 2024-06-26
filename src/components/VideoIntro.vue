<template>
  <div ref="videoWrapper" class="video-intro-wrapper">
    <div v-if="videoElement">
      <video ref="videoElement" :src="videoUrl" autoplay playsinline @canplaythrough="playVideo" @ended="markVideoWatched"></video>
      <div class="skip" @click="skipVideo">
        <p>Skip</p>
      </div>
    </div>
  </div>
</template>

<script>
import {useAppStore} from "../stores/appStore";
import {useVideoManager} from "../assets/js/VideoManager";

export default {
  name: 'VideoIntro',
  data() {
    const appStore = useAppStore();
    const videoManager = useVideoManager();
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    const videoName = import.meta.env.VITE_APP_VIDEO_INTRO_NAME;

    return {
      appStore,
      videoManagerState: videoManager.state,
      videoUrl: `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/${videoName}`,
    };
  },
  computed: {
    videoElement() {
      return this.videoManagerState.introVideoElement;
    }
  },
  methods: {
    playVideo() {
      this.updateOpacityTo(1, () => {
        this.$refs.videoElement?.play();
      });
    },
    markVideoWatched() {
      this.updateOpacityTo(0, () => {
        this.$refs.videoWrapper?.remove();
        this.appStore.setVideoIntroWatched();
      });
    },
    updateOpacityTo(opacity, callback) {
      if (this.$refs.videoElement) {
        this.$refs.videoElement.style.opacity = opacity;
      }
      setTimeout(() => {
        if (callback) {
          callback();
        }
      }, 3000);
    },
    skipVideo() {
      this.markVideoWatched();
    }
  }
};
</script>

<style scoped lang="scss">
.video-intro-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 100;

  video {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 5;
    cursor: none;
    opacity: 0;
    transition: opacity 2.5s ease-in-out;
  }

  .skip {
    position: fixed;
    bottom: 5px;
    right: 5px;
    // display: flex;
    justify-content: center;
    align-items: center;
    padding: 5px 10px;
    background: white;
    z-index: 6;
    cursor: pointer;
    border-radius: 10px;
    opacity: 0.5;
    display: none;

    p {
      position: relative;
      font-size: 20px;
    }

  }

}
</style>
