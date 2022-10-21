import { Box, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { MeshPhongMaterial, Quaternion } from "three";

export default function Grass(){
    
     const {camera} = useThree()
     const cameraQuat=new Quaternion()

    useFrame(()=>{
        camera.getWorldQuaternion(cameraQuat)
        camera.setRotationFromQuaternion(cameraQuat)
    })
    const model = useGLTF("./models/river2.glb");
    useEffect(()=>{
        model.scene.scale.setScalar(17)
        model.scene.position.setY(9)
        model.scene.position.setZ(55)
    },[model]);

    return(
        <>
        {/* <Suspense fallback={null}>
            <primitive object={model.scene}/>
        </Suspense> */}
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
