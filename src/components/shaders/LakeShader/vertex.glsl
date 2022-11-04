#include <fog_pars_vertex>

varying vec2 vUv;
uniform float u_time;
void main(){
    #include <begin_vertex>
    #include <project_vertex>
    #include <fog_vertex>

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
    vUv=uv;
}