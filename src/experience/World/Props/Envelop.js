import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
//import { MouseUtils } from "../Utils/MouseUtils";
import { CameraUtils } from "../Utils/CameraUtils";
import Carousel from "./Carousel";
import { MouseUtils } from "../Utils/MouseUtils";

export default class Envelop {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;
        this.isOpen = false; // Instance of ChestDrawer class
        this.pointer.on("click", this.handleClick.bind(this));
        this.init();
    }
    setDependencies(dahlia, letter, chestDrawer) {
        this.dahlia = dahlia;
        this.letter = letter;
        this.chestDrawer = chestDrawer;
    }

    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
        //this.outline = new Outline(this.scene, this.envelopModel, 0.05, 0xffffff);
    this.envelopModel.position.set(-3.5, 0, -4);
        this.envelopModel.rotateZ(Math.PI / 2);
      
        this.interactiveEnvelop = new MouseUtils(this.envelopModel, this.camera, this.pointer, this.renderer);
        this.scene.add(this.envelopModel);
    }
    handleClick(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel], true);
        console.log(this.envelopModel.position)
        if (intersects.length > 0) {
            if (this.chestDrawer.isOpen && !this.hasAnimatedToCamera) {
                //this.positionEnvelopInFrontOfCamera();
                //this.hasAnimatedToCamera = true;
                CameraUtils.animateToCamera(this.envelopModel, this.camera);
                this.hasAnimatedToCamera = true;
                gsap.delayedCall(1.5, () => { 
                    this.triggerCarouselView();
                });
            }
        }
    }

    animateToPosition(x, y, z) {
        gsap.to(this.envelopModel.position, {
            x: x,
            y: y,
            z: z,
            duration: 1, 
            onComplete: () => {
                console.log("Animation complete!");
            }
        });
    }

    triggerCarouselView() {
    const basePosition = this.envelopModel.position.clone();

    let timeline = gsap.timeline();
    
    
    timeline.add(() => {
        const objects = [
            { model: this.envelopModel },
            { model: this.dahlia.getModel(), initialPosition: basePosition },
            { model: this.letter.getModel(), initialPosition: basePosition }
        ];
        
        const carousel = new Carousel(this.scene, this.camera, objects);
        carousel.alignItems();
        console.log("Carousel displayed.");
    });
    timeline.add(this.dahlia.appear(basePosition));
    timeline.add(this.letter.appear(basePosition), "-=0.5"); 
    
}

    
    


    destroy() {
        this.items.forEach(item => {
            item.visible = false; // ou this.scene.remove(item) si vous voulez les enlever complètement
        });
        document.getElementById('btn-left').removeEventListener('click', this.handleLeftClick);
        document.getElementById('btn-right').removeEventListener('click', this.handleRightClick);
   
        this.pointer.off("click");
        if (this.envelopModel) {
            this.envelopModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.envelopModel);
        }
    }
}