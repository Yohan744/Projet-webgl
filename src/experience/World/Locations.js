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
        ]

        this.locationsLookingPoint = [
            new THREE.Vector3(-3, 1, -2),
            new THREE.Vector3(3.75, 1, -3),
        ]

        this.experience.on('ready', () => {
            this.scene = this.experience.scene
            this.init()
        })

    }

    init() {

        for (let i = 0; i < this.locationsPositions.length; i++) {

            const geometry = new THREE.PlaneGeometry(0.3, 0.3)
            geometry.rotateX(Math.PI * 0.5)

            const location = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                })
            )

            location.position.copy(this.locationsPositions[i]).add(new THREE.Vector3(0, 0.03, 0))
            location.data = {
                lookingPoint: this.locationsLookingPoint[i]
            };

            this.spots.push(location)
            this.scene.add(location)
        }

    }

    getLocations() {
        return this.spots
    }

}