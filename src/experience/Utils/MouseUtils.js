import * as THREE from "three";

export class MouseUtils {
    constructor(model, camera) {
        this.model = model;
        this.camera = camera;
        this.isDragging = false;
        this.prevMousePosition = new THREE.Vector2();

    }

    onMouseDown(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const intersects = raycaster.intersectObjects([this.model]);

        if (intersects.length > 0) {
            this.isDragging = true;
            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }

    onMouseMove(event) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.prevMousePosition.x;
            const deltaY = event.clientY - this.prevMousePosition.y;

            const rotationSpeed = 0.005;
            this.model.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
            this.model.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }
}
