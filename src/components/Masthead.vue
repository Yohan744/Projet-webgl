<template>
  <section id="masthead">
    <router-link
        :to="videoReady ? '/experience' : ''"
        :class="{ disabled: !videoReady }"
        @click.prevent="!videoReady">{{ textVideoReady }}</router-link>
  </section>
</template>

<script>
import { useVideoManager } from "../assets/js/VideoManager";
import { watch } from "vue";

export default {
  name: 'Masthead',
  data() {
    return {
      videoManager: useVideoManager(),
      videoManagerState: useVideoManager().state,
      videoReady: useVideoManager().state.videoReady,
    };
  },
  computed: {
    textVideoReady() {
      return this.videoReady ? 'Lancer l\'experience' : 'Chargement...';
    },
  },
  mounted() {
    this.videoManager.preloadVideo();

    watch(() => this.videoManagerState.videoReady, (videoReady) => {
      this.videoReady = videoReady;
    });
  },
};
</script>

<style scoped>
.disabled {
  pointer-events: none;
  color: grey;
  cursor: not-allowed;
}
</style>
