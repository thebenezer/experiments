
precision highp float;
varying vec2 vUv;

uniform sampler2D tex;
uniform float u_time;
uniform vec2 u_pos;
uniform vec2 u_scale;
 
uniform float u_maxIter;

vec2 complex_square( vec2 z ) {
	return vec2(
		z.x * z.x - z.y * z.y,
		z.x * z.y * 2.0
	);
}

void main(){
    vec2 uv = u_pos+(vUv-0.5)*u_scale*4.*100.;
	
    #if 1 // Mandelbrot
        vec2 c = uv;
        vec2 z = vec2( 0.0 );
    #else // Julia
        vec2 c = vec2( 0.0, 0.00 );
        vec2 z = uv;
    #endif
	
	float iter = 0.;
	
	for ( iter = 0. ; iter < u_maxIter; iter++ ) {
		z = c + complex_square( z );
		if ( length( z ) > 2.0 )
			break;
	}
	// vec4 
	float f = iter/u_maxIter;
	vec3 col = vec3(f);

    gl_FragColor = vec4(col,1.0);
}