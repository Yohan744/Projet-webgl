import Experience from "../../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import { useInteractableObjects } from "../../ObjectsInteractable";

export default class Drawer {
    constructor(mesh) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.pointer = this.experience.pointer;
        this.mesh = mesh;

        this.isOpen = false;
        this.click = this.handleClick.bind(this);
        this.originalCameraPosition = null;

        this.init();
        this.setEvents();
    }

    init() {
    }

    setEvents() {
        this.pointer.on("click", this.click);
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.mesh, true);
        if (intersects.length > 0 && !this.isOpen) {
            const interactableObjects = useInteractableObjects();
            console.log(interactableObjects)
            this.envelopModel = interactableObjects.envelopModel;
            this.animateDrawer(this.mesh);
        }
    }

    animateDrawer(drawer) {
        if (!this.isOpen) {
            gsap.to(drawer.position, {
                x: drawer.position.x + 0.3,
                z: drawer.position.z + 0.3,
                duration: 1,
                onComplete: () => {
                    this.isOpen = true;
                    this.positionEnvelopeInDrawer(this.mesh);
                    this.experience.camera.moveCameraToDrawer(this.mesh);
                }
            });
        } else {
            gsap.to(drawer.position, {
                x: drawer.position.x - 0.5,
                duration: 1,
                onComplete: () => {
                    this.isOpen = false;
                }
            });
        }
    }

    restoreCameraPosition() {
        if (this.originalCameraPosition) {
            this.camera.instance.position.copy(this.originalCameraPosition);
            this.camera.instance.lookAt(this.scene.position);
        }
    }

    positionEnvelopeInDrawer(drawer) {
        const drawerPosition = new THREE.Vector3();
        drawer.getWorldPosition(drawerPosition);
        const envelopPositionX = drawerPosition.x;
        const envelopPositionY = drawerPosition.y + 0.1;
        const envelopPositionZ = drawerPosition.z - 0.3;

        this.envelopModel.rotation.x = -Math.PI * 2;
        this.envelopModel.rotation.y += 0.6;
        this.envelopModel.rotation.z = 0;

        this.envelopModel.position.set(envelopPositionX, envelopPositionY, envelopPositionZ);
        this.envelopModel.visible = true;
    }

    destroy() {
        this.pointer.off("click", this.click);
        this.scene.remove(this.mesh);
        this.mesh.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
}
