import {MouseUtils} from "../Utils/MouseUtils";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import {CameraUtils} from "../Utils/CameraUtils";
import Prop from "./Prop";
import * as THREE from "three";

export default class Cassette extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        // just temporary
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer.instance;
        this.pointer = this.experience.pointer;
        this.cassetteModel = mesh
        this.temporaryInit();
    }

    temporaryInit() {
        this.cassetteModel.scale.set(0.05, 0.05, 0.05);
        this.cassetteModel.position.set(-3.65, 1.8, -4.1);
        this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera, this.pointer, this.renderer);
        this.cassetteModel.traverse(child => {
            if (child.isMesh && Array.isArray(child.morphTargetInfluences)) {
                child.morphTargetInfluences.forEach((_, i) => child.morphTargetInfluences[i] = 0);
            }
        });
        this.scene.add(this.cassetteModel);
    }

    onClick() {
        console.log("click object")
    }

    // handlepencilClick() {
    //     if (this.appStore.$state.isCameraOnSpot) {
    //         this.advanceMorphTargets();
    //     }
    // }
    //
    // advanceMorphTargets() {
    //     this.cassetteModel.traverse(child => {
    //         if (child.isMesh && child.morphTargetInfluences) {
    //             child.morphTargetInfluences[0] = (child.morphTargetInfluences[0] + 0.1) % 1;
    //         }
    //     });
    // }

    destroy() {
        super.destroy()
    }
}
