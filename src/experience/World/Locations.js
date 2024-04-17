import * as THREE from 'three'
import Experience from "../Experience";

export default class Locations {

    constructor() {

        this.instance = this

        this.experience = new Experience()
        this.debug = this.experience.debug

        this.spots = []

        this.locationsPositions = [
            new THREE.Vector3(-1, 0, -2),
            new THREE.Vector3(0, 0, -1),
            new THREE.Vector3(1, 0, -3),
        ]

        this.locationsRotations = [
            new THREE.Euler(0, 0, 0),
            new THREE.Euler(0, 0, 0),
            new THREE.Euler(0, 0, 0),
        ]

        this.experience.on('ready', () => {
            this.scene = this.experience.scene
            this.init()
        })

    }

    init() {

        for (let i = 0; i < this.locationsPositions.length; i++) {

            const location = new THREE.Mesh(
                new THREE.BoxGeometry(0.1, 0.1, 0.1),
                new THREE.MeshBasicMaterial({color: 0xff0000})
            )

            location.position.copy(this.locationsPositions[i])
            location.rotation.copy(this.locationsRotations[i])

            this.spots.push(location)
            this.scene.add(location)
        }

    }

    getLocations() {
        return this.spots
    }

}