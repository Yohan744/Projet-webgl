import * as THREE from "three";
import Experience from "../../../Experience";
import MaterialLibrary from "../../../MaterialLibrary";
import gsap from "gsap";

export default class Picture {

    constructor(mesh) {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.pointer = this.experience.pointer;
        this.gameManager = this.experience.gameManager;
        this.materialLibrary = new MaterialLibrary()

        this.photoModel = mesh;
        this.displacedParticles = 0;
        this.initialPositions = [];
        this.activeParticles = [];
        this.rows = 60;
        this.columns = 60;
        this.particlesPerCell = 50;
        this.cells = {};
        this.cellMeshes = [];
        this.detectedCells = new Set();
        this.rotationInitiated = false;

        if (this.gameManager.state.gameStepId === 0) {
            this.init();
            this.setupParticles();
            this.setupGridCells();
            this.setupMouseEvents();
            this.experience.renderer.toggleBlurEffect(true);
        }

    }

    init() {
        this.photoModel.position.set(0, 2.22, 9.28);
        this.photoModel.rotation.set(-Math.PI * 0.5, 0, -Math.PI);
        this.photoModel.material.depthWrite = false;
        this.experience.renderer.toggleBlurEffect(true);

        this.group = new THREE.Group();
        this.group.position.copy(this.photoModel.position);
        this.photoModel.position.set(0, 0, 0);
        this.group.rotation.set(-0.23, 0, 0)
        this.group.add(this.photoModel);
        this.scene.add(this.group);
    }

    setupParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = this.rows * this.columns * this.particlesPerCell;
        const posArray = new Float32Array(particlesCount * 3);
        const scaleArray = new Float32Array(particlesCount);

        const width = 0.175;
        const height = 0.125;
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

        this.particlesMaterial = this.materialLibrary.getDustPictureMaterial()

        this.particlesMesh = new THREE.Points(particlesGeometry, this.particlesMaterial);
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
            color: 0x000000,
            transparent: true,
            visible: false,
            side: THREE.FrontSide,
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

    detectCells() {
        const intersects = this.pointer.raycaster.intersectObjects(this.cellMeshes);

        if (intersects.length > 0) {
            const cellIndex = this.cellMeshes.indexOf(intersects[0].object);
            if (!this.detectedCells.has(cellIndex)) {
                this.detectedCells.add(cellIndex);
                return [cellIndex, ...this.getNeighboringCells(cellIndex)];
            }
        }
        return [];
    }

    getNeighboringCells(cellIndex) {
        const neighbors = [];
        const row = Math.floor(cellIndex / this.columns);
        const column = cellIndex % this.columns;

        const addNeighbor = (r, c) => {
            if (r >= 0 && r < this.rows && c >= 0 && c < this.columns) {
                const distance = Math.sqrt(Math.pow(row - r, 2) + Math.pow(column - c, 2));
                if (distance <= 7) {
                    neighbors.push(r * this.columns + c);
                }
            }
        };

        for (let i = -7; i <= 7; i++) {
            for (let j = -7; j <= 7; j++) {
                if (i !== 0 || j !== 0) {
                    addNeighbor(row + i, column + j);
                }
            }
        }
        return neighbors;
    }

    onMouseMove() {
        const cellIndices = this.detectCells();
        cellIndices.forEach((cellIndex) => {
            this.removeCellParticles(cellIndex);
        });
        this.particlesMesh.geometry.attributes.position.needsUpdate = true;
    }

    removeCellParticles(cellIndex) {
        if (this.cells[cellIndex]) {
            const neighbors = this.getNeighboringCells(cellIndex);
            neighbors.forEach((neighbor) => {
                const distance = this.getDistanceBetweenCells(cellIndex, neighbor);
                const percentage = this.getRemovalPercentage(distance);
                this.removeParticlesInCell(neighbor, percentage);
            });

            this.removeParticlesInCell(cellIndex, 1);

            delete this.cells[cellIndex];

            if (this.displacedParticles >= this.initialPositions.length * 0.9 && !this.rotationInitiated) {
                this.rotationInitiated = true;
                this.rotateAndRemovePicture();
            } else {
                this.scene.remove(this.cellMeshes[cellIndex]);
            }
        }
    }

    removeParticlesInCell(cellIndex, percentage) {
        if (this.cells[cellIndex]) {
            this.cells[cellIndex].forEach((index) => {
                if (this.activeParticles[index] && Math.random() < percentage) {
                    this.activeParticles[index] = false;
                    this.removeParticle(index);
                    this.displacedParticles++;
                }
            });

            if (percentage === 1) {
                delete this.cells[cellIndex];
            }
        }
    }

    getRemovalPercentage(distance) {
        const percentages = [0, 0.165, 0.155, 0.145, 0.135, 0.125, 0.115, 0.105];
        return percentages[distance] || 0;
    }

    getDistanceBetweenCells(cellIndex1, cellIndex2) {
        const row1 = Math.floor(cellIndex1 / this.columns);
        const column1 = cellIndex1 % this.columns;
        const row2 = Math.floor(cellIndex2 / this.columns);
        const column2 = cellIndex2 % this.columns;
        return Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(column1 - column2, 2));
    }

    rotateAndRemovePicture() {
        const tl = gsap.timeline({
            onComplete: () => {
                this.removeObject(this.group);
                if (this.gameManager.state.gameStepId === 0) this.gameManager.incrementGameStepId()
            }
        });

        tl.to(this.group.rotation, {
            y: Math.PI,
            delay: 0.25,
            duration: 3,
            ease: 'power4.inOut'
        })

        tl.set(this.particlesMaterial.uniforms.uOpacity, {
            value: 0,
            delay: 3,
        }, 0);

        tl.to(this.photoModel.material, {
            opacity: 0,
            delay: 5,
            duration: 2.5,
            ease: 'power1.inOut',
            onStart: () => {
                this.experience.renderer.toggleBlurEffect(false);
                gsap.delayedCall(1, () => {
                    this.experience.renderer.setNormalPostProcessValues();
                })
            },
        }, 0);

    }

    removeParticle(index) {
        const positions = this.particlesMesh.geometry.attributes.position.array;
        positions[index * 3] = NaN;
        positions[index * 3 + 1] = NaN;
        positions[index * 3 + 2] = NaN;
    }

    removeObject(object) {
        if (object instanceof THREE.Group) {
            this.scene.remove(object);
            object.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) child.material.dispose();
            });
        } else {
            this.group.remove(object);
            if (object.geometry) object.geometry.dispose();
            if (object.material) object.material.dispose();
        }
    }

    destroy() {
        window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
}
