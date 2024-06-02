<template>
  <div ref="parallaxSection" class="parallax-container">
    <div :class="{'fixed-center': isVisible, 'absolute-center': !isVisible}">
      <h3>Les années 80 selon Mona</h3>
      <h2 class="date">{{ currentYear }}</h2>
    </div>
    <div class="content">
      <div v-for="(year, index) in years" :key="year" class="year-section" :class="'year-section-' + index">
        <div class="media-container media-left" :class="'media-left-' + index">
          <div v-for="(media, i) in mediaData[year].left" :key="`left-${i}`" class="media-item">
            <component :is="media.type === 'video' ? 'iframe' : 'img'" :src="media.src" :alt="'Media ' + year + '-left-' + i" class="media-element"></component>
            <p>{{ media.text }}</p>
          </div>
        </div>
        <div class="media-container media-right" :class="'media-right-' + index">
          <div v-for="(media, i) in mediaData[year].right" :key="`right-${i}`" class="media-item">
            <component :is="media.type === 'video' ? 'iframe' : 'img'" :src="media.src" :alt="'Media ' + year + '-right-' + i" class="media-element"></component>
            <p>{{ media.text }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mediaData from '/src/assets/img/years/videoLinks.json';

gsap.registerPlugin(ScrollTrigger);

export default {
  name: "Section3",
  props: {
    isVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      years: Object.keys(mediaData),
      currentYear: 1980,
      mediaData
    };
  },
  mounted() {
    this.setupAnimations();
    this.adjustMediaSizes();
    window.addEventListener('resize', this.adjustMediaSizes);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.adjustMediaSizes);
  },
  methods: {
    setupAnimations() {
      const years = this.years;

      years.forEach((year, index) => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: `.year-section-${index}`,
            start: "top 80%", // Section starts to come into view
            end: "bottom 20%",   // Section is still in view
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
    adjustMediaSizes() {
      const mediaContainers = document.querySelectorAll('.media-container');
      mediaContainers.forEach(container => {
        const totalHeight = 80 * window.innerHeight / 100; 
        const textElements = container.querySelectorAll('p');
        let textHeight = 0;
        textElements.forEach(text => {
          textHeight += text.offsetHeight;
        });
        const mediaElements = container.querySelectorAll('.media-element');
        const availableHeight = totalHeight - textHeight - (20 * mediaElements.length);
        const mediaHeight = availableHeight / mediaElements.length;
        mediaElements.forEach(media => {
          media.style.maxHeight = `${mediaHeight}px`;
        });
      });
    }
  }
}
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
  font-size: 5rem;
  margin-top: 1rem;
  color: rgb(165, 165, 165);
}

.content {
  margin-top: 50vh;
}

.year-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  min-height: 30vh;
  padding: 0 5%;
  margin: 5vh 0;
}

.media-container {
  width: 40%;
  max-height: 80vh; 
  display: flex;
  flex-direction: column;
  align-items: center;
}

.media-item {
  margin-bottom: 20px;
}

.media-item iframe, .media-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain; 
}

@media (max-width: 768px) {
  .year-section {
    flex-direction: column;
  }

  .media-container {
    width: 80%;
    margin: 20px 0;
  }
}
</style>
