import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, RepeatWrapping } from "three";

export default function Waterfall(){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
   
    const flowingWaterShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
          },
          vertexShader: `
            varying vec2 vUv;
            uniform float u_time;
            void main(){
                // Elevation
                // float elevation = sin(position.y * 1.) * 0.5;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,0.1);
                vUv=uv;
            }
          `,
          fragmentShader: `
            varying vec2 vUv;
            uniform sampler2D tex;
            uniform float u_time;
            void main(){
                float period = 1.;     // length of one period in frames
                float amplitude = 0.005; 
                vec4 inputTexture = texture2D(tex,vec2(vUv.x,vUv.y+u_time*0.2));
                vec3 bottomFoam = mix(
                    inputTexture.rgb,
                    vec3(1.,1.,1.),
                    step(
                        vUv.y+amplitude * sin(2.*3.14 * u_time / period)+sin(vUv.x*10.+u_time*10.)*0.005,
                        0.54
                        )
                    );
                gl_FragColor = vec4(bottomFoam,1.);
            }
          `
    }


    useFrame((state)=>{
        if(!planeRef.current) return;
        // @ts-ignore
        planeRef.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return(
        <>
            <mesh ref={planeRef} position={[4.8,-49.90,50.1]} frustumCulled={false}>
                <planeGeometry args={[1.2,10,20,100]}/>
                <shaderMaterial attach="material" args={[flowingWaterShader]}/>
            </mesh>
        </>
    )
}

