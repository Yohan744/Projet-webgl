<template>
  <div class="content-container">
    <h2 class="title" id="title1">Là où poussent</h2>
    <h1 class="title" id="title2">les fleurs</h1>
    <div class="image-container"></div>
    <div class="buttons">
      <div @click="handleButtonClick">
        <p class="seeMore">En apprendre plus </p>
        <img src="/assets/images/arrow_bottom.png" alt="bottom arrow">
      </div>
    </div>
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

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  width: 100%;
  height: 100vh;
  text-align: center;
}

.handwriting {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  animation: handwriting 4s steps(30, end) forwards, glow-inside 2s infinite;
}

.title {
  margin: 0;
  padding: 0;
  z-index: 1;
  font-weight: lighter;
  position: relative;
  color: white;
  visibility: hidden;
}

 
@media (max-width: 768px) {
    .title {
      font-size: 10px;
    } 
  }

  @media (max-width: 992px) {
    .title[data-v-71bb5894]:first-child  {
      margin-top:20vh;
    }
    .title {
      font-size: 30px;
    }
  }

.title:first-child {
  margin-top: 10vh; 
}

.title.handwriting {
  visibility: visible;
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
  background: url('/assets/images/fond-intro.webp') no-repeat center/cover;
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


