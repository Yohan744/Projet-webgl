import Experience from "../../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import {useInteractableObjects} from "../../ObjectsInteractable";
import Outline from "../../Effects/Outline";
import {watch} from "vue";

export default class Drawer {
    constructor(mesh) {
        this.experience = new Experience();
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;
        this.interactableObjects = useInteractableObjects();
        this.mesh = mesh;

        this.isOpen = false;
        this.drawerBasicPosition = this.mesh.position.clone();

        this.drawerOutline = new Outline(this.mesh, 1.02);
        this.pointer.on('click', this.handleClick.bind(this));

        this.setWatchers()

    }

    setWatchers() {
        watch(() => this.gameManager.state.isInteractingWithObject, (state) => {
            if (!state && this.gameManager.state.actualObjectInteractingName === "drawer") {
                this.drawerOutline.showOutline()
                this.animateDrawer()
                this.gameManager.setActualObjectInteractingName(null)
            }
        })
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot && this.gameManager.state.isInteractingWithObject === false) {
            this.drawerOutline.removeOutline()
            this.animateDrawer();
            this.gameManager.updateInteractingState(true);
            this.gameManager.setActualObjectInteractingName("drawer");
            this.globalEvents.trigger('change-cursor', {name: 'default'})
        }
    }

    animateDrawer() {
        gsap.to(this.mesh.position, {
            x: this.isOpen ? this.drawerBasicPosition.x : '+=' + 0.3,
            z: this.isOpen ? this.drawerBasicPosition.z : '+=' + 0.3,
            duration: 1.5,
            ease: 'power2.inOut',
            onUpdate: () => {
                this.drawerOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                if (!this.isOpen) {
                    // this.positionEnvelopeInDrawer();
                }
                this.isOpen = !this.isOpen;
            }
        });
    }

    positionEnvelopeInDrawer() {
        const enveloppeMesh = this.interactableObjects.envelopModel?.mesh
        if (!enveloppeMesh) {
            console.error("Envelop model not found")
            return
        }

        const drawerPosition = new THREE.Vector3();
        this.mesh.getWorldPosition(drawerPosition);

        const envelopPositionX = drawerPosition.x;
        const envelopPositionY = drawerPosition.y + 0.1;
        const envelopPositionZ = drawerPosition.z;

        enveloppeMesh.rotation.set(-Math.PI * 2, 0.6, 0);
        enveloppeMesh.position.set(envelopPositionX, envelopPositionY, envelopPositionZ);
    }

    destroy() {
        this.pointer.off("click", this.handleClick);
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
        this.experience.scene.remove(this.mesh);
    }

}