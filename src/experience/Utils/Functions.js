import * as THREE from "three";

export const remapMaterialUVs = (material, remapUVs, {
    uvAttributePrefix,
    uvAttributeOffset
} = {}) => {
    const _uvAttributePrefix = uvAttributePrefix || 'texcoord_';
    const _uvAttributeOffset = 2;

    material.customProgramCacheKey = () => Math.random();
    material.onBeforeCompile = (shader, context) => {
        const resolveIncludes = (shader) => {
            // NOTE Straight from three/WebGLProgram.js
            const includePattern = /^[ \t]*#include +<([\w\d./]+)>/gm;

            return shader.replace(includePattern, (match, include) => {
                const string = THREE.ShaderChunk[include];

                if (!string) {
                    return;
                }

                return resolveIncludes(string);
            });
        };

        let maxTexCoordIndex = 0;
        const texCoordSwaps = [];

        Object.entries(remapUVs).forEach(([textureType, uvMap]) => {
            if (!uvMap.startsWith(_uvAttributePrefix)) {
                console.warn('Invalid UVMap name', uvMap);

                return;
            }

            const texCoordIndex = parseFloat(uvMap.split(new RegExp(`${_uvAttributePrefix}\\D*`, 'gi')).join(''));

            maxTexCoordIndex = Math.max(texCoordIndex, maxTexCoordIndex);
            texCoordSwaps[textureType] = texCoordIndex;
        });

        if (maxTexCoordIndex - 1 <= 0) {
            return;
        }

        shader.vertexShader = shader.vertexShader.replace(`#include <uv2_pars_vertex>`, `
      ${Array(maxTexCoordIndex - 1).fill(0).map((_, index) => `
        attribute vec2 ${_uvAttributePrefix}${index + _uvAttributeOffset};
        varying vec2 vTexCoord${index + _uvAttributeOffset};
      `).join('\n')}

      #include <uv2_pars_vertex>
    `).replace(`#include <uv2_vertex>`, `
      ${Array(maxTexCoordIndex - 1).fill(0).map((_, index) => `
        vTexCoord${index + _uvAttributeOffset} = ( vec3( ${_uvAttributePrefix}${index + _uvAttributeOffset}, 1 ) ).xy;
      `).join('\n')}

      #include <uv2_vertex>
    `);

        shader.fragmentShader = shader.fragmentShader.replace(`#include <uv2_pars_fragment>`, `
      ${Array(maxTexCoordIndex - 1).fill(0).map((_, index) => `
        varying vec2 vTexCoord${index + _uvAttributeOffset};
      `).join('\n')}

      #include <uv2_pars_fragment>
    `);

        shader.vertexShader = resolveIncludes(shader.vertexShader);
        shader.fragmentShader = resolveIncludes(shader.fragmentShader);

        Object.entries(texCoordSwaps).forEach(([textureType, texCoordIndex]) => {
            shader.fragmentShader = shader.fragmentShader.replaceAll(
                `texture2D( ${textureType}, vUv )`,
                `texture2D( ${textureType}, vTexCoord${texCoordIndex} )`
            ).replaceAll(
                `texture2D( ${textureType}, vUv2 )`,
                `texture2D( ${textureType}, vTexCoord${texCoordIndex} )`
            );
        });
    };
};