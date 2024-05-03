import * as THREE from "three";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";

export default class Malle {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.mixer = null;

        this.init();
    }

    init() {
        this.malleModel = this.resources.items.malleModel.scene;
        this.malleModel.scale.set(1, 1, 1);
        this.malleModel.position.set(-1.2, 0.5, 3.85);

        this.malleModel.rotation.y = Math.PI;

        // this.scene.add(this.malleModel);
        // this.outline = new Outline(this.malleModel, 1.02);

        if (this.malleModel.animations && this.malleModel.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.malleModel);
            const action = this.mixer.clipAction(this.malleModel.animations[0]);
            action.play();
        }
    }

    update(deltaTime) {
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
    }

    destroy() {
        this.pointer.off("click");
        this.outline.destroy()
        if (this.malleModel) {
            this.malleModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.malleModel);
        }
    }
}
