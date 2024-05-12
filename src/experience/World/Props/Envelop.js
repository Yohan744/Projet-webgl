import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import Pointer from "../../Utils/Pointer";
import Outline from "../Effects/Outline";
//import { MouseUtils } from "../Utils/MouseUtils";
import { CameraUtils } from "../Utils/CameraUtils";
import Carousel from "./Carousel";
import { MouseUtils } from "../Utils/MouseUtils";

export default class Envelop {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer.instance;
        this.camera = this.experience.camera.instance;
        this.pointer = this.experience.pointer
        this.appStore = this.experience.appStore;
        this.isOpen = false; 
        this.pointer.on("click", this.handleClick.bind(this));
       
        this.raycaster = new THREE.Raycaster();
        this.envelopOpened = false;

        this.group = new THREE.Group();
        this.init();
    }
    setDependencies(dahlia, letter, chestDrawer) {
        this.dahlia = dahlia;
        this.letter = letter;
        this.chestDrawer = chestDrawer;
    }
  
    init() {
        this.envelopModel = this.resources.items.envelopModel.scene;
        this.envelopModel.position.set(-3.5, 0, -4);
        this.envelopModel.rotateZ(Math.PI / 2);
        this.scene.add(this.envelopModel);
    }

    handleClick(event) {
        const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel], true);
        if (intersects.length > 0) {
            if (this.chestDrawer.isOpen && !this.hasAnimatedToCamera) {
                CameraUtils.animateToCamera(this.envelopModel, this.camera);
                this.hasAnimatedToCamera = true;
                this.createLine();
                document.addEventListener('mousemove', (event) => this.hoverLine(event));
             
               // this.addAnchors();
                //this.addInteraction();
                //  gsap.delayedCall(1.5, () => { 
                //      this.animateMorphTargets();
                //      this.createGroup();
                //  });
            }
        }
    }

    animateToPosition(x, y, z) {
        gsap.to(this.envelopModel.position, {
            x: x,
            y: y,
            z: z,
            duration: 1, 
            onComplete: () => {
                console.log("Animation complete!");
            }
        });
    }    
    
    createGroup() {
        this.group = new THREE.Group();
        this.group.position.copy(this.envelopModel.position);
        console.log("Group position copied", this.group.position);
       
        this.group.add(this.envelopModel);
        this.group.add(this.dahlia.dahliaModel);
        this.group.add(this.letter.letterModel);
        this.envelopModel.position.set(0, 0, 0);
        this.dahlia.dahliaModel.position.set(0.5, 0, 0);
        this.letter.letterModel.position.set(1, 0, 0);
        this.group.rotateX(80 * (Math.PI / 180));
        this.scene.add(this.group);

        this.carousel = new Carousel(this.scene, this.camera, this.group);
        this.interactiveEnvelop = new MouseUtils(this.envelopModel, this.camera, this.pointer, this.renderer);
    }
    
  
    
    createLine() {
        const material = new THREE.MeshBasicMaterial({ color: 0x553755 });
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.07, 0.02, 0.1),
            new THREE.Vector3(0.07, 0.02, 0.1)
        ]);
        const geometry = new THREE.TubeGeometry(curve, 20, 0.005, 6, false);
        this.line = new THREE.Mesh(geometry, material);
        this.line.rotateY(Math.PI / 2);
        this.envelopModel.add(this.line);
    }
    
    hoverLine(event) {
        if (this.envelopOpened) return;
        event.preventDefault();
        let rect = this.renderer.domElement.getBoundingClientRect();
        let x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        let y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        const intersects = this.raycaster.intersectObject(this.line, true);

        if (intersects.length > 0) {
            console.log("Hovering over the line...");
            this.envelopOpened = true; 
            this.handleHover();
            this.createGroup();
            // Mettre à jour l'indicateur pour éviter des traitements répétitifs
        } else {
            console.log("Not hovering...");
        }
    }
    
    handleHover() {
        this.line.material.color.set(0xff0000); 
        const start = { x: 0.07 };
        const end = { x: -0.07 };
    
        // Animation du point de fin de la courbe
        gsap.to(start, {
            x: end.x,
            duration: 1,
            onUpdate: () => {
                this.line.geometry.dispose();  // Dispose l'ancienne géométrie pour éviter les fuites de mémoire
                this.line.geometry = new THREE.TubeGeometry(this.curve, 20, 0, 8, false);
            
            }
        });
    }
    
    handleNoHover() {
        // Réinitialise la couleur quand la souris n'est pas sur la ligne
        this.line.material.color.set(0x553755);  // Couleur initiale
    }



    animateMorphTargets(callback) {
        console.log("animation ")
      /*  console.log("Animating morph target here");
        console.log("anima:", this.envelopModel.animations);
        this.mixer = new THREE.AnimationMixer(this.envelopModel);
        const action = this.mixer.clipAction(this.envelopModel.animations[0]);
        action.play();
        gsap.to(this.envelopModel.morphTargetInfluences, {
            duration: 1.5,
            endArray: [1], // Exemple : animer vers le premier morph target
            onComplete: () => {
                console.log("Morph target animation complete");
                callback(); // Exécuter le callback après l'animation morph
            }
        });*/
    }

    
   
    // addAnchors() {
    //     const material = new THREE.MeshBasicMaterial({ color: 0x553755 }); // Couleur corrigée
    //     const geometry = new THREE.SphereGeometry(0.1, 0.5, 0.5);  // Taille augmentée pour visibilité

    //     this.anchors = [];
    //     const xOffset = 0.1;  // Ajustement pour être visible sur l'axe x

    //     // Positions centrées sur l'enveloppe, ajustées pour visibilité
    //     const anchorPositions = [
    //         new THREE.Vector3(-xOffset, 0.1, 0.1),  // Légèrement en avant pour être visible
    //         new THREE.Vector3(xOffset, 0, 0.1)    // Légèrement en avant pour être visible
    //     ];

    //     anchorPositions.forEach(pos => {
    //         const anchor = new THREE.Mesh(geometry, material);
    //         this.envelopModel.add(anchor);  // Ajout comme enfant de l'enveloppe
    //         anchor.position.copy(pos);
    //         this.anchors.push(anchor);
    //     });
    // }

    // addInteraction() {
    //     const raycaster = new THREE.Raycaster();
    //     const mouse = new THREE.Vector2();
    //     let selectedAnchor = null;

    //     const onMouseMove = (event) => {
    //         event.preventDefault();
    //         mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    //         mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
    //         if (selectedAnchor) {
    //             raycaster.setFromCamera(mouse, this.camera);
    //             const intersects = raycaster.intersectObjects([this.envelopModel], true);
    //             if (intersects.length > 0) {
    //                 const point = intersects[0].point;
    //                 point.z = selectedAnchor.position.z;
    //                 selectedAnchor.position.copy(point);
    //                 if (this.checkAnchorProximity()) {
    //                     this.createGroup();
    //                     window.removeEventListener('mousemove', onMouseMove);
    //                     window.removeEventListener('mouseup', onMouseUp);
    //                 }
    //             }
    //         }
    //     };
        

    //     const onMouseDown = (event) => {
    //         event.preventDefault();
    //         raycaster.setFromCamera(mouse, this.camera);
    //         const intersects = raycaster.intersectObjects(this.anchors);

    //         if (intersects.length > 0) {
    //             selectedAnchor = intersects[0].object;
    //             selectedAnchor.initialPosition = selectedAnchor.position.clone();
    //             window.addEventListener('mousemove', onMouseMove);
    //             window.addEventListener('mouseup', onMouseUp);
    //         }
    //     };

    //     const onMouseUp = (event) => {
    //         event.preventDefault();
    //         selectedAnchor = null;
    //     };

    //     window.addEventListener('mousedown', onMouseDown);
    // }

    // checkAnchorProximity() {
    //     const distanceThreshold = 0.05; // Distance seuil pour considérer 'toucher'
    //     const distance = this.anchors[0].position.distanceTo(this.anchors[1].position);
    //     return distance < distanceThreshold;
    // }
    destroy() {
        if (this.group) {
            this.scene.remove(this.group);
            this.group = null;
        }
    }
}