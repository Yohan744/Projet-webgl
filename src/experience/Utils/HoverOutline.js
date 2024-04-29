import * as THREE from "three";

export class HoverOutline {
    constructor(model, scene, showOutline) {
        this.model = model;
        this.scene = scene;
        this.outlineMesh = null;
        this.showOutline = showOutline;
    }

     onHover(intersect, scene) {
        const showOutline = true;
        let outlineMesh = null;

        if (showOutline && !outlineMesh) {
            const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.BackSide });
            outlineMaterial.depthWrite = false;

            const boundingBox = new THREE.Box3().setFromObject(intersect.object);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            const outlineGeometry = new THREE.BoxGeometry(size.x * 1.02, size.y * 1.01, size.z * 1.01);
            outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
            outlineMesh.position.copy(boundingBox.getCenter(new THREE.Vector3()));
            scene.add(outlineMesh);
        }

        return outlineMesh;
    }

    onHoverExit() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh = null;
        }
    }

    destroy() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);

            if (this.outlineMesh.geometry) {
                this.outlineMesh.geometry.dispose();
            }
            if (this.outlineMesh.material) {
                this.outlineMesh.material.dispose();
            }

            this.outlineMesh = null;
        }

        this.model = null;
        this.scene = null;
    }

}