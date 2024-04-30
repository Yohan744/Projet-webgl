import * as THREE from 'three';
import { LineSegments, LineBasicMaterial, EdgesGeometry } from 'three';

export default class Outline {
    constructor(scene, model, thickness = 0.01, outlineColor = 0xffffff) {
        this.scene = scene;
        this.model = model;
        this.thickness = thickness;
        this.outlineColor = outlineColor;
        this.outlineMeshes = [];
        this.initOutline();
    }

    initOutline() {
        this.model.traverse(child => {
            if (child.isMesh) {
                this.createOutlineMesh(child);
            }
        });
    }

    createOutlineMesh(mesh) {
        const edgesGeometry = new EdgesGeometry(mesh.geometry, 1); // Threshold angle for edge detection
        const lineMaterial = new LineBasicMaterial({ color: this.outlineColor, linewidth: this.thickness });
        const edgeLines = new LineSegments(edgesGeometry, lineMaterial);

        // Retrieve and apply the world position, rotation, and scale
        const position = new THREE.Vector3();
        const quaternion = new THREE.Quaternion();
        const scale = new THREE.Vector3();

        mesh.getWorldPosition(position);
        mesh.getWorldQuaternion(quaternion);
        mesh.getWorldScale(scale);

        edgeLines.position.copy(position);
        edgeLines.quaternion.copy(quaternion);
        edgeLines.scale.copy(scale);

        this.scene.add(edgeLines);
        this.outlineMeshes.push(edgeLines);
    }

    removeOutline() {
        this.outlineMeshes.forEach(mesh => {
            this.fadeOutOutline(mesh);
        });
    }

    fadeOutOutline(mesh) {
        const duration = 100;
        const endTime = performance.now() + duration;
        const startOpacity = mesh.material.opacity;

        const fade = () => {
            const now = performance.now();
            const timeLeft = endTime - now;

            if (timeLeft <= 0) {
                this.scene.remove(mesh);
                mesh.geometry.dispose();
                mesh.material.dispose();
            } else {
                mesh.material.opacity = startOpacity * (timeLeft / duration);
                requestAnimationFrame(fade);
            }
        };

        requestAnimationFrame(fade);
    }
}