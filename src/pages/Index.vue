<template>
    <Masthead />
</template>

<script>
import Masthead from "../components/Masthead.vue";
import {onBeforeRouteLeave} from "vue-router";
import {useGameManager} from "../assets/js/GameManager";

export default {
  name: 'Index',
  components: {
    Masthead
  },
  setup() {
    onBeforeRouteLeave((to, from, next) => {
      const gameManager = useGameManager();
      gameManager.setLastVisitedRoute(from.fullPath);
      next();
    });
  }
}
</script>