import * as THREE from 'three';
import Walkman from "../experience/World/Props/Walkman";
import Cassette from "../experience/World/Props/Cassette";

export const objectsData = {
    walkman: {
        file: Walkman,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        outlineScale: 1.05 // false to deactivate, type number to activate
    },
    cassette: {
        file: Cassette,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        outlineScale: 0.055 // false to deactivate, type number to activate
    },
}