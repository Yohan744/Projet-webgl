import * as THREE from "three";

export class HoverOutline {
    constructor(model, scene) {
        this.model = model;
        this.scene = scene;
        this.outlineMesh = null;
    }

    createPermanentOutline(model, scene) {
        const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        outlineMaterial.depthWrite = false;

        const boundingBox = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        boundingBox.getSize(size);

        const outlineGeometry = new THREE.BoxGeometry(size.x * 1.0, size.y * 0.6, size.z * 1.01);
        const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
        outlineMesh.position.copy(boundingBox.getCenter(new THREE.Vector3()));
        scene.add(outlineMesh);

        this.outlineMesh = outlineMesh;
        return outlineMesh;
    }


    destroy() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh.geometry.dispose();
            this.outlineMesh.material.dispose();
            this.outlineMesh = null;
        }

        this.model = null;
        this.scene = null;
    }

}