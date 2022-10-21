import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { editable as e,SheetProvider } from '@theatre/r3f'
import { getProject } from "@theatre/core";
import { useGLTF } from "@react-three/drei";
import { Color, Mesh, MeshPhysicalMaterial, DoubleSide } from "three";

const demoSheet = getProject('GlassProject').sheet('Glass');

export default function Crystal(){
    const params = {
        color: 0xff0000,
        transmission: 1,
        opacity: 1,
        metalness: 0,
        roughness: 0,
        ior: 2,
        thickness: 4.5,
        specularIntensity: 2,
        specularColor: new Color(0xff0000),
        envMapIntensity: 0,
        exposure: 1
    };
    
    const model = useGLTF("./models/crystal.glb");
    useEffect(()=>{
        model.scene.scale.setScalar(1)
        model.scene.position.setY(0)
        model.scene.position.setZ(0)
        model.scene.traverse((object)=>{
            if(object.name === "Crystal"){
                const mat = new MeshPhysicalMaterial({
                    color: 0xff,
                    metalness: 0,
                    roughness: 0.6,
                    ior: 2,
                    transmission: 1, // use material.transmission for glass materials
                    specularIntensity: 10,
                    specularColor: new Color(0x00ff00),
                    opacity: 0.8,
                    side: DoubleSide,
                    transparent: true,
                    // thickness:2.5,
                });
                mat.thickness=5.5;
                (object as Mesh).material = mat;
            }
        })
    },[model]);


    useFrame(()=>{

    })
    return(
        <>
        <Suspense fallback={null}>
            <primitive object={model.scene}/>
        </Suspense>
        <SheetProvider sheet={demoSheet}>
            {/* <e.mesh theatreKey="Crystal" position={[0,40,50]} scale={[1,1,1]} rotation={[0,Math.PI/2,0]}>
                <icosahedronGeometry args={[10,0]}/>
                <meshPhysicalMaterial/>
            </e.mesh> */}
        </SheetProvider>
        </>
    )
}
