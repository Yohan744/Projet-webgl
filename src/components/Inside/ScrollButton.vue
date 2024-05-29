<template>
    
    <button class="scroll-button" @click="scrollToTop"><img src="/src/assets/img/arrow_bottom.png" alt=""></button>
  </template>
  
  <script>
  export default {
    name: 'ScrollButton',
    methods: {
      scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }
  </script>
  
  <style scoped>
  img {
    display: block;
    transform: rotate(180deg);
  }
  .scroll-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: none;
    border: none;
    color: #fff;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  