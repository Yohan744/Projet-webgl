import * as THREE from 'three';
import Walkman from "../experience/World/Props/Essential/Walkman";
import Cassette from "../experience/World/Props/Essential/Cassette";
import Pencil from "../experience/World/Props/Essential/Pencil";
import Telephone from "../experience/World/Props/Telephone";
import RubiksCube from "../experience/World/Props/RubiksCube";
import Television from "../experience/World/Props/Essential/Television";
import RecordPlayer from "../experience/World/Props/RecordPlayer";

export const objectsData = {
    walkman: {
        file: Walkman,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.5,
        outlineScale: 1.05, // false to deactivate, type number to activate
        propSound: 'walkman', // not set yet
        spotId: 2 // spot where object belongs
    },
    cassette: {
        file: Cassette,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.4,
        outlineScale: 1.05,
        propSound: '',
        spotId: 1
    },
    crayon: {
        file: Pencil,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.6,
        outlineScale: 1.05,
        propSound: '',
        spotId: 2
    },
    telephone: {
        file: Telephone,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.05,
        propSound: 'telephone',
        spotId: 0
    },
    rubicub: {
        file: RubiksCube,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.6,
        outlineScale: 1.05,
        propSound: 'rubiksCube',
        spotId: 3
    },
    tv: {
        file: Television,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.05,
        propSound: 'tv',
        spotId: 3
    },
    tourne_disque1: {
        file: RecordPlayer,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.05,
        propSound: 'recordPlayer',
        spotId: 1
    },
}