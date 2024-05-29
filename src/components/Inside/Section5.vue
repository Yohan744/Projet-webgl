<template>
  <div class="new-section">
    <div class="left">
      <iframe src="https://open.spotify.com/embed/playlist/19tq2QerDNgEqwNLcSuwL3" width="300" height="480" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </div>
    <div class="right">
      <div class="image-container">
        <img src="/src/assets/img/section1_photo.jpg" alt="Image description">
      </div>
      <div class="text-container">
        <p>
          heritage
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NewSection',
}
</script>

<style scoped>
.new-section {
  display: flex;
  justify-content: space-between;
  padding: 20px;
}

.left {
  flex: 1;
  padding: 10px;
}

.right {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  width: 100%;
  margin-bottom: 15px;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.text-container {
  width: 100%;
  text-align: center;
}
</style>
