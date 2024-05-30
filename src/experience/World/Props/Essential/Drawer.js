import Experience from "../../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import {useInteractableObjects} from "../../ObjectsInteractable";
import Outline from "../../Effects/Outline";
import {watch} from "vue";
import EventEmitter from "../../../Utils/EventEmitter";

export default class Drawer extends EventEmitter{
    constructor(mesh) {

        super()

        this.experience = new Experience();
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.globalEvents = this.experience.globalEvents;
        this.mesh = mesh;

        this.isOpen = false;
        this.drawerBasicPosition = this.mesh.position.clone();

        this.drawerOutline = new Outline(this.mesh, 1.02);
        this.pointer.on('click', this.handleClick.bind(this));

        this.experience.on('ready', () => {
            this.interactableObjects = useInteractableObjects();
            this.setWatchers()
        })

    }

    setWatchers() {

        this.interactableObjects.envelopModel.on('envelopIsNoLongerIsSky', () => {
            this.drawerOutline.showOutline()
            this.animateDrawer(false)
            this.gameManager.setActualObjectInteractingName(null)
        })

    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && this.gameManager.state.isCameraOnSpot && this.gameManager.state.isInteractingWithObject === false) {
            this.drawerOutline.removeOutline()
            this.animateDrawer(true);
            this.gameManager.updateInteractingState(true);
            this.gameManager.setActualObjectInteractingName("drawer");
            this.globalEvents.trigger('change-cursor', {name: 'default'})
        }
    }

    animateDrawer(state) {
        gsap.to(this.mesh.position, {
            x: state ? '+=' + 0.3 : this.drawerBasicPosition.x,
            z: state ? '+=' + 0.3 : this.drawerBasicPosition.z,
            duration: 1.5,
            ease: 'power2.inOut',
            onStart: () => {
                this.trigger('drawer-animation', [state])
            },
            onUpdate: () => {
                this.drawerOutline.updateOutlineMeshPosition(this.mesh.position)
            },
            onComplete: () => {
                if (state) {
                    this.trigger('envelop-animation')
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