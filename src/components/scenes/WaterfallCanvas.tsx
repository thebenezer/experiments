import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, Circle, Cone, meshBounds, OrbitControls, OrbitControlsProps, PerspectiveCamera, RoundedBox, Tetrahedron, useTexture } from '@react-three/drei';
import { Vector2, Mesh, RepeatWrapping, MeshPhongMaterial, ShaderMaterial, Vector3, MirroredRepeatWrapping, MeshPhysicalMaterial, DoubleSide, Color, TextureEncoding } from 'three';
import { Perf } from "r3f-perf";
import { useEffect, useMemo, useRef, useState } from 'react';

import {GLTFExporter} from 'three/examples/jsm/exporters/GLTFExporter'
import { getProject } from '@theatre/core'
import studio from '@theatre/studio'

import extension from '@theatre/r3f/dist/extension'
import { editable as e,SheetProvider } from '@theatre/r3f'


// our Theatre.js project sheet, we'll use this later
const demoSheet = getProject('GlassProject').sheet('Glass')


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
        <mesh ref={planeRef} position={[4.8,-49.90,50.1]} frustumCulled={false}>
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
    // texture.repeat.set(1000,1000)
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
    sandTexture.repeat.set(100,10);
    const params = {
        color: 0xffffff,
        transmission: 1,
        opacity: 1,
        metalness: 0,
        roughness: 0.6,
        ior: 2,
        thickness: 4.5,
        specularIntensity: 2,
        specularColor: new Color(0xff0000),
        envMapIntensity: 0,
        exposure: 1
    };

    return(
        <>
            <RoundedBox
                radius={10}
                smoothness={10}
                frustumCulled ={true}
                args={[10000,1000,1000]}
                position={[0,-500,-450]}
                material={new MeshPhysicalMaterial({
                    color: params.color,
					metalness: params.metalness,
					roughness: params.roughness,
					ior: params.ior,
                    toneMapped: true,
					transmission: params.transmission, // use material.transmission for glass materials
					specularIntensity: params.specularIntensity,
					specularColor: params.specularColor,
					opacity: params.opacity,
					side: DoubleSide,
					transparent: true,
                    // map:sandTexture
                })}
                receiveShadow={true}
            />
        </>
    )
}

