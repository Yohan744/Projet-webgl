import {MouseUtils} from "../Utils/MouseUtils";
import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import {CameraUtils} from "../Utils/CameraUtils";
import Prop from "./Prop";
import * as THREE from "three";
import gsap from "gsap";

export default class Cassette extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        // just temporary
        this.cassetteModel = mesh
        this.basicPosition = new THREE.Vector3(-3.65, 1.8, -4.1);
        this.temporaryInit();
    }

    temporaryInit() {
        this.cassetteModel.scale.set(0.05, 0.05, 0.05);
        this.cassetteModel.position.copy(this.basicPosition);
        new MouseUtils(this.cassetteModel);
        this.cassetteModel.traverse(child => {
            if (child.isMesh && Array.isArray(child.morphTargetInfluences)) {
                child.morphTargetInfluences.forEach((_, i) => child.morphTargetInfluences[i] = 0);
            }
        });
        this.scene.add(this.cassetteModel);
        this.outline = new Outline(this.cassetteModel, 0.055);
    }

    onClick() {
        console.log("click object")
    }

    // OVERRIDE JUST FOR NOW
    animatePropsToBasicPosition() {

        gsap.to(this.mesh.position, {
            x: this.basicPosition.x,
            y: this.basicPosition.y,
            z: this.basicPosition.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshPosition(this.mesh.position)
            }
        });

        gsap.to(this.mesh.rotation, {
            x: this.propsBasicRotation.x,
            y: this.propsBasicRotation.y,
            z: this.propsBasicRotation.z,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
                this.outline?.updateOutlineMeshRotation(this.mesh.rotation)
            }
        });

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
