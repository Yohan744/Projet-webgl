<template>
  
  <h2 class="title" id="title1">Là où poussent</h2>
  <h1 class="title" id="title2">les fleurs</h1>
  <h3 class="title" id="title3">La vie de Mona</h3>
  <img src="/src/assets/img/fleur.png" alt="">
  <div class="image-container"></div>
    <div class="buttons">
      <button @click="handleButtonClick"><p class="seeMore">En apprendre plus </p><img src="/src/assets/img/arrow_bottom.png" alt=""></button>
    </div>

</template>

<script>
export default {
  name: 'Section0',
  mounted() {
    this.triggerHandwritingAnimation();
  },
  methods: {
    handleButtonClick() {
      document.getElementById('section-1').scrollIntoView({ behavior: 'smooth' });
    },
    triggerHandwritingAnimation() {
      const titles = document.querySelectorAll('.title');
      titles.forEach((title, index) => {
        setTimeout(() => {
          title.style.visibility = 'visible';
          title.classList.add('handwriting');
        }, index * 2000); 
      });
    }
  }
}
</script>

<style scoped>
@keyframes handwriting {
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
}

.handwriting {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  animation: handwriting 4s steps(30, end) 1;
}

.title {
  margin: 0;
  padding: 0;
  z-index: 1;
  position: relative;
  color: white;
  transition: width 0.5s ease-in-out;
  visibility: hidden; 
}

img {
  z-index: 1;
}

.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/src/assets/img/section1_background.webp') no-repeat center center;
  background-size: cover; 
  z-index: 0; 
}

.buttons {
  display: block;
  position: absolute;
  bottom: 20px;
}

.buttons:hover {
  color: #A7CF90;
}

.seeMore {
  display: block;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background: none;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  color: #A7CF90;
}
</style>
