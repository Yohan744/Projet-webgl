import EventEmitter from './EventEmitter.js'
import Experience from '../Experience.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js'
import {KTX2Loader} from 'three/examples/jsm/loaders/KTX2Loader.js'

export default class Loader extends EventEmitter {
    /**
     * Constructor
     */
    constructor() {
        super()

        this.experience = new Experience()

        this.setLoaders()

        this.toLoad = 0
        this.loaded = 0
        this.items = {}
    }

    /**
     * Set loaders
     */
    setLoaders() {
        this.loaders = []

        // Images
        this.loaders.push({
            extensions: ['jpg', 'png', 'webp'],
            action: (_resource) => {
                const image = new Image()

                image.addEventListener('load', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.addEventListener('error', () => {
                    this.fileLoadEnd(_resource, image)
                })

                image.src = _resource.source
            }
        })

        // Draco
        const dracoLoader = new DRACOLoader()
        // dracoLoader.setDecoderPath('draco/');
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        dracoLoader.setDecoderConfig({type: 'js'})
        dracoLoader.preload();

        this.loaders.push({
            extensions: ['drc'],
            action: (_resource) => {
                dracoLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)

                    DRACOLoader.dispose()
                })
            }
        })

        // GLTF
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        this.loaders.push({
            extensions: ['glb', 'gltf'],
            action: (_resource) => {
                gltfLoader.load(_resource.source, (_data) => {
                    this.fileLoadEnd(_resource, _data)
                })
            }
        })

    }

    /**
     * Load
     */
    load(_resources = []) {
        for (const _resource of _resources) {
            this.toLoad++

            let extensionMatch;

            if (_resource.type === 'texture' || _resource.type === 'model') {

                extensionMatch = _resource.source.match(/\.([a-z0-9]+)$/)

            } else if (_resource.type === 'group') {

                for (const textureType in _resource.textures) {
                    const texturePath = _resource.textures[textureType];
                    extensionMatch = texturePath.match(/\.([a-z0-9]+)$/);
                }

            }

            if (typeof extensionMatch[1] !== 'undefined') {
                const extension = extensionMatch[1]
                const loader = this.loaders.find((_loader) => _loader.extensions.find((_extension) => _extension === extension))

                if (loader) {
                    loader.action(_resource)
                } else {
                    console.warn(`Cannot found loader for ${_resource}`)
                }
            } else {
                console.warn(`Cannot found extension of ${_resource}`)
            }
        }
    }

    /**
     * File load end
     */
    fileLoadEnd(_resource, _data) {
        this.loaded++
        if (_data) {
            this.items[_resource.name] = {
                scene: _data.scene,
                animations: _data.animations
            };
        }

        this.trigger('fileEnd', [_resource, _data])

        if (this.loaded === this.toLoad) {
            this.trigger('end')
        }
    }
}
