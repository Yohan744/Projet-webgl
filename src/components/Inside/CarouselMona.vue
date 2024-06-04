<template>
  <div class="carousel-container">
    <div class="carousel">
      <div class="carousel-inner">
        <div 
          class="carousel-item" 
          v-for="(image, index) in images" 
          :key="index" 
          :class="{ active: currentIndex === index }"
          :style="{ 
            transform: `rotate(${(index - currentIndex) * 5}deg) translate(${(index - currentIndex) * 10}px, ${(index - currentIndex) * 5}px)`, 
            zIndex: images.length - Math.abs(currentIndex - index)
          }"
        >
          <img :src="image" alt="Image carousel">
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
import pola0 from '@/assets/img/pola/pola0.png';
import pola1 from '@/assets/img/pola/pola1.png';
import pola2 from '@/assets/img/pola/pola2.png';
import pola3 from '@/assets/img/pola/pola3.png';
import pola4 from '@/assets/img/pola/pola4.png';
import pola5 from '@/assets/img/pola/pola5.png';

export default {
  data() {
    return {
      currentIndex: 0,
      images: [
        pola0,
        pola1,
        pola2,
        pola3,
        pola4,
        pola5
      ]
    };
  },
  methods: {
    prev() {
      this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.images.length - 1;
    },
    next() {
      this.currentIndex = (this.currentIndex < this.images.length - 1) ? this.currentIndex + 1 : 0;
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
