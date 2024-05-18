import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import Prop from '../Prop';
import { watch } from "vue";

export default class Cassette extends Prop {
    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound);

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.offsetFromCamera = 0.6;
        this.desiredRotation = desiredRotationOnClick;

        this.gameManager = this.experience.gameManager;
        this.init();
    }

    init() {
        watch(() => this.gameManager.state.showingInventoryObjectInFrontOfCamera,
            (newVal) => {
                if (newVal === 'cassette') {
                    this.showInFrontOfCamera();
                    this.gameManager.isObjectOut = true;
                }
            }
        );
    }

    showInFrontOfCamera() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        if (!this.experience.objectGroup) {
            this.experience.objectGroup = new THREE.Group();
            this.scene.add(this.experience.objectGroup);
        }

        const isCassetteAndPencilInFront = this.gameManager.state.isPencilInFrontOfCamera && this.gameManager.state.isCassetteInFrontOfCamera;
        const isCassetteAndWalkmanInFront = this.gameManager.state.isWalkmanInFrontOfCamera && this.gameManager.state.isCassetteInFrontOfCamera;

        if (isCassetteAndPencilInFront) {
            this.mesh.position.set(0.3, 0, 0);
        } else if (isCassetteAndWalkmanInFront) {
            this.mesh.position.set(0.3, 0, 0);
        } else {
            this.mesh.position.set(0, 0, 0);
        }

        this.experience.objectGroup.add(this.mesh);

        gsap.to(this.experience.objectGroup.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: 'power2.inOut'
        });

        gsap.to(this.mesh.rotation, {
            x: this.desiredRotation.x,
            y: this.desiredRotation.y,
            z: this.desiredRotation.z,
            duration: 2,
            ease: 'power2.inOut'
        });

        this.gameManager.setCassetteInFrontOfCamera(true);
        this.gameManager.state.isObjectOut = true;
    }

    onClick() {
        console.log('Cassette clicked');
    }

    destroy() {
        super.destroy();
    }
}
