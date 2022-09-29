
precision highp float;
// precision highp vec2;
varying vec2 vUv;

uniform sampler2D tex;
uniform float u_time;
uniform vec2 u_pos;
uniform vec2 u_scale;
uniform float u_angle;
uniform float u_repeat,u_color;
 
uniform float u_maxIter;

vec2 rotateArea (vec2 p, vec2 pivot, float angle) {
	float s = sin(angle);
	float c = cos(angle);
	p -= pivot;
	p = vec2(p.x*c-p.y*s,p.x*s+p.y*c);
	p += pivot;
	return p;
}

vec2 complex_square( vec2 z ) {
	return vec2(
		z.x * z.x - z.y * z.y,
		z.x * z.y * 2.0
	);
}

void main(){
    
	vec4 inputTexture = texture2D(tex,vUv);	
	vec2 c = u_pos+(vUv-0.5)*u_scale*4.*100.;
	
	c = rotateArea(c,u_pos,u_angle);//used to rotate the area around u_pos

	vec2 z = vec2( 0.0 ),zPrev;
	
	float r= 20.0; //escaper Radius
	float r2 = r*r;
	float iter;
	for ( iter = 0. ; iter < u_maxIter; iter++ ) {
		zPrev=z;
		z = c + complex_square( z );
		if ( dot( z,zPrev ) > r2 ) break;
	}
	vec4 col = vec4(0.,0.,0.,1.0);//center color

	if(iter<u_maxIter)
	{
		float dist = length(z); //diatance from origin
		float fractionalIter = (dist-r)/(r2-r); //lin interpolation

		fractionalIter = log2(log(dist)/log(r)); //double exp interpolation

		// iter-=fractionalIter;

		float f = sqrt(iter/u_maxIter);  
		// vec3 col = mix(vec3(1.-f),inputTexture.rgb,0.5);
		col= texture2D(tex,vec2(f*u_repeat + u_time * 0.2,u_color));

		float angle = atan(z.x, z.y);//angle of final point from center

		col *= vec4(smoothstep(3.,0. , fractionalIter ));//leaf with dark base and bright tip

		col *= vec4(1.+sin(angle*2.)*0.2);//lines on leaf
		// col = vec4(f);
	
	}

    gl_FragColor = vec4(col.rgb,1.0);
}