import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import { Suspense, useEffect, useRef } from "react";
import { BackSide, Color, DoubleSide, Group, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, RepeatWrapping, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from "three";
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

    const riverRef = useRef<Group>(null)
    const model = useGLTF("./models/glass.glb");
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const riverMat = new ShaderMaterial({
        uniforms: UniformsUtils.merge( [
            UniformsLib[ 'fog'],{u_time:{value:0},tex:{value:texture}}
            ]),
          vertexShader: `
            varying vec2 UV;
            uniform float u_time;

            #include <fog_pars_vertex>
            void main(){
                #include <begin_vertex>
                #include <project_vertex>
                #include <fog_vertex>
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                UV=uv;
            }
          `,
          fragmentShader: `
            #include <fog_pars_fragment>
            varying vec2 UV;
            uniform sampler2D tex;
            uniform float u_time;
            void main(){
                

                float waterfallFoamPos = 0.001;

                vec4 inputTexture = texture2D(tex,vec2(UV.x,UV.y*5.+u_time*0.1));

                float amplitude = 0.009;
                float frequency = 30.;
                float y = sin(UV.x * frequency);
                float t = 1.;
                // y += sin(UV.x*frequency*1.72 + t*1.121)*4.0;
                y += sin(UV.x*frequency*2.221 + t*0.437)*4.0*sin(u_time*2.);
                y += sin(UV.x*frequency*3.+ t*20.+u_time*5.)*2.5;
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
                        0.085
                        )
                    );


                gl_FragColor = vec4(bottomFoam,1.);


                #include <fog_fragment>
            }
          `,
          side:DoubleSide,
          fog:true
    });


    const reflectionEnv = useTexture("./textures/studio_small_05_1k.jpg");

    const mountainMat = new MeshPhysicalMaterial({
        color: 0xbbffff,
        metalness: 0.00,
        roughness: 0.50,
        ior: 2,
        envMap: reflectionEnv,
        // envMapIntensity:1,
        // reflectivity:0.20,
        transmission: 1, // use material.transmission for glass materials
        // specularIntensity: 10,
        // specularColor: new Color(0xff0000),
        opacity: 0.8,
        side: DoubleSide,
        transparent: true,
    })
    mountainMat.thickness = 1.5;

    const plateauMat = new MeshPhysicalMaterial({
        color: 0xbbeeff,
        metalness: 0.00,
        roughness: 0.50,
        ior: 2,
        // reflectivity:0.20,
        transmission: 1, // use material.transmission for glass materials
        specularIntensity: 2,
        specularColor: new Color(0xff0000),
        opacity: 1,
        side: DoubleSide,
        transparent: false,
    })
    const grassMat = new MeshPhongMaterial({
        color: 0xbbffbb,
        opacity: 1,
        side: DoubleSide,
        transparent: false,
    })

    useEffect(()=>{
        model.scene.scale.set(15,15,15)
        model.scene.position.setY(0)
        model.scene.position.setZ(50.5)
        model.scene.traverse((object)=>{
            if(object.name.includes("Cone")){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =mountainMat;
            }else if(object.name.includes("Plateau")){
                (object as Mesh).frustumCulled = false;
                (object as Mesh).material =plateauMat;
            }else if(object.name.includes("Grass")){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =grassMat;
                // (object as Mesh).material.color = 0xffffff;
            }else if(object.name == "TheRiver"){
                (object as Mesh).frustumCulled = false;
                (object as Mesh).material =riverMat;
            }
        })
    },[model]);

    useFrame((state)=>{
        riverMat.uniforms.u_time.value = state.clock.getElapsedTime();
    })

    return(
        <>
            <Suspense fallback={null}>
                <primitive ref={riverRef} object={model.scene}/>
            </Suspense>
        </>
    )
}
