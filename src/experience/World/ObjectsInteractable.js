import Experience from "../Experience";
import {objectsData} from "../../data/Objects";

export default class ObjectsInteractable {

    constructor(materialLibrary) {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.materialLibrary = materialLibrary

        this.objects = []

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
                    this.walkman = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.walkman)
                } else if (name.includes("cassette")) {
                    this.cassette = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.cassette)
                }  else if (name.includes("crayon")) {
                    this.pencil = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.pencil)
                } else if (name.includes("telephone")) {
                    this.telephone = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.telephone)
                } else if (name.includes("rubicub")) {
                    child.material = this.materialLibrary.getRubiksCubeMaterial()
                    this.rubikscube = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.rubikscube)
                } else if (name.includes("tv")) {
                    child.material = this.materialLibrary.getTvMaterial()
                    this.television = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.television)
                } else if (name.includes("tourne_disque")) {
                    child.material = this.materialLibrary.getRecordPlayerMaterial()
                    this.recordPlayer = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.distanceToCamera, data.outlineScale, data.propSound)
                    this.objects.push(this.recordPlayer)
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
        this.objects.forEach(object => object.destroy())
    }


}