import Experience from "../../Experience";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vertexShader from '../../Shaders/Blur/blur.glsl';
import fragmentShader from '../../Shaders/Blur/fragment.glsl';
import {HoverOutline} from "../../Utils/HoverOutline";
import { CameraUtils } from "../../Utils/CameraUtils";
import {MouseUtils} from "../../Utils/MouseUtils";

export default class Cassette {
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
        this.initPostProcessing();
        this.animate();
        this.interactiveCassette = new MouseUtils(this.cassetteModel, this.camera);
    }

    init() {
        this.cassetteModel = this.resources.items.cassetteModel.scene;
        this.locations = this.experience.locations;
        this.modelHover = new HoverOutline(this.cassetteModel, this.scene, true)

        this.scene.add(this.cassetteModel);
        this.cassetteModel.scale.set(0.09, 0.09, 0.09);
        this.cassetteModel.position.set(3.8, 1.3, -2.5);
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', this.mousemove.bind(this));
        window.addEventListener('click', this.handleClick.bind(this));
        window.addEventListener('mousedown', (event) => this.interactiveCassette.onMouseDown(event));
        window.addEventListener('mousemove', (event) => this.interactiveCassette.onMouseMove(event));
        window.addEventListener('mouseup', () => this.interactiveCassette.onMouseUp());
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
        const intersects = this.raycaster.intersectObjects([this.cassetteModel], true);
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
        const intersects = this.raycaster.intersectObjects([this.cassetteModel], true);

        if (intersects.length > 0) {
            if (this.outlineMesh) {
                this.onHoverExit();
            }
            this.showOutline = false;
            if (!this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.cassetteModel, this.camera);
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
