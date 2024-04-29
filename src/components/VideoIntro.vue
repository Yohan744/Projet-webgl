<template>
  <div ref="videoWrapper" class="video-intro">
    <video
        :src="videoUrl"
        autoplay
        ref="videoElement"
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
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/videoplayback_mwcxl6.mp4`;
    return {
      videoUrl,
    };
  },
  methods: {
    playVideo() {
      this.updateOpacityTo(1, () => {
        this.$refs.videoElement.play();
      });
    },
    onVideoEnded() {
      this.markVideoWatched();
    },
    markVideoWatched() {
      const appStore = useAppStore();

      this.updateOpacityTo(0, () => {
        this.$refs.videoWrapper.remove();
        appStore.setVideoIntroWatched();
      });

    },
    updateOpacityTo(opacity, callback) {
      this.$refs.videoElement.style.opacity = opacity;
      setTimeout(() => {
        if (callback) {
          callback();
        }
      }, 2000);
    }
  },
};
</script>

<style scoped lang="scss">

.video-intro {
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
    z-index: 10;
    opacity: 0;
    transition: opacity 1s ease-in-out;
  }

}

</style>
