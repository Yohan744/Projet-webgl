<template>
  <div class="section-content">
    <h1>Section 5</h1>
    <p>Content for section 5.</p>
    <div class="additional-content">
      <div class="image-container">
      </div>
      <div class="text-container">
        <p>Additional content for section 5.</p>
      </div>
      <div class="buttons">
        <button @click="handleButtonClick">Click Me</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Section5',
  methods: {
    handleButtonClick() {
      alert('Button clicked in section 5');
    }
  }
}
</script>

<style scoped>
</style>
