import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
//import { MouseUtils } from "../Utils/MouseUtils";
import { CameraUtils } from "../Utils/CameraUtils";
import { MouseUtils } from "../Utils/MouseUtils";

export default class Dahlia {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;
        this.isOpen = false; 
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1), 
            new THREE.MeshBasicMaterial({color: 0xff0000})
        );
        this.init();
    }
    
    setDependencies(envelop, chestDrawer) {
        this.envelop = envelop;
        this.chestDrawer = chestDrawer;
    }
    init() {
        this.dahliaModel = this.resources.items.dahliaModel.scene;
       // this.outline = new Outline(this.scene, this.dahliaModel, 0.05, 0xffffff);
       // this.interactiveDahlia = new MouseUtils(this.dahliaModel, this.camera, this.pointer);
        this.dahliaModel.position.set(-3.5, 0, -4);
        this.dahliaModel.rotateZ(Math.PI / 2);

           this.interactiveDahlia = new MouseUtils(this.dahliaModel, this.camera, this.pointer, this.renderer);
        this.scene.add(this.dahliaModel);
    }
    getModel() {
        return this.mesh;
    }

    handleClick(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.dahliaModel], true);
        console.log(this.dahliaModel.position)
        if (intersects.length > 0) {
            if (!this.hasAnimatedToCamera) {
                //this.positionEnvelopInFrontOfCamera();
                //this.hasAnimatedToCamera = true;
                CameraUtils.animateToCamera(this.dahliaModel, this.camera);
                this.hasAnimatedToCamera = true;
            }
        }
    }
   

    animateToPosition(x, y, z) {
        gsap.to(this.dahliaModel.position, {
            x: x,
            y: y,
            z: z,
            duration: 1, 
            onComplete: () => {
                console.log("Animation complete!");
            }
        });
    }
    appear(envelopPosition) {
        const offset = new THREE.Vector3(0, 0.3, 0); // Example offset
        const targetPosition = envelopPosition.clone().add(offset);
        return gsap.to(this.dahliaModel.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 1,
            onComplete: () => console.log("Dahlia appeared next to Envelop!")
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