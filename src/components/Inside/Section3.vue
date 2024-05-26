<template>
  <div ref="parallaxSection" class="parallax-container">
    <div :class="{'fixed-center': isFixed, 'absolute-center': !isFixed}">
      <h1>Les années 80 selon Mona</h1>
      <div class="date">{{ currentYear }}</div>
    </div>
    <div class="content">
      <div v-for="(year, index) in years" :key="year" class="year-section" :class="'year-section-' + index">
        <div class="image-left" :class="'image-left-' + index">
          <img src="/src/assets/img/section1_photo.jpg" alt="Image {{ year }}-1">
        </div>
        <div class="image-right" :class="'image-right-' + index">
          <img src="/src/assets/img/section1_photo.jpg" alt="Image {{ year }}-2">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "ParallaxComponent",
  data() {
    return {
      years: Array.from({ length: 10 }, (_, i) => 1980 + i),
      currentYear: 1980,
      isFixed: false,
    };
  },
  mounted() {
    this.setupAnimations();
  },
  methods: {
    setupAnimations() {
      const years = this.years;

      ScrollTrigger.create({
        trigger: this.$refs.parallaxSection,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => this.isFixed = true,
        onLeave: () => this.isFixed = false,
        onEnterBack: () => this.isFixed = true,
        onLeaveBack: () => this.isFixed = false,
      });

      years.forEach((year, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: `.year-section-${index}`,
            start: "top center",
            end: "bottom center",
            scrub: true,
            onEnter: () => this.currentYear = year,
            onEnterBack: () => this.currentYear = year,
            invalidateOnRefresh: true,
          }
        });

        timeline
          .fromTo(`.image-left-${index}`, { y: 100, opacity: 0.05 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo(`.image-right-${index}`, { y: 100, opacity: 0.05 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4 }, "<")
          .to(`.image-left-${index}`, { y: -100, opacity: 0.05, duration: 0.5 })
          .to(`.image-right-${index}`, { y: -100, opacity: 0.05, duration: 0.5, delay: 0.4 }, "<");
      });
    },
  },
};
</script>

<style scoped>
.parallax-container {
  position: relative;
  width: 100%;
}

.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}

.absolute-center {
  position: absolute;
  top: -50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 2;
}

.date {
  font-size: 2rem;
  margin-top: 1rem;
}

.content {
  margin-top: 50vh; 
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 30vh; 
  padding: 0 5%; 
  margin: 5vh 0; 
}

.image-left, .image-right {
  width: 40%;
  display: flex;
  justify-content: center;
}

.image-left img, .image-right img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .year-section {
    flex-direction: column;
  }

  .image-left, .image-right {
    width: 80%;
    margin: 20px 0;
  }
}
</style>
