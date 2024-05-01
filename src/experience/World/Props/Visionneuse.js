import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";

export default class Visionneuse {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;

        this.pointer.on('click', this.handleVisionneuseClick.bind(this));
        this.isCameraMoved = false;
        this.init();
    }

    init() {
        this.visionneuseModel = this.resources.items.visionneuseModel.scene;
        this.visionneuseModel.position.set(-3.8, 1.15, 4.5);
        this.outline = new Outline(this.scene, this.visionneuseModel, 0.05, 0xffffff);
        this.scene.add(this.visionneuseModel);
    }


    handleVisionneuseClick() {
        if (!this.isCameraMoved && this.appStore.$state.isCameraOnSpot) {
            const intersects = this.experience.pointer.raycaster.intersectObject(this.visionneuseModel, true);
            if (intersects.length > 0) {
                this.onModelClicked();
            }
        }
    }

    onModelClicked() {
        this.outline.removeOutline();
        this.experience.camera.lookAtSheet();
        this.isCameraMoved = true;
    }


    destroy() {
        this.pointer.off("click");
        if (this.visionneuseModel) {
            this.visionneuseModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.visionneuseModel);
        }
    }
}
