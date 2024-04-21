import { MeshStandardMaterial, Mesh, PlaneGeometry, Vector3 } from "three";
import Experience from "../Experience";

export default class Background {

    constructor() {

        this.experience = new Experience()
        this.resources = this.experience.resources
        this.scene = this.experience.scene

        this.planePosition = new Vector3(0, 1.55, -15)

        this.init()

    }

    init() {

        this.planeGeometry = new PlaneGeometry(10, 10, 1, 1)

        this.planeMaterial = new MeshStandardMaterial({
            map: this.resources.items.backgroundTreeTexture,
        })

        this.background = new Mesh(this.planeGeometry, this.planeMaterial)
        this.background.position.copy(this.planePosition)
        this.background.rotation.set(0, 0, 0)
        this.scene.add(this.background)

    }

    destroy() {
        this.planeGeometry.dispose()
        this.planeMaterial.dispose()
        this.scene.remove(this.background)
    }

}