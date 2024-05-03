import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
//import { MouseUtils } from "../Utils/MouseUtils";
import { CameraUtils } from "../Utils/CameraUtils";

export default class Dahlia {
    constructor(envelop) {
        this.envelop = envelop;
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
        this.dahliaModel = this.resources.items.dahliaModel.scene;
        this.outline = new Outline(this.scene, this.dahliaModel, 0.05, 0xffffff);
       // this.interactiveDahlia = new MouseUtils(this.dahliaModel, this.camera, this.pointer);
        this.dahliaModel.position.set(-3.5, 0, -4);
        this.dahliaModel.rotateZ(Math.PI / 2);
        this.scene.add(this.dahliaModel);
    }

    appear(envelopPosition) {
        const targetPosition = envelopPosition.clone(); 
        targetPosition.x += 1; 
        targetPosition.y += 0.5; 
        gsap.to(this.dahliaModel.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1,
            onComplete: () => {
                console.log("Dahlia appeared!");
            }
        });
    }

    returnToInitialPosition() {
        const initialPosition = new THREE.Vector3(-3.5, 0, -4); 
        gsap.to(this.dahliaModel.position, {
            x: initialPosition.x,
            y: initialPosition.y,
            z: initialPosition.z,
            duration: 1,
            onComplete: () => {
                console.log("Dahlia returned to initial position!");
            }
        });
    }



    destroy() {
        this.pointer.off("click");
        if (this.dahliaModel) {
            this.dahliaModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.dahliaModel);
        }
    }
}