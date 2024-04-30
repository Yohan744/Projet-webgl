import * as THREE from "three";

export class Outline {
    constructor(model, scene) {
        this.model = model;
        this.scene = scene;
        this.outlineMeshes = [];

        this.initOutline();
    }

    initOutline() {
    }

    destroy() {
        this.outlineMeshes.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.outlineMeshes = [];
    }
}
