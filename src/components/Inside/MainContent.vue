<template>
  <div class="main-content">
    <section id="section-0">
      <Section0 />
    </section>
    <section id="section-1">
      <Section1 />
    </section>
    <section id="section-2">
      <Section2 />
    </section>
    <section id="section-3">
      <Section3 />
    </section>
    <section id="section-4">
      <Section4 />
    </section>
    <section id="section-5">
      <Section5 />
    </section>
  </div>
</template>

<script>
import Section0 from './Section0.vue';
import Section1 from './Section1.vue';
import Section2 from './Section2.vue';
import Section3 from './Section3.vue';
import Section4 from './Section4.vue';
import Section5 from './Section5.vue';

export default {
  name: 'MainContent',
  components: {
    Section0,
    Section1,
    Section2,
    Section3,
    Section4,
    Section5
  },
  methods: {
    scrollToSection(index) {
      const section = document.getElementById(`section-${index}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>

<style scoped>

section {
  min-height: 100vh; 
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  color: black;
  background: white;
}
</style>
