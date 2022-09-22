import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, Circle, Cone, meshBounds, OrbitControls, OrbitControlsProps, PerspectiveCamera, Tetrahedron, useTexture } from '@react-three/drei';
import { Vector2, Mesh, RepeatWrapping, MeshPhongMaterial, ShaderMaterial, Vector3, MirroredRepeatWrapping } from 'three';
import { Perf } from "r3f-perf";
import { useEffect, useRef } from 'react';

interface RiverProps {
    RiverPosition: Vector3;
    RiverRotation?: Vector3;
    RiverPhase?: number;
    RiverAmplitude?: number;
    RiverFreq?: number;
  }
  
function River({
            RiverPosition,
            RiverRotation=new Vector3(-Math.PI/2,0,0),
            RiverPhase=0,
            RiverAmplitude=0.5,
            RiverFreq=1.0,
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
                // Elevation
                float elevation = sin(position.y * u_freq + u_phase) * u_amp;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+elevation,position.yz,0.1);
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
        <mesh ref={planeRef} rotation={[RiverRotation.x,RiverRotation.y,RiverRotation.z]} position={RiverPosition} frustumCulled={false}>
            <planeGeometry args={[1,10,100,100]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]}/>
        </mesh>
        </>
    )
}

function Waterfall(){
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
        <mesh ref={planeRef} position={[4.8,-49.95,50.1]} frustumCulled={false}>
            <planeGeometry args={[1,10,20,100]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]}/>
        </mesh>
        </>
    )
}

function Lake(){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
   
    const flowingWaterShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
            iResolution:{ type:'v', value: new Vector2(100,100)}
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
        <mesh ref={planeRef} position={[0,-49.05,120]} rotation={[-Math.PI/2,0,0]} frustumCulled={false}>
            <circleGeometry args={[8,30]}/>
            <shaderMaterial attach="material" args={[flowingWaterShader]}/>
        </mesh>
        </>
    )
}

function Plateau(){
    const sandTexture = useTexture("./peter-burroughs-tilingdirt.jpg");
    sandTexture.wrapS =  sandTexture.wrapT = MirroredRepeatWrapping;
    sandTexture.repeat.set(10,10);

    return(
        <>
            <Box
                args={[1000,1000,1000]}
                position={[0,-500,-450]}
                material={new MeshPhongMaterial({
                    color:0xffffff,
                    map: sandTexture
                })}
                receiveShadow={true}
            />
        </>
    )
}

function Grass(){
    const grassTexture = useTexture("./peter-burroughs-tilinggrasstexture.jpg");
    grassTexture.wrapS =  grassTexture.wrapT = MirroredRepeatWrapping;
    grassTexture.repeat.set(10,10);

    return(
        <>
        <Box 
            args={[1000,100,1000]} 
            position={[0,-100,550]} 
            material={new MeshPhongMaterial({
                // color:0x00eeaa,
                map: grassTexture
            })} 
            receiveShadow={true}
        />
        </>
    )
}

interface MountainProps {
    MountainPosition: Vector3;
    MountainRadius: number;
    MountainHeight: number;
  }
  
function Mountains({
            MountainPosition,
            MountainRadius,
            MountainHeight,
        }:MountainProps){
    const rockTexture = useTexture("./stonetexture.jpg");
    rockTexture.wrapS = RepeatWrapping;
    rockTexture.wrapT = RepeatWrapping;

    return(
        <>
            <Cone
                args={[MountainRadius,MountainHeight]}
                position={MountainPosition}
                material={new MeshPhongMaterial({
                    color:0xD0B49F,
                    map: rockTexture
                })}
                castShadow={true}
            />
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
                camera={{ fov: 75, position: [0, 10, 20] }}
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
                    maxDistance={250}
                    maxPolarAngle={Math.PI/1.8}
                    minPolarAngle={Math.PI/5}
                />
                <River RiverPosition={new Vector3(0,0.09,.10)} ></River>
                <River RiverPosition={new Vector3(-9.55,0.09,-99.900)}></River>
                <River 
                    RiverAmplitude={2} 
                    RiverFreq={0.5} 
                    RiverPhase={Math.PI*2} 
                    RiverPosition={new Vector3(18.55,0.09,-180.900)}
                    RiverRotation={new Vector3(-Math.PI/2,0,-0.48)}
                />
                <Waterfall></Waterfall>
                <Lake></Lake>
                <Grass></Grass>
                <Plateau></Plateau>
                {/* <Box args={[1000,100,1000]} position={[0,-50,-450]} material={new MeshPhongMaterial()} receiveShadow={true}></Box> */}
                <Mountains MountainPosition={new Vector3(60,40,-85)} MountainRadius={60} MountainHeight={80}></Mountains>
                <Mountains MountainPosition={new Vector3(30,15,0)} MountainRadius={20} MountainHeight={30}></Mountains>
                <Mountains MountainPosition={new Vector3(-60,15,-85)} MountainRadius={60} MountainHeight={80}></Mountains>
                <Mountains MountainPosition={new Vector3(-50,20,-10)} MountainRadius={60} MountainHeight={80}></Mountains>
                
                <Mountains MountainPosition={new Vector3(-80,40,-180)} MountainRadius={60} MountainHeight={80}></Mountains>
                <Mountains MountainPosition={new Vector3(90,40,-150)} MountainRadius={60} MountainHeight={90}></Mountains>
                <Mountains MountainPosition={new Vector3(-2,5,-150)} MountainRadius={10} MountainHeight={10}></Mountains>
                <Mountains MountainPosition={new Vector3(20,40,-270)} MountainRadius={100} MountainHeight={140}></Mountains>
                
                <Mountains MountainPosition={new Vector3(200,40,-300)} MountainRadius={60} MountainHeight={80}></Mountains>
                <Mountains MountainPosition={new Vector3(-150,40,-250)} MountainRadius={60} MountainHeight={90}></Mountains>
                <Mountains MountainPosition={new Vector3(-150,5,-100)} MountainRadius={60} MountainHeight={80}></Mountains>
                <Mountains MountainPosition={new Vector3(150,40,-50)} MountainRadius={60} MountainHeight={80}></Mountains>
                
                <Perf></Perf>
            </Canvas>
        </>
    )
}