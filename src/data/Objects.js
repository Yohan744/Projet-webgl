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
        outlineScale: 1.02,
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
        rotationOnClick: new THREE.Vector3(0, 0.16, -0.55),
        animateToCameraOnClick: true,
        distanceToCamera: 1.5,
        outlineScale: 1.01,
        propSound: 'tv',
    },
    tableau_magique1: {
        file: Telecran,
        rotationOnClick: new THREE.Vector3(0, 0, -Math.PI * 0.35),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.02,
        propSound: 'telecran',
    },
    tourne_disque1: {
        file: RecordPlayer,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.01,
        propSound: 'recordPlayer',
    },
    malle_bas1: {
        file: BottomChest,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: false,
        distanceToCamera: 0,
        outlineScale: 1.01,
        propSound: '',
    },
    malle_haut1: {
        file: TopChest,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: false,
        distanceToCamera: 0,
        outlineScale: 1.01,
        propSound: '',
    },
}