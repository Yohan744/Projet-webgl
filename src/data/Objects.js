import * as THREE from 'three';
import Walkman from "../experience/World/Props/Essential/Walkman";
import Cassette from "../experience/World/Props/Essential/Cassette";
import Pencil from "../experience/World/Props/Essential/Pencil";
import Telephone from "../experience/World/Props/Telephone";
import RubiksCube from "../experience/World/Props/RubiksCube";
import Television from "../experience/World/Props/Essential/Television";
import RecordPlayer from "../experience/World/Props/RecordPlayer";
import Telecran from "../experience/World/Props/Telecran";
import Letter from "../experience/World/Props/Essential/Letter";
import BottomChest from "../experience/World/Props/Essential/BottomChest";
import TopChest from "../experience/World/Props/Essential/TopChest";

export const objectsData = {
    walkman: {
        file: Walkman,
        //rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.5,
        outlineScale: 1.05, // false to deactivate, type number to activate
        propSound: 'walkman', // not set yet
    },
    cassette: {
        file: Cassette,
        rotationOnClick: new THREE.Vector3(1.33, 0.04, -0.44),
        animateToCameraOnClick: true,
        distanceToCamera: 0.2,
        outlineScale: 1.05,
        propSound: 'cassette',
    },
    crayon: {
        file: Pencil,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.01,
        outlineScale: 1.1,
        propSound: '',
    },
    telephone: {
        file: Telephone,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.04,
        propSound: 'telephone',
    },
    rubicub: {
        file: RubiksCube,
        rotationOnClick: new THREE.Vector3(0, -Math.PI * 0.2, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.6,
        outlineScale: 1.05,
        propSound: 'rubiksCube',
    },
    tv: {
        file: Television,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1.2,
        outlineScale: 1.03,
        propSound: 'tv',
    },
    tableau_magique1: {
        file: Telecran,
        rotationOnClick: new THREE.Vector3(0, 0, -Math.PI * 0.35),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.05,
        propSound: 'telecran',
    },
    tourne_disque1: {
        file: RecordPlayer,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.02,
        propSound: 'recordPlayer',
    },
    lettre: {
        file: Letter,
        rotationOnClick: new THREE.Vector3(1.2, 1.88, 0.04),
        animateToCameraOnClick: true,
        distanceToCamera: 0.4,
        outlineScale: 1.05,
        propSound: '',
    },
    malle_bas: {
        file: BottomChest,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: false,
        distanceToCamera: 0,
        outlineScale: 1.02,
        propSound: '',
    },
    malle_haut: {
        file: TopChest,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: false,
        distanceToCamera: 0,
        outlineScale: 1.02,
        propSound: '',
    },
}