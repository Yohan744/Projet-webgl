import * as THREE from 'three'
import Experience from "../Experience";
import gsap from "gsap";
import {watch} from "vue";

export default class Locations {

    static instance

    constructor(materialLibrary) {

        if (Locations.instance) {
            return Locations.instance
        }
        Locations.instance = this

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.gameManager = this.experience.gameManager
        this.material = materialLibrary.getLocationsMaterial()

        this.spots = []

        this.isSpotsVisible = true

        this.locationsPositions = [
            new THREE.Vector3(-1.75, 0, 4.1),
            new THREE.Vector3(-2, 0, -2.5),
            new THREE.Vector3(1.5, 0, -2.25),
            new THREE.Vector3(0.65, 0, 2.25),
        ]

        this.locationsLookingPoint = [
            new THREE.Vector3(-3, -0.5, -0.5),
            new THREE.Vector3(-9, -0.5, -15),
            new THREE.Vector3(10, -3.5, -2.5),
            new THREE.Vector3(5, -2, -1),
        ]

        this.locationsOffset = [
            new THREE.Vector3(0, 0.05, 0),
            new THREE.Vector3(0, 0.05, 0),
            new THREE.Vector3(0, 0.1, 0),
            new THREE.Vector3(0, 0.1, 0),
        ]

        this.locationsGameIdApparition = [1, 2, 4, 3]

        this.init()
        this.setWatcher()
        if (this.gameManager.state.gameStepId === 0) this.setLocationsVisibility(false)

    }

    init() {

        for (let i = 0; i < this.locationsPositions.length; i++) {

            const geometry = new THREE.PlaneGeometry(0.8, 0.8)
            geometry.rotateX(-Math.PI * 0.5)

            const location = new THREE.Mesh(
                geometry,
                this.material
            )

            location.matrixAutoUpdate = false

            location.position.copy(this.locationsPositions[i]).add(this.locationsOffset[i])
            location.name = 'location-' + i
            location.data = {
                lookingPoint: this.locationsLookingPoint[i]
            };

            if (this.gameManager.state.gameStepId !== -1) location.visible = false

            location.updateMatrix()

            this.spots.push(location)
            this.scene.add(location)
        }

    }

    setWatcher() {
        watch(() => this.gameManager.state.gameStepId, (newVal) => {
            this.spots.forEach((spot, index) => {
                spot.visible = newVal >= this.locationsGameIdApparition[index]
            })
            if (newVal === 1) this.setLocationsVisibility(true)
        })
    }

    getLocations() {
        return this.spots
    }

    setLocationsVisibility(state) {
        this.isSpotsVisible = state
        this.spots.forEach((spot) => {

            let delay = 0.5 + Math.random() * 0.5
            const id = spot.data.id

            gsap.to(spot.material, {
                opacity: state ? 0.65 : 0,
                duration: 3,
                ease: 'power2.out',
                onStart: () => {
                    state ? spot.material.visible = true : null
                },
                onComplete: () => {
                    !state ? spot.material.visible = false : null
                }
            })

            gsap.to(spot.scale, {
                x: state ? 1 : 0,
                y: state ? 1 : 0,
                z: state ? 1 : 0,
                duration: 3,
                ease: 'power2.out',
                onUpdate: () => {
                    spot.updateMatrix()
                }
            })

        })

    }

    update() {
        if (this.isSpotsVisible) {
            this.material.uniforms.uTime.value = this.experience.time.elapsed * 0.001
        }
    }

    destroy() {
        Locations.instance = null
        this.spots.forEach((spot) => {
            spot.geometry.dispose()
            spot.material.dispose()
            this.scene.remove(spot)
        })
    }

}