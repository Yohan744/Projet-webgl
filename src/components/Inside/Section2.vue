<template>
    <h1>Section 2</h1>
    <p>Content for section 2.</p>
    <div class="additional-content">
      <div class="three-columns">
        <div class="column">
          <img src="/src/assets/img/section1_photo.jpg" alt="Column 1 Image">
        </div>
        <div class="column">
          <img src="/src/assets/img/section1_photo.jpg" alt="Column 2 Image">
        </div>
        <div class="column">
          <img src="/src/assets/img/section1_photo.jpg" alt="Column 3 Image">
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Section2',
  methods: {
    handleButtonClick() {
      alert('Button clicked in section 2');
    }
  }
}
</script>

<style scoped>
.additional-content {
  margin-top: 20px;
}

.three-columns {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.column {
  flex: 1;
  padding: 10px;
  background: #f0f0f0;
  border-radius: 8px;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.column img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.buttons {
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  background: #444;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background: #555;
}

@media (max-width: 768px) {
  .three-columns {
    flex-direction: column;
  }

  .column {
    margin: 10px 0;
  }
}
</style>
