import * as THREE from 'three'
import Experience from "../Experience";

export default class Locations {

    constructor() {

        this.instance = this

        this.experience = new Experience()
        this.debug = this.experience.debug

        this.spots = []

        this.locationsPositions = [
            new THREE.Vector3(-1.75, 0, 5.1),
            new THREE.Vector3(-2.5, 0, -2.25),
            new THREE.Vector3(1.5, 0, -1.75),
            new THREE.Vector3(1.5, 0, 2),
        ]

        this.locationsLookingPoint = [
            new THREE.Vector3(-3, -0.5, -0.5),
            new THREE.Vector3(-12, -0.5, -15),
            new THREE.Vector3(5, -3.5, -15),
            new THREE.Vector3(5, -2, -3),
        ]

        this.locationsOffset = [
            new THREE.Vector3(0, 0.115, 0),
            new THREE.Vector3(0, 0.075, 0),
            new THREE.Vector3(0, 0.075, 0),
            new THREE.Vector3(0, 0.075, 0),
        ]

        this.experience.on('ready', () => {
            this.scene = this.experience.scene
            this.init()
        })

    }

    init() {

        for (let i = 0; i < this.locationsPositions.length; i++) {

            const geometry = new THREE.PlaneGeometry(0.5, 0.5)
            geometry.rotateX(Math.PI * 0.5)

            const location = new THREE.Mesh(
                geometry,
                new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    side: THREE.DoubleSide,
                })
            )

            location.position.copy(this.locationsPositions[i]).add(this.locationsOffset[i])
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

    destroy() {
        this.spots.forEach((spot) => {
            this.scene.remove(spot)
        })
    }

}