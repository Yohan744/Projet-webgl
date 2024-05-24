uniform float uTime;
uniform float uRadius;
uniform float uInnerRadius;
uniform float uPointRadius;
uniform float uColorReductionInCenter;

varying vec2 vUv;

void main() {

    float t = (sin(uTime) * 0.5 - 0.5) * 0.1;

    float r = uRadius;
    r += t;

    float innerR = uInnerRadius;
    innerR += t * 0.95;

    float distanceToCenter = length(vUv - vec2(0.5));
    float diff = step(innerR, distanceToCenter) - step(r, distanceToCenter);

    float a = 0.9;
    a -= (1.0 - diff) * (uColorReductionInCenter + t * 1.25);
    a *= step(distanceToCenter, r);

    float pointAlpha = 1.0 * step(distanceToCenter, uPointRadius);
    a = max(a, pointAlpha);

    gl_FragColor = vec4(vec3(1.0), a);

}
