import {MeshStandardMaterial, Mesh, PlaneGeometry, Vector3, FrontSide} from "three";
import Experience from "../../Experience";

export default class Projections {

    constructor() {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene
        this.planePosition = new Vector3(0, 2.25, -8)
        this.init()
    }
    init() {
        this.planeGeometry = new PlaneGeometry(2, 2, 1, 1)
        const t = this.resources.items.backgroundTreeTexture
        t.flipY = true

        this.planeMaterial = new MeshStandardMaterial({
            map: t,
            transparent:false,
            side: FrontSide
        })
        this.background = new Mesh(this.planeGeometry, this.planeMaterial)
        this.background.position.copy(2.45, 1.15, 4.5)
        this.background.rotation.set(0, 0, 0)
        this.scene.add(this.background)
    }
    destroy() {
        if (this.planeGeometry) this.planeGeometry.dispose()
        if (this.planeMaterial) {
            this.planeMaterial.map.dispose()
            this.planeMaterial.dispose()
        }
        if (this.scene) {
            if (this.background) this.scene.remove(this.background)
        }
    }
}