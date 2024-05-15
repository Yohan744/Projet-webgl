import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import Experience from "../../Experience";

export class MouseUtils {
    constructor(mesh) {
        this.experience = new Experience();
        this.mesh = mesh;
        this.meshName = this.mesh.name.toLowerCase();
        this.camera = this.experience.camera.modes.default.instance;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;

        this.mouseDown = this.onMouseDown.bind(this);
        this.mouseMove = this.onMouseMove.bind(this);
        this.mouseUp = this.onMouseUp.bind(this);
        this.rafId = null;

        this.pointer.on('click', this.mouseDown);
        this.pointer.on('movement-orbit', this.mouseMove);
        this.pointer.on('click-release', this.mouseUp);

        this.isDragging = false;
        this.init()
    }

    init() {
        this.fakeCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5);
        this.fakeCamera.position.copy(this.camera.position);

        this.controls = new OrbitControls(this.fakeCamera, this.experience.targetElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.enableRotate = true;
        this.controls.enableDamping = true;
        this.controls.screenSpacePanning = false
        this.controls.target.copy(this.mesh.position);
    }

    onMouseDown() {
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && this.appStore.$state.isCameraOnSpot && this.appStore.$state.isInteractingWithObject && this.appStore.$state.isOrbitControlsEnabled) {
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
        if (this.meshName === this.appStore.$state.actualObjectInteractingName) {
            this.controls.update();
            this.mesh.quaternion.copy(this.fakeCamera.quaternion.conjugate());
        }
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
