varying vec2 vUv;
uniform float u_time;
uniform float u_phase;
uniform float u_amp;
uniform float u_freq;
void main(){
    // Elevation
    gl_Position = vec4(position,0.1);
    vUv=uv;
}