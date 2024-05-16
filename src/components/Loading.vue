<template>
  <div class="loading-wrapper">
    <p>Loading {{progress}}%</p>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    progress: Number,
  },
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
  transition: opacity 2.5s ease-in-out;

  p {
    position: relative;
    width: fit-content;
    font-size: 30px;
    color: white;
    opacity: 0.5;
  }

}

</style>