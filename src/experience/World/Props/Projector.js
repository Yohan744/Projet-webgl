import Experience from "../../Experience";
import * as THREE from "three";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
import {FrontSide, Mesh, MeshStandardMaterial} from "three";
import Projections from "./Projections";
import {MouseUtils} from "../Utils/MouseUtils";

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
            this.resources.items.monasurf,
            this.resources.items.monabouquet,
        ];
        this.pointer = new Pointer();
        this.init();
        this.setupSpotlight();
        this.setupProjection();

    }

    init() {
        this.loadModel();
        this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        this.isCameraMoved = false;
    }

    loadModel() {
        this.projectorModel = this.resources.items.projectorModel.scene;
        this.projectorModel.scale.set(1, 1, 1);
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.scene.add(this.projectorModel);
    }

    setupSpotlight() {
        this.spotlight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI * 0.2);
        this.spotlight.position.copy(this.projectorModel.position).add(new THREE.Vector3(0.1, 0.08, 0));
        this.spotlight.target.position.set(this.projectorModel.position.x + 5, this.projectorModel.position.y, this.projectorModel.position.z);
        this.scene.add(this.spotlight.target);
        this.scene.add(this.spotlight);
    }

    handlePointerDown(event) {
        const intersects = this.experience.pointer.raycaster.intersectObject(this.projectorModel, true);
        if (intersects.length > 0) {
            if (!this.isCameraMoved) {
                this.onModelClicked(intersects[0]);
                this.isCameraMoved = true;
            }
        }
    }
    setupProjection() {
        this.projection = new Projections();
    }
    onModelClicked(intersect) {
        const offset = new THREE.Vector3(-1.3, 0.2, 0.5);
        const modelPosition = intersect.object.getWorldPosition(new THREE.Vector3());
        const targetPosition = modelPosition.clone().add(offset);
        this.experience.camera.lookAtSheet(targetPosition);
    }
    destroy() {
        this.pointer.off("click");
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
