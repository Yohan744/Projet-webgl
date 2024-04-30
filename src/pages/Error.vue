<template>
  <section id="errorWrapper">
    <h1>Page not found</h1>
    <router-link to="/">Go back to home</router-link>
  </section>
</template>

<script>
export default {
  head() {
    return {
      name: 'ErrorPage',
    }
  }
}
</script>