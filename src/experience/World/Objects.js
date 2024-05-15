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
                child.receiveShadow = false
                child.castShadow = false

                if (name.includes("miroir")) {
                    child.material = this.materialLibrary.getMirrorMaterial()
                } else if (name.includes("carton")) {
                    child.material = this.materialLibrary.getCardBoardMaterial()
                } else if (name === 'tapis_voiture') {
                    child.material = this.materialLibrary.getFirstCarpetMaterial()
                } else if (name === 'tapis_vieux') {
                    child.material = this.materialLibrary.getSecondCarpetMaterial()
                } else if (name.includes("drap_qui_tombe")) {
                    child.material = this.materialLibrary.getSheetMaterial()
                } else if (name === "bureau") {
                    child.material = this.materialLibrary.getDeskMaterial()
                } else if (name.includes("bibliothèque")) {
                    child.material = this.materialLibrary.getLibraryMaterial()
                } else if (name.includes("petit_meuble")) {
                    child.material = this.materialLibrary.getLittleStorageMaterial()
                } else if (name === 'meuble') {
                    child.material = this.materialLibrary.getChestDrawerMaterial()
                } else if (name.includes("meuble_mur_fenetre")) {
                    child.material = this.materialLibrary.getStorageMaterial()
                } else if (name.includes("coussin")) {
                    child.material = this.materialLibrary.getPillowMaterial()
                } else if (name.includes("porte_manteau")) {
                    child.material = this.materialLibrary.getCoatRackMaterial()
                } else if (name.includes("ampoule")) {
                    child.material = this.materialLibrary.getBulbMaterial()
                } else if (name.includes("échelle")) {
                    child.material = this.materialLibrary.getLadderMaterial()
                } else if (name.includes("rockingchair")) {
                    child.material = this.materialLibrary.getRockingChairMaterial()
                } else if (name === 'table') {
                    child.material = this.materialLibrary.getTableMaterial()
                } else if (name.includes("lampe")) {
                    child.material = this.materialLibrary.getLampMaterial()
                } else if (name.includes("chaise")) {
                    child.material = this.materialLibrary.getChairMaterial()
                } else if (name.includes("fauteuil_drappe_")) {
                    child.material = this.materialLibrary.getSheetChairMaterial()
                } else {
                    console.log(name)
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