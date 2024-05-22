<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<script>

export default {
  name: 'App',
  mounted() {
    window.addEventListener("keydown", (e) => this.goFullScreen(e))
  },
  beforeUnmount() {
    window.removeEventListener("keydown", (e) => this.goFullScreen(e))
  },
  methods: {
    goFullScreen(e) {
      if (e.code === "KeyF") {
        document.documentElement.requestFullscreen()
      }
    }
  }
}
</script>

<style lang="scss">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
