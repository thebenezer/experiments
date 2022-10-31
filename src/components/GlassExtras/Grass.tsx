import { Box, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { MeshPhongMaterial, Quaternion } from "three";

export default function Grass(){
    

    const model = useGLTF("./models/river2.glb");
    useEffect(()=>{
        model.scene.scale.setScalar(17)
        model.scene.position.setY(9)
        model.scene.position.setZ(55)
    },[model]);

    return(
        <>
            <Box 
                args={[10000,100,1000]} 
                position={[0,-100,550]} 
                material={new MeshPhongMaterial({
                    color : 0xbbffbb
                })} 
                receiveShadow={true}
            />
        </>
    )
}
