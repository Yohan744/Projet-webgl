import Experience from "../../Experience";
import Outline from "../Effects/Outline";
import * as THREE from "three";
import Prop from "./Prop";
import {MouseUtils} from "../Utils/MouseUtils";
import gsap from "gsap";

export default class Pencil extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.outlineScale = isOutlined;

        // just temporary
        this.pencilModel = mesh
        this.basicPosition = new THREE.Vector3(-3.2, 1.85, -4.85);
        this.temporaryInit();
    }

    temporaryInit() {
        this.pencilModel.scale.set(0.09, 0.09, 0.09);
        this.pencilModel.position.copy(this.basicPosition);
        new MouseUtils(this.pencilModel);
        this.pencilModel.traverse(child => {
            if (child.isMesh && Array.isArray(child.morphTargetInfluences)) {
                child.morphTargetInfluences.forEach((_, i) => child.morphTargetInfluences[i] = 0);
            }
        });
        this.scene.add(this.pencilModel);

        this.outline = new Outline(this.pencilModel, 0.1);
    }

    onClick() {
        console.log("click pencil")
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

    destroy() {
        super.destroy()
    }
}
