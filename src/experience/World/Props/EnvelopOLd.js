// import Experience from "../../Experience";
// import * as THREE from "three";
// import gsap from "gsap";
// import Pointer from "../../Utils/Pointer";
// import Outline from "../Effects/Outline";
// //import { MouseUtils } from "../Utils/MouseUtils";
// import { CameraUtils } from "../Utils/CameraUtils";
// import Carousel from "./Carousel";
// import { MouseUtils } from "../Utils/MouseUtils";

// export default class Envelop {
//     constructor() {
//         this.experience = new Experience();
//         this.scene = this.experience.scene;
//         this.resources = this.experience.resources;
//         this.renderer = this.experience.renderer.instance;
//         this.camera = this.experience.camera.instance;
//         this.pointer = this.experience.pointer
//         this.appStore = this.experience.appStore;
//         this.isOpen = false; 
//         this.pointer.on("click", this.handleClick.bind(this));
//         this.init();
//     }
//     setDependencies(dahlia, letter, chestDrawer) {
//         this.dahlia = dahlia;
//         this.letter = letter;
//         this.chestDrawer = chestDrawer;
//     }

//     init() {
//         this.envelopModel = this.resources.items.envelopModel.scene;
//         //this.outline = new Outline(this.scene, this.envelopModel, 0.05, 0xffffff);
//         this.envelopModel.position.set(-3.5, 0, -4);
//         this.envelopModel.rotateZ(Math.PI / 2);
      
//         this.interactiveEnvelop = new MouseUtils(this.envelopModel, this.camera, this.pointer, this.renderer);
//         this.scene.add(this.envelopModel);
//     }
//     handleClick(event) {
//         const intersects = this.pointer.raycaster.intersectObjects([this.envelopModel], true);
//         if (intersects.length > 0) {
//             if (this.chestDrawer.isOpen && !this.hasAnimatedToCamera) {
//                 //this.positionEnvelopInFrontOfCamera();
//                 //this.hasAnimatedToCamera = true;
//                 CameraUtils.animateToCamera(this.envelopModel, this.camera);
//                 this.hasAnimatedToCamera = true;
//                 gsap.delayedCall(1.5, () => { 
//                     this.triggerCarouselView();
//                 });
//             }
//         }
//     }

//     animateToPosition(x, y, z) {
//         gsap.to(this.envelopModel.position, {
//             x: x,
//             y: y,
//             z: z,
//             duration: 1, 
//             onComplete: () => {
//                 console.log("Animation complete!");
//             }
//         });
//     }

//     triggerCarouselView() {

//         this.group = new THREE.Group();
//         this.group.position.copy(this.envelopModel.position); 
//         this.group.add(this.envelopModel);
    
//         this.envelopModel.position.set(0, 0, 0);
//         this.scene.add(this.group); 
        





//         //obts 3D vides, ajouter deans les objets;
//         /*  
//         //const basePosition = this.envelopModel.position.clone();
//         this.group = new THREE.Group();
//         //this.carousel = new Carousel(this.scene, this.camera, objects);
//         this.carousel.group.position.copy(this.envelopModel.position);
//         this.carousel.group.add(this.envelopModel);
//         this.envelopModel.position.set(0,0,0);
//         let timeline = gsap.timeline();
//         const offsetDistance = 0.5;
//         timeline.add(() => {
//             const objects = [
//                 { model: this.envelopModel, initialPosition: new THREE.Vector3(basePosition.x, basePosition.y, basePosition.z) },
//                 // { model: this.dahlia.getModel(), initialPosition: new THREE.Vector3(basePosition.x + offsetDistance, basePosition.y, basePosition.z) },
//                 //{ model: this.letter.getModel(), initialPosition: new THREE.Vector3(basePosition.x + 2 * offsetDistance, basePosition.y, basePosition.z) }
//             ];
//             const carousel = new Carousel(this.scene, this.camera, objects);
//             carousel.alignItems();
//             console.log("Carousel displayed.");
//         });
//         timeline.add(this.dahlia.appear(basePosition));
//         timeline.add(this.letter.appear(basePosition), "-=0.5"); 
//     */
// }
    

//     destroy() {
//         this.items.forEach(item => {
//             item.visible = false; // ou this.scene.remove(item) si vous voulez les enlever complètement
//         });
   
//         this.pointer.off("click");
//         if (this.envelopModel) {
//             this.envelopModel.traverse(child => {
//                 if (child.isMesh) {
//                     child.material.dispose();
//                     child.geometry.dispose();
//                 }
//             });
//             this.scene.remove(this.envelopModel);
//         }
//     }
// }