import {MouseUtils} from "../Utils/MouseUtils";
import Experience from "../../Experience";
import Prop from "./Prop";
import * as THREE from "three";

export default class Telephone extends Prop {

    constructor(mesh, desiredRotationOnClick = new THREE.Vector3(0, 0, 0), animatePropsToCameraOnClick = true, isOutlined = 1.05) {
        super(mesh, desiredRotationOnClick, animatePropsToCameraOnClick, isOutlined)

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;

    }

    onClick() {
        console.log("click telephone")
    }

    destroy() {
        super.destroy()
    }
}
