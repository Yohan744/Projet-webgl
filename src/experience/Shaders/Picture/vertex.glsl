uniform float uPixelRatio;
uniform float uSize;
attribute float aScale;

void main() {

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;

    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * aScale * uPixelRatio * (1.0 / -viewPosition.z);

}