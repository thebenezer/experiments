

#include <fog_pars_fragment>
varying vec2 UV;
uniform sampler2D tex;
uniform float u_time;
void main(){
	

	float waterfallFoamPos = 0.001;

	vec4 inputTexture = texture2D(tex,vec2(UV.x,UV.y*5.+u_time*0.12));

	float amplitude = 0.009;
	float frequency = 30.;
	float y = sin(UV.x * frequency);
	// y += sin(UV.x*frequency*1.72 + 1.121)*4.0;
	y += sin(UV.x*frequency*2.221 + 0.437)*4.0*sin(u_time*2.);
	y += sin(UV.x*frequency*3.+ 20.+u_time*5.)*2.5;
	y *= amplitude*0.06;

	vec3 waterfallFoam = mix(
		vec3(1.,1.,1.),
		inputTexture.rgb,
		step(
			UV.y+y ,
			0.13+waterfallFoamPos
			)
		);

	vec3 riverBeforeFall = mix(waterfallFoam,inputTexture.rgb,
		step(
			0.135+ waterfallFoamPos,
			UV.y+y 
			)
		);

	vec3 bottomFoam = mix(
		riverBeforeFall,
		vec3(1.,1.,1.),
		step(
			UV.y+y,
			0.081
			)
		);


	gl_FragColor = vec4(bottomFoam,1.);


	#include <fog_fragment>
}