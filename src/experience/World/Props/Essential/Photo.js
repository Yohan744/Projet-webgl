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
        this.mixer = null;
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1), 
            new THREE.MeshBasicMaterial({color: 0xff0000})
                 );
        this.init();
    }

    init() {
        this.photoModel = this.resources.items.photoModel.scene
        this.photoModel.scale.set(1, 1, 1);
        this.photoModel.position.set(0, 2.25, 9.32);
        
        this.photoModel.rotation.x = Math.PI / 2;
        this.scene.add(this.photoModel);

        const group = new THREE.Group();
        group.position.copy(this.photoModel.position)
        group.add(this.photoModel);    
        this.photoModel.position.set(0, 0, 0);
        console.log(group.position)
        this.scene.add(group);

        const rectangleGeometry = new THREE.PlaneGeometry(0.17, 0.17);  
        const rectangleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });
        const rectangleMesh = new THREE.Mesh(rectangleGeometry, rectangleMaterial);
        rectangleMesh.position.set(0, 0, 0.01);
        group.add(rectangleMesh);

        // Création des particules
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 10000;  // Nombre de particules
        const posArray = new Float32Array(particlesCount * 3); // Trois valeurs par particule (x, y, z)

        for (let i = 0; i < particlesCount; i++) {
            // Répartit les particules uniformément sur le rectangle
            posArray[i * 3 + 0] = (Math.random() - 0.5) * 0.17; // Coordonnées x, ajustées à la largeur du rectangle
            posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.11; // Coordonnées y, ajustées à la hauteur du rectangle
            posArray[i * 3 + 2] = 0; // Coordonnées z, sur le plan du rectangle
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.001,
            sizeAttenuation: true,
            color: 0xffffff,  
            transparent: true,
            opacity: 0.3
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
rectangleMesh.add(particlesMesh); // Ajoute les particules au rectangle
    }
    onClick() {
        console.log("photo")
    }

    destroy() {
        super.destroy()
    }
}
