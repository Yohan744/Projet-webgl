import Experience from "../../Experience";

export default class Walkman {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.init();
    }

    init() {
        this.walkmanModel = this.resources.items.walkmanModel.scene;
        this.walkmanModel.scale.set(0.04, 0.04, 0.04);
        this.walkmanModel.position.set(3.8, 1.3, -2.5);
        this.scene.add(this.walkmanModel);
    }

    destroy() {
        this.walkmanModel.traverse(child => {
            if (child.isMesh) {
                child.material.dispose();
                child.geometry.dispose();
            }
        });
        this.scene.remove(this.walkmanModel);
    }

}