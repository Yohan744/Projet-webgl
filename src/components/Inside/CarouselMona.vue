<template>
  <div class="carousel-container">
    <div class="carousel">
      <div class="carousel-inner">
        <div 
          class="carousel-item" 
          v-for="(image, index) in 6"
          :key="index" 
          :class="{ active: currentIndex === index }"
          :style="{ 
            transform: `rotate(${(index - currentIndex) * 5}deg) translate(${(index - currentIndex) * 10}px, ${(index - currentIndex) * 5}px)`, 
            zIndex: imagesLength - Math.abs(currentIndex - index)
          }"
        >
          <img :src="`/assets/images/pola/pola${index}.png`" alt="Image carousel">
        </div>
      </div>
      <div class="carousel-controls">
        <button @click="prev">‹</button>
        <button @click="next">›</button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      currentIndex: 0,
      imagesLength: 6,
    };
  },
  methods: {
    prev() {
      this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.imagesLength - 1;
    },
    next() {
      this.currentIndex = (this.currentIndex < this.imagesLength - 1) ? this.currentIndex + 1 : 0;
    }
  }
};
</script>

<style scoped>
.carousel-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  overflow: visible;
}

.carousel {
  position: relative;
  width: 80%;
  max-width: 600px;
  overflow: visible;
  border-radius: 8px;
}

.carousel-inner {
  position: relative;
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-item {
  position: absolute;
  width: 80%;
  max-width: 300px;
  transition: transform 0.5s ease, z-index 0s;
}

.carousel-item img {
  width: 100%;
  border-radius: 8px;
}

.carousel-controls {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
  z-index: 10; 
}

.carousel-controls button {
  border: none;
  color: black;
  font-size: 45px;
  padding: 10px;
  cursor: pointer;
  background: none
}

.carousel-controls button:hover {
  font-weight: bolder;
  font-size: 50px;
}
</style>
