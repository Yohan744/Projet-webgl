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
        this.rows = 60;
        this.columns = 60;
        this.particlesPerCell = 50;
        this.cells = {};
        this.cellMeshes = [];
        this.detectedCells = new Set();
        this.rotationInitiated = false;

        this.init();
    }

    init() {
        this.setupPhotoModel();
        this.setupGroup();
        this.setupParticles();
        this.setupGridCells();
        this.setupMouseEvents();
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

        const texture = this.resources.items.monabouquet;
        texture.repeat.set(1, -1); 
        texture.offset.set(0, 1); 
    
        this.photoModel.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.DoubleSide,
                    transparent: true,
                });
            }
        });

        this.group.add(this.photoModel);
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

        const particlesMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 3 }
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
        fragmentShader: `
            void main() {
                vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
                float dist = length(uv);

                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);

                vec4 color = vec4(0.3, 0.3, 0.3, alpha * 0.5); 

                gl_FragColor = color;
            }
        `,
        transparent: true,
        blending: THREE.NormalBlending, 
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

    detectCells(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cellMeshes);

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
    
    onMouseMove(event) {
        const cellIndices = this.detectCells(event);
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
                this.rotatePhoto();
            } else {
                this.fadeOut(this.cellMeshes[cellIndex]);
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
        switch (distance) {
            case 1:
                return 0.165;
            case 2:
                return 0.155;
            case 3:
                return 0.145;
            case 4:
                return 0.135;
            case 5:
                return 0.125;
            case 6:
                return 0.115;
            case 7:
                return 0.105;
            default:
                return 0;
        }
    }
    
    getDistanceBetweenCells(cellIndex1, cellIndex2) {
        const row1 = Math.floor(cellIndex1 / this.columns);
        const column1 = cellIndex1 % this.columns;
        const row2 = Math.floor(cellIndex2 / this.columns);
        const column2 = cellIndex2 % this.columns;
        return Math.sqrt(Math.pow(row1 - row2, 2) + Math.pow(column1 - column2, 2));
    }
    
    rotatePhoto() {
        const duration = 2000;
        const targetRotation = Math.PI; 
    
        const startRotation = this.group.rotation.z;
        const startTime = performance.now();
    
        const rotate = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = THREE.MathUtils.clamp(elapsed / duration, 0, 1);
    
            this.group.rotation.y = startRotation + progress * targetRotation;
    
            if (progress < 1) {
                requestAnimationFrame(rotate);
            } else {
                setTimeout(() => this.fadeOut(this.group), 5000); 
            }
        };
        rotate();
    }
    
    removeParticle(index) {
        const positions = this.particlesMesh.geometry.attributes.position.array;
        positions[index * 3] = NaN;
        positions[index * 3 + 1] = NaN;
        positions[index * 3 + 2] = NaN;
    }

    fadeOut(object, duration = 2000) {
        const startTime = performance.now();
        const fade = () => {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const opacity = THREE.MathUtils.clamp(1 - elapsed / duration, 0, 1);

            if (object instanceof THREE.Group) {
                object.traverse((child) => {
                    if (child.material) {
                        child.material.opacity = opacity;
                        child.material.transparent = true;
                    }
                });
            } else if (object.material) {
                object.material.opacity = opacity;
                object.material.transparent = true;
            }

            if (opacity > 0) {
                requestAnimationFrame(fade);
            } else {
                this.removeObject(object);
            }
        };
        fade();
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
