import * as THREE from 'three'
import Experience from './Experience.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

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


        this.prevTarget = new THREE.Vector3();

        this.upVector = new THREE.Vector3(0, 1, 0);
        this.lerpCamera = 0.975
        this.cameraAmplitude = 1


        this.mode = 'default' // 'default' for production, 'debug' for development

        if (this.debug) {
            this.debugFolder = this.debug.addFolder('camera')
            this.setDebug()
        }

        this.lookingPoint = new THREE.Vector3(0, 1, -3)

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
        this.modes.default.instance.position.set(0, 1.25, 2)
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

            this.debugFolder.add(
                this, 'mode', {
                    'Default': "default",
                    'Debug': "debug",
                }
            )

            this.debugFolder.add(this, 'cameraAmplitude').min(0).max(3).step(0.001).name('Camera amplitude')

            this.debugFolder.add(this, 'lerpCamera').min(0).max(0.99).step(0.001).name('Camera smoothness')

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


    destroy() {
        this.modes.debug.orbitControls.destroy()
    }
}
