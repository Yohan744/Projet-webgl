import * as THREE from "three";
import Experience from "../../../Experience";
import gsap from "gsap";

export default class Projector {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.appStore = this.experience.appStore;

        this.animations = [];

        this.textures = [
            this.experience.resources.items.monasurf,
            this.experience.resources.items.monabouquet,
            this.experience.resources.items.backgroundTreeTexture
        ];

        this.isDragging = false;
        this.isAnimating = false;
        this.isFirstAnimationIsDone = false;

        this.mouseStartClickPosition = {
            x: 0,
            y: 0,
        };

        this.dragDistance = 0.3

        this.setEvents();
        this.init();
    }

    init() {
        this.projectorModel = this.experience.resources.items.projectorModel.scene;
        this.projectorModel.position.set(-3.8, 1.15, 4.5);
        this.scene.add(this.projectorModel);
    }

    setEvents() {
        this.pointer.on('click', this.onPointerDown.bind(this));
        this.pointer.on('movement-orbit', this.onPointerMove.bind(this));
        this.pointer.on('click-release', this.onPointerUp.bind(this));
    }

    onPointerDown() {
        const mousePosition = this.pointer.getMousePosition();
        this.pointer.raycaster.setFromCamera(mousePosition, this.camera);
        const intersects = this.pointer.raycaster.intersectObjects([this.projectorModel], true);

        if (intersects.length > 0 && intersects[0].object.name === 'tireuse') {
            this.isDragging = true;
            this.draggableModel = intersects[0].object;
            this.mouseStartClickPosition = {
                x: mousePosition.x,
                y: mousePosition.y,
            };
            console.log("ready")
            this.appStore.updateInteractingState(true)
        }
    }

    onPointerMove(mouse) {
        if (!this.isDragging || !this.draggableModel || this.isAnimating) return;

        if (!this.isFirstAnimationIsDone && (mouse.x + 1) - (this.mouseStartClickPosition.x + 1) > this.dragDistance) {
            console.log("Parfait")
            this.isAnimating = true
            gsap.to(this.draggableModel.position, {
                z: "+=0.05",
                duration: 1,
                onComplete: () => {
                    this.isAnimating = false
                    this.isFirstAnimationIsDone = true
                }
            })
        } else if (this.isFirstAnimationIsDone && (this.mouseStartClickPosition.x + 1) - (mouse.x + 1) > this.dragDistance) {
            console.log("Parfait")
            this.isAnimating = true
            gsap.to(this.draggableModel.position, {
                z: "-=0.05",
                duration: 1,
                onComplete: () => {
                    this.isAnimating = false
                    this.isFirstAnimationIsDone = false
                }
            })

        } else {
            console.log("pas assez loin")
        }
    }

    onPointerUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.draggableModel = null;
            this.appStore.updateInteractingState(false)
        }
    }

}
