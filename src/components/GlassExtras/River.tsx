import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import { Suspense, useEffect, useRef } from "react";
import { BackSide, DoubleSide, Mesh, RepeatWrapping, ShaderMaterial, Vector3 } from "three";
import { editable as e,SheetProvider } from '@theatre/r3f'

const demoSheet = getProject('GlassProject').sheet('Glass')


interface RiverProps {
    RiverPosition: Vector3;
    RiverRotation?: Vector3;
    RiverPhase?: number;
    RiverAmplitude?: number;
    RiverFreq?: number;
    RiverThickness?:number;
    RiverKey?:string;
  }
  
function RiverInstance({
            RiverPosition,
            RiverRotation=new Vector3(-Math.PI/2,0,0),
            RiverPhase=0,
            RiverAmplitude=0.5,
            RiverFreq=1.0,
            RiverThickness=1.2,
            RiverKey='River'
        }:RiverProps){

    
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);


    const flowingWaterShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            u_phase: { type:'f', value: RiverPhase },
            u_amp: { type:'f', value: RiverAmplitude },
            u_freq: { type:'f', value: RiverFreq },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
          },
          vertexShader: `
            varying vec2 UV;
            uniform float u_time;
            uniform float u_phase;
            uniform float u_amp;
            uniform float u_freq;
            void main(){
                // waveShape
                
                float waveShape = sin(position.y * u_freq + u_phase) * u_amp;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+waveShape,position.yz,0.1);
                UV=uv;
            }
          `,
          fragmentShader: `
            varying vec2 UV;
            uniform sampler2D tex;
            uniform float u_time;
            void main(){
                gl_FragColor = texture2D(tex,vec2(UV.x,UV.y+u_time*0.2));
                // gl_FragColor = vec4(UV,0.,1.);
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
        <SheetProvider sheet={demoSheet}>
        {/* @ts-ignore */}
        <e.mesh theatreKey={RiverKey} ref={planeRef} rotation={[RiverRotation.x,RiverRotation.y,RiverRotation.z]} position={RiverPosition} frustumCulled={false}>
            <planeGeometry args={[RiverThickness,10,100,100]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]}/>
        </e.mesh>
        </SheetProvider>
        </>
    )
}

export default function River({theRiverPosition=new Vector3(0,0,0)}){
    const model = useGLTF("./models/river3.glb");
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
    useEffect(()=>{
        model.scene.scale.setScalar(2)
        model.scene.position.setY(9)
        model.scene.position.setZ(55)
        model.scene.traverse((object)=>{
            if(object.name === "Plane"){
                (object as Mesh).frustumCulled = false;
                (object as Mesh).material = new ShaderMaterial({
                    uniforms: {
                        u_time: { value: 0 },
                        // u_phase: { value: RiverPhase },
                        // u_amp: { value: RiverAmplitude },
                        // u_freq: { value: RiverFreq },
                        // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
                        tex: { value: texture },
                      },
                      vertexShader: `
                        varying vec2 UV;
                        uniform float u_time;
                        // uniform float u_phase;
                        // uniform float u_amp;
                        // uniform float u_freq;
                        void main(){
                            // waveShape
                            
                            // float waveShape = sin(position.y * u_freq + u_phase) * u_amp;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,0.1);
                            UV=uv;
                        }
                      `,
                      fragmentShader: `
                        varying vec2 UV;
                        uniform sampler2D tex;
                        uniform float u_time;
                        void main(){
                            gl_FragColor = texture2D(tex,vec2(UV.x,UV.y*5.+u_time*0.1));
                            // gl_FragColor = vec4(UV,0.,1.);
                        }
                      `,
                      side:DoubleSide,
                });;
            }
        })
    },[model]);

    useFrame((state)=>{
        model.scene.traverse((object)=>{
            if(object.name === "Plane"){
                // mat.side=BackSide;
                (object as Mesh).material.uniforms.u_time.value = state.clock.getElapsedTime();
            }
        })
    })

    return(
        <>
        <Suspense fallback={null}>
            <primitive object={model.scene}/>
        </Suspense>
            <RiverInstance RiverPosition={new Vector3(0,theRiverPosition.y,.10)} RiverKey={'R1'}/>
            <RiverInstance RiverPosition={new Vector3(-9.55,0.095,-99.900)} RiverKey={'R2'}/>
            <RiverInstance 
                RiverAmplitude={2} 
                RiverFreq={0.5} 
                RiverPhase={Math.PI*2} 
                RiverPosition={new Vector3(27.759999999999753,theRiverPosition.y,-171.92999999999867)}
                RiverRotation={new Vector3(-Math.PI/2,0,-0.77)}
                RiverThickness={1.4}
                RiverKey={'R3'}
            />
            <RiverInstance 
                // RiverAmplitude={3} 
                // RiverFreq={0.5} 
                RiverPhase={Math.PI*0.7} 
                RiverPosition={new Vector3(103.40999999999977,theRiverPosition.y,-237.2700000000003)}
                RiverRotation={new Vector3(-Math.PI/2,0,-0.6700000000000002)}
                RiverThickness={1.4}
                RiverKey={'R4'}
            />
            <RiverInstance 
                RiverAmplitude={3.5} 
                RiverFreq={0.4} 
                RiverPhase={Math.PI*0.55} 
                RiverPosition={new Vector3(143.73000000000104,theRiverPosition.y,-319.65999999999696)}
                RiverRotation={new Vector3(-Math.PI/2,0,-0.05000000000000385)}
                RiverThickness={2.25}
                RiverKey={'R5'}
            />
            <RiverInstance 
                RiverAmplitude={3} 
                RiverFreq={0.5} 
                RiverPhase={Math.PI*2.1} 
                RiverPosition={new Vector3(143.5300000000005,theRiverPosition.y,-422.12999999999784)}
                RiverRotation={new Vector3(-Math.PI/2,0,0.20000000000000007)}
                RiverThickness={1.8}
                RiverKey={'R6'}
            />
            <RiverInstance 
                RiverAmplitude={1} 
                RiverFreq={0.9} 
                RiverPhase={Math.PI*-0.1} 
                RiverPosition={new Vector3(100.09000000000044,theRiverPosition.y,-476.79000000000207)}
                RiverRotation={new Vector3(-Math.PI/2,0,1.2200000000000015)}
                RiverThickness={1.2}
                RiverKey={'R7'}
            />
            <RiverInstance 
                RiverAmplitude={2} 
                RiverFreq={0.5} 
                RiverPhase={Math.PI*0.2} 
                RiverPosition={new Vector3(7.929999999999916,theRiverPosition.y,-518.0899999999933)}
                RiverRotation={new Vector3(-Math.PI/2,0,1.2900000000000007)}
                RiverThickness={1.15}
                RiverKey={'R8'}
            />
            <RiverInstance 
                RiverAmplitude={4} 
                RiverFreq={0.3} 
                RiverPhase={Math.PI*-0.3} 
                RiverPosition={new Vector3(-83.33000000000008,theRiverPosition.y,-567.4799999999912)}
                RiverRotation={new Vector3(-Math.PI/2,0,1.3700000000000008)}
                RiverThickness={1.15}
                RiverKey={'R9'}
            />
            <RiverInstance 
                RiverAmplitude={1} 
                RiverFreq={0.6} 
                RiverPhase={Math.PI*0.9} 
                RiverPosition={new Vector3(-171.73000000000002,theRiverPosition.y,-618.9599999999944)}
                RiverRotation={new Vector3(-Math.PI/2,0,1.1400000000000006)}
                RiverThickness={0.95}
                RiverKey={'R10'}
            />
        </>
    )
}
