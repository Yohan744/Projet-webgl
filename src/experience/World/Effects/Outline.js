import Experience from "../../Experience";
import gsap from "gsap";

export default class Outline {
    constructor(mesh, outlineScale = 1.05) {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.materialLibrary = this.experience.world.materialLibrary
        this.mesh = mesh;
        this.outlineScale = outlineScale;
        this.init()
    }

    init() {
        this.material = this.materialLibrary.getOutlineMaterial().clone()
        this.clonedModel = this.mesh.clone();
        this.clonedModel.scale.setScalar(this.outlineScale)
        this.clonedModel.traverse(child => {
            if (child.isMesh) {
                child.material.dispose()
                child.material = this.material
            }
        })
        this.mesh.renderOrder = 1
        this.scene.add(this.clonedModel)
    }

    removeOutline() {
        gsap.to(this.material, {
            opacity: 0,
            duration: 0.5,
        })
    }

    destroy() {
        this.scene.remove(this.clonedModel)
        this.clonedModel.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose()
                child.material.dispose()
                child.material = null
            }
        })
        this.material.dispose()
    }

}