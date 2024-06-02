import * as THREE from "three";
import Experience from "../../../Experience";
import Prop from "../Prop";
import {useInteractableObjects} from "../../ObjectsInteractable";

export default class Dahlia {
    constructor(mesh) {

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        this.mesh = mesh;

        this.experience.on('ready', () => {

            this.interactableObjects = useInteractableObjects();

        })

    }

    init() {

    }

    onClickGeneral() {

    }

    onClick() {
        console.log("click Dahlia")
    }

    destroy() {
        super.destroy()
    }

}