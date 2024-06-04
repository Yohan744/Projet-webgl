import * as THREE from "three";
import Experience from "../../../Experience";
import {useInteractableObjects} from "../../ObjectsInteractable";
import {gsap} from 'gsap';
import SoundManager from "../../../../assets/js/SoundManager";
import Outline from "../../Effects/Outline";
import {watch} from "vue";

export default class TopChest {
    constructor(mesh) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.renderer = this.experience.renderer;
        this.soundManager = this.experience.soundManager;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;

        this.mesh = mesh;
        this.mixer = null;
        this.actions = {};

        this.isLocked = true;

        this.clock = new THREE.Clock();
        this.actionTimeScale = 0.35

        this.isOpen = false;

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.chestOutline = new Outline(this.mesh, 1.0075);

            this.setupAnimations();
            this.setWatchers()
        })

    }

    setWatchers() {
        this.pointer.on('click', this.onClick.bind(this));

        watch(() => this.gameManager.state.isInteractingWithObject, (value) => {
            if (!value && this.gameManager.state.actualObjectInteractingName === 'walkman') {
                this.isOpen = false;
                this.playAnimation("animation_0_filtered", true);
                this.gameManager.setActualObjectInteractingName(null);
                this.renderer.toggleBlurEffect(false);
                this.mixer.addEventListener('finished', (event) => {
                    const finishedAction = event.action;
                    if (finishedAction === this.actions['animation_0_filtered'] && this.actions['animation_0_filtered'].timeScale === -1) {
                        this.chestOutline.showOutline();
                    }
                });
            }
        })
    }

    onClick() {
        this.walkman = this.interactableObjects.walkmanInstance;
        const intersects = this.pointer.raycaster.intersectObjects([this.mesh], true);
        if (intersects.length > 0 && !this.walkman.canComeOut && this.gameManager.state.isCameraOnSpot) {

            if (this.isLocked) {
                this.animateMorphTarget(0, 1, 2);
            } else {
                this.soundManager.play("chest");
                this.playAnimation("animation_0_filtered")
                this.walkman.canComeOut = true;
                if (!this.walkman.isInFrontOfCamera) {
                    setTimeout(() => {
                        this.walkman.animateToCamera(!this.walkman.isInFrontOfCamera);
                    }, 1000)
                }
            }
            this.chestOutline.removeOutline()
            this.gameManager.updateInteractingState(true);
            this.gameManager.setActualObjectInteractingName('walkman')
            this.renderer.toggleBlurEffect(true, 5);
            this.globalEvents.trigger('change-cursor', {name: "default"})
        }
    }

    setupAnimations() {
        const animations = this.resources.items.objectsInteractableModel.animations;

        if (animations && animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.scene);

            const originalClip = animations.find(clip => clip.name === 'Anim_0');
            if (originalClip) {
                const positionTrack = originalClip.tracks[3];
                const quaternionTrack = originalClip.tracks[4];

                const newClip = new THREE.AnimationClip('animation_0_filtered', originalClip.duration, [positionTrack, quaternionTrack]);
                const action = this.mixer.clipAction(newClip);
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                action.timeScale = this.actionTimeScale;
                this.actions['animation_0_filtered'] = action;
            }
        }
    }

    animateMorphTarget(initialValue, finalValue, duration) {
        this.soundManager.play("lock");
        if (this.mesh.morphTargetInfluences) {
            gsap.to(this.mesh.morphTargetInfluences, {
                duration: duration,
                endArray: [finalValue],
                onComplete: () => {
                    this.isLocked = false;
                    this.soundManager.play("chest");
                    this.playAnimation("animation_0_filtered")
                    this.walkman.canComeOut = true;
                    if (!this.walkman.isInFrontOfCamera) {
                        setTimeout(() => {
                            this.walkman.animateToCamera(!this.walkman.isInFrontOfCamera);
                        }, 1000)
                    }
                }
            });
        }
    }

    playAnimation(animationName, reversed = false) {

        const action = this.actions[animationName];
        if (action) {
            console.log("Playing animation");

            if (reversed) {
                action.time = action.getClip().duration;
                action.paused = false;
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                action.timeScale = -1;
            } else {
                action.reset();
                action.paused = false;
                action.setLoop(THREE.LoopOnce);
                action.clampWhenFinished = true;
                action.timeScale = this.actionTimeScale;
            }

            if (reversed && this.isOpen || !reversed && !this.isOpen) action.play();
            this.isOpen = !this.isOpen;

        } else {
            console.warn(`Animation ${animationName} not found.`);
        }
    }

    update() {
        const delta = this.clock.getDelta();
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }


    destroy() {
        this.mixer?.stopAllAction();
    }
}
