import * as THREE from 'three';
import Walkman from "../experience/World/Props/Essential/Walkman";
import Cassette from "../experience/World/Props/Essential/Cassette";
import Pencil from "../experience/World/Props/Essential/Pencil";
import Telephone from "../experience/World/Props/Telephone";
import RubiksCube from "../experience/World/Props/RubiksCube";
import Television from "../experience/World/Props/Television";
import RecordPlayer from "../experience/World/Props/RecordPlayer";
import Telecran from "../experience/World/Props/Telecran";

export const objectsData = {
    telephone: {
        file: Telephone,
        rotationOnClick: new THREE.Vector3(0, 0, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 1,
        outlineScale: 1.03,
        propSound: 'telephone',
    },
    rubicub: {
        file: RubiksCube,
        rotationOnClick: new THREE.Vector3(0, -Math.PI * 0.2, 0),
        animateToCameraOnClick: true,
        distanceToCamera: 0.6,
        outlineScale: 1.06,
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
        rotationOnClick: new THREE.Vector3(0, Math.PI * 0.075, -Math.PI * 0.35),
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
    }
}