function Grass(){
    const grassTexture = useTexture("./peter-burroughs-tilinggrasstexture.jpg");
    grassTexture.wrapS =  grassTexture.wrapT = MirroredRepeatWrapping;
    grassTexture.repeat.set(100,10);
    const {scene}=useThree();

    const gltfExporter = new GLTFExporter();
    // Parse the input and generate the glTF output
    gltfExporter.parse(
        scene,
        // called when the gltf has been generated
        function ( gltf ) {

            console.log( gltf );
            // downloadJSON( gltf );

        },
        // called when there is an error in the generation
        function ( error ) {

            console.log( 'An error happened' );

        },
    );
    return(
        <>
        <Box 
            args={[10000,100,1000]} 
            position={[0,-100,550]} 
            material={new MeshPhongMaterial({
                // color:0x00eeaa,
                // map: grassTexture
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
    const params = {
        color: 0xffffff,
        transmission: 1,
        opacity: 0.5,
        metalness: 0,
        roughness: 0.6,
        ior: 2,
        thickness: 1.5,
        specularIntensity: 10,
        specularColor: new Color(0xff0000),
        envMapIntensity: 0,
        exposure: 1
    };
    return(
        <>
        <mesh position={MountainPosition}>
            <coneGeometry args={[MountainRadius,MountainHeight,,,true]}/>
            <meshPhysicalMaterial 
                color={params.color}
                metalness= {params.metalness}
                roughness= {params.roughness}
                ior= {params.ior}
                transmission= {params.transmission} // use material.transmission for glass materials
                specularIntensity= {params.specularIntensity}
                specularColor= {params.specularColor}
                opacity= {params.opacity}
                side= {DoubleSide}
                transparent= {true}
            />
        </mesh>
            {/* <Cone
                args={[MountainRadius,MountainHeight,,,true]}
                position={MountainPosition}
                material={new MeshPhysicalMaterial({
                    color: params.color,
					metalness: params.metalness,
					roughness: params.roughness,
					ior: params.ior,
					transmission: params.transmission, // use material.transmission for glass materials
					specularIntensity: params.specularIntensity,
					specularColor: params.specularColor,
					opacity: params.opacity,
					side: DoubleSide,
					transparent: true,
                })}
                castShadow={true}
            /> */}
       </>
    )
}

export default function WaterfallCanvas() {
    //@ts-ignore
    const orbitControlsRef = useRef<OrbitControls>(null)


    useEffect(()=>{
        if(!orbitControlsRef.current) return;
        orbitControlsRef.current.enabled = true
        setTheatreInit(true);

    })

    let [theatreInit, setTheatreInit] = useState(false);
    studio.initialize();

    useEffect(() => {
        // setTheatreInit(true);

        if (!theatreInit ) {
            theatreInit = true
            studio.extend(extension);
            setTheatreInit(true);
        }
        console.log(theatreInit,"after")

    }, [theatreInit])
    
    return(
        <>
            <Canvas 
                shadows
                camera={{ fov: 75, position: [0, 10, 20], far:20000}}
            >
                <SheetProvider sheet={demoSheet}>
                    <color attach="background" args={[0xfefefe]} />
                    <fogExp2 attach={"fog"} args={[0xfefefe,0.0022]}></fogExp2>
                    <ambientLight intensity={0.1} />
                    <directionalLight 
                        color={0xffffff}
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
                    <Mountains MountainPosition={new Vector3(60,35,-85)} MountainRadius={60} MountainHeight={80}></Mountains>
                    <Mountains MountainPosition={new Vector3(30,10,0)} MountainRadius={20} MountainHeight={30}></Mountains>
                    <Mountains MountainPosition={new Vector3(-60,10,-85)} MountainRadius={60} MountainHeight={80}></Mountains>
                    <Mountains MountainPosition={new Vector3(-50,15,-10)} MountainRadius={60} MountainHeight={80}></Mountains>
                    
                    <Mountains MountainPosition={new Vector3(-80,35,-180)} MountainRadius={60} MountainHeight={80}></Mountains>
                    <Mountains MountainPosition={new Vector3(90,35,-150)} MountainRadius={60} MountainHeight={90}></Mountains>
                    <Mountains MountainPosition={new Vector3(-2,0,-150)} MountainRadius={20} MountainHeight={20}></Mountains>
                    <Mountains MountainPosition={new Vector3(20,35,-270)} MountainRadius={100} MountainHeight={140}></Mountains>
                    
                    <Mountains MountainPosition={new Vector3(200,35,-300)} MountainRadius={60} MountainHeight={80}></Mountains>
                    <Mountains MountainPosition={new Vector3(-150,35,-250)} MountainRadius={60} MountainHeight={90}></Mountains>
                    <Mountains MountainPosition={new Vector3(-150,5,-100)} MountainRadius={60} MountainHeight={80}></Mountains>
                    <Mountains MountainPosition={new Vector3(150,35,-50)} MountainRadius={60} MountainHeight={80}></Mountains>
                    
                    {/* @ts-ignore */}
                    <e.mesh theatreKey="Cone" position={[0,0,0]} >
                        <coneGeometry args={[100,100,,,true]}/>
                        <meshPhysicalMaterial />
                    </e.mesh>

                    {/* @ts-ignore */}
                    {/* <e.mesh theatreKey="Cube">
                    <boxGeometry args={[100, 100, 100]} />
                    <meshStandardMaterial color="orange" />
                    </e.mesh> */}

                    </SheetProvider>

                <Perf
                position='bottom-left'></Perf>
            </Canvas>
        </>
    )
}