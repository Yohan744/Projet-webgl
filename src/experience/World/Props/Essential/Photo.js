import * as THREE from "three";
import Experience from "../../../Experience";

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
        this.photoModel.position.set(0, 2.25, 9.32);
        this.photoModel.rotation.x = Math.PI / 2;
        this.scene.add(this.photoModel);
    }

    setupGroup() {
        this.group = new THREE.Group();
        this.group.position.copy(this.photoModel.position);
        this.photoModel.position.set(0, 0, 0);
        this.group.add(this.photoModel);
        this.scene.add(this.group);

        const t = this.resources.items.photoTexture
        t.flipY = true

        const rectangleGeometry = new THREE.PlaneGeometry(0.17, 0.12);
        const rectangleMaterial = new THREE.MeshBasicMaterial({
            map: t,
            side: THREE.DoubleSide,
            transparent: true,
        });
        this.rectangleMesh = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        this.rectangleMesh.position.set(0, 0, 0.01);
        this.group.add(this.rectangleMesh);
    }

    setupParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 20000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            const x = (Math.random() - 0.5) * 0.17;
            const y = (Math.random() - 0.5) * 0.12;
            const z = 0;
            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;
            this.initialPositions.push(new THREE.Vector3(x, y, z));
            this.activeParticles.push(true);
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.01,
            color: '#9f9f9f',
            transparent: true,
            opacity: 0.3
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.rectangleMesh.add(this.particlesMesh);
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 0.17 - 0.085;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 0.12 + 0.06;

        const positions = this.particlesMesh.geometry.attributes.position.array;
        const radius = 0.005;
        const radiusSquared = radius * radius; 

        for (let i = 0; i < this.initialPositions.length; i++) {
            if (!this.activeParticles[i]) continue;

            const pos = this.initialPositions[i];
            const dx = mouseX - pos.x;
            const dy = mouseY - pos.y;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < radiusSquared) {
                this.activeParticles[i] = false;
                positions[i * 3] = NaN;
                positions[i * 3 + 1] = NaN;
                this.displacedParticles++;
                if (this.displacedParticles >= this.initialPositions.length / 2) {
                    this.removeGroup();
                    break;
                }
            } else if (distanceSquared < radiusSquared * 4) {
                const distance = Math.sqrt(distanceSquared);
                const directionX = dx / distance;
                const directionY = dy / distance;
                const targetX = mouseX + directionX * radius;
                const targetY = mouseY + directionY * radius;

                positions[i * 3] += (targetX - pos.x) * 0.1;
                positions[i * 3 + 1] += (targetY - pos.y) * 0.1;
            }
        }
        this.particlesMesh.geometry.attributes.position.needsUpdate = true;
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
