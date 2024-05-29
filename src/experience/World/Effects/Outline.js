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

    updateOutlineMeshPosition(position) {
        this.clonedModel.position.copy(position)
    }

    updateOutlineMeshRotation(rotation) {
        this.clonedModel.rotation.copy(rotation)
    }

    removeOutline() {
        gsap.to(this.material, {
            opacity: 0,
            duration: 0.75,
        })
        const scale = 1 + ((this.outlineScale - 1) * 0.5)
        gsap.to(this.clonedModel.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: 0.75,
        })
    }

    showOutline() {
        gsap.to(this.material, {
            opacity: 0.4,
            delay: 0.5,
            duration: 0.75,
        })
        gsap.to(this.clonedModel.scale, {
            x: this.outlineScale,
            y: this.outlineScale,
            z: this.outlineScale,
            delay: 0.5,
            duration: 0.75,
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