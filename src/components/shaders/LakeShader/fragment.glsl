#include <fog_pars_fragment>

uniform sampler2D tex;
uniform float u_time;
uniform vec2 iResolution;

varying vec2 vUv;
void main(){
	float waveStrength = 0.02;
	float frequency = 70.0;
	float waveSpeed = 3.0;
	vec4 sunlightColor = vec4(1.0,0.91,0.75, 1.0);
	float sunlightStrength = 5.0;
	float centerLight = 1.;
	float oblique = .25; 

	vec2 wavePos = vec2(0.5,0.02);
			
	float modifiedTime = u_time * waveSpeed;
	float aspectRatio = iResolution.x/iResolution.y;
	vec2 distVec = vUv - wavePos;
	distVec.x *= aspectRatio;
	float distance = length(distVec);
	
	float multiplier = (distance < 1.0) ? ((distance-1.0)*(distance-1.0)) : 0.0;
	float addend = (sin(frequency*distance-modifiedTime)+centerLight) * waveStrength * multiplier;
	vec2 newTexCoord = vUv + addend*oblique;    
	
	vec4 colorToAdd = sunlightColor * sunlightStrength * addend;

	gl_FragColor = texture2D(tex,newTexCoord+u_time*0.01)+colorToAdd;
	// gl_FragColor = vec4(UV,0.,1.);

	#include <fog_fragment>

}