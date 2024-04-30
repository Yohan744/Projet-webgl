import * as THREE from "three";

export class MouseUtils {
    constructor(model, camera, pointer) {
        this.model = model;
        this.camera = camera;
        this.pointer = pointer;
        this.isDragging = false;
        this.prevMousePosition = new THREE.Vector2();

        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);

        this.pointer.on("movement", this.onMouseMove);
        this.pointer.on("pointerdown", this.onMouseDown);
        this.pointer.on("pointerup", this.onMouseUp);
    }

    onMouseDown(mouse) {
        console.log("MouseDown", mouse);
        this.pointer.raycaster.setFromCamera(mouse, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.model]);
        console.log("Intersects", intersects);
        if (intersects.length > 0) {
            this.isDragging = true;
            this.prevMousePosition.copy(mouse);
            console.log("Dragging started");
        }
    }

    onMouseMove(mouse) {
        if (this.isDragging) {
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
            console.log("Dragging stopped");
            this.isDragging = false;
        }
    }

    destroy() {
        this.pointer.off("movement", this.onMouseMove);
        this.pointer.off("pointerdown", this.onMouseDown);
        this.pointer.off("pointerup", this.onMouseUp);
    }
}
