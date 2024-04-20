import {DoubleSide, MeshStandardMaterial, RepeatWrapping} from "three";
import Experience from "./Experience";

export default class MaterialLibrary {

    static instance;

    constructor() {

        if (MaterialLibrary.instance) {
            return MaterialLibrary.instance
        }
        MaterialLibrary.instance = this

        this.experience = new Experience()
        this.resources = this.experience.resources

    }

    getGroundMaterial() {
        const texture = this.resources.items.atticModel.diffuse
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(2, 2)

        const roughness = this.resources.items.atticModel.roughness
        roughness.wrapS = RepeatWrapping
        roughness.wrapT = RepeatWrapping
        roughness.repeat.set(2, 2)

        return new MeshStandardMaterial({
            map: texture,
            roughnessMap: roughness,
            side: DoubleSide
        })
    }

}