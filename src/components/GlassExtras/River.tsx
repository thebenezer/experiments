import { useGLTF, useTexture, Html, useProgress } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { getProject } from "@theatre/core";
import { Suspense, useEffect, useRef } from "react";
import { Color, DoubleSide, Group, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, RepeatWrapping, ShaderMaterial, UniformsLib, UniformsUtils, Vector2, Vector3 } from "three";
import { editable as e,SheetProvider } from '@theatre/r3f'
import WaterfallShader from "../shaders/WaterfallShader";
import LakeShader from "../shaders/LakeShader";
import { Console } from "console";

const demoSheet = getProject('GlassProject').sheet('Glass')


export default function River({theRiverPosition=new Vector3(0,0,0)}){

    // const {  progress, item, loaded, total } = useProgress()

    // useEffect(()=>{
    //     console.log( progress, item, loaded, total)
    // },[ item])

    const riverRef = useRef<Group>(null)
    const model = useGLTF("./models/glass1.glb");
    const texture = useTexture("./textures/peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const riverMat = new ShaderMaterial({
        uniforms: UniformsUtils.merge( [
            UniformsLib[ 'fog'],{
                    u_time:{value:0},
                    tex:{value:texture}
                }
            ]),
          vertexShader: WaterfallShader.vertex,
          fragmentShader: WaterfallShader.fragment,
          fog:true
    });
    const lakeMat = new ShaderMaterial({
        uniforms: UniformsUtils.merge( [
            UniformsLib[ 'fog'],{
                    u_time: { type:'f', value: 0 },
                    tex: { type:'t', value: texture },
                    iResolution:{ type:'v', value: new Vector2(100,100)}
                }
            ]),
          vertexShader: LakeShader.vertex,
          fragmentShader: LakeShader.fragment,
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
        opacity: 10,
        side: DoubleSide,
        transparent: false,
    })
    const grassMat = new MeshPhongMaterial({
        color: 0xbbffbb,
        opacity: 1,
        side: DoubleSide,
        transparent: false,
    })

    const crystalMat = new MeshPhysicalMaterial({
        // color: 0xaa77aa,
        color: 0xFFAAaa,
        metalness: 0.00,
        roughness: 0.00,
        ior: 2.2,
        // envMap: reflectionEnv,
        // envMapIntensity:1,
        reflectivity:2,
        transmission: 2, // use material.transmission for glass materials
        specularIntensity: 1,
        specularColor: new Color(0x000000),
        opacity: 0.8,
        side: DoubleSide,
        transparent: true,
    })
    crystalMat.thickness = 2.5;
    const glowMat = new MeshPhongMaterial({
        color: 0xffffff,
        // emissive: 0xffffff,
        opacity: 0,
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
            }else if(object.name.includes("Lake")){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =lakeMat;
            }else if(object.name == "Crystal"){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =crystalMat;
            }else if(object.name == "CrystalOutline"){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =glowMat;
            }else if(object.name == "TheRiver"){
                (object as Mesh).frustumCulled = false;
                (object as Mesh).material =riverMat;
            }
        })
    },[model]);
    useFrame((state)=>{
        riverMat.uniforms.u_time.value = state.clock.getElapsedTime();
        lakeMat.uniforms.u_time.value = state.clock.getElapsedTime();
    })

    return(
        <Suspense fallback={null}>
            <primitive ref={riverRef} object={model.scene}/>
        </Suspense>
    )
}
useGLTF.preload('./models/glass1.glb');
useTexture.preload('./textures/studio_small_05_1k.jpg')
useTexture.preload('./textures/peter-burroughs-tilingwater.jpg')
