import Experience from "../Experience";
import {objectsData} from "../../data/Objects";

const interactableObjects = {}

export default class ObjectsInteractable {

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

        this.objectsInteractableModel = this.resources.items.objectsInteractableModel.scene

        this.objectsInteractableModel.traverse(child => {
            if (child.isMesh) {

                const name = child.name.toLowerCase()
                const data = objectsData[name]
                child.material.dispose()

                // if (!data) return

                if (name.includes("walkman")) {
                    child.material = this.materialLibrary.getWalkmanMaterial()
                    this.walkman = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.walkman = this.walkman

                } else if (name.includes("tirroir")) {
                    child.material = this.materialLibrary.getDrawerMaterial()

                } else if (name.includes("cartepostale")) {
                    child.material = this.materialLibrary.getPostalCardMaterial()

                }  else if (name.includes("dahlia")) {
                    child.material = this.materialLibrary.getDahliaMaterial()

                }  else if (name.includes("magazine")) {
                    if (name.includes('ouvert')) child.material = this.materialLibrary.getOpenMagazineMaterial()
                    if (name.includes('fermé')) child.material = this.materialLibrary.getClosedMagazineMaterial()

                }  else if (name.includes("malle")) {
                    if (name.includes('haut')) {
                        child.material = this.materialLibrary.getTopChestMaterial()
                        this.topChest = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                        interactableObjects.topChest = this.topChest
                    }

                    if (name.includes('bas')) {
                        child.material = this.materialLibrary.getBottomChestMaterial()
                        this.bottomChest = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                        interactableObjects.bottomChest = this.bottomChest
                    }

                } else if (name.includes("cassette")) {
                    child.material = this.materialLibrary.getCassetteMaterial()
                    this.cassette = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.cassette = this.cassette

                }  else if (name.includes("crayon")) {
                    child.material = this.materialLibrary.getPencilMaterial()
                    this.pencil = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.pencil = this.pencil

                } else if (name.includes("telephone")) {
                    child.material = this.materialLibrary.getTelephoneMaterial()
                    this.telephone = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.telephone = this.telephone

                } else if (name.includes("rubicub")) {
                    child.material = this.materialLibrary.getRubiksCubeMaterial()
                    this.rubikscube = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.rubiksCube = this.rubikscube

                } else if (name.includes("tv")) {
                    child.material = this.materialLibrary.getTvMaterial()
                    this.television = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.television = this.television

                } else if (name.includes("enveloppe")) {
                    child.material = this.materialLibrary.getEnveloppeMaterial()

                } else if (name.includes("lettre")) {
                    child.material = this.materialLibrary.getLetterMaterial()
                    this.letter = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.letter = this.letter

                } else if (name.includes("tableau_magique1")) {
                    child.material = this.materialLibrary.getTelecranMaterial()
                    this.telecran = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.telecran = this.telecran

                } else if (name.includes("tourne_disque")) {
                    child.material = this.materialLibrary.getRecordPlayerMaterial()
                    this.recordPlayer = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    interactableObjects.recordPLayer = this.recordPlayer

                } else if (name.includes("photo") || name.includes("diapo") || name.includes("rail")) {

                } else {
                    // console.log(name)
                }

                child.material.needsUpdate = true

            }
        })

        this.scene.add(this.objectsInteractableModel)

    }

    update() {

    }

    destroy() {
        if (this.objectsInteractableModel) {
            this.objectsInteractableModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose()
                    child.material.dispose()
                }
            })
            this.scene.remove(this.objectsInteractableModel)
        }
        interactableObjects.forEach(object => object.destroy())
    }


}

export const useInteractableObjects = () => interactableObjects