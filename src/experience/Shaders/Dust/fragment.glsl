void main() {
    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.35, 0.5, distanceToCenter);
    gl_FragColor = vec4(vec3(0.05), alpha);
}