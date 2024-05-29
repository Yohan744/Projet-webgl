<template>

  <div class="inventory-wrapper">
    <div v-for="(item, index) in inventoryItems" :key="index" @click="handleInventoryObjectClick(index)" :class="{ 'visible': isVisible(index) }">
      <img :src="item.imageSrc" :alt="item.name"/>
    </div>
  </div>

</template>

<script>

import {useGameManager} from "../assets/js/GameManager";
import cassetteIcon from '../assets/icons/objects/cassette.png';

export default {
  name: 'Inventory',
  setup() {
    const gameManager = useGameManager();
    return {
      gameManager,
    };
  },
  data() {
    return {
      inventoryItems: [
        { name: 'picture', imageSrc: cassetteIcon },
        { name: 'projector', imageSrc: cassetteIcon },
        { name: 'drawer', imageSrc: cassetteIcon },
        { name: 'pencil', imageSrc: cassetteIcon },
        { name: 'walkman', imageSrc: cassetteIcon },
      ],
    }
  },
  computed: {
    isVisible() {
      return index => index < this.gameManager.state.gameStepId;
    },
  },
  methods: {
    handleInventoryObjectClick(index) {

      if (index < this.gameManager.state.gameStepId) {
        console.log("click on: ", this.inventoryItems[index].name)
      } else {
        console.log("not available yet")
      }

    },
  },
}

</script>