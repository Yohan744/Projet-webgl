<template>

  <div class="inventory-wrapper">
    <div v-for="(item, index) in inventoryItems" :key="index" :class="{ 'visible': isVisible(index) }">
      <img :src="item.imageSrc" :alt="item.name"/>
    </div>
  </div>

</template>

<script>

import {useGameManager} from "../assets/js/GameManager";
import pictureIcon from '../assets/icons/objects/picture.png';
import projectorIcon from '../assets/icons/objects/projector.png';
import envelopeIcon from '../assets/icons/objects/enveloppe.png';
import cassetteIcon from '../assets/icons/objects/cassette.png';
import pencilIcon from '../assets/icons/objects/pencil.png';
import walkmanIcon from '../assets/icons/objects/walkman.png';


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
        { name: 'picture', imageSrc: pictureIcon },
        { name: 'projector', imageSrc: projectorIcon },
        { name: 'envelope', imageSrc: envelopeIcon },
        { name: 'cassette', imageSrc: cassetteIcon },
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
}

</script>