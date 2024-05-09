import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import {MouseUtils} from "../../Utils/MouseUtils";

export default class Walkman extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    onClick() {
        console.log("click walkman")
    }

    destroy() {
        super.destroy()
    }

}