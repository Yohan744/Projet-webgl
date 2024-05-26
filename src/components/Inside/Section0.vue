<template>
    <h2 class="title">Là où poussent</h2>
    <h1 class="title">les fleurs</h1>
    <h3 class="title">La vie de Mona</h3>
    <div class="image-container"></div>
      <div class="buttons">
        <button @click="handleButtonClick">Click Me</button>
      </div>
</template>

<script>
export default {
  name: 'Section0',
  methods: {
    handleButtonClick() {
      document.getElementById('section-1').scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
.image-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/src/assets/img/section1_background.png') no-repeat center center;
  background-size: cover; 
  z-index: 0; 
}

.title {
  margin: 0;
  padding: 0;
  z-index: 1;
  position: relative;
  color: white;
}

.buttons {
  position: absolute;
  bottom: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  background: #444;
  color: #fff;
  border: none;
  cursor: pointer;
}

button:hover {
  background: #555;
}
</style>
