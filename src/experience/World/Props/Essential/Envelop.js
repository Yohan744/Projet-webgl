import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import gsap from "gsap";
import EventEmitter from "../../../Utils/EventEmitter";
import {watch} from "vue";
import * as THREE from "three";
import Outline from "../../Effects/Outline";

export default class Envelop extends EventEmitter {

    constructor(mesh) {

        super()

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;
        this.timeline = gsap.timeline();

        this.mesh = mesh;
        this.mesh.rotation.order = 'YXZ';
        this.envelopBasicPosition = this.mesh.position.clone();
        this.envelopBasicRotation = this.mesh.rotation.clone();
        this.envelopRotationInSky = new THREE.Vector3(0, 2.17, 1.63);

        this.isEnvelopInSky = false
        this.isEnvelopReadyToBeOpened = false
        this.isEnvelopOpen = false;

        this.carousel = new THREE.Group();
        this.carouselIndex = 1
        this.carouselItemsOffset = 0.5;
        this.dahliaBasicRotation = new THREE.Vector3(1.57, -0.25, 0);
        this.letterBasicRotation = new THREE.Vector3(-1.57, 0, Math.PI);
        this.cassetteBasicRotation = new THREE.Vector3(1.57, 0, 0);

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.envelopOutline = new Outline(this.mesh, 1.005);

            this.initCarousel()
            this.setupMorphTargetsToInitialPosition()
            this.setWatchers()

            this.debug = this.experience.debug

            this.debugFolder = this.debug.addFolder({title: 'Envelop'})
            this.debugFolder.addBinding(this.carousel.rotation, 'x', {label: 'Carousel Rotation x', min: -Math.PI, max: Math.PI, step: 0.01})
            this.debugFolder.addBinding(this.carousel.rotation, 'y', {label: 'Carousel Rotation y', min: -Math.PI, max: Math.PI, step: 0.01})
            this.debugFolder.addBinding(this.carousel.rotation, 'z', {label: 'Carousel Rotation z', min: -Math.PI, max: Math.PI, step: 0.01})

            this.debugFolder.addBinding(this.carousel.position, 'x', {label: 'Carousel Position x', min: -10, max: 10, step: 0.01})
            this.debugFolder.addBinding(this.carousel.position, 'z', {label: 'Carousel Position z', min: -10, max: 10, step: 0.01})


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

                this.animateCarouselItems(false, 0)

                if (this.isEnvelopOpen) this.animateMorphTargets(false)

                if (!this.isEnvelopInSky) {
                    this.trigger('envelopIsNoLongerIsSky')
                } else {
                    this.animateEnvelopToSky(false)
                }

                this.globalEvents.trigger('change-cursor', {name: 'default'})
                this.isEnvelopOpen = false

            }
        })

        this.pointer.on('click', this.handleClick.bind(this));

    }

    animateEnvelopInDrawer(state) {
        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.1 : this.envelopBasicPosition.x,
            z: state ? '+=' + 0.1 : this.envelopBasicPosition.z,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.envelopOutline.updateOutlineMeshPosition(this.mesh.position)
            },
        });
    }

    animateEnvelopToSky(state) {
        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.7 : this.envelopBasicPosition.x + 0.1,
            y: state ? '+=' + 0.9 : this.envelopBasicPosition.y,
            z: state ? '+=' + 0.75 : this.envelopBasicPosition.z + 0.1,
            duration: state ? 1.5 : 2,
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

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot && this.isEnvelopReadyToBeOpened && !this.isEnvelopOpen) {
            this.setupMorphTargetsToInitialPosition()
            this.animateMorphTargets(true)
            this.updateMeshOpacity(0, 1.5)
            this.isEnvelopOpen = true
        }
    }

    initCarousel() {

        this.carousel.position.set(-2.5, 2.15, -3.26);
        this.carousel.rotation.y = 0.625;
        this.carousel.visible = false;

        this.dahlia = this.interactableObjects.dahlia.mesh
        this.letter = this.interactableObjects.lettre.mesh
        const cassetteMeshes = this.interactableObjects.cassette
        this.cassette = this.mergeMeshes(cassetteMeshes)

        this.dahlia.rotation.order = 'YXZ';
        this.letter.rotation.order = 'YXZ';
        this.cassette.rotation.order = 'YXZ';

        this.dahlia.material.opacity = 0;
        this.letter.material.opacity = 0;
        this.cassette.opacity = 0;

        this.carousel.add(this.dahlia, this.letter, this.cassette);

        this.dahlia.position.set(0, 0, 0);
        this.letter.position.set(0, 0, 0);
        this.cassette.position.set(0, 0, 0);

        this.dahlia.rotation.setFromVector3(this.dahliaBasicRotation, 'YXZ');
        this.letter.rotation.setFromVector3(this.letterBasicRotation, 'YXZ');
        this.cassette.rotation.setFromVector3(this.cassetteBasicRotation, 'YXZ');

        this.scene.add(this.carousel);

    }

    animateCarouselItems(state, delay) {

        this.experience.renderer.toggleBlurEffect(state, 0)

        const items = [this.dahlia, this.letter, this.cassette];
        items.forEach((item, index) => {

            gsap.to(item.position, {
                x: state ? this.carouselItemsOffset * (index - 1) : 0,
                z: state ? this.carouselItemsOffset * 0.5 : 0,
                delay: 0.05 * index + delay,
                duration: 1.5,
                ease: 'power2.inOut',
                onStart: () => {
                    if (state) this.carousel.visible = true
                    if (!state) this.updateMeshOpacity(1, 0)
                },
                onComplete: () => {
                    if (!state) this.carousel.visible = false
                }
            })

            if (item instanceof THREE.Group) {
                item.traverse((child) => {
                    if (child.material) {
                        gsap.to(child.material, {
                            opacity: state ? 1 : 0,
                            delay: 0.15 * index + delay,
                            duration: 1.5,
                            ease: 'power2.inOut',
                        })
                    }
                });
            } else {
                gsap.to(item.material, {
                    opacity: state ? 1 : 0,
                    delay: 0.05 * index + delay,
                    duration: 1.5,
                    ease: 'power2.inOut',
                })
            }
        })

    }

    animateMorphTargets(open) {
        if (this.mesh.morphTargetInfluences.length === 0) return;

        this.timeline.clear();

        const value = open ? 1 : 0;
        const reverseValue = open ? 0 : 1;
        const duration = 0.01

        if (open) {

            for (let i = 41; i >= 0; i--) {

                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: value,
                    duration: duration,
                    ease: "power1.inOut"
                })
                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: 0.5,
                    [i - 1]: 0.5,
                    duration: duration,
                    ease: "power1.inOut"
                })
                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: reverseValue,
                    [i - 1]: value,
                    duration: duration,
                    ease: "power1.inOut"
                });

            }

            this.timeline.set(this.mesh.morphTargetInfluences, {
                [0]: value,
            });

        } else {

            for (let i = 0; i < 41; i++) {

                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: value,
                    duration: duration,
                    ease: "power1.inOut"
                })
                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: 0.5,
                    [i - 1]: 0.5,
                    duration: duration,
                    ease: "power1.inOut"
                })
                this.timeline.to(this.mesh.morphTargetInfluences, {
                    [i]: reverseValue,
                    [i - 1]: value,
                    duration: duration,
                    ease: "power1.inOut"
                });

            }

            this.timeline.set(this.mesh.morphTargetInfluences, {
                [41]: value,
            });

        }

        this.timeline.play();
    }

    setupMorphTargetsToInitialPosition() {
        if (this.mesh.morphTargetInfluences.length === 0) return

        for (let i = 0; i < this.mesh.morphTargetInfluences.length; i++) {
            this.mesh.morphTargetInfluences[i] = 0;
        }
        this.envelopOutline.resetOutline()
        this.envelopOutline.removeOutline()
    }

    updateMeshOpacity(value, delay = 0) {
        gsap.to(this.mesh.material, {
            opacity: value,
            delay: delay,
            duration: 1,
            onStart: () => {
                if (value === 1) {
                    this.mesh.material.visible = true
                } else if (value === 0) {
                    this.globalEvents.trigger('change-cursor', {name: 'default'})
                    this.envelopOutline.removeOutline()
                    this.animateCarouselItems(true, 0.2)
                }
            },
            onComplete: () => {
                if (value === 0) this.mesh.material.visible = false
            },
            ease: 'power2.inOut'
        })
    }

    mergeMeshes(meshes) {
        const group = new THREE.Group();
        meshes.forEach(mesh => {
            mesh.material.opacity = 0;
            group.add(mesh);
        });
        return group;
    }

}