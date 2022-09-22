import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, Circle, Cone, meshBounds, OrbitControls, OrbitControlsProps, PerspectiveCamera, Tetrahedron, useTexture } from '@react-three/drei';
import { Vector2, Mesh, RepeatWrapping, MeshPhongMaterial, ShaderMaterial, Vector3, MirroredRepeatWrapping, ACESFilmicToneMapping } from 'three';
import { Perf } from "r3f-perf";
import { useEffect, useRef } from 'react';
import MandelbrotShader from "../shaders/MandelbrotShader";

interface MandelbrotProps {
    MandelbrotPosition: Vector3;
    MandelbrotRotation?: Vector3;
  }
  
function MandelbrotPlane({
            MandelbrotPosition,
            MandelbrotRotation=new Vector3(0,0,0),
        }:MandelbrotProps){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
    const flowingWaterShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
          },
          vertexShader: MandelbrotShader.vertex,
          fragmentShader: MandelbrotShader.fragment 
    }


    useFrame((state)=>{
        if(!planeRef.current) return;
        // @ts-ignore
        planeRef.current.material.uniforms.u_time.value = state.clock.getElapsedTime();
    });

    return(
        <>
        <mesh ref={planeRef} rotation={[MandelbrotRotation.x,MandelbrotRotation.y,MandelbrotRotation.z]} position={MandelbrotPosition} frustumCulled={false}>
            <planeGeometry args={[10,10,1,1]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]}/>
        </mesh>
        </>
    )
}

export default function MyCanvas() {

    //@ts-ignore
    const orbitControlsRef = useRef<OrbitControls>(null)


    useEffect(()=>{
        if(!orbitControlsRef.current) return;
        orbitControlsRef.current.enabled = true
    })
    
    return(
        <>
            <Canvas 
                shadows
                camera={{ fov: 60, position: [0, 0, 20] }}
                style={{
                    zIndex:0,
                    position: "absolute",
                    top: 0,
                }}
                gl={{
                    logarithmicDepthBuffer: true,
                    powerPreference: "high-performance",
                    antialias: false,
                    toneMapping: ACESFilmicToneMapping,
                    toneMappingExposure: 1,
                    alpha: false,
                }}
            >
                <ambientLight intensity={0.1} />
                <directionalLight 
                    color={0xfefefe}
                    position={[10, 10, 5]}
                    castShadow 
                    shadow-mapSize-height={512}
                    shadow-mapSize-width={512}
                    shadow-camera-near={0}
                    shadow-camera-far={500}
                    shadow-camera-left={-200}
                    shadow-camera-right={200}
                    shadow-camera-top={200}
                    shadow-camera-bottom={-200}
                />
                <OrbitControls 
                    ref={orbitControlsRef} 
                    enableDamping={true} 
                    dampingFactor={0.04} 
                    // maxDistance={250}
                    // maxPolarAngle={Math.PI/1.8}
                    // minPolarAngle={Math.PI/5}
                />
                <MandelbrotPlane MandelbrotPosition={new Vector3(0,0,0)} ></MandelbrotPlane>
                
                <Perf
                    trackCPU={false}
                    className={"perfContainer"}
                    position={"bottom-right"}
                />
            </Canvas>
        </>
    )
}