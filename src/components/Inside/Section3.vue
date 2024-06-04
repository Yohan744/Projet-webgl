<template>
  <div ref="parallaxSection" class="parallax-container general-padding">
    <div :class="{'fixed-center': isVisible, 'absolute-center': !isVisible}">
      <h3>Les années 80 selon Mona</h3>
      <h2 class="date">{{ currentYear }}</h2>
    </div>
    <div class="content">
      <div v-for="(year, index) in years" :key="year" class="year-section" :class="'year-section-' + index">
        <div :class="['media-container', 'media-left', `media-left-${index}`, mediaData[year].left.length === 2 ? 'two-items' : '', mediaData[year].left.length === 3 ? 'three-items' : '']">
          <div v-for="(media, i) in mediaData[year].left" :key="`left-${i}`" class="media-item" @mouseover="handleMouseOver" @mouseleave="handleMouseOut" @mousemove="handleMouseMove">
            <component :is="media.type === 'video' ? 'iframe' : 'img'" :src="media.src" :alt="'Media ' + year + '-left-' + i" class="media-element"></component>
            <p>{{ media.text }}</p>
          </div>
        </div>
        <div :class="['media-container', 'media-right', `media-right-${index}`, mediaData[year].right.length === 2 ? 'two-items' : '', mediaData[year].right.length === 3 ? 'three-items' : '']">
          <div v-for="(media, i) in mediaData[year].right" :key="`right-${i}`" class="media-item" @mouseover="handleMouseOver" @mouseleave="handleMouseOut" @mousemove="handleMouseMove">
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
import mediaData from '/src/assets/img/years/videoLinksVideoGetty.json';

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
            start: "top 80%", 
            end: "bottom 20%",  
            scrub: true,
            onEnter: () => this.currentYear = year,
            onEnterBack: () => this.currentYear = year,
            invalidateOnRefresh: true,
          }
        });

        timeline
        .fromTo(`.media-left-${index}`, { y: 100, opacity: 0.05 }, { y: -50, opacity: 1, duration: 0.25 })
        .fromTo(`.media-right-${index}`, { y: 100, opacity: 0.05 }, { y: -150, opacity: 1, duration: 0.25, delay: 0.7 }, "<")
        .to(`.media-left-${index}`, { y: -200, opacity: 0.05, duration: 0.25 })
        .to(`.media-right-${index}`, { y: -250, opacity: 0.05, duration: 0.25, delay: 0.7 }, "<");
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
    },
    handleMouseOver(event) {
      if (window.innerWidth >= 768) {
        const mediaItem = event.currentTarget;
        mediaItem.style.transform = 'scale(1.5)';
        mediaItem.style.opacity = 1;
        mediaItem.style.zIndex = 10;
      }
    },
    handleMouseOut(event) {
      if (window.innerWidth >= 768) {
        const mediaItem = event.currentTarget;
        mediaItem.style.transform = 'scale(1)';
        mediaItem.style.opacity = 0.8; 
        mediaItem.style.zIndex = 1;
      }
    },
    handleMouseMove(event) {
      if (window.innerWidth >= 768) {
        const mediaItem = event.currentTarget;
        const rect = mediaItem.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        mediaItem.style.transform = `scale(1.5) translate(${x}px, ${y}px)`;
      }
    }
  }
}
</script>

<style scoped>

.general-padding {
  padding: 200px
}
@media (max-width: 1200px) {
  .general-padding {
  padding: 100px
  }
}
@media (max-width: 1024px) {
  .general-padding {
  padding: 80px
  }
}
@media (max-width: 768px) {
  .general-padding {
  padding: 20px
  }
}

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
  min-height: 100vh;
  padding: 0 5%;
  margin: 5vh 0;
  align-items: center
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
  transition: transform 0.3s ease, opacity 0.3s ease, z-index 0.3s ease;
  opacity: 0.8; 
}

.media-item iframe, .media-item img {
  width: 100%;
  height: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain; 
}

iframe {
    min-height: 400px;
    min-width: 400px;
  }

@media (max-width: 1200px) {
  .media-container {
    width: 60%;
    margin: 20px 0;
  }
  
  iframe {
    min-height: 300px;
    min-width: 300px;
  }
}
@media (max-width: 1024px) {
  .media-container {
    width: 40%;
    margin: 20px 0;
  }
  iframe {
    min-height: 200px;
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .year-section {
    flex-direction: column;
  }

  .media-container {
    width: 80%;
    margin: 20px 0;
  }

  .media-item {
    pointer-events: none; 
  }
  iframe {
    min-height: 100px;
    min-width: 100px;
  }


}


.two-items .media-item:nth-child(1) {
  transform: translateX(50px);
  transform: translateY(40px);
  left: 15px;
}

.two-items .media-item:nth-child(2) {
  transform: translateX(-50px);
  left: -15px;

}

.three-items{
  display: ruby;
}


</style>
