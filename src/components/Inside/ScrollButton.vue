<template>
    <button class="scroll-button" @click="scrollToTop">Scroll to Top</button>
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
  .scroll-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #444;
    border: none;
    color: #fff;
    padding: 10px 20px;
    cursor: pointer;
  }
  </style>
  