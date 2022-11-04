varying vec2 UV;
uniform float u_time;

#include <fog_pars_vertex>
void main(){
	#include <begin_vertex>
	#include <project_vertex>
	#include <fog_vertex>
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
	UV=uv;
}