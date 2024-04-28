// Ca ne fonctionne pas pour le moment
import * as THREE from "three";

export class FloatAnimation {
    constructor(object) {
        this.object = object;
        this.clock = new THREE.Clock();
        this.isFloating = true;
    }

    startFloating() {
        this.clock.start();
        this.floatingBaseline = this.object.position.clone();
    }

    animate() {
        if (this.clock.running && this.isFloating) {
            const time = this.clock.getElapsedTime();
            this.object.position.y = this.floatingBaseline.y + Math.sin(time * Math.PI) * 0.1;
            this.object.position.x = this.floatingBaseline.x + Math.sin(time * Math.PI / 2) * 0.1;
        }
    }
}
