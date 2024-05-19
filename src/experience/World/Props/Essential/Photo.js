import * as THREE from "three";
import Experience from "../../../Experience";
import dustVertexShader from "./../../../Shaders/Dust/vertex.glsl";
import dustFragmentShader from "./../../../Shaders/Dust/fragment.glsl";

export default class Photo {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        this.isHovering = false;
        this.displacedParticles = 0;
        this.group = null;
        this.initialPositions = [];
        this.activeParticles = [];

        this.init();
    }

    init() {
        this.setupPhotoModel();
        this.setupGroup();
        this.setupParticles();
        this.setupMouseEvents();
    }

    setupPhotoModel() {
        this.photoModel = this.resources.items.photoModel.scene;
        this.photoModel.position.set(0, 2.25, 9.25);
        this.photoModel.rotation.x = Math.PI / 2;
        // this.scene.add(this.photoModel);
    }

    setupGroup() {
        this.group = new THREE.Group();
        this.group.position.copy(this.photoModel.position);
        this.photoModel.position.set(0, 0, 0);
        // this.group.add(this.photoModel);
        this.scene.add(this.group);

        // const texture = this.resources.items.photoTexture;
        const texture = this.resources.items.backgroundTreeTexture;

        const rectangleGeometry = new THREE.PlaneGeometry(0.17, 0.12);
        const rectangleMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.rectangleMesh = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        this.rectangleMesh.position.set(0, 0, 0);
        this.group.add(this.rectangleMesh);
    }

    setupParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 400;
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const x = (Math.random() - 0.5) * 0.17;
            const y = (Math.random() - 0.5) * 0.12;
            const z = 0;
            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;
            this.initialPositions.push(new THREE.Vector3(x, y, z));
            this.activeParticles.push(true);

            scaleArray[i] = Math.random();
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: {value: 0},
                uPixelRatio: {value: Math.min(window.devicePixelRatio, 2)},
                uSize: {value: 50}
            },
            vertexShader: `
            
            uniform float uPixelRatio;
            uniform float uSize;
            attribute float aScale;
            
            void main() {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;
            
                gl_Position = projectionPosition;
                gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);
            }
            `,
            fragmentShader: dustFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.group.add(this.particlesMesh);
        this.particlesMesh.position.set(0, 0, 0.001);
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 0.17 - 0.085;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 0.12 + 0.06;

        const positions = this.particlesMesh.geometry.attributes.position.array;
        const radius = 0.04;
        const radiusSquared = radius * radius;

        for (let i = 0; i < this.initialPositions.length; i++) {
            if (!this.activeParticles[i]) continue;

            const posX = positions[i * 3];
            const posY = positions[i * 3 + 1];

            const dx = mouseX - posX;
            const dy = mouseY - posY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < radiusSquared) {
                this.activeParticles[i] = false;
                this.removeParticle(i);
                this.displacedParticles++;
                if (this.displacedParticles >= this.initialPositions.length) {
                    this.fadeOutGroup();
                    break;
                }
            }
        }

        this.particlesMesh.geometry.attributes.position.needsUpdate = true;
    }

    removeParticle(index) {
        const positions = this.particlesMesh.geometry.attributes.position.array;
        positions[index * 3] = NaN;
        positions[index * 3 + 1] = NaN;
        positions[index * 3 + 2] = NaN;
    }

    fadeOutGroup(duration = 2000) {
        const startTime = performance.now();
        const fade = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const opacity = THREE.MathUtils.clamp(1 - elapsed / duration, 0, 1);

            this.group.traverse((object) => {
                if (object.material) {
                    object.material.opacity = opacity;
                    object.material.transparent = true;
                }
            });

            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                this.removeGroup();
            }
        };
        fade();
    }

    removeGroup() {
        this.scene.remove(this.group);
        this.group.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        });
    }

    destroy() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
}
