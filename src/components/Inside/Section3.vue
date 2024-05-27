<template>
  <div ref="parallaxSection" class="parallax-container">
    <div :class="{'fixed-center': isFixed, 'absolute-center': !isFixed}">
      <h1>Les années 80 selon Mona</h1>
      <div class="date">{{ currentYear }}</div>
    </div>
    <div class="content">
      <div v-for="(year, index) in years" :key="year" class="year-section" :class="'year-section-' + index">
        <div class="media-left" :class="'media-left-' + index">
          <component :is="mediaComponents[index][0]" :src="mediaSources[index][0]" :alt="'Media ' + year + '-1'"></component>
        </div>
        <div class="media-right" :class="'media-right-' + index">
          <component :is="mediaComponents[index][1]" :src="mediaSources[index][1]" :alt="'Media ' + year + '-2'"></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import videoLinks from '/src/assets/img/years/videoLinks.json';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "ParallaxComponent",
  data() {
    return {
      years: Array.from({ length: 10 }, (_, i) => 1980 + i),
      currentYear: 1980,
      isFixed: false,
      mediaComponents: Array.from({ length: 10 }, () => ['', '']),
      mediaSources: Array.from({ length: 10 }, () => ['', '']),
    };
  },
  async mounted() {
    await this.loadMedia();
    this.setupAnimations();
  },
  methods: {
    async loadMedia() {
      const promises = this.years.map((year, index) => {
        return Promise.all([
          this.loadMediaSource(year, 1).then(({ component, src }) => {
            this.mediaComponents[index][0] = component;
            this.mediaSources[index][0] = src;
          }),
          this.loadMediaSource(year, 2).then(({ component, src }) => {
            this.mediaComponents[index][1] = component;
            this.mediaSources[index][1] = src;
          })
        ]);
      });
      await Promise.all(promises);
    },
    async loadMediaSource(year, index) {
      try {
        const videoLink = videoLinks[year] && videoLinks[year][index];
        if (videoLink) {
          return { component: 'iframe', src: videoLink };
        } else {
          const imagePath = `/src/assets/img/years/${year}-${index}.png`;
          const image = await import(/* @vite-ignore */ imagePath).catch(() => null);
          if (image) {
            return { component: 'img', src: image.default };
          } else {
            throw new Error(`No media found for year ${year}, index ${index}`);
          }
        }
      } catch (error) {
        console.error(`Error loading media ${year}-${index}:`, error);
        return { component: 'div', src: '' };
      }
    },
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
          .fromTo(`.media-left-${index}`, { y: 100, opacity: 0.05 }, { y: 0, opacity: 1, duration: 0.5 })
          .fromTo(`.media-right-${index}`, { y: 100, opacity: 0.05 }, { y: 0, opacity: 1, duration: 0.5, delay: 0.4 }, "<")
          .to(`.media-left-${index}`, { y: -100, opacity: 0.05, duration: 0.5 })
          .to(`.media-right-${index}`, { y: -100, opacity: 0.05, duration: 0.5, delay: 0.4 }, "<");
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

.media-left, .media-right {
  width: 40%;
  display: flex;
  justify-content: center;
}

.media-left img, .media-right img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .year-section {
    flex-direction: column;
  }

  .media-left, .media-right {
    width: 80%;
    margin: 20px 0;
  }
}
</style>
