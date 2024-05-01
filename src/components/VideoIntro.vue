<template>
  <div ref="videoWrapper" class="video-intro-wrapper">
    <video
        ref="videoElement"
        :src="videoUrl"
        autoplay
        playsinline
        @canplaythrough="playVideo"
        @ended="onVideoEnded"
    ></video>
  </div>
</template>

<script>
import {useAppStore} from "../stores/appStore";

export default {
  name: 'VideoIntro',
  data() {
    const appStore = useAppStore();
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    return {
      appStore,
      videoUrl: `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/videoplayback_mwcxl6.mp4`,
    };
  },
  methods: {
    playVideo() {
      this.updateOpacityTo(1, () => {
        this.$refs.videoElement?.play();
      });
    },
    onVideoEnded() {
      this.markVideoWatched();
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
  },
};
</script>

<style scoped lang="scss">

.noInteractionBtn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 10;

  p {
    position: relative;
    color: white;
  }

}

.video-intro-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;

  video {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    object-fit: cover;
    z-index: 5;
    opacity: 0;
    transition: opacity 2.5s ease-in-out;
  }

}

</style>
