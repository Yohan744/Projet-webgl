import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import gsap from "gsap";
import EventEmitter from "../../../Utils/EventEmitter";
import {watch} from "vue";
import * as THREE from "three";
import Outline from "../../Effects/Outline";
import {getActualCursor} from "../../../../assets/js/Cursor";

export default class Envelop extends EventEmitter {

    constructor(mesh) {

        super()

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.soundManager = this.experience.soundManager;
        this.globalEvents = this.experience.globalEvents;
        this.timeline = gsap.timeline();

        this.mesh = mesh;
        this.mesh.rotation.order = 'YXZ';
        this.envelopBasicPosition = this.mesh.position.clone();
        this.envelopBasicRotation = this.mesh.rotation.clone();
        this.envelopRotationInSky = new THREE.Vector3(0, 2.17, 1.63);

        this.isEnvelopDiscovered = false

        this.isEnvelopInSky = false
        this.isEnvelopReadyToBeOpened = false
        this.isEnvelopOpen = false;
        this.carouselReady = false
        this.carouselIsMoving = false
        this.isDragging = false
        this.isRotating = false
        this.objectRotating = null

        this.voicesPlayed = [false, false, false, false, false, false]
        this.isSpeaking = false;

        this.carousel = new THREE.Group();
        this.carouselIndex = 0
        this.carouselItemsOffset = 0.4;
        this.dahliaBasicRotation = new THREE.Vector3(Math.PI * 0.5, -0.25, 0);
        this.letterBasicRotation = new THREE.Vector3(-Math.PI * 0.5, 0, Math.PI);
        this.cassetteBasicRotation = new THREE.Vector3(Math.PI * 0.5, 0, 0);
        this.cartePostaleBasicRotation = new THREE.Vector3(-Math.PI, Math.PI * 0.5, -Math.PI * 0.5);
        this.itemScaleArray = [1, 1.3, 1.5, 1.5, 1.5, 1.2]
        this.itemsName = ['lettre', 'dahlia', 'cartepostaleplage', 'cartespostalesmaison', 'cartepostalebiarritz', 'corps']

        this.initialMousePositionOnClick = {x: 0, y: 0}

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.envelopOutline = new Outline(this.mesh, 1.01);

            this.initCarousel()
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

                for (let i = 0; i < this.voicesPlayed.length; i++) {
                    this.soundManager.stop('commode' + (i + 1))
                }

                if (!this.isEnvelopInSky) {
                    this.trigger('envelopIsNoLongerIsSky')
                } else {
                    if (this.isEnvelopOpen) {
                        gsap.delayedCall(1.5, () => {
                            this.animateMorphTargets(false)
                        })
                    }
                    this.animateCarouselItems(false, 0)
                    this.animateEnvelopToSky(false, 1.5)
                }

                this.globalEvents.trigger('change-cursor', {name: 'default'})
                this.isEnvelopOpen = false

            }
        })

        this.pointer.on('click', this.handleClick.bind(this));
        this.pointer.on('click-release', this.handleClickRelease.bind(this));
        this.pointer.on('movement-orbit', this.handleMouseMove.bind(this));

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

    animateEnvelopToSky(state, delay = 0) {

        if (!this.isEnvelopDiscovered) {
            this.isEnvelopDiscovered = true
            this.soundManager.playSoundWithBackgroundFade('envelopeDiscover', 1.25)
        }

        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.7 : this.envelopBasicPosition.x + 0.23,
            y: state ? '+=' + 0.9 : this.envelopBasicPosition.y,
            z: state ? '+=' + 0.75 : this.envelopBasicPosition.z + 0.23,
            delay: delay,
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
                    this.carouselIndex = 0
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
            delay: delay,
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
            this.animateCarouselItemsScale()
            this.isEnvelopOpen = true
        }

        const intersectsCarousel = this.pointer.raycaster.intersectObjects(this.items, true);
        if (this.isEnvelopOpen && this.carouselReady) {
            this.initialMousePositionOnClick = {x: this.pointer.mouse.x, y: this.pointer.mouse.y}
            if (intersectsCarousel.length > 0) {
                const index = this.itemsName.indexOf(intersectsCarousel[0].object.name)
                if (index === this.carouselIndex) {
                    this.isRotating = true
                    this.objectRotating = intersectsCarousel[0].object
                } else if (!this.isSpeaking) {
                    this.animateCarouselItemsOnSide(index > this.carouselIndex ? -1 : 1)
                }
            } else {
                if (!this.isSpeaking) this.isDragging = true
            }
        }
    }

    handleClickRelease() {
        this.isDragging = false
        this.isRotating = false
        this.objectRotating = null
    }

    handleMouseMove() {
        if (this.isEnvelopOpen && this.carouselReady && !this.isSpeaking) {

            const x = this.pointer.getMousePosition().x
            const d = x - this.initialMousePositionOnClick.x

            if (this.isDragging) {
                if (Math.abs(d) > 0.03) {
                    this.animateCarouselItemsOnSide(d > 0 ? 1 : -1)
                    this.isDragging = false
                }
            }

            if (this.isRotating && this.objectRotating) {
                if (this.objectRotating.name === 'corps' || this.objectRotating.name.includes('bobine')) {
                    this.cassette.rotation.z = this.lerp(this.cassette.rotation.z, this.cassette.rotation.z - d * 0.3, 0.99)
                } else {
                    this.objectRotating.rotation.y = this.lerp(this.objectRotating.rotation.y, this.objectRotating.rotation.y + d * 0.3, 0.99)
                }
            }

            const intersectsCarousel = this.pointer.raycaster.intersectObjects(this.items, true);
            if (intersectsCarousel.length > 0) {
                const index = this.itemsName.indexOf(intersectsCarousel[0].object.name)
                if (index !== this.carouselIndex && getActualCursor() !== 'grab') {
                    this.globalEvents.trigger('change-cursor', {name: 'grab'})
                } else if (index === this.carouselIndex && getActualCursor() !== 'rotate') {
                    this.globalEvents.trigger('change-cursor', {name: 'rotate'})
                }
            } else {
                if (getActualCursor() !== 'default' && !this.isRotating) {
                    this.globalEvents.trigger('change-cursor', {name: 'default'})
                }
            }
        }
    }

    initCarousel() {

        this.carousel.position.set(-2.44, 2.15, -3.19);
        this.carousel.rotation.y = 0.625;
        this.carousel.visible = false;

        this.dahlia = this.interactableObjects.dahlia.mesh
        this.letter = this.interactableObjects.lettre.mesh
        const cassetteMeshes = this.interactableObjects.cassette.cassetteObjects
        const clonedObjects = []
        cassetteMeshes.map((object) => clonedObjects.push(object.clone()))
        this.cassette = this.mergeMeshes(clonedObjects)
        this.cartePostalePlage = this.interactableObjects.cartePostalePlage
        this.cartePostaleMaison = this.interactableObjects.cartePostaleMaison
        this.cartePostaleBiarritz = this.interactableObjects.cartePostaleBiarritz

        this.dahlia.rotation.order = 'YXZ';
        this.letter.rotation.order = 'YXZ';
        this.cassette.rotation.order = 'YXZ';
        this.cartePostaleBiarritz.rotation.order = 'YXZ';
        this.cartePostalePlage.rotation.order = 'YXZ';
        this.cartePostaleMaison.rotation.order = 'YXZ';

        this.dahlia.material.opacity = 0;
        this.letter.material.opacity = 0;
        this.cassette.opacity = 0;
        this.cartePostalePlage.opacity = 0;
        this.cartePostaleMaison.opacity = 0;
        this.cartePostaleBiarritz.opacity = 0;

        this.carousel.add(this.letter, this.dahlia, this.cartePostalePlage , this.cartePostaleMaison, this.cartePostaleBiarritz, this.cassette);
        this.items = [this.letter, this.dahlia, this.cartePostalePlage, this.cartePostaleMaison, this.cartePostaleBiarritz, this.cassette];

        this.dahlia.position.set(0, 0, 0);
        this.letter.position.set(0, 0, 0);
        this.cassette.position.set(0, 0, 0);
        this.cartePostalePlage.position.set(0, 0, 0);
        this.cartePostaleMaison.position.set(0, 0, 0);
        this.cartePostaleBiarritz.position.set(0, 0, 0);

        this.dahlia.rotation.setFromVector3(this.dahliaBasicRotation, 'YXZ');
        this.letter.rotation.setFromVector3(this.letterBasicRotation, 'YXZ');
        this.cassette.rotation.setFromVector3(this.cassetteBasicRotation, 'YXZ');
        this.cartePostalePlage.rotation.setFromVector3(this.cartePostaleBasicRotation, 'YXZ');
        this.cartePostaleMaison.rotation.setFromVector3(this.cartePostaleBasicRotation, 'YXZ');
        this.cartePostaleBiarritz.rotation.setFromVector3(this.cartePostaleBasicRotation, 'YXZ');

        this.scene.add(this.carousel);

    }

    animateCarouselItems(state, delay) {

        this.experience.renderer.toggleBlurEffect(state, state ? 0.35 : 0)

        this.items.forEach((item, index) => {

            gsap.to(item.position, {
                x: state ? this.carouselItemsOffset * index : 0,
                z: state ? this.carouselItemsOffset * 0.75 : 0,
                delay: 0.1 * index + delay,
                duration: 1.5,
                ease: 'power2.inOut',
                onStart: () => {
                    if (state) this.carousel.visible = true
                    if (!state) this.updateMeshOpacity(1, 1.2)
                    if (!state) this.carouselReady = false
                },
                onComplete: () => {
                    if (!state) this.carousel.visible = false
                    if (state) this.carouselReady = true
                    if (state && index === 0) this.playVoice('commode' + (this.carouselIndex + 1), this.carouselIndex)
                }
            })

            if (item instanceof THREE.Group) {
                item.traverse((child) => {
                    if (child.material) {
                        gsap.to(child.material, {
                            opacity: state ? 1 : 0,
                            delay: 0.1 * index + delay,
                            duration: 1.5,
                            ease: 'power2.inOut',
                        })
                    }
                });
            } else {
                gsap.to(item.material, {
                    opacity: state ? 1 : 0,
                    delay: 0.1 * index + delay,
                    duration: 1.5,
                    ease: 'power2.inOut',
                })
            }
        })

    }

    animateCarouselItemsOnSide(side) {

        if (this.carouselIsMoving || side === 1 && this.carouselIndex === 0 || side === -1 && this.carouselIndex === 5) return
        this.carouselIsMoving = true

        this.carouselIndex = side === 1 ? this.carouselIndex - 1 : this.carouselIndex + 1

        this.items.forEach((item, index) => {
            gsap.to(item.position, {
                x: '+=' + this.carouselItemsOffset * side,
                duration: 1,
                ease: 'power2.inOut',
                onComplete: () => {
                    this.carouselIsMoving = false
                    this.playVoice('commode' + (this.carouselIndex + 1), this.carouselIndex)
                }
            })
        })

        this.animateCarouselItemsScale()

    }

    animateCarouselItemsScale() {

        this.items.forEach((item, index) => {

            if (index === this.carouselIndex) {
                gsap.to(item.scale, {
                    x: this.itemScaleArray[index],
                    y: this.itemScaleArray[index],
                    z: this.itemScaleArray[index],
                    duration: 1,
                    ease: 'power2.inOut',
                })
            } else {
                gsap.to(item.scale, {
                    x: 0.6,
                    y: 0.6,
                    z: 0.6,
                    duration: 1,
                    ease: 'power2.inOut'
                })
            }

        })

    }

    animateMorphTargets(open) {
        if (this.mesh.morphTargetInfluences.length === 0) return;

        if (this.gameManager.state.gameStepId === 2) {
            this.gameManager.incrementGameStepId()
        }

        this.timeline.clear();

        this.soundManager.play('envelopeOpening')

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
        this.mesh.morphTargetInfluences[40] = 1;
        this.mesh.morphTargetInfluences[41] = 1;
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
                    this.animateCarouselItems(true, 0.75)
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
        meshes.forEach((mesh) => {
            const d = mesh.clone()
            d.material.opacity = 0;
            group.add(d);
        });
        return group;
    }

    lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }

    playVoice(voiceName, index) {
        if (this.voicesPlayed[index]) return;

        this.soundManager.playSoundWithBackgroundFade(voiceName, 1.25)
        this.isSpeaking = true;

        this.soundManager.sounds[voiceName].on('end', () => {
            this.voicesPlayed[index] = true
            this.isSpeaking = false;

            if (index === 5 && this.gameManager.state.gameStepId === 3) {
                this.gameManager.incrementGameStepId()
            }

        })

    }

    destroy() {
        this.scene.remove(this.mesh);
        this.scene.remove(this.carousel);
        this.mesh.geometry.dispose();
        this.pointer.off('click', this.handleClick.bind(this));
        this.pointer.off('click-release', this.handleClickRelease.bind(this));
        this.pointer.off('movement-orbit', this.handleMouseMove.bind(this));
    }

}