import Experience from "../Experience";
import {remapMaterialUVs} from "../Utils/Functions";

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

                } else if (name.includes("carton") && !name.includes("magazine")) {
                    if (name.includes("drap")) child.material = this.materialLibrary.getSheetCardBoardMaterial()
                    else {
                        child.material = this.materialLibrary.getCardBoardMaterial()
                        // remapMaterialUVs(child.material, {
                        //     map: 'texcoord_0',
                        //     aoMap: 'texcoord_2'
                        // });
                    }

                } else if (name.includes('tapis')) {
                    if (name.includes("voiture")) child.material = this.materialLibrary.getFirstCarpetMaterial()
                    if (name.includes("vieux")) child.material = this.materialLibrary.getSecondCarpetMaterial()

                } else if (name.includes('magazine')) {
                    if (name.includes("table")) child.material = this.materialLibrary.getMagazineMaterial()
                    if (name.includes("carton")) child.material = this.materialLibrary.getTableMagazineMaterial()

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
                    if (name.includes("table")) child.material = this.materialLibrary.getPillowMaterial()
                    if (name.includes("commode")) child.material = this.materialLibrary.getSecondPillowMaterial()

                } else if (name.includes("cube")) {
                    if (name.includes("table")) child.material = this.materialLibrary.getCubeTableMaterial()
                    if (name.includes("sol")) child.material = this.materialLibrary.getCubeGroundMaterial()

                } else if (name.includes("valise")) {
                    if (name.includes("avant")) child.material = this.materialLibrary.getFrontSuitCaseMaterial()
                    if (name.includes("arrière")) child.material = this.materialLibrary.getBackSuitCaseMaterial()

                } else if (name.includes("livre")) {
                    if (name.includes("sol")) child.material = this.materialLibrary.getGroundBooksMaterial()
                    if (name === 'pile__de_livre') child.material = this.materialLibrary.getStackBooksMaterial()
                    if (name === 'rangée_livre_biblio') child.material = this.materialLibrary.getRowBooksLibraryMaterial()
                    if (name === 'rangée_livre_bureau') child.material = this.materialLibrary.getRowBooksDeskMaterial()

                } else if (name.includes("porte_manteau")) {
                    child.material = this.materialLibrary.getCoatRackMaterial()

                } else if (name.includes("ampoule")) {
                    child.material = this.materialLibrary.getBulbMaterial()

                    child.layers.enable(11)
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

                } else if (name.includes("fauteuil_avant")) {
                    child.material = this.materialLibrary.getSheetChairMaterial()

                } else if (name.includes("fauteuil_fond")) {
                    child.material = this.materialLibrary.getSecondSheetChairMaterial()

                } else if (name.includes("tableau")) {
                    if (name === 'tableau_gauche') child.material = this.materialLibrary.getRightBigPaintingMaterial()
                    if (name === 'tableau_gauche1') child.material = this.materialLibrary.getRightPaintingMaterial()
                    if (name === 'tableau_gauche1_1') child.material = this.materialLibrary.getLeftPaintingMaterial()

                } else if (name.includes("baton")) {
                    child.material = this.materialLibrary.getStickMaterial()

                } else if (name.includes("rangeevynile")) {
                    child.material = this.materialLibrary.getVinylRowMaterial()

                } else if (name.includes("vase")) {
                    child.material = this.materialLibrary.getVaseMaterial()

                } else {
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