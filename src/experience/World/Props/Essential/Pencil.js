import Experience from "../../../Experience";
import * as THREE from "three";
import Prop from "../Prop";

export default class Pencil extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, distanceToCamera = 0.6, isOutlined = 1.05, propSound, spotId) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, distanceToCamera, isOutlined, propSound, spotId)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    init() {

    }

    onClickGeneral() {

    }

    onClick() {
        console.log("click crayon")
    }

    destroy() {
        super.destroy()
    }
}
