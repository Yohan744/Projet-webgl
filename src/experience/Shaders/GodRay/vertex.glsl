uniform float uSeed;
uniform float uTime;

varying vec2 vUv;

void main() {
    vec3 newPos = position;
    newPos.z += sin(uTime + position.z * 10.0 + uSeed) * 0.1;
    newPos.x += sin(uTime + position.x * 10.0 + uSeed * 3.0) * 0.1;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    vUv = uv;
}