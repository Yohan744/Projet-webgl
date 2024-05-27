<template>
  <div>
    <div class="additional-content">
      <div class="three-columns">
        <div class="column column-left">
          <img src="/src/assets/img/section-2/Biarritz.png" alt="Column 1 Image">
        </div>
        <div class="column column-center">
          <img src="/src/assets/img/section-2/CartePostale.png" alt="Column 2 Image">
        </div>
        <div class="column column-right">
          <img src="/src/assets/img/section-2/Gouville.png" alt="Column 3 Image">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(ScrollTrigger, Draggable);

export default {
  name: 'Section2',
  mounted() {
    this.setupAnimations();
  },
  methods: {
    setupAnimations() {
      const animation1 = gsap.fromTo(".column-left", 
        { x: -100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, paused: true }
      );
      
      const animation2 = gsap.fromTo(".column-center", 
        { x: 0, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, delay: 0.5, paused: true }
      );

      const animation3 = gsap.fromTo(".column-right", 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1, delay: 1, paused: true }
      );

      ScrollTrigger.create({
        trigger: ".three-columns",
        start: "top 80%",
        onEnter: () => {
          animation1.restart();
          animation2.restart();
          animation3.restart();
        },
        onLeave: () => {
          animation1.reverse();
          animation2.reverse();
          animation3.reverse();
        },
        onEnterBack: () => {
          animation1.restart();
          animation2.restart();
          animation3.restart();
        },
        onLeaveBack: () => {
          animation1.reverse();
          animation2.reverse();
          animation3.reverse();
        }
      });

      // Setup Draggable after animations have completed
      ScrollTrigger.create({
        trigger: ".three-columns",
        start: "top 80%",
        onEnter: () => {
          Draggable.create(".column-left, .column-center, .column-right", {
            type: "x,y",
            edgeResistance: 0.65,
            bounds: ".three-columns",
            inertia: true,
            zIndexBoost: true
          });
        }
      });
    },
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
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 20px;
  position: relative;
}

.column {
  flex: 1;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
}

.column-left {
  margin-right: -100px;
  margin-top: 40px;
  z-index: 1;
}

.column-center {
  z-index: 2;
}

.column-right {
  margin-left: -100px;
  margin-top: 40px;
  z-index: 1;
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

  .column-left, .column-right {
    margin: 0;
    z-index: 1;
  }

  .column-center {
    z-index: 2;
  }
}
</style>
