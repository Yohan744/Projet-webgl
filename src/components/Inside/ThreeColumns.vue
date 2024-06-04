<template>
    <div class="three-columns">
      <div ref="columnLeft" class="column column-left">
        <img :src="images.left" alt="Column 1 Image">
      </div>
      <div ref="columnCenter" class="column column-center">
        <img :src="images.center" alt="Column 2 Image">
      </div>
      <div ref="columnRight" class="column column-right">
        <img :src="images.right" alt="Column 3 Image">
      </div>
    </div>
  </template>
  
  <script>
  import { gsap } from "gsap";
  import { ScrollTrigger } from "gsap/ScrollTrigger";
  import { Draggable } from "gsap/Draggable";
  import { nextTick } from "vue";
  
  gsap.registerPlugin(ScrollTrigger, Draggable);
  
  export default {
    name: 'ThreeColumns',
    props: {
      images: {
        type: Object,
        required: true
      }
    },
    mounted() {
      nextTick(this.setupAnimations);
    },
    methods: {
      setupAnimations() {
        const columnLeft = this.$refs.columnLeft;
        const columnCenter = this.$refs.columnCenter;
        const columnRight = this.$refs.columnRight;
  
        const animation1 = gsap.fromTo(columnLeft, 
          { x: -100, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1, paused: true }
        );
        
        const animation2 = gsap.fromTo(columnCenter, 
          { x: 0, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1, delay: 0.5, paused: true }
        );
  
        const animation3 = gsap.fromTo(columnRight, 
          { x: 100, opacity: 0 }, 
          { x: 0, opacity: 1, duration: 1, delay: 1, paused: true }
        );
  
        ScrollTrigger.create({
          trigger: this.$el,
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
  
        ScrollTrigger.create({
          trigger: this.$el,
          start: "top 80%",
          onEnter: () => {
            Draggable.create([columnLeft, columnCenter, columnRight], {
              type: "x,y",
              edgeResistance: 0.65,
              bounds: this.$el,
              inertia: true,
              zIndexBoost: true
            });
          }
        });
      }
    }
  }
  </script>
  
  <style scoped>
  .three-columns {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin-bottom: 20px;
    position: relative;
    z-index: 3;
  }
  
  .column {
    height: 80vh;
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
  