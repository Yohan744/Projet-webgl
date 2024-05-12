import Experience from "../../../Experience";
import Prop from "../Prop";
import * as THREE from "three";

export default class Cassette extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05, propSound) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined, propSound)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    init() {

    }

    onClickGeneral() {

    }

    onClick() {
        console.log("click cassette")
    }

    destroy() {
        super.destroy()
    }
}
