import Experience from "../../Experience";
import * as THREE from "three";
import gsap from "gsap";
import { CameraUtils } from "../Utils/CameraUtils";
import Pointer from "../../Utils/Pointer";


export default class Carousel {
    constructor(scene, camera, group) {
        this.scene = scene;
        this.camera = camera;
        this.group = group;
        this.objects = Array.from(group.children);
        this.currentIndex = 0;

        this.bindKeyEvents();
    }

    bindKeyEvents() {
        window.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                this.rotateObjects(event.key === 'ArrowRight');
            }
        });
    }

    rotateObjects(clockwise = true) {
        if (clockwise) {
            const first = this.objects.shift();
            this.objects.push(first);
        } else {
            const last = this.objects.pop();
            this.objects.unshift(last);
        }
        this.updatePositions();
    }

    updatePositions() {
        this.objects.forEach((obj, index) => {
            obj.position.x = (index - 1) * 0.3; 
        });
    }
}

