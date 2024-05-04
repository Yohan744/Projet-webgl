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

        this.mouseDown = this.onMouseDown.bind(this);
        this.mouseMove = this.onMouseMove.bind(this);
        this.mouseUp = this.onMouseUp.bind(this);
        this.rafId = null;

        this.pointer.on('click', this.mouseDown);
        this.pointer.on('movement', this.mouseMove);
        this.pointer.on('click-release', this.mouseUp);

        this.isDragging = false;
    }

    onMouseDown() {
        const intersects = this.pointer.raycaster.intersectObjects([this.model], true);
        if (intersects.length > 0) {
            this.isDragging = true;
            this.controls.enabled = true;
            this.update();
        }
    }


    onMouseMove() {
        if (this.isDragging) {
            requestAnimationFrame(this.update);
        }
    }


    update = () => {
            this.controls.update();
            this.model.quaternion.copy(this.fakeCamera.quaternion.conjugate());

    }
        onMouseUp() {
        this.isDragging = false;
        cancelAnimationFrame(this.rafId);
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
        this.controls.dispose();
        this.pointer.off('click', this.mouseDown);
        this.pointer.off('movement', this.mouseMove);
        this.pointer.off('click-release', this.mouseUp);
    }
}
