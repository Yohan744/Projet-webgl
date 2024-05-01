import * as THREE from "three";

export class MouseUtils {
    constructor(model, camera, pointer) {
        this.model = model;
        this.camera = camera;
        this.pointer = pointer;
        this.isDragging = false;
        this.prevMousePosition = new THREE.Vector2();
        this.mouse = {x: 0, y: 0};

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.pointer.on("movement", this.onMouseMove);
        this.pointer.on("click", this.onMouseDown);
        this.pointer.on("click-release", this.onMouseUp);
    }

    onMouseDown() {
        const intersects = this.pointer.raycaster.intersectObjects([this.model]);
        if (intersects.length > 0) {
            this.isDragging = true;
            this.prevMousePosition.copy(this.pointer.getMousePosition());
        }
    }

    onMouseMove() {
        if (this.isDragging) {
            let mouse = this.pointer.getMousePosition();
            const deltaX = (mouse.x - this.prevMousePosition.x) * window.innerWidth;
            const deltaY = (mouse.y - this.prevMousePosition.y) * window.innerHeight;

            const rotationSpeed = 0.002;
            this.model.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
            this.model.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), -deltaY * rotationSpeed);

            this.prevMousePosition.copy(mouse);
        }
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
        }
    }

    destroy() {
        this.pointer.off("movement", this.onMouseMove);
        this.pointer.off("click", this.onMouseDown);
        this.pointer.off("click-release", this.onMouseUp);
    }
}
