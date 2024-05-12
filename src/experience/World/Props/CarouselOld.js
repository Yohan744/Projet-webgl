// import Experience from "../../Experience";
// import * as THREE from "three";
// import gsap from "gsap";
// import { CameraUtils } from "../Utils/CameraUtils";
// import Pointer from "../../Utils/Pointer";


// export default class Carousel {
//     constructor(scene, camera, objects) {
//         this.scene = scene;
//         this.camera = camera;
//         this.objects = objects || [];  
//         this.currentIndex = 0; 
     
//         this.bindKeyEvents();
//     }

//     // initCarousel()

//     // créer un cercle autour de camera

//     alignItems() {
//         console.log(this.objects);
//         const angle = Math.PI * 2 / this.objects.length;
//         this.objects.forEach((obj, index) => {
//             const x = this.objects[0].initialPosition.x;
//             const y = this.objects[0].initialPosition.y;
//             const z = this.objects[0].initialPosition.z;
//             gsap.to(obj.model.position, {
//                 x: x,
//                 y: y,
//                 z: z,
//                 duration: 1,
//                 onComplete: () => console.log(obj.model.name + " positioned.")
//             });
//         });
//     }
    
//     nextObject() {
//         if (this.objects.length > 0) {
//             const previousIndex = this.currentIndex;
//             const nextIndex = (previousIndex + 1) % this.objects.length;

//             this.swapPositions(previousIndex, nextIndex);
//             this.currentIndex = nextIndex;

//             console.log(`Moved to next object: Current index is now ${this.currentIndex}`);
//         }
//     }

//     previousObject() {
//         if (this.objects.length > 0) {
//             const previousIndex = this.currentIndex;
//             const nextIndex = (previousIndex - 1 + this.objects.length) % this.objects.length;

//             this.swapPositions(previousIndex, nextIndex);
//             this.currentIndex = nextIndex;

//             console.log(`Moved to previous object: Current index is now ${this.currentIndex}`);
//         }
//     }
    

//     swapPositions(indexA, indexB) {
//         const objectA = this.objects[indexA];
//         const objectB = this.objects[indexB];

//         const posA = objectA.model.position.clone();
//         const posB = objectB.model.position.clone();

//         objectA.initialPosition.copy(posB);
//         objectB.initialPosition.copy(posA);

//         gsap.to(objectA.initialPosition, {
//             x: posB.x,
//             y: posB.y,
//             z: posB.z,
//             duration: 1
//         });

//         gsap.to(objectB.initialPosition, {
//             x: posA.x,
//             y: posA.y,
//             z: posA.z,
//             duration: 1
//         });

    
//         gsap.to(this.objects[indexB].initialPosition, {
//             x: posA.x,
//             y: posA.y,
//             z: posA.z,
//             duration: 1
//         });
//     }

//     bindKeyEvents() {
//         document.addEventListener('keydown', (event) => {
//             if (event.key === 'ArrowRight') {
//                 this.nextObject();
//             } else if (event.key === 'ArrowLeft') {
//                 this.previousObject();
//             }
//         });
//     }

//     destroy() {
//         document.removeEventListener('keydown', this.bindKeyEvents);
//     }
// }

// // export default class Carousel {
// //     constructor(scene, camera, objects) {
// //         this.scene = scene;
// //         this.camera = camera;
// //         this.objects = objects;
// //     }

// //     alignItems() {
// //         const angle = Math.PI * 2 / this.objects.length; 
// //         this.objects.forEach((obj, index) => {
// //             const radius = 5; 
// //             const theta = angle * index;
// //             const x = this.objects[0].initialPosition.x + radius * Math.cos(theta); 
// //             const y = this.objects[0].initialPosition.y;
// //             const z = this.objects[0].initialPosition.z + radius * Math.sin(theta);
// //             gsap.to(obj.model.position, {
// //                 x: x,
// //                 y: y,
// //                 z: z,
// //                 duration: 1,
// //                 onComplete: () => console.log(obj.model.name + " positioned.")
// //             });
// //         });
// //     }
// //     // focusOnObject(targetModel) {
// //     //    
// //     //     const position = new THREE.Vector3(); // Position cible pour la caméra
// //     //     const offset = new THREE.Vector3(0, 0, 5);
// //     //     targetModel.getWorldPosition(position);
// //     //     position.add(offset); 

// //     //     
// //     //     gsap.to(this.camera.position, {
// //     //         x: position.x,
// //     //         y: position.y,
// //     //         z: position.z,
// //     //         duration: 2,
// //     //         onUpdate: () => {
// //     //             this.camera.lookAt(targetModel.position); 
// //     //         }
// //     //     });
// //     // }

// //     // nextObject() {
// //     //     this.currentIndex = (this.currentIndex + 1) % this.objects.length;
// //     //     this.focusOnObject(this.objects[this.currentIndex].model);
// //     // }

// //     // previousObject() {
// //     //     this.currentIndex = (this.currentIndex - 1 + this.objects.length) % this.objects.length;
// //     //     this.focusOnObject(this.objects[this.currentIndex].model);
// //     // }
// // }

