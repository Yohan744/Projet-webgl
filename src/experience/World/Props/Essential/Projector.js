import * as THREE from "three";
import Experience from "../../../Experience";

export default class Projector {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer.instance;
        this.clock = new THREE.Clock();
        this.animations = [];
        this.textures = [
            this.experience.resources.items.monasurf,
            this.experience.resources.items.monabouquet,
            this.experience.resources.items.backgroundTreeTexture
        ];
        this.textureIndex = 0;
        this.init();
    }

    init() {
        this.projectorModel = this.experience.resources.items.projectorModel.scene;
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.scene.add(this.projectorModel);

        this.experience.pointer.on('click', this.onPointerDown.bind(this), false);
        this.experience.pointer.on('movement', this.onPointerMove.bind(this), false);
        this.experience.pointer.on('click-release', this.onPointerUp.bind(this), false);

        this.dragging = false;
        this.animate();
    }

    onPointerDown() {
        const mousePosition = this.experience.pointer.getMousePosition();
        this.experience.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.experience.pointer.raycaster.intersectObjects([this.projectorModel], true);

        if (intersects.length > 0 && intersects[0].object.name === 'tireuse') {
            this.dragging = true;
            this.draggableModel = intersects[0].object;
            this.startY = mousePosition.y;
            this.startZ = this.draggableModel.position.z;
            console.log(`dragging a commencé  Z: ${this.startZ}`);
        }
    }

    onPointerMove() {
        if (!this.dragging || !this.draggableModel) return;

        const currentMouseY = this.experience.pointer.getMousePosition().y;
        const deltaY = currentMouseY - this.startY;
        const newZ = this.startZ + deltaY * 0.01;
        this.draggableModel.position.z = THREE.MathUtils.clamp(newZ, 0, 0.5);
        console.log(`deltaY: ${deltaY}, newZ: ${newZ}, clampedZ: ${this.draggableModel.position.z}`);
        this.startY = currentMouseY;
    }

    onPointerUp() {
        if (this.dragging) {
            console.log(`relaché Z: ${this.draggableModel.position.z}`);
            this.dragging = false;
            this.draggableModel = null;
        }
    }


    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}
