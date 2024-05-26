uniform float uOpacity;

void main() {

    vec2 uv = gl_PointCoord.xy * 2.0 - 1.0;
    float dist = length(uv);
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    gl_FragColor = vec4(vec3(0.3), (alpha - 0.3) * uOpacity);

}