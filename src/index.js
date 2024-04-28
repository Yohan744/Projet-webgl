import Experience from './experience/Experience.js'
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";


const loader = new GLTFLoader();
loader.setCrossOrigin('anonymous');
const experience = new Experience({
    targetElement: document.querySelector('.experience')
})

