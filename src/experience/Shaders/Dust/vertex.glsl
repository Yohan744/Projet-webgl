uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x -= cos(uTime * 0.3 + modelPosition.x * 1000.0) * aScale * 0.5;
    modelPosition.y += sin(uTime + modelPosition.y * 100.0) * aScale * 0.15;
    modelPosition.z += sin(uTime * 0.3 + modelPosition.z * 700.0) * aScale * 0.5;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);

}
