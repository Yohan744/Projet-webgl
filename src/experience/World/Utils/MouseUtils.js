import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export class MouseUtils {
    constructor(model, camera, pointer, renderer) {
        this.model = model;
        this.camera = camera;
        this.pointer = pointer;
        this.renderer = renderer;

        this.fakeCamera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.fakeCamera.position.copy(camera.position);

        this.controls = new OrbitControls(this.fakeCamera, renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableRotate = true;
        this.controls.target.copy(model.position);
        this.controls.update();

        this.pointer.on('click', this.onMouseDown.bind(this));
        this.pointer.on('movement', this.onMouseMove.bind(this));
        this.pointer.on('click-release', this.onMouseUp.bind(this));

        this.isDragging = false;
    }

    onMouseDown() {
        const intersects = this.pointer.raycaster.intersectObjects([this.model]);
        if (intersects.length > 0) {
            this.controls.enabled = true;
            this.isDragging = true;
        }
    }

    onMouseMove() {
        if (this.isDragging) {
            this.controls.update();
            this.model.quaternion.copy(this.fakeCamera.quaternion);
        }
    }

    onMouseUp() {
        this.isDragging = false;
    }

    destroy() {
        this.controls.dispose();
        this.pointer.off('click', this.onMouseDown);
        this.pointer.off('movement', this.onMouseMove);
        this.pointer.off('click-release', this.onMouseUp);
    }
}
