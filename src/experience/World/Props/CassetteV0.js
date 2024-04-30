import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import vertexShader from '../../Shaders/Blur/blur.glsl';
import fragmentShader from '../../Shaders/Blur/fragment.glsl';


export default class CassetteV0 {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.clock = new THREE.Clock();

        this.init();
        this.setupMouseEvents();
        this.animate = this.animate.bind(this);
        this.prevMousePosition = new THREE.Vector2();
        this.isFloating = true;
        this.hasAnimatedToCamera = false;
        this.showOutline = true;
        this.initMouseHandlers();
        this.initPostProcessing();
        this.animate();
    }

    init() {
        this.cassetteModel = this.resources.items.cassetteModel.scene;
        this.locations = this.experience.locations;

        this.scene.add(this.cassetteModel);
        this.cassetteModel.scale.set(0.09, 0.09, 0.09);
        this.cassetteModel.position.set(3.8, 1.3, -2.5);

        const planeGeometry = new THREE.PlaneGeometry(2, 2);
        const planeMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                blur_size: { value: new THREE.Vector2(0.5, 0.5) },
                opacity: { value: 0.7 }
            },
            depthWrite: false,
            depthTest: false,
            transparent: true
        });


        this.backgroundPlane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.backgroundPlane.position.z = -1;
        this.scene.add(this.backgroundPlane);
        this.backgroundPlane.visible = false;
    }

    onMouseDown(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([this.cassetteModel]);

        if (intersects.length > 0) {
            this.isDragging = true;
            this.isFloating = false;
            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }

    onMouseMove(event) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.prevMousePosition.x;
            const deltaY = event.clientY - this.prevMousePosition.y;

            const rotationSpeed = 0.005;
            this.cassetteModel.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), deltaX * rotationSpeed);
            this.cassetteModel.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), deltaY * rotationSpeed);

            this.prevMousePosition.set(event.clientX, event.clientY);
        }
    }

    onMouseUp() {
        this.isDragging = false;
        this.isFloating = true;
    }

    initMouseHandlers() {
        window.addEventListener('mousedown', (event) => this.onMouseDown(event));
        window.addEventListener('mousemove', (event) => this.onMouseMove(event));
        window.addEventListener('mouseup', () => this.onMouseUp());
    }

    initPostProcessing() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);
        this.blurPass = new ShaderPass(new THREE.ShaderMaterial({
            uniforms: {
                tDiffuse: { value: null },
                h: { value: 1.0 / window.innerWidth },
                v: { value: 1.0 / window.innerHeight }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader
        }));
        this.blurPass.enabled = false;
        this.composer.addPass(this.blurPass);
    }


    setupMouseEvents() {
        window.addEventListener('mousemove', this.mousemove.bind(this));
        window.addEventListener('click', this.handleClick.bind(this));
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
                this.onHover(intersects[0]);
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
                this.animateToCamera();
                this.hasAnimatedToCamera = true;
            }
        }
    }

    animateToCamera() {
        const distanceFromCamera = 7;

        const backward = new THREE.Vector3(0, 0, 1);
        backward.applyQuaternion(this.camera.quaternion);
        const planePosition = new THREE.Vector3().addVectors(this.camera.position, backward.multiplyScalar(distanceFromCamera));

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.camera.quaternion);
        const targetPosition = new THREE.Vector3().addVectors(this.camera.position, forward.multiplyScalar(1));

        gsap.timeline({
            onComplete: () => {
                this.cassetteModel.position.copy(targetPosition);
                this.startFloating();
                this.backgroundPlane.position.copy(planePosition);
                this.backgroundPlane.lookAt(this.camera.position);

                const fovHeight = 2 * Math.tan((this.camera.fov * Math.PI / 180) / 2) * distanceFromCamera;
                const fovWidth = fovHeight * this.camera.aspect;
                this.backgroundPlane.scale.set(fovWidth, fovHeight, 1);
                this.backgroundPlane.visible = true;
            }
        })
            .to(this.cassetteModel.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1,
                ease: "power2.inOut"
            });
    }



    startFloating() {
        this.clock.start();
        this.floatingBaseline = this.cassetteModel.position.clone();
    }

    animate() {
        requestAnimationFrame(this.animate);

        if (this.clock.running && this.isFloating) {
            const time = this.clock.getElapsedTime();
            this.cassetteModel.position.y = this.floatingBaseline.y + Math.sin(time * Math.PI) * 0.1;
            this.cassetteModel.position.x = this.floatingBaseline.x + Math.sin(time * Math.PI / 2) * 0.1;
        }
        this.renderer.render(this.scene, this.camera);

        if (this.backgroundPlane.visible) {
            this.composer.render();
        }
    }

    onHover(intersect) {
        if (this.showOutline && !this.outlineMesh) {
            const outlineMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.BackSide});
            outlineMaterial.depthWrite = false;

            const boundingBox = new THREE.Box3().setFromObject(intersect.object);
            const size = new THREE.Vector3();
            boundingBox.getSize(size);

            const outlineGeometry = new THREE.BoxGeometry(size.x * 1.02, size.y * 1.01, size.z * 1.01);
            this.outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
            this.outlineMesh.position.copy(boundingBox.getCenter(new THREE.Vector3()));
            this.scene.add(this.outlineMesh);
        }
    }

    onHoverExit() {
        if (this.outlineMesh) {
            this.scene.remove(this.outlineMesh);
            this.outlineMesh = null;
        }
    }

}
