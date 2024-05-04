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

                if (name.includes("walkman")) {
                    this.walkman = new data.file(child, data.rotationOnClick, data.animateToCameraOnClick, data.outlineScale)
                    this.objects.push(this.walkman)
                }

                child.material.needsUpdate = true

            }
        })

        // juste for now waiting for final file.glb

        const dataCasetteTemporary = objectsData["cassette"]
        const cassetteMesh = this.resources.items.cassetteModel.scene
        this.cassette = new dataCasetteTemporary.file(cassetteMesh, dataCasetteTemporary.rotationOnClick, dataCasetteTemporary.animateToCameraOnClick, dataCasetteTemporary.outlineScale)
        this.objects.push(this.cassette)

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