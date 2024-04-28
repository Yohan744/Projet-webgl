import Experience from "../../Experience";
import * as THREE from "three";
import {HoverOutline} from "../../Utils/HoverOutline";
import {MouseUtils} from "../../Utils/MouseUtils";
import {CameraUtils} from "../../Utils/CameraUtils";

export default class Visionneuse {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        this.init();
        this.setupMouseEvents();
        this.animate = this.animate.bind(this);
        this.hasAnimatedToCamera = false;
        this.showOutline = true;
        this.isDragging = false;
        this.interactiveVisionneuse = new MouseUtils(this.visionneuseModel, this.camera);

        this.animate();
    }

    init() {
        this.visionneuseModel = this.resources.items.visionneuseModel.scene;
        this.modelHover = new HoverOutline(this.visionneuseModel, this.scene, true)

        this.scene.add(this.visionneuseModel);
        this.visionneuseModel.scale.set(1, 1, 1);
        this.visionneuseModel.position.set(3.8, 1.5, -1.5);

    }

    setupMouseEvents() {
        window.addEventListener('mousemove', this.mousemove.bind(this));
        window.addEventListener('click', this.handleClick.bind(this));
        window.addEventListener('mousedown', (event) => this.interactiveVisionneuse.onMouseDown(event));
        window.addEventListener('mousemove', (event) => this.interactiveVisionneuse.onMouseMove(event));
        window.addEventListener('mouseup', () => this.interactiveVisionneuse.onMouseUp());
    }


    mousemove(event) {
        this.mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        this.updateHover();
    }

    handleClick(event) {
        this.updateClick();
    }

    updateHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.visionneuseModel], true);
        if (intersects.length > 0) {
            if (!this.isDragging && this.showOutline) {
                if (!this.outlineMesh) {
                    this.outlineMesh = this.modelHover.onHover(intersects[0], this.scene);
                }
            }
        } else {
            this.onHoverExit();
        }
    }

    updateClick() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.visionneuseModel], true);

        if (intersects.length > 0) {
            if (this.outlineMesh) {
                this.onHoverExit();
            }
            this.showOutline = false;
            if (!this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.visionneuseModel, this.camera);
                this.hasAnimatedToCamera = true;
            }
        }
    }


    animate() {
        requestAnimationFrame(this.animate);

        this.renderer.render(this.scene, this.camera);
    }


    onHoverExit() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh = null;
        }
    }

}