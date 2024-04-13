import Experience from "../Experience";
import { MeshStandardMaterial, DoubleSide, RepeatWrapping } from "three";
import GodRay from "./Effects/GodRay";
import Dust from "./Effects/Dust";

export default class Attic {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

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

                    const texture = this.resources.items.atticModel.diffuse
                    texture.wrapS = RepeatWrapping
                    texture.wrapT = RepeatWrapping
                    texture.repeat.set(2, 2)

                    const roughness = this.resources.items.atticModel.roughness
                    roughness.wrapS = RepeatWrapping
                    roughness.wrapT = RepeatWrapping
                    roughness.repeat.set(2, 2)

                    child.material = new MeshStandardMaterial({
                        map: texture,
                        roughnessMap: roughness,
                        side: DoubleSide
                    })

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