import Experience from "../Experience";
import * as THREE from "three";

export default class Lights {

    constructor(_options) {
        this.experience = new Experience()
        this.debug = this.experience.debug
        this.scene = this.experience.scene

        this.spotLightPosition = new THREE.Vector3(-6, 9, -12)
        this.spotLightTarget = new THREE.Vector3(1, 0, -2.25)

        this.pointLightPosition = new THREE.Vector3(-1, 1.75, -2.5)

        this.setupAmbientLight()
        this.setupSpotLight()
        this.setupPointLight()

        if (this.debug) {
            this.setupPointLightHelper()
        }

        // this.setupSpotLightHelper()
        // this.setupSpotLightShadowHelper()

    }

    setupAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)
    }

    setupSpotLight() {
        const spotLight = new THREE.SpotLight("#fff4cc", 4000, 18)
        spotLight.position.copy(this.spotLightPosition)
        spotLight.target.position.copy(this.spotLightTarget)
        spotLight.castShadow = true
        spotLight.shadow.mapSize.set(256, 256)
        spotLight.shadow.camera.near = 11
        spotLight.shadow.camera.far = 18
        spotLight.shadow.camera.fov = 10
        spotLight.angle = Math.PI * 0.031
        this.scene.add(spotLight.target)
        this.scene.add(spotLight)
    }

    setupPointLight() {
        const pointLight = new THREE.PointLight(0xffffff, 3)
        pointLight.position.copy(this.pointLightPosition)
        pointLight.shadow.camera.far = 10
        pointLight.shadow.mapSize.set(1024, 1024)
        this.scene.add(pointLight)

        // sphere just for now
        const sphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.115, 8, 8),
            new THREE.MeshBasicMaterial({ color: "#fff4cc" })
        )
        sphere.position.copy(this.pointLightPosition)
        this.scene.add(sphere)

    }

    setupPointLightHelper() {
        const lightHelper = new THREE.PointLightHelper(this.scene.children.find(child => child.type === 'PointLight'))
        this.scene.add(lightHelper)
    }

    setupSpotLightHelper() {
        const lightHelper = new THREE.SpotLightHelper(this.scene.children.find(child => child.type === 'SpotLight'))
        this.scene.add(lightHelper)
    }

    setupSpotLightShadowHelper() {
        const shadowCameraHelper = new THREE.CameraHelper(this.scene.children.find(child => child.type === 'SpotLight').shadow.camera)
        this.scene.add(shadowCameraHelper)
    }

}