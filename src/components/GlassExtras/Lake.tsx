import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, RepeatWrapping, UniformsLib, UniformsUtils, Vector2 } from "three";

export default function Lake(){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    // texture.repeat.set(1000,1000)
    const planeRef = useRef<Mesh>(null);
   
    const flowingWaterShader ={
        uniforms: UniformsUtils.merge( [
            UniformsLib[ 'fog'],{
                u_time: { type:'f', value: 0 },
                // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
                tex: { type:'t', value: texture },
                iResolution:{ type:'v', value: new Vector2(100,100)}
              }
            ]),
          vertexShader: `
            #include <fog_pars_vertex>

            varying vec2 vUv;
            uniform float u_time;
            void main(){
                #include <begin_vertex>
                #include <project_vertex>
                #include <fog_vertex>

                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,0.1);
                vUv=uv;
            }
          `,
          fragmentShader: `

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

                vec2 wavePos = vec2(0.525,0.92);
                        
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
          `,
    }


    useFrame((state)=>{
        if(!planeRef.current) return;
        // @ts-ignore
        planeRef.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return(
        <>
        <mesh ref={planeRef} position={[0,-49.05,120]} rotation={[-Math.PI/2,0,0]} frustumCulled={false}>
            <circleGeometry args={[8,30]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]} fog={true}/>
        </mesh>
        </>
    )
}