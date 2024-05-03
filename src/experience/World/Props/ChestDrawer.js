import Experience from "../../Experience";
import * as THREE from "three";

export default class ChestDrawer {
    constructor(envelop) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.appStore = this.experience.appStore;
        this.pointer = this.experience.pointer;
        this.envelop = envelop;
        this.pointer.on("click", this.handleClick.bind(this));
        this.isCameraMoved = false;

        console.log(this.camera);
        this.isOpen = false;

        this.init();
    }

    init() {
        this.chestDrawerModel = this.resources.items.chestDrawerModel.scene;
        this.chestDrawerModel.position.set(-3.5, 0, -4);
        this.chestDrawerModel.traverse((child) => {
            if (child.name === "tirroir-haut") {
                child.userData.clickable = true;
                this.tirroirHaut = child;
            }
        });
        this.scene.add(this.chestDrawerModel);
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObjects([this.chestDrawerModel], true);
        const tiroirHautClicked = intersects.find(intersect => intersect.object === this.tirroirHaut);

        if (tiroirHautClicked) {
            if (!this.isOpen) {
                this.animateDrawer(this.tirroirHaut, () => {
                    this.isOpen = true;
                    this.envelopAppear();
                    this.envelop.isOpen = true;
                    this.experience.camera.moveCameraAboveObject(this.tirroirHaut, 2);
                    this.isCameraMoved = true;
                });
            } else {
               /* this.envelopReturn();
                this.envelop.isOpen = false;
                this.animateDrawerClose(this.tirroirHaut, () => {
                    this.isOpen = false;
                });*/
            }
        }
    }

    animateDrawer(drawer, callback) {
        const targetPositionX = drawer.position.x + 0.5;
        this.animateProperty(drawer.position, 'x', targetPositionX, () => {
            if (callback) callback();
        });
    }

    animateDrawerClose(drawer, callback) {
        const targetPositionX = drawer.position.x - 0.5;
        this.animateProperty(drawer.position, 'x', targetPositionX, callback);
    }

    animateProperty(obj, prop, target, callback) {
        const step = (target - obj[prop]) / 100;
        function animateStep() {
            if (Math.abs(obj[prop] - target) > Math.abs(step)) {
                obj[prop] += step;
                requestAnimationFrame(animateStep);
            } else {
                obj[prop] = target;
                if (callback) callback();
            }
        }
        animateStep();
    }

    envelopAppear() {
        const position = new THREE.Vector3();
        this.tirroirHaut.getWorldPosition(position);
        this.envelop.animateToPosition(position.x - 0.5, position.y, position.z);
    }
    
    /* 
    envelopReturn() {
        const initialPosition = new THREE.Vector3(-3.5, 0, -4);
        this.envelop.animateToPosition(initialPosition.x, initialPosition.y, initialPosition.z);
    }
*/

    destroy() {
        this.pointer.off("click");
        this.scene.remove(this.chestDrawerModel);
    }
}