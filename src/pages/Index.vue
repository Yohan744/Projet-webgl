<template>
  <div>
    <MobileWarning/>
    <Masthead/>
  </div>
</template>

<script>
import Masthead from "../components/Masthead.vue";
import {onBeforeRouteLeave} from "vue-router";
import {useGameManager} from "../assets/js/GameManager";
import MobileWarning from "../components/MobileWarning.vue";

export default {
  name: 'Index',
  components: {
    MobileWarning,
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