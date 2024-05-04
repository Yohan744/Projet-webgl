import {MeshStandardMaterial, Mesh, PlaneGeometry, Vector3, FrontSide, DoubleSide} from "three";
import Experience from "../../Experience";

export default class Projections {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.planePosition = new Vector3(0, 1, 2)
        this.init()
    }
    init() {
        this.planeGeometry = new PlaneGeometry(3, 3)
        const t = this.resources.items.backgroundTreeTexture
        t.flipY = true

        this.planeMaterial = new MeshStandardMaterial({
            map: t,
            side: DoubleSide
        })
        this.plane = new Mesh(this.planeGeometry, this.planeMaterial)
        this.plane.position.copy(this.planePosition)
        this.plane.rotation.set(0, -Math.PI * 0.25, 0)
        this.scene.add(this.plane)
    }
    destroy() {
        if (this.planeGeometry) this.planeGeometry.dispose()
        if (this.planeMaterial) {
            this.planeMaterial.map.dispose()
            this.planeMaterial.dispose()
        }
        if (this.scene) {
            if (this.plane) this.scene.remove(this.plane)
        }
    }
}