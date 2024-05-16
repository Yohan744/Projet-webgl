import * as THREE from 'three';
import { gsap } from 'gsap';
import Experience from "../../../Experience";
import Prop from '../Prop';
import {watch} from "vue";

export default class Cassette extends Prop {
    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound, spotId) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound, spotId);

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.offsetFromCamera = 0.6;
        this.desiredRotation = desiredRotationOnClick;

        this.appStore = this.experience.appStore;
        this.init();
    }

    init() {
        watch(() =>  this.appStore.cassetteIconClicked,
            (newVal) => {
                if (newVal) {
                    this.showInFrontOfCamera();
                }
            }
        );
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

        this.scene.add(this.mesh);
    }

    onClick() {
        console.log('Cassette clicked');
    }

    destroy() {
        super.destroy();
    }
}
