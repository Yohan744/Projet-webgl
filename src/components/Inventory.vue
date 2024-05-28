<template>

  <div class="inventory-wrapper">
    <div v-for="(item, index) in inventoryItems" :key="index" @click="handleInventoryObjectClick(index)" :class="{ 'visible': isVisible(index) }">
      <img :src="item.imageSrc" :alt="item.name"/>
    </div>
  </div>

</template>

<script>

import {useGameManager} from "../assets/js/GameManager";

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
        { name: 'picture', imageSrc: './src/assets/icons/objects/cassette.png' },
        { name: 'projector', imageSrc: './src/assets/icons/objects/cassette.png' },
        { name: 'drawer', imageSrc: './src/assets/icons/objects/cassette.png' },
        { name: 'pencil', imageSrc: './src/assets/icons/objects/cassette.png' },
        { name: 'walkman', imageSrc: './src/assets/icons/objects/cassette.png' },
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