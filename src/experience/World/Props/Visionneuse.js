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
        this.model = null;

        this.pointer = new Pointer();
        this.init();
    }

    init() {

        this.loadModel();
        this.renderer.domElement.addEventListener('pointerdown', this.handleVisionneuseClick.bind(this));
        this.isCameraMoved = false;
    }

    loadModel() {
        this.visionneuseModel = this.resources.items.visionneuseModel.scene;
        this.visionneuseModel.scale.set(1, 1, 1);
        this.visionneuseModel.position.set(-3.8, 1.4, 4.5);
        this.outline = new Outline(this.scene, this.visionneuseModel, 0.05, 0xffffff);
        this.scene.add(this.visionneuseModel);
    }


    handleVisionneuseClick() {
        if (!this.isCameraMoved) {
            const intersects = this.experience.pointer.raycaster.intersectObject(this.visionneuseModel, true);
            if (intersects.length > 0) {
                this.onModelClicked(intersects[0]);
            }
        }
    }

    onModelClicked(intersect) {
        this.outline.removeOutline();
        const offset = new THREE.Vector3(-0.9, 0.3, 0);
        const modelPosition = intersect.object.getWorldPosition(new THREE.Vector3());
        const targetPosition = modelPosition.clone().add(offset);

        this.experience.camera.moveToVisionneuse(targetPosition);
        this.isCameraMoved = true;
    }


    destroy() {
        this.pointer.off("click");
        if (this.visionneuseModel) {
            this.scene.remove(this.visionneuseModel);
        }
    }
}
