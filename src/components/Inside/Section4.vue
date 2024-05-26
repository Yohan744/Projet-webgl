<template>
  <div class="section-content">
    <h1>Section 4</h1>
    <p>Content for section 4.</p>
    <div class="additional-content">
      <div class="image-container">
      </div>
      <div class="text-container">
        <p>Additional content for section 4.</p>
      </div>
      <div class="buttons">
        <button @click="handleButtonClick">Click Me</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section4',
  methods: {
    handleButtonClick() {
      alert('Button clicked in section 4');
    }
  }
}
</script>

<style scoped>
</style>
