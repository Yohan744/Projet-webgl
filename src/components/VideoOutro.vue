<template>
  <div ref="videoWrapper" class="video-outro-wrapper">
    <div v-if="videoElement">
      <video ref="videoElement" :src="videoUrl" autoplay playsinline @canplaythrough="playVideo" @ended="markVideoWatched"></video>
    </div>
  </div>
</template>

<script>
import {useAppStore} from "../stores/appStore";
import {useVideoManager} from "../assets/js/VideoManager";
import {useRouter} from "vue-router";

export default {
  name: 'VideoOutro',
  data() {
    const appStore = useAppStore();
    const videoManager = useVideoManager();
    const cloudName = import.meta.env.VITE_APP_CLOUD_NAME;
    const videoName = import.meta.env.VITE_APP_VIDEO_OUTRO_NAME;
    const router = useRouter();

    return {
      appStore,
      router,
      videoManagerState: videoManager.state,
      videoUrl: `https://res.cloudinary.com/${cloudName}/video/upload/v1714375827/${videoName}`,
    };
  },
  computed: {
    videoElement() {
      return this.videoManagerState.outroVideoElement;
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
        this.router.push('/inside')
        this.$refs.videoWrapper?.remove();
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
    }
  }
};
</script>

<style scoped lang="scss">
.video-outro-wrapper {
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
}
</style>
