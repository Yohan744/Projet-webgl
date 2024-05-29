import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import Prop from '../Prop';
import { watch } from 'vue';

export default class Pencil extends Prop {
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
        watch(() => this.gameManager.state.showingInventoryObjectInFrontOfCamera, (newVal) => {
            if (newVal === 'pencil') {
                this.showInFrontOfCamera();
            }
        });
        watch(() => this.gameManager.state.objectToPocket, (newVal) => {
            if (newVal === 'pencil') {
                this.moveToPocket();
            }
        });
    }

    showInFrontOfCamera() {
        const cameraDirection = new THREE.Vector3();
        this.camera.getWorldDirection(cameraDirection);

        const targetPosition = new THREE.Vector3();
        targetPosition.addVectors(this.camera.position, cameraDirection.multiplyScalar(this.offsetFromCamera));

        gsap.to(this.mesh.position, {
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

        this.gameManager.state.isPencilInFrontOfCamera = true;
        this.scene.add(this.mesh);
    }

    moveToPocket() {
        const pocketPosition = new THREE.Vector3(0, -1, 2);

        gsap.to(this.mesh.position, {
            x: pocketPosition.x,
            y: pocketPosition.y,
            z: pocketPosition.z,
            duration: 2,
            ease: 'power2.inOut',
            onComplete: () => {
                this.gameManager.updatePocketButtonState(false);
                this.gameManager.addObjectToInventory('pencil');
                this.scene.remove(this.mesh);
            }
        });
    }

    onClick() {
        console.log('Pencil clicked');
        this.gameManager.setPencilInFrontOfCamera(true);
        if (!this.gameManager.state.isObjectOut) {
            this.gameManager.updatePocketButtonState(true);
        }
    }

    destroy() {
        super.destroy();
    }
}
