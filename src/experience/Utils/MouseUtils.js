import * as THREE from "three";
import Pointer from "./Pointer";

export class MouseUtils {
    constructor(model, camera) {
        this.model = model;
        this.camera = camera;
        this.pointer = new Pointer();
        this.isDragging = false;
        this.prevMousePosition = new THREE.Vector2();

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

    }

    onMouseDown(event) {
        const mouse = new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
        );
        this.pointer.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.model]);
        this.isDragging = true;
        if (intersects.length > 0) {
            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }

    onMouseMove(event) {
            const deltaX = event.clientX - this.prevMousePosition.x;
            const deltaY = event.clientY - this.prevMousePosition.y;
        if (this.isDragging) {
            const rotationSpeed = 0.005;
            this.model.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
            this.model.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }


    onMouseUp() {
        this.isDragging = false;
    }

    destroy() {
        window.removeEventListener('mousedown', this.onMouseDown);
         window.removeEventListener('mousemove', this.onMouseMove);
         window.removeEventListener('mouseup', this.onMouseUp);

        if (this.pointer && this.pointer.destroy) {
            this.pointer.destroy();
        }

        this.model = null;
        this.camera = null;
        this.pointer = null;
        this.prevMousePosition = null;
    }

}
