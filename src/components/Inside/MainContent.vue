<template>
  <div class="main-content">
    <section v-for="(section, index) in sections" :key="index" :id="`section-${index}`" ref="sections">
      <component :is="section" :is-visible="isSectionVisible(index)" />
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
import Section6 from './Section6.vue';

export default {
  name: 'MainContent',
  components: {
    Section0,
    Section1,
    Section2,
    Section3,
    Section4,
    Section5,
    Section6,
  },
  data() {
    return {
      sections: ['Section0', 'Section1', 'Section2', 'Section3', 'Section4', 'Section5', 'Section6'],
      activeSection: 0,
      sectionToTabMapping: {
        0: 0,
        1: 1,
        2: 2,
        3: 2,
        4: 3,
        5: 3,
        6: 4,
      },
      tabToSectionMapping: {
        0: 0,
        1: 1,
        2: 2,
        3: 4,
        4: 6
      }
    };
  },
  methods: {
    scrollToSection(index) {
      const sectionIndex = this.tabToSectionMapping[index];
      const section = document.getElementById(`section-${sectionIndex}`);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    },
    handleScroll() {
      let activeSection = null;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop === 0) {
        activeSection = 0;
      } else {
        this.$refs.sections.forEach((section, index) => {
          const rect = section.getBoundingClientRect();
          const sectionMidpoint = rect.top + rect.height / 2;
          const viewportHeight = window.innerHeight;

          if (
            (rect.top >= 0 && rect.bottom <= viewportHeight) ||
            (rect.top < 0 && rect.bottom > viewportHeight / 2)
          ) {
            activeSection = index;
          }
        });
      }

      if (activeSection !== this.activeSection) {
        this.activeSection = activeSection;
        const activeTab = this.sectionToTabMapping[activeSection];
        this.$emit('update-active-section', activeTab);
      }

      this.updateHeaderTheme();
    },
    isSectionVisible(index) {
      return this.activeSection === index;
    },
    updateHeaderTheme() {
      const header = this.$root.$refs.headerBanner;
      if (header) {
        header.isDarkTheme = this.activeSection === 0 && (window.scrollY || document.documentElement.scrollTop) <= 50;
      }
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
</script>


<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
}
section {
  min-height: 100vh;
  overflow: hidden;
}
</style>

