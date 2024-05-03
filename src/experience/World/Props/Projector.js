import Experience from "../../Experience";
import * as THREE from "three";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";

export default class Projector {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.model = null;
        this.currentImageIndex = 0;
        this.images = [
            this.resources.items.images1,
            this.resources.items.images2,
            this.resources.items.images3,
        ];

        this.pointer = new Pointer();
        this.init();
    }

    init() {
        this.loadModel();
        this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        this.renderer.domElement.addEventListener('pointermove', this.handlePointerMove.bind(this));
        this.renderer.domElement.addEventListener('pointerup', this.handlePointerUp.bind(this));
        this.isCameraMoved = false;
    }

    loadModel() {
        this.projectorModel = this.resources.items.projectorModel.scene;
        this.projectorModel.scale.set(1, 1, 1);
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.outline = new Outline(this.projectorModel, 1.05);
        this.scene.add(this.projectorModel);
    }

    handlePointerDown() {
        const intersects = this.experience.pointer.raycaster.intersectObject(this.projectorModel, true);
        if (intersects.length > 0) {
            if (!this.isCameraMoved) {
                this.onModelClicked(intersects[0]);
                this.isCameraMoved = true;
            } else {
                this.isDragging = true;
            }
        }
    }

    handlePointerMove() {
        if (this.isDragging) {
            this.changePlaneImage();
        }
    }

    handlePointerUp() {
        this.isDragging = false;
    }
// Décale qui permet de placer une texture sur un objet 3D
    createDisplaySurface() {
        if (!this.displayPlane) {
            const geometry = new THREE.PlaneGeometry(0.48, 0.3);
            const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            this.displayPlane = new THREE.Mesh(geometry, material);
            this.displayPlane.position.set(-2.8, 1.7, 4.57);
            this.displayPlane.lookAt(this.camera.position);
            this.scene.add(this.displayPlane);
            this.updatePlaneImage();
        }
    }

    changePlaneImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updatePlaneImage();
    }

    updatePlaneImage() {
        const loader = new THREE.TextureLoader();
        const imagePath = this.images[this.currentImageIndex];

        loader.load(
            imagePath,
            texture => {
                if (this.displayPlane) {
                    texture.needsUpdate = true;
                    this.displayPlane.material.map = texture;
                    this.displayPlane.material.needsUpdate = true;
                }
            },
            undefined,
        );
    }

    onModelClicked(intersect) {
        this.outline.removeOutline();
        const offset = new THREE.Vector3(-1.3, 0.2, 0.5);
        const modelPosition = intersect.object.getWorldPosition(new THREE.Vector3());
        const targetPosition = modelPosition.clone().add(offset);

        this.experience.camera.lookAtSheet(targetPosition, () => {
            //this.createDisplaySurface();
        });
    }

    destroy() {
        this.pointer.off("click");
        this.outline.destroy()
        if (this.projectorModel) {
            this.projectorModel.traverse(child => {
                if (child.isMesh) {
                    child.material.dispose();
                    child.geometry.dispose();
                }
            });
            this.scene.remove(this.projectorModel);
        }
    }
}
