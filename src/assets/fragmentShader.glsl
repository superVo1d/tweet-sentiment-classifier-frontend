uniform float u_intensity;
uniform float u_time;
uniform vec3 u_color;

varying vec2 vUv;
varying float vDisplacement;

void main() {
    float distort = 2.0 * vDisplacement * u_intensity;

    vec3 baseColor = vec3(abs(vUv - 0.5) * 2.0 * (1.0 - distort), 1.0);
    
    vec3 color = mix(baseColor, u_color, 0.4); 

    gl_FragColor = vec4(color, 1.0);
}
