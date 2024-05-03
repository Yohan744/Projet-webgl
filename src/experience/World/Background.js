import { MeshStandardMaterial, Mesh, PlaneGeometry, Vector3, FrontSide } from "three";
import Experience from "../Experience";

export default class Background {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.planePosition = new Vector3(0, 2.25, -8)

        this.init()

    }

    init() {

        this.planeGeometry = new PlaneGeometry(8, 8, 1, 1)

        const t = this.resources.items.backgroundTreeTexture
        t.flipY = true

        this.planeMaterial = new MeshStandardMaterial({
            map: t,
            side: FrontSide
        })

        this.background = new Mesh(this.planeGeometry, this.planeMaterial)
        this.background.position.copy(this.planePosition)
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