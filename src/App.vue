<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component"/>
    </transition>
  </router-view>
</template>

<script>
import {useAppStore} from "./stores/appStore";

export default {
  name: 'App',
  setup() {
    const appStore = useAppStore();

    const onBeforeUnload = () => {
      appStore.resetSomeStatesOnReload()
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    onBeforeUnload(() => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    });
  },

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
