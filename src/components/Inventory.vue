<template>

  <div class="inventory-wrapper">
    <div v-for="(item, index) in inventoryItems" :key="index" @click="handleInventoryObjectClick(index)" :class="{ 'visible': isVisible(index) }">
      <img :src="item.imageSrc" :alt="item.name"/>
    </div>
  </div>

</template>

<script>

import {useGameManager} from "../assets/js/GameManager";
import projectorIcon from '../assets/icons/objects/projector.webp';
import pencilIcon from '../assets/icons/objects/pencil.webp';
import walkmanIcon from '../assets/icons/objects/walkman.webp';
import envelopeIcon from '../assets/icons/objects/envelope.webp';


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
        { name: 'picture', imageSrc: envelopeIcon },
        { name: 'projector', imageSrc: projectorIcon },
        { name: 'envelope', imageSrc: envelopeIcon },
        { name: 'pencil', imageSrc: pencilIcon },
        { name: 'walkman', imageSrc: walkmanIcon },
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