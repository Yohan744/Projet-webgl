<template>
    <Masthead />
</template>

<script>
import Masthead from "../components/Masthead.vue";
import {onBeforeRouteLeave} from "vue-router";
import {useAppStore} from "../stores/appStore";

export default {
  name: 'Index',
  components: {
    Masthead
  },
  setup() {
    onBeforeRouteLeave((to, from, next) => {
      const appStore = useAppStore()
      appStore.setLastVisitedRoute(from.fullPath);
      next();
    });
  }
}
</script>