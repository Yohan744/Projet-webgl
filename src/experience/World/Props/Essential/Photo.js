import * as THREE from "three";
import Experience from "../../../Experience";
import Outline from "../../Effects/Outline";
import { PI } from "three/examples/jsm/nodes/Nodes.js";

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
        this.init();
    }

    init() {
        this.photoModel = this.resources.items.photoModel.scene;
        this.photoModel.scale.set(1, 1, 1);
        this.photoModel.position.set(0, 2.25, 9.32);
        this.photoModel.rotation.x = Math.PI / 2;
        this.scene.add(this.photoModel);

        this.group = new THREE.Group();
        this.group.position.copy(this.photoModel.position);
        this.photoModel.position.set(0, 0, 0);
        this.group.add(this.photoModel);
        this.scene.add(this.group);

        const rectangleGeometry = new THREE.PlaneGeometry(0.17, 0.12);
        const rectangleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });
        this.rectangleMesh = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        this.rectangleMesh.position.set(0, 0, 0.01);
        this.group.add(this.rectangleMesh);

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 20000;
        const posArray = new Float32Array(particlesCount * 3);
        this.initialPositions = [];
        this.activeParticles = new Array(particlesCount).fill(true);

        for (let i = 0; i < particlesCount; i++) {
            const x = (Math.random() - 0.5) * 0.17;
            const y = (Math.random() - 0.5) * 0.12;
            const z = 0;
            posArray[i * 3] = x;
            posArray[i * 3 + 1] = y;
            posArray[i * 3 + 2] = z;
            this.initialPositions.push(new THREE.Vector3(x, y, z));
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.001,
            color: 0xffffff,
            transparent: true,
            opacity: 0.4
        });

        this.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.rectangleMesh.add(this.particlesMesh);

        this.setupMouseEvents();
    }

    setupMouseEvents() {
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseX = ((event.clientX - rect.left) / rect.width) * 0.17 - 0.085;
        const mouseY = -((event.clientY - rect.top) / rect.height) * 0.12 + 0.06;

        const positions = this.particlesMesh.geometry.attributes.position.array;
        const radius = 0.005;
        const distanceFactor = 0.1;

        for (let i = 0; i < this.initialPositions.length; i++) {
            if (!this.activeParticles[i]) continue;

            const pos = this.initialPositions[i];
            const dx = mouseX - pos.x;
            const dy = mouseY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < radius) {
                this.activeParticles[i] = false;
                positions[i * 3] = NaN;
                positions[i * 3 + 1] = NaN;
                this.displacedParticles++;
                this.checkDisplacedParticles(); 
            } else {
                if (distance < radius * 2) {
                    const directionX = dx / distance;
                    const directionY = dy / distance;
                    const targetX = mouseX + directionX * radius;
                    const targetY = mouseY + directionY * radius;

                    positions[i * 3] += (targetX - pos.x) * distanceFactor;
                    positions[i * 3 + 1] += (targetY - pos.y) * distanceFactor;
                }
            }
        }
        this.particlesMesh.geometry.attributes.position.needsUpdate = true;
    }

    checkDisplacedParticles() {
        const particlesCount = this.initialPositions.length;
        if (this.displacedParticles >= particlesCount / 3) {
            console.log('Au moins un tiers des particules ont été déplacées.');
            this.scene.remove(this.group);
            this.group.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
        }
    }

    destroy() {
        this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this));
        super.destroy();
    }
}
