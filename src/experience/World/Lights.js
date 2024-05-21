import Experience from "../Experience";
import * as THREE from "three";

export default class Lights {

    constructor(_options) {
        this.experience = new Experience()
        this.debug = this.experience.config?.debug
        this.scene = this.experience.scene

        this.pointLightPosition = new THREE.Vector3(-0.164, 3.2, 0.1369)

        if (this.scene) {
            this.setupAmbientLight()
            this.setupPointLight()
        }

    }

    setupAmbientLight() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        ambientLight.castShadow = false
        this.scene.add(ambientLight)
    }

    setupPointLight() {
        const pointLight = new THREE.PointLight("#ffffff", 10)
        pointLight.position.copy(this.pointLightPosition)
        pointLight.shadow.camera.near = 0.1
        pointLight.shadow.camera.far = 10
        pointLight.shadow.mapSize.set(1024, 1024)
        this.scene.add(pointLight)
    }

    destroy() {
        this.scene.remove(this.scene.children.find(child => child.type === 'AmbientLight'))
        this.scene.remove(this.scene.children.find(child => child.type === 'SpotLight'))
        this.scene.remove(this.scene.children.find(child => child.type === 'PointLight'))
        this.scene.remove(this.scene.children.find(child => child.type === 'SpotLightHelper'))
        this.scene.remove(this.scene.children.find(child => child.type === 'PointLightHelper'))
        this.scene.remove(this.scene.children.find(child => child.type === 'CameraHelper'))
    }

}