import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import { gsap } from 'gsap';
import { watch } from 'vue';

export default class Walkman extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound)

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
            if (newVal === 'cassette') {
                this.gameManager.isObjectOut = true;
            }
        });
    }

    updateState() {
        this.gameManager.setWalkmanInFrontOfCamera(true);
    }

    onClick() {
        console.log("click walkman");
        this.updateState();
    }

    destroy() {
        super.destroy();
    }
}
