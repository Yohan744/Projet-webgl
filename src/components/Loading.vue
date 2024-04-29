<template>
  <div class="loading-wrapper">
    <p>Loading ...</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
}
</script>

<style scoped lang="scss">

.loading-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  height: 100dvh;
  width: 100dvw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  transition: opacity 1s ease-in-out;

  p {
    position: relative;
    width: fit-content;
    font-size: 30px;
    color: white;
    opacity: 0.5;
  }

}

</style>