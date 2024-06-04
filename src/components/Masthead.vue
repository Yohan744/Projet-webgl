<template>
  <section id="masthead">
    <h1 class="masthead-title">Là où poussent <br> les fleurs</h1>
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
      videoReady: useVideoManager().state.introVideoReady,
    };
  },
  computed: {
    textVideoReady() {
      return this.videoReady ? 'Lancer l\'experience' : 'Chargement...';
    },
  },
  mounted() {
    this.videoManager.preloadIntroVideo();

    watch(() => this.videoManagerState.introVideoReady, (videoReady) => {
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
