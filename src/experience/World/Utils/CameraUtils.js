import * as THREE from "three";
import gsap from "gsap";

export class CameraUtils {

    static animateToCamera(model, camera) {
        const distance = 1;
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);

        const targetPosition = new THREE.Vector3().addVectors(camera.position, forward.multiplyScalar(distance));
        const targetDirection = new THREE.Vector3().subVectors(model.position, camera.position).normalize();
        const upDirection = new THREE.Vector3(0, 1, 0);

        const startRotation = model.quaternion.clone();
        const endRotation = new THREE.Quaternion().setFromUnitVectors(upDirection, targetDirection.negate());

        gsap.timeline({
            onComplete: () => {
                model.position.copy(targetPosition);
                model.quaternion.copy(endRotation);
            }
        })
            .to(model.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1,
                ease: "power2.inOut"
            })
            .to({ t: 0 }, {
                t: 1,
                onUpdate: function() {
                    model.quaternion.slerpQuaternions(startRotation, endRotation, this.targets()[0].t);
                },
                duration: 1,
                ease: "power2.inOut"
            }, "<");
    }

    static destroy() {
        if (CameraUtils.currentAnimation) {
            CameraUtils.currentAnimation.kill();
            CameraUtils.currentAnimation = null;
        }
    }
}
