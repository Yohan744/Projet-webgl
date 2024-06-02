import Experience from "../../Experience";
import Prop from "./Prop";
import * as THREE from "three";

export default class Telecran extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

        this.mesh.rotation.y = 0.12;
        this.propsBasicRotation = this.mesh.rotation.clone();
        this.outline.updateOutlineMeshRotation(this.mesh.rotation)
    }

    init() {

    }

    onClickGeneral() {

    }
    onClick() {
        console.log("click telecran")
    }

    destroy() {
        super.destroy()
    }
}
