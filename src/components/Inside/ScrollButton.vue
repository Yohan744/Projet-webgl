<template>
  <div class="scroll-button" @click="scrollToTop">
    <img src="/assets/images/arrow_bottom.png" alt="">
  </div>
</template>

<script>
export default {
  name: 'ScrollButton',
  methods: {
    scrollToTop() {
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }
}
</script>

<style lang="scss" scoped>

.scroll-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: none;
  border: none;
  color: #fff;
  padding: 10px 20px;
  cursor: pointer;

  img {
    position: relative;
    display: block;
    transform: rotate(180deg);
  }

}

</style>
  