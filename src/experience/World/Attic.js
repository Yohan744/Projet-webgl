import Experience from "../Experience";
import GodRay from "./Effects/GodRay";
import Dust from "./Effects/Dust";

export default class Attic {

    constructor(materialLibrary) {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.materialLibrary = materialLibrary

        this.godRayMeshs = []
        this.godRays = []

        if (this.scene) {
            this.init()
        }
    }

    init() {

        this.atticModel = this.resources.items.atticModel.scene

        this.atticModel.traverse(child => {
            if (child.isMesh) {

                const name = child.name.toLowerCase()
                child.material.dispose()
                child.matrixAutoUpdate = false

                if (name.includes("sol")) {
                    child.material = this.materialLibrary.getGroundMaterial()
                    child.castShadow = true
                    child.receiveShadow = true
                } else if (name.includes("mur_fenetre")) {
                    child.material = this.materialLibrary.getWindowWallMaterial()
                    child.castShadow = true
                    child.receiveShadow = true
                } else if (name.includes("murs_bas")) {
                    child.material = this.materialLibrary.getWallsMaterial()
                    child.receiveShadow = true
                } else if (name.includes("toit")) {
                    child.material = this.materialLibrary.getRoofMaterial()
                    child.receiveShadow = true
                } else if (name.includes("vitre")) {
                    child.material = this.materialLibrary.getWindowMaterial()
                    child.castShadow = true
                    child.receiveShadow = true
                } else if (name.includes("tassots")) {
                    child.material = this.materialLibrary.getSideWindowMaterial()
                }  else if (name.includes("poutres")) {
                    child.material = this.materialLibrary.getBeamMaterial()
                }

                child.material.needsUpdate = true

            }
        })

        this.scene.add(this.atticModel)

        this.initEffects()

    }

    initEffects() {
        if (this.godRayMeshs.length > 0) {
            this.godRayMeshs.forEach(mesh => {
                this.godRays.push(new GodRay(mesh))
            })
        }
        this.dust = new Dust()
    }

    update() {
        if (this.dust) this.dust.update()
    }

    destroy() {
        if (this.atticModel) {
            this.atticModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
            this.scene.remove(this.atticModel)
        }
        if (this.godRays.length > 0) {
            this.godRays.forEach(godRay => {
                godRay.destroy()
            })
        }
        if (this.dust) this.dust.destroy()
    }


}