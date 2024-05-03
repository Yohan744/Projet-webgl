import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import * as THREE from "three";

export default class Pencil {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.hasMoved = false;

        this.init();
    }

    init() {
        this.pencilModel = this.resources.items.pencilModel.scene;
        this.pencilModel.scale.set(0.09, 0.09, 0.09);
        this.pencilModel.position.set(-3.2, 1.85, -4.85);
        this.scene.add(this.pencilModel);
        this.outline = new Outline(this.pencilModel, 0.1);

        this.pointer.on("click", (event) => this.handleClick(event));
    }

    handleClick(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.pencilModel], true);
        if (intersects.length > 0) {
            this.outline.removeOutline()
            // CameraUtils.animateToCamera(this.pencilModel, this.camera);
            this.hasMoved = true;
        }
        if(this.hasMoved) {
            this.pointer.trigger('pencilClick');
        }
    }

    destroy() {
        this.pointer.off("click");
        this.outline.destroy()
        if (this.pencilModel) {
            this.pencilModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.pencilModel);
        }
    }
}
