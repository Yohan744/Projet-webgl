// import Experience from "../../Experience";
// import * as THREE from "three";
// import gsap from "gsap";
// import Pointer from "../../Utils/Pointer";
// import Outline from "../Effects/Outline";
// //import { MouseUtils } from "../Utils/MouseUtils";
// import { CameraUtils } from "../Utils/CameraUtils";
// import { MouseUtils } from "../Utils/MouseUtils";

// export default class Letter {
//     constructor() {
//         this.experience = new Experience();
//         this.scene = this.experience.scene;
//         this.resources = this.experience.resources;
//         this.renderer = this.experience.renderer.instance;
//         this.camera = this.experience.camera.instance;
//         this.pointer = this.experience.pointer
//         this.appStore = this.experience.appStore;
//         this.isOpen = false; 
//         this.mesh = new THREE.Mesh(
//             new THREE.BoxGeometry(1, 1, 1), 
//             new THREE.MeshBasicMaterial({color: 0xff0000})
//         );
//         this.init();
//     }

//     setDependencies(envelop, chestDrawer) {
//         this.envelop = envelop;
//         this.letterModel.position.set(0, 0, 0);
//         //this.letterModel.rotateZ(Math.PI / 2);
//         envelop.envelopModel.add(this.letterModel)
//         this.chestDrawer = chestDrawer;
//     }
//     getModel() {
//         return this.mesh;
//     }
//     init() {
//         this.letterModel = this.resources.items.letterModel.scene;
//        // this.interactiveLetter = new MouseUtils(this.letterModel, this.camera, this.pointer);
//        this.letterModel.position.set(0.1,0.1,0);
//        console.log(this.letterModel.position)
//        //this.letterModel.rotateZ(Math.PI / 2);

//         this.interactiveDahlia = new MouseUtils(this.letterModel, this.camera, this.pointer, this.renderer);
//         //this.scene.add(this.letterModel);
//     }

//     handleClick(event) {
//         const intersects = this.pointer.raycaster.intersectObjects([this.letterModel], true);
//         console.log(this.letterModel.position)
//         if (intersects.length > 0) {
//             if (!this.hasAnimatedToCamera) {
//                 CameraUtils.animateToCamera(this.letterModel, this.camera);
//                 this.hasAnimatedToCamera = true;
//             }
//         }
//     }

//     animateToPosition(x, y, z) {
//         gsap.to(this.letterModel.position, {
//             x: x,
//             y: y,
//             z: z,
//             duration: 1, 
//             onComplete: () => {
//                 console.log("Animation complete!");
//             }
//         });
//     }

//     // appear(envelopPosition) {
//     //     const offset = new THREE.Vector3(0, -0.5, 0); // Example offset
//     //     const targetPosition = envelopPosition.clone().add(offset);
//     //     console.log(this.letterModel);
//     //     return gsap.to(this.letterModel.position, {
//     //         x: targetPosition.x,
//     //         y: targetPosition.y,
//     //         z: targetPosition.z,
//     //         duration: 1,
//     //         onComplete: () => console.log("letter appeared next to Envelop!")
//     //     });
//     // }
    

//     destroy() {
//         this.pointer.off("click");
//         if (this.letterModel) {
//             this.letterModel.traverse(child => {
//                 if (child.isMesh) {
//                     child.material.dispose();
//                     child.geometry.dispose();
//                 }
//             });
//             this.scene.remove(this.letterModel);
//         }
//     }
// }