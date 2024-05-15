import * as THREE from 'three'
import Experience from "../Experience";
import {watch} from "vue";
import gsap from "gsap";

export default class Locations {

    static instance

    constructor(materialLibrary) {

        if (Locations.instance) {
            return Locations.instance
        }
        Locations.instance = this

        this.experience = new Experience()
        this.debug = this.experience.debug
        this.appStore = this.experience.appStore
        this.materialLibrary = materialLibrary

        this.spots = []

        this.locationsPositions = [
            new THREE.Vector3(-1.75, 0, 4.1),
            new THREE.Vector3(-2, 0, -2.5),
            new THREE.Vector3(1.75, 0, -2.25),
            new THREE.Vector3(0.8, 0, 2.75),
        ]

        this.locationsLookingPoint = [
            new THREE.Vector3(-3, -0.5, -0.5),
            new THREE.Vector3(-9, -0.5, -15),
            new THREE.Vector3(10, -3.5, -5),
            new THREE.Vector3(5, -2, -3),
        ]

        this.locationsOffset = [
            new THREE.Vector3(0, 0.05, 0),
            new THREE.Vector3(0, 0.05, 0),
            new THREE.Vector3(0, 0.1, 0),
            new THREE.Vector3(0, 0.1, 0),
        ]

        this.experience.on('ready', () => {
            this.scene = this.experience.scene
            this.init()

            watch(() => this.appStore.$state.isCameraOnSpot, (state) => !state && this.setLocationsVisibility(true))

        })

    }

    init() {

        for (let i = 0; i < this.locationsPositions.length; i++) {

            const geometry = new THREE.PlaneGeometry(0.65, 0.65)
            geometry.rotateX(-Math.PI * 0.5)

            const location = new THREE.Mesh(
                geometry,
                this.materialLibrary.getLocationsMaterial()
            )

            location.matrixAutoUpdate = false

            location.position.copy(this.locationsPositions[i]).add(this.locationsOffset[i])
            location.data = {
                lookingPoint: this.locationsLookingPoint[i]
            };

            location.updateMatrix()

            this.spots.push(location)
            this.scene.add(location)
        }

    }

    getLocations() {
        return this.spots
    }

    setLocationsVisibility(state) {
        this.spots.forEach((spot) => {

            const delay = Math.random() * 0.25

            gsap.to(spot.material, {
                opacity: state ? 1 : 0,
                delay: delay,
                duration: 1.5,
                ease: 'power3.inOut'
            })

            gsap.to(spot.scale, {
                x: state ? 1 : 0,
                y: state ? 1 : 0,
                z: state ? 1 : 0,
                delay: delay,
                duration: 1.5,
                ease: 'power3.inOut',
                onUpdate: () => {
                    spot.updateMatrix()
                }
            })

        })

    }

    destroy() {
        this.spots.forEach((spot) => {
            spot.geometry.dispose()
            spot.material.dispose()
            this.scene.remove(spot)
        })
    }

}