import Experience from "../Experience";
import { MeshStandardMaterial, DoubleSide, RepeatWrapping } from "three";
import GodRay from "./Effects/GodRay";
import Dust from "./Effects/Dust";
import MaterialLibrary from "../MaterialLibrary";

export default class Attic {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.materialLibrary = new MaterialLibrary()

        this.godRayMesh = null

        this.init()
    }

    init() {

        this.atticModel = this.resources.items.atticModel.scene

        this.atticModel.traverse(child => {
            if (child.isMesh) {

                const name = child.name.toLowerCase()
                child.material.dispose()

                if (name.includes("godray")) {
                    this.godRayMesh = child
                } else {
                    child.material = this.materialLibrary.getGroundMaterial()
                    child.matrixAutoUpdate = false
                    child.castShadow = true
                    child.receiveShadow = true
                    child.material.needsUpdate = true
                }

            }
        })

        this.scene.add(this.atticModel)

        this.initEffects()

    }

    initEffects() {
        if (this.godRayMesh) this.godRay = new GodRay(this.godRayMesh)
        this.dust = new Dust()
    }

    update() {
        if (this.dust) this.dust.update()
    }

}