import * as THREE from 'three'
import Experience from './Experience.js'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from "gsap"
import {watch} from "vue";

export default class Camera {
    constructor(_options) {

        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore
        this.isMobile = this.experience.config.isMobile

        this.isFocused = false
        this.isMoving = false

        this.mousePos = {
            x: null,
            y: null
        }

        this.mode = 'default' // 'default' for production, 'debug' for development

        this.basicCameraPosition = new THREE.Vector3(0, 2.25, 9.5)
        this.basicLookingPoint = new THREE.Vector3(0, -0.25, -3)

        this.lookingPoint = this.getNormalizedLookingPoint(this.basicCameraPosition, this.basicLookingPoint)
        this.prevTarget = new THREE.Vector3();
        this.direction = new THREE.Vector3();
        this.side = new THREE.Vector3();
        this.lookAtTarget = new THREE.Vector3();
        this.upVector = new THREE.Vector3(0, 1, 0);

        this.lerpCamera = 0
        this.cameraAmplitude = this.isMobile ? {x: 3.5, y: 2} : {x: 1.75, y: 1.25}
        this.lerpCameraNormal = 0.975
        this.cameraAmplitudeNormal = this.isMobile ? {x: 3.5, y: 2} : {x: 1.75, y: 1.25}
        this.lerpCameraFocus = 0.99
        this.cameraAmplitudeFocus = this.isMobile ? {x: 1, y: 1} : {x: 0.5, y: 0.5}
        this.movingSpeedMultiplier = 0.65

        if (this.debug) {
            this.debugFolder = this.debug.addFolder('camera')
            this.setDebug()
        }

        this.setInstance()
        this.setModes()
        this.setWatchers()
    }

    setInstance() {
        const width = this.config.width === null ? window.innerWidth : this.config.width
        this.instance = new THREE.PerspectiveCamera(50, width / this.config.height, 0.1, 25)
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
        this.modes.default.instance.position.copy(this.basicCameraPosition)
        this.modes.default.instance.lookAt(this.lookingPoint)

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(0, 4, 4)

        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.75
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

    setWatchers() {
        this.pointer.on('spot-clicked', (spot) => this.moveToSpot(spot))

        if (this.pointer && this.mode === 'default') {
            this.pointer.on('movement', (mouse) => {
                this.mousePos = mouse
                this.onMovement()
            })
        }

        watch(() => this.appStore.isCameraOnSpot, (value) => {
            if (!value) {
                this.goBackToDefaultPosition()
            }
        })
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

        if (this.isMoving) return

        this.isMoving = true

        const position = spot.object.position.clone()
        const lookingPoint = this.getNormalizedLookingPoint(position, spot.object.data.lookingPoint)
        const distanceToPoint = Math.round(position.distanceTo(this.modes.default.instance.position))

        gsap.to(this.modes.default.instance.position, {
            x: position.x,
            y: position.y + this.basicCameraPosition.y,
            z: position.z,
            duration: distanceToPoint * this.movingSpeedMultiplier,
            ease: 'power1.inOut',
            onComplete: () => {
                this.isMoving = false
                this.appStore.updateCameraOnSpot(true)
            }
        })

        gsap.to(this.lookingPoint, {
            x: lookingPoint.x,
            y: lookingPoint.y,
            z: lookingPoint.z,
            duration: distanceToPoint * this.movingSpeedMultiplier,
            ease: 'power1.inOut'
        })

    }

    goBackToDefaultPosition() {

        if (this.isMoving) return

        this.isMoving = true

        const lookingPoint = this.getNormalizedLookingPoint(this.basicCameraPosition, this.basicLookingPoint)
        const distanceToPoint = Math.round(this.modes.default.instance.position.distanceTo(this.basicCameraPosition))

        gsap.to(this.modes.default.instance.position, {
            x: this.basicCameraPosition.x,
            y: this.basicCameraPosition.y,
            z: this.basicCameraPosition.z,
            duration: distanceToPoint * this.movingSpeedMultiplier * 0.75,
            ease: 'power2.inOut',
            onComplete: () => {
                this.isMoving = false
            }
        })

        gsap.to(this.lookingPoint, {
            x: lookingPoint.x,
            y: lookingPoint.y,
            z: lookingPoint.z,
            duration: distanceToPoint * this.movingSpeedMultiplier * 0.35,
            ease: 'linear'
        })

    }

    moveToVisionneuse(targetPosition, lookAtPosition) {
        gsap.to(this.modes.default.instance.position, {
            x: targetPosition.x,
            y: targetPosition.y,
            z: targetPosition.z,
            duration: 2,
            ease: "power3.inOut",
            onUpdate: () => {
                this.modes.default.instance.lookAt(lookAtPosition);
            },
            onComplete: () => {
                console.log(targetPosition)
                const position = targetPosition.clone()

                gsap.to(this.lookingPoint, {
                    x: position.x * this.basicCameraPosition.x,
                    y: position.y + 0.4,
                    z: position.z - 0.4,
                    duration: 2,
                    ease: 'power1.inOut',
                    onComplete: () => {
                        this.isFocused = true
                        this.updateFocusMode(this.isFocused)
                        this.appStore.updateCameraOnSpot(true)
                    }
                });
            }
        });
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

    getNormalizedLookingPoint(position, point) {
        const direction = new THREE.Vector3().copy(point);
        direction.normalize();
        return position.clone().add(direction.multiplyScalar(10));
    }

    updateLerpCameraAfterFirstFrame() {
        this.lerpCamera = this.lerpCameraNormal
    }

    onMovement() {
        this.direction.set(0, 0, 0);
        this.instance.getWorldDirection(this.direction);
        this.side.set(0, 0, 0).crossVectors(this.direction, this.upVector).normalize();
    }

    update() {

        if (this.mode === 'default') {
            this.lookAtTarget.set(0, 0, 0).copy(this.lookingPoint);
            this.lookAtTarget.addScaledVector(this.side, this.mousePos.x * this.cameraAmplitude.x);
            this.lookAtTarget.addScaledVector(this.upVector, this.mousePos.y * this.cameraAmplitude.y);

            this.modes.default.instance.lookAt(this.lookAtTarget.lerp(this.prevTarget, this.lerpCamera));
            this.prevTarget.copy(this.lookAtTarget);
        } else {
            if (this.debug) {
                this.modes.debug.orbitControls.update();
            }
        }

        this.instance.position.copy(this.modes[this.mode].instance.position);
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion);
        this.instance.updateMatrixWorld();
    }


    destroy() {
        this.modes.debug.orbitControls.destroy()
        this.scene.remove(this.instance)
        this.pointer.off('spot-clicked', this.moveToSpot)
        this.pointer.off('movement', this.onMovement)
    }
}