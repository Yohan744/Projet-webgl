import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";

import Pointer from "../../Utils/Pointer";

export default class Carousel {
    constructor(scene, camera, objects) {
        this.scene = scene;
        this.camera = camera;
        this.objects = objects;
    }

    alignItems() {
        const angle = Math.PI * 2 / this.objects.length; 
        this.objects.forEach((obj, index) => {
            const radius = 5; 
            const theta = angle * index;
            const x = this.objects[0].initialPosition.x + radius * Math.cos(theta); 
            const y = this.objects[0].initialPosition.y;
            const z = this.objects[0].initialPosition.z + radius * Math.sin(theta);
            gsap.to(obj.model.position, {
                x: x,
                y: y,
                z: z,
                duration: 1,
                onComplete: () => console.log(obj.model.name + " positioned.")
            });
        });
    }
}

