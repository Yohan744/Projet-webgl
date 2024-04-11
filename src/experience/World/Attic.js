import Experience from "../Experience";
import * as THREE from "three";
import {Vector2} from "three";

export default class Attic {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.init()
    }

    init() {

        this.atticModel = this.resources.items.atticModel.scene

        this.atticModel.traverse(child => {
            if (child.isMesh) {

                child.material.dispose()

                child.material = new THREE.MeshStandardMaterial({
                    map: this.resources.items.atticModel.diffuse,
                    roughnessMap: this.resources.items.atticModel.roughness,
                    side: THREE.DoubleSide
                })

                child.castShadow = true
                child.receiveShadow = true
                child.material.needsUpdate = true

            }
        })

        this.scene.add(this.atticModel)

    }

}