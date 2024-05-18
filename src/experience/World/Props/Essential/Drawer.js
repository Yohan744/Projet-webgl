import Experience from "../../../Experience";
import * as THREE from "three";
import gsap from "gsap";

export default class Drawer {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.camera = this.experience.camera;
        this.pointer = this.experience.pointer;

        this.isOpen = false;
        this.click = this.handleClick.bind(this)
        this.originalCameraPosition = null;

        this.init();
        this.setEvents();
    }

    init() {
        this.drawerModel = this.resources.items.drawerModel.scene;
        this.drawerModel.position.set(-3.5, 0, -4);
        this.scene.add(this.drawerModel);

        this.topDrawer = this.drawerModel.getObjectByName("tirroir-haut");

        this.envelopModel = this.resources.items.envelopModel.scene;
        this.envelopModel.visible = true;
        this.scene.add(this.envelopModel);
    }

    setEvents() {
        this.pointer.on("click", this.click);
    }

    handleClick() {
        const intersects = this.pointer.raycaster.intersectObject(this.topDrawer, true);
        if (intersects.length > 0 && !this.isOpen) {
            this.animateDrawer(this.topDrawer);
        }
    }

    animateDrawer(drawer) {
        if (!this.isOpen) {
            gsap.to(drawer.position, {
                x: drawer.position.x + 0.5,
                duration: 1,
                onUpdate: () => {
                },
                onComplete: () => {
                    this.isOpen = true;
                    this.positionEnvelopeInDrawer(this.topDrawer);
                    this.experience.camera.moveCameraToDrawer(this.topDrawer);
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
        this.pointer.off("click");
        this.scene.remove(this.drawerModel);
        this.drawerModel.traverse((child) => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
    }
}
