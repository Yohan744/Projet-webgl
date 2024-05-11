import * as THREE from "three";
import Experience from "../../../Experience";
import {DoubleSide} from "three";
import {DragControls} from "three/examples/jsm/controls/DragControls";

export default class Projector {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.renderer = this.experience.renderer.instance;
        this.clock = new THREE.Clock();
        this.animations = [];
        this.textures = [
            this.experience.resources.items.monasurf,
            this.experience.resources.items.monabouquet,
            this.experience.resources.items.backgroundTreeTexture
        ];
        this.textureIndex = 0;
        this.init();
    }

    init() {
        this.projectorModel = this.experience.resources.items.projectorModel.scene;
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.scene.add(this.projectorModel);

        this.initDraggableObjects();

        // this.setupAnimations(this.experience.resources.items.projectorModel.animations);
        this.animate();
        this.renderer.domElement.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    }

    initDraggableObjects() {
        const tireuse = this.projectorModel.getObjectByName('tireuse');

        this.setupDragControls([tireuse], { draggingThreshold: 0.1 });


        this.renderer.domElement.removeEventListener('pointerdown', this.handlePointerDown.bind(this));

        console.log("Objet draggable : ", this.dragControls.getObjects());
        console.log("DragControls activé : ", this.dragControls.enabled);
    }

    setupDragControls(objects) {
        this.dragControls = new DragControls(objects, this.camera, this.renderer.domElement);

        this.dragControls.addEventListener('dragstart', event => {
            console.log("Début du glisser-déposer. Arrêt des animations...");
            this.stopAnimations();
        });

        this.dragControls.addEventListener('dragend', event => {
            console.log("Fin du glisser-déposer. Reprise des animations...");
            this.resumeAnimations();
        });

        this.dragControls.addEventListener('drag', event => {
            console.log("Drag en cours...");
            event.object.position.z = THREE.MathUtils.clamp(event.object.position.z, -0.05, 0.05);
        });
    }

    stopAnimations() {
        console.log("Arrêt des animations");
        this.animations.forEach(action => {
            action.stop();
        });
    }

    resumeAnimations() {
        console.log("Reprise des animations");
    }


    moveRail(rail) {
        rail.position.x += 0.05;
        if (rail.position.x > 1) {
            rail.position.x = 0;
        }
    }
    setupSpotlight() {
        this.spotlight = new THREE.SpotLight(0xffffff, 60, 0, Math.PI * 0.05);
        this.spotlight.position.copy(this.projectorModel.position);
        this.spotlight.target.position.set(this.projectorModel.position.x + 0.7, this.projectorModel.position.y + 0.02, this.projectorModel.position.z);

        this.spotlight.angle = 0.1;
        this.spotlight.penumbra = 0.7;
        this.spotlight.decay = 1;
        this.spotlight.distance = 0;

        this.spotlight.castShadow = true;
        this.spotlight.shadow.mapSize.width = 1024;
        this.spotlight.shadow.mapSize.height = 1024;
        this.spotlight.shadow.camera.near = 1;
        this.spotlight.shadow.camera.far = 100;
        this.spotlight.shadow.camera.fov = 30;
        this.spotlight.shadow.camera.aspect = 6;
        this.spotlight.shadow.camera.focus = 0.6;

        const texture = this.textures[this.textureIndex];
        texture.flipY = true;
        this.spotlight.map = texture;
        this.spotlight.map.side = DoubleSide

        this.scene.add(this.spotlight.target);
        this.scene.add(this.spotlight);
    }

    setupAnimations(animations) {
        animations.forEach(clip => {
            const tracks = clip.tracks.map(track => new THREE.VectorKeyframeTrack(
                track.name,
                new Float32Array(track.times),
                new Float32Array(track.values)
            ));
            const animationClip = new THREE.AnimationClip(clip.name, clip.duration, tracks);
            const action = this.mixer.clipAction(animationClip);
            action.setLoop(THREE.LoopOnce);
            action.clampWhenFinished = true;
            this.animations.push(action);
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        // const delta = this.clock.getDelta();
        //this.mixer.update(delta);
        this.renderer.render(this.scene, this.camera);
    }

    handlePointerDown(event) {
        const intersects = this.experience.pointer.raycaster.intersectObject(this.projectorModel, true);
        if (intersects.length > 0) {
            // this.initDraggableObjects()
            //this.triggerAnimation();
            if (!this.isCameraMoved) {
                this.onModelClicked(intersects[0]);
                this.isCameraMoved = true;
            } else {
                const object = intersects[0].object;
                if (object.name === 'rail_Diapo') {
                    console.log("là")
                    this.moveRail(object);
                }
            }
        }
    }



    onModelClicked(intersect) {
        const offset = new THREE.Vector3(-1.3, 0.2, 0.5);
        const modelPosition = intersect.object.getWorldPosition(new THREE.Vector3());
        const targetPosition = modelPosition.clone().add(offset);
        this.experience.camera.lookAtSheet(targetPosition);
        this.setupSpotlight();
        this.isCameraMoved = true;
    }

    triggerAnimation() {
        if (this.animations.length > 0) {
            const action = this.animations[0];
            if (!action.isRunning()) {
                action.play();
                this.textureIndex = (this.textureIndex + 1) % this.textures.length;
                const newTexture = this.textures[this.textureIndex];
                newTexture.flipY = true;
                if (this.spotlight && this.spotlight.map) {
                    this.spotlight.map = this.textures[this.textureIndex];
                    this.spotlight.map.needsUpdate = true;
                }
                action.paused = false;
            }

            const targetTime = action.time + 0.30;
            if (targetTime >= action.getClip().duration) {
                action.reset();

                action.play();
            } else {
                const startTime = performance.now();
                const interpolateAnimation = () => {
                    const elapsed = performance.now() - startTime;
                    const t = Math.min(elapsed / 1000, 1);

                    action.time = THREE.MathUtils.lerp(action.time, targetTime, t);
                    this.mixer.update(0);

                    if (t < 1) {
                        requestAnimationFrame(interpolateAnimation);
                    } else {
                        action.paused = true;
                        if (targetTime >= action.getClip().duration) {
                            action.reset();
                            action.paused = true;
                        }
                    }
                };
                interpolateAnimation();
            }
        }
    }


    destroy() {
        if (this.mixer) {
            this.mixer.uncacheRoot(this.projectorModel);
        }
        if (this.projectorModel) {
            this.scene.remove(this.projectorModel);
            this.projectorModel.traverse(child => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    child.material.dispose();
                }
            });
        }
    }
}
