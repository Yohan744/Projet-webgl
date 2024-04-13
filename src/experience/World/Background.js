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

        const planeGeometry = new PlaneGeometry(10, 10, 1, 1)

        const planeMaterial = new MeshStandardMaterial({
            map: this.resources.items.backgroundTreeTexture,
        })

        const background = new Mesh(planeGeometry, planeMaterial)
        background.position.copy(this.planePosition)
        background.rotation.set(0, 0, 0)
        this.scene.add(background)

        // Adding blurry window just for now

        const window = new Mesh(
            new PlaneGeometry(3, 3, 1, 1),
            new MeshStandardMaterial({
                transparent: true,
                opacity: 0.35,
                color: "white",
            })
        )

        window.position.set(0, 1.3, -4.1)
        window.rotation.set(0, 0, 0)
        this.scene.add(window)

    }

}