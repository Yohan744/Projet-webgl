import Experience from "../Experience";

export default class Objects {

    constructor(materialLibrary) {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.materialLibrary = materialLibrary

        if (this.scene) {
            this.init()
        }
    }

    init() {

        this.objectsModel = this.resources.items.objectsModel.scene

        this.objectsModel.traverse(child => {
            if (child.isMesh) {

                const name = child.name.toLowerCase()
                child.material.dispose()
                child.matrixAutoUpdate = false

                if (name.includes("tour_miroir")) {
                    child.material = this.materialLibrary.getSideMirrorMaterial()
                } else if (name.includes("miroir001")) {
                    child.material = this.materialLibrary.getMirrorMaterial()
                } else if (name.includes("carton")) {
                    child.material = this.materialLibrary.getCardBoardMaterial()
                } else if (name.includes("tapis")) {
                    child.material = this.materialLibrary.getCarpetMaterial()
                } else if (name.includes("drap_qui_tombe") || name.includes("fauteuil_drappe_")) {
                    child.material = this.materialLibrary.getSheetMaterial()
                } else if (name.includes("bureau")) {
                    // child.material = this.materialLibrary.getDeskMaterial()
                } else if (name.includes("bibliothèque")) {
                    // child.material = this.materialLibrary.getShelfMaterial()
                } else if (name.includes("petitmeuble")) {
                    child.material = this.materialLibrary.getLittleStorageMaterial()
                } else if (name.includes("coussin")) {
                    child.material = this.materialLibrary.getPillowMaterial()
                } else if (name.includes("porte_manteau")) {
                    // child.material = this.materialLibrary.getCoatRackMaterial()
                }

                else {
                    // console.log(name)
                }

                child.material.needsUpdate = true

            }
        })

        this.scene.add(this.objectsModel)

    }

    update() {

    }

    destroy() {
        if (this.objectsModel) {
            this.objectsModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
            this.scene.remove(this.objectsModel)
        }
    }


}