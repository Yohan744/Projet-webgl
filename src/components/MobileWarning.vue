<template>

  <div ref="mobileWarningWrapper" id="mobile-warning-wrapper">

    <p class="text">Ce projet a été réalisé dans le but d'être testé sur ordinateur, ainsi, la qualité de l'expérience peut-être diminuée.</p>

    <div class="cta" @click="handleButtonClick">
      <p>Compris</p>
    </div>

  </div>

</template>

<script setup>

import {ref} from "vue";

const mobileWarningWrapper = ref(null);

function handleButtonClick() {
  mobileWarningWrapper.value.classList.add("hidden");
}


</script>

<style lang="scss" scoped>

#mobile-warning-wrapper {
  position: fixed;
  height: 100vh; // fallback
  height: 100dvh;
  width: 100vw; // fallback
  width: 100dvw;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10;

  @media screen and (min-width: 576px) and (min-height: 576px) {
    display: none;
    z-index: -10;
    pointer-events: none;
  }

  &.hidden {
    display: none;
    z-index: -10;
    pointer-events: none;
  }

  .text {
    position: relative;
    font-family: "SometypeMono", sans-serif;
    font-size: 20px;
    line-height: 1.3;
    text-align: center;
    color: white;
  }

  .cta {
    position: relative;
    margin-top: 70px;
    padding: 10px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
    background: #88c590;

    p {
      position: relative;
      font-family: "SometypeMono", sans-serif;
      font-size: 15px;
      color: white;
    }

  }

}

</style>