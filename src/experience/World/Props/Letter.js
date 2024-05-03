import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
//import { MouseUtils } from "../Utils/MouseUtils";
import { CameraUtils } from "../Utils/CameraUtils";

export default class Letter {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;
        this.isOpen = false; 

        this.init();
    }

    init() {
        this.letterModel = this.resources.items.letterModel.scene;
        this.outline = new Outline(this.scene, this.letterModel, 0.05, 0xffffff);
       // this.interactiveLetter = new MouseUtils(this.letterModel, this.camera, this.pointer);
        this.letterModel.position.set(-3.5, 0, -4);
        this.letterModel.rotateZ(Math.PI / 2);
        this.scene.add(this.letterModel);
    }

    animateToPosition(x, y, z) {
        gsap.to(this.letterModel.position, {
            x: x,
            y: y,
            z: z,
            duration: 1, 
            onComplete: () => {
                console.log("Animation complete!");
            }
        });
    }

    destroy() {
        this.pointer.off("click");
        if (this.letterModel) {
            this.letterModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.letterModel);
        }
    }
}