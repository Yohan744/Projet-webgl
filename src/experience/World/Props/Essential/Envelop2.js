import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import gsap from "gsap";
import EventEmitter from "../../../Utils/EventEmitter";
import {watch} from "vue";
import * as THREE from "three";
import Outline from "../../Effects/Outline";

export default class Envelop2 extends EventEmitter{

    constructor(mesh) {

        super()

        this.experience = new Experience();
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;

        this.debug = this.experience.debug

        this.debugFolder = this.debug.addFolder({
            title: 'Envelop2',
            expanded: false
        })

        const params = {
            morph: 0
        }

        this.debugFolder.addBinding(params, 'morph', {min: 0, max: 1, step: 0.01}).on('change', (value) => {
            this.animateMorphTargetToValue(value.value, 0)
        })

        this.mesh = mesh;
        this.mesh.rotation.order = 'YXZ';
        this.envelopBasicPosition = this.mesh.position.clone();
        this.envelopBasicRotation = this.mesh.rotation.clone();
        this.envelopRotationInSky = new THREE.Vector3(0, 2.17, 1.63);

        this.isEnvelopInSky = false
        this.isEnvelopReadyToBeOpened = false

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.setupMorphTargetsToInitialPosition()
            this.setWatchers()
        })

    }

    setWatchers() {
        this.interactableObjects.drawer.on('drawer-animation', (state) => {
            this.animateEnvelopInDrawer(state)
        })

        this.interactableObjects.drawer.on('envelop-animation', () => {
            this.animateEnvelopToSky(true)
        })

        watch(() => this.gameManager.state.isInteractingWithObject, (state) => {
            if (!state && this.gameManager.state.actualObjectInteractingName === "drawer") {

                this.updateMeshOpacity(1, 0)

                if (!this.isEnvelopInSky) {
                    this.trigger('envelopIsNoLongerIsSky')
                } else {
                    this.animateEnvelopToSky(false)
                }

                this.globalEvents.trigger('change-cursor', {name: 'default'})

            }
        })

        this.pointer.on('click', this.handleClick.bind(this));

    }

    animateEnvelopInDrawer(state) {
        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.2 : this.envelopBasicPosition.x,
            z: state ? '+=' + 0.2 : this.envelopBasicPosition.z,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.envelopOutline.updateOutlineMeshPosition(this.mesh.position)
            },
        });
    }

    animateEnvelopToSky(state) {
        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.75 : this.envelopBasicPosition.x + 0.2,
            y: state ? '+=' + 0.9 : this.envelopBasicPosition.y,
            z: state ? '+=' + 0.75 : this.envelopBasicPosition.z + 0.2,
            duration: 1.5,
            ease: 'power2.inOut',
            onStart: () => {
                if (state) {
                    this.isEnvelopInSky = true
                } else {
                    this.isEnvelopReadyToBeOpened = false
                    this.envelopOutline.removeOutline()
                }
            },
            onUpdate: () => {
                this.envelopOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                if (!state) {
                    this.isEnvelopInSky = false
                    this.trigger('envelopIsNoLongerIsSky')
                } else {
                    this.globalEvents.trigger('change-cursor', {name: 'click'})
                    this.isEnvelopReadyToBeOpened = true
                    this.envelopOutline.showOutline()
                }
            }
        });

        gsap.to(this.mesh.rotation, {
            x: state ? this.envelopRotationInSky.x : this.envelopBasicRotation.x,
            y: state ? this.envelopRotationInSky.y : this.envelopBasicRotation.y,
            z: state ? this.envelopRotationInSky.z : this.envelopBasicRotation.z,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.envelopOutline.updateOutlineMeshRotation(this.mesh.rotation)
            }
        })

    }

    setupMorphTargetsToInitialPosition() {
        for (let i = 0; i < this.mesh.morphTargetInfluences.length; i++) {
            this.mesh.morphTargetInfluences[i] = 0;
        }
        this.envelopOutline = new Outline(this.mesh, 1.03);
        this.envelopOutline.removeOutline()
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot && this.isEnvelopReadyToBeOpened) {
            console.log("j'ouvre l'enveloppe et paf le carousel")
            this.animateMorphTargetToValue(0.05, 1.5)
            this.updateMeshOpacity(0, 1.5)
        }
    }

    animateMorphTargetToValue(value, duration) {
        for (let i = 0; i < this.mesh.morphTargetInfluences.length; i++) {
            gsap.to(this.mesh.morphTargetInfluences, {
                [i]: value,
                duration: duration,
                ease: 'power2.inOut'
            })
        }
    }

    updateMeshOpacity(value, delay = 0) {
        gsap.to(this.mesh, {
            opacity: value,
            delay: delay,
            duration: 1,
            onStart: () => {
                if (value === 1) {
                    this.mesh.visible = true
                    this.envelopOutline.showOutline()
                } else if (value === 0) {
                    this.globalEvents.trigger('change-cursor', {name: 'default'})
                    this.envelopOutline.removeOutline()
                }
            },
            onComplete: () => {
                if (value === 0) this.mesh.visible = false
            },
            ease: 'power2.inOut'
        })
    }

}