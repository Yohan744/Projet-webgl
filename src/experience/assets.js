export default [
    {
        name: 'base',
        data: {},
        items:
            [
                {
                    name: 'atticModel',
                    source: '/assets/models/newAttic.glb',
                    type: 'model',
                },

                {
                    name: 'backgroundTreeTexture',
                    source: '/assets/textures/background/backgroundTree.webp',
                    type: 'texture',
                },

                {
                    name: 'ground',
                    type: 'group',
                    textures: {
                        diffuse: 'assets/textures/attic/ground/diffuse.webp',
                        roughness: 'assets/textures/attic/ground/roughness.webp',
                        normal: 'assets/textures/attic/ground/normal.webp',
                        specular: 'assets/textures/attic/ground/specular.webp',
                    }
                },

                {
                    name: 'windowWall',
                    type: 'group',
                    textures: {
                        diffuse: 'assets/textures/attic/windowWall/diffuse.webp',
                        roughness: 'assets/textures/attic/windowWall/roughness.webp',
                        normal: 'assets/textures/attic/windowWall/normal.webp',
                    }
                },

                {
                    name: 'walls',
                    type: 'group',
                    textures: {
                        diffuse: 'assets/textures/attic/walls/diffuse.webp',
                        roughness: 'assets/textures/attic/walls/roughness.webp',
                        normal: 'assets/textures/attic/walls/normal.webp',
                        ao: 'assets/textures/attic/walls/occlusion.webp',
                    }
                },

                {
                    name: 'window',
                    type: 'group',
                    textures: {
                        roughness: 'assets/textures/attic/window/roughness.webp',
                    }
                },

                ////////////////////////////////// OBJECTS //////////////////////////////////

                {
                    name: 'sideMirror',
                    type: 'group',
                    textures: {
                        diffuse: 'assets/textures/objects/mirror/side/diffuse.webp',
                        roughness: 'assets/textures/objects/mirror/side/roughness.webp',
                        normal: 'assets/textures/objects/mirror/side/normal.webp',
                        specular: 'assets/textures/objects/mirror/side/specular.webp',
                    }
                },

                {
                    name: 'mirror',
                    type: 'group',
                    textures: {
                        roughness: 'assets/textures/objects/mirror/glass/roughness.webp',
                    }
                },

            ]
    }
]