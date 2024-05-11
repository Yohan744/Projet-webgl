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
        this.isOpen = false; 
        this.pointer.on("click", this.handleClick.bind(this));
        this.group = new THREE.Group();
        this.init();
    }
    setDependencies(dahlia, letter, chestDrawer) {
        this.dahlia = dahlia;
        this.letter = letter;
        this.chestDrawer = chestDrawer;
    }

    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
        this.envelopModel.position.set(-3.5, 0, -4);
        this.envelopModel.rotateZ(Math.PI / 2);
      
        this.interactiveEnvelop = new MouseUtils(this.envelopModel, this.camera, this.pointer, this.renderer);
        this.scene.add(this.envelopModel);
    }
    handleClick(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel], true);
        if (intersects.length > 0) {
            if (this.chestDrawer.isOpen && !this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.envelopModel, this.camera);
                this.hasAnimatedToCamera = true;
                gsap.delayedCall(1.5, () => { 
                    this.createGroup();
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

    createGroup() {
        this.group = new THREE.Group();
        this.group.position.copy(this.envelopModel.position);
        console.log("Group position copied", this.group.position);
        this.group.add(this.envelopModel);
        this.group.add(this.dahlia.dahliaModel);
        this.group.add(this.letter.letterModel);
        this.envelopModel.position.set(0, 0, 0);
        this.dahlia.dahliaModel.position.set(0.3, 0, 0);
        this.letter.letterModel.position.set(0.6, 0, 0);
        this.scene.add(this.group);
        this.carousel = new Carousel(this.scene, this.camera, this.group);
    }
    
    destroy() {
        if (this.group) {
            this.scene.remove(this.group);
            this.group = null;
        }
    }
}