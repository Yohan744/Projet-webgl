import * as THREE from "three";
import Experience from "../../../Experience";
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
        this.displacedParticles = 0;
        this.group = null;
        this.initialPositions = [];
        this.activeParticles = [];
        this.rows = 45;
        this.columns = 45;
        this.particlesPerCell = 20;
        this.cells = {};
        this.cellMeshes = [];
        this.detectedCells = new Set();

        this.init();
    }

    init() {
        this.setupPhotoModel();
        this.setupGroup();
        this.setupParticles();
        this.setupGridCells();
        this.setupMouseEvents();
        this.updateUndetectedCellsCount();
    }

    setupPhotoModel() {
        this.photoModel = this.resources.items.photoModel.scene;
        this.photoModel.position.set(0, 2.25, 9.25);
        this.photoModel.rotation.x = Math.PI / 2;
    }

    setupGroup() {
        this.group = new THREE.Group();
        this.group.position.copy(this.photoModel.position);
        this.photoModel.position.set(0, 0, 0);
        this.scene.add(this.group);
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
        const particlesCount = this.rows * this.columns * this.particlesPerCell;
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);

        const width = 0.17;
        const height = 0.12;
        const xSpacing = width / (this.columns - 1);
        const ySpacing = height / (this.rows - 1);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                const startIndex = (i * this.columns + j) * this.particlesPerCell;
                this.createParticlesForCell(i, j, xSpacing, ySpacing, width, height, posArray, scaleArray, startIndex);
            }
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 4 }
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

    createParticlesForCell(row, column, xSpacing, ySpacing, width, height, posArray, scaleArray, startIndex) {
        const cellIndex = row * this.columns + column;
        const cellParticles = [];

        for (let k = 0; k < this.particlesPerCell; k++) {
            const index = startIndex + k;
            const x = column * xSpacing - width / 2 + (Math.random() - 0.5) * xSpacing;
            const y = row * ySpacing - height / 2 + (Math.random() - 0.5) * ySpacing;
            const z = 0;

            posArray[index * 3] = x;
            posArray[index * 3 + 1] = y;
            posArray[index * 3 + 2] = z;

            this.initialPositions.push(new THREE.Vector3(x, y, z));
            this.activeParticles.push(true);
            cellParticles.push(index);

            scaleArray[index] = Math.random();
        }

        this.cells[cellIndex] = cellParticles;
    }

    setupGridCells() {
        const width = 0.17;
        const height = 0.12;
        const xSpacing = width / this.columns;
        const ySpacing = height / this.rows;

        const cellGeometry = new THREE.PlaneGeometry(xSpacing, ySpacing);
        const cellMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
            visible: false,
            side: THREE.DoubleSide
        });

        for (let i = 0; i < this.rows * this.columns; i++) {
            const cellMesh = new THREE.Mesh(cellGeometry, cellMaterial);
            const row = Math.floor(i / this.columns);
            const column = i % this.columns;
            cellMesh.position.set(
                column * xSpacing - width / 2 + xSpacing / 2,
                row * ySpacing - height / 2 + ySpacing / 2,
                0
            );
            this.group.add(cellMesh);
            this.cellMeshes.push(cellMesh);
        }
    }

    setupMouseEvents() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    detectCell(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.cellMeshes);

        if (intersects.length > 0) {
            const cellIndex = this.cellMeshes.indexOf(intersects[0].object);
            if (!this.detectedCells.has(cellIndex)) {
                this.detectedCells.add(cellIndex);
                this.updateUndetectedCellsCount();
                return cellIndex;
            }
        }

        return -1;
    }

    onMouseMove(event) {
        const cellIndex = this.detectCell(event);
        if (cellIndex !== -1) {
            this.removeCellParticles(cellIndex);
            this.particlesMesh.geometry.attributes.position.needsUpdate = true;
        }
    }

    removeCellParticles(cellIndex) {
        if (this.cells[cellIndex]) {
            this.cells[cellIndex].forEach((index) => {
                if (this.activeParticles[index]) {
                    this.activeParticles[index] = false;
                    this.removeParticle(index);
                    this.displacedParticles++;
                }
            });

            delete this.cells[cellIndex];

            if (this.displacedParticles >= this.initialPositions.length) {
                this.fadeOutGroup();
            }
        }
    }

    removeParticle(index) {
        const positions = this.particlesMesh.geometry.attributes.position.array;
        positions[index * 3] = NaN;
        positions[index * 3 + 1] = NaN;
        positions[index * 3 + 2] = NaN;
    }

    updateUndetectedCellsCount() {
        const undetectedCells = this.rows * this.columns - this.detectedCells.size;
        console.log(`Undetected Cells: ${undetectedCells}`);
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
