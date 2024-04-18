import * as THREE from 'three'
import Experience from './Experience.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap"

export default class Camera {
    constructor(_options) {

        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene
        this.pointer = this.experience.pointer

        this.isFocused = false

        this.basicCameraPosition = new THREE.Vector3(0, 0, 2)
        this.offsetPosition = new THREE.Vector3(0, 1.25, 0)

        this.lookingPoint = new THREE.Vector3(0, 1, -3)
        this.prevTarget = new THREE.Vector3();
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.lerpCamera = 0.975
        this.cameraAmplitude = 1
        this.lerpCameraNormal = 0.975
        this.cameraAmplitudeNormal = 1
        this.lerpCameraFocus = 0.99
        this.cameraAmplitudeFocus = 0.25

        this.mode = 'default' // 'default' for production, 'debug' for development

        if (this.debug) {
            this.debugFolder = this.debug.addFolder('camera')
            this.setDebug()
        }

        this.pointer.on('spot-clicked', (spot) => {
            this.moveToSpot(spot)
        })

        this.setInstance()
        this.setModes()
    }

    setInstance() {
        const width = this.config.width === null ? window.innerWidth : this.config.width
        this.instance = new THREE.PerspectiveCamera(55, width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')
        this.instance.lookAt(this.lookingPoint)

        this.scene.add(this.instance)

    }

    setModes() {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')
        this.modes.default.instance.position.copy(this.basicCameraPosition).add(this.offsetPosition)
        this.modes.default.instance.lookAt(this.lookingPoint)

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(0, 5, 5)

        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }

    setDebug() {
        if (this.debug) {
            this.debugFolder.add(this, 'mode', {'Default': "default", 'Debug': "debug",})

            this.debugFolder.add(this, 'cameraAmplitude').min(0).max(3).step(0.001).name('Camera amplitude')

            this.debugFolder.add(this, 'lerpCamera').min(0).max(0.99).step(0.001).name('Camera smoothness')

            this.debugFolder.add(this, 'isFocused').name('Camera focus object').onFinishChange(() => {
                this.updateFocusMode(this.isFocused)
            })
        }
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    moveToSpot(spot) {

        const position = spot.object.position.clone()

        const direction = new THREE.Vector3().copy(spot.object.data.lookingPoint);
        direction.normalize();
        const lookingPoint = position.clone().add(direction.multiplyScalar(5));


        gsap.to(this.modes.default.instance.position, {
            x: position.x,
            y: position.y + this.offsetPosition.y,
            z: position.z,
            duration: 4,
            ease: 'power2.inOut'
        })

        gsap.to(this.lookingPoint, {
            x: lookingPoint.x,
            y: lookingPoint.y,
            z: lookingPoint.z,
            duration: 4,
            ease: 'power2.inOut'
        })

    }

    update() {

        if (this.pointer && this.mode === 'default') {

            const direction = new THREE.Vector3();
            this.instance.getWorldDirection(direction);
            const side = new THREE.Vector3().crossVectors(direction, this.upVector).normalize();

            const mousePos = this.pointer.getMousePosition();

            let lookAtTarget = new THREE.Vector3().copy(this.lookingPoint);
            lookAtTarget.addScaledVector(side, mousePos.x * this.cameraAmplitude);

            lookAtTarget.addScaledVector(this.upVector, -mousePos.y * -this.cameraAmplitude);
            this.modes.default.instance.lookAt(lookAtTarget.lerp(this.prevTarget, this.lerpCamera));
            this.prevTarget.copy(lookAtTarget);
        }

        if (this.debug) {
            this.modes.debug.orbitControls.update();
        }

        this.instance.position.copy(this.modes[this.mode].instance.position);
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
        this.instance.updateMatrixWorld();
    }

    updateFocusMode(value) {
        this.isFocused = value

        if (this.isFocused) {
            this.cameraAmplitude = this.cameraAmplitudeFocus
            this.lerpCamera = this.lerpCameraFocus
        } else {
            this.cameraAmplitude = this.cameraAmplitudeNormal
            this.lerpCamera = this.lerpCameraNormal
        }
    }

    destroy() {
        this.modes.debug.orbitControls.destroy()
    }
}