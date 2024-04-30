import * as THREE from "three";
import gsap from "gsap";

export class CameraUtils {
    static animateToCamera(model, camera) {
        const distance = 1;
        const planeDistance = 0.1;

        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(camera.quaternion);
        const targetPosition = new THREE.Vector3().addVectors(camera.position, forward.multiplyScalar(distance));

        const finalQuaternion = new THREE.Quaternion();
        finalQuaternion.setFromRotationMatrix(
            new THREE.Matrix4().lookAt(
                model.position,
                camera.position,
                new THREE.Vector3(0, 1, 0)
            )
        );

        gsap.timeline({
            onComplete: () => {
                model.position.copy(targetPosition);
                model.quaternion.copy(finalQuaternion);
            }
        })
            .to(model.position, {
                x: targetPosition.x,
                y: targetPosition.y,
                z: targetPosition.z,
                duration: 1,
                ease: "power2.inOut"
            })
            .to(model.quaternion, {
                x: finalQuaternion.x,
                y: finalQuaternion.y,
                z: finalQuaternion.z,
                w: finalQuaternion.w,
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
