import { useTexture } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { DoubleSide, Vector3 } from "three";


interface MountainProps {
    MountainPosition: Vector3;
    MountainRadius: number;
    MountainHeight: number;
  }
  
export default function Mountain({
    MountainPosition,
    MountainRadius,
    MountainHeight,
}:MountainProps){
    const texture = useTexture("./textures/studio_small_05_1k.jpg");

    return(
        <>
        <mesh position={MountainPosition}>
            <coneGeometry args={[MountainRadius,MountainHeight,,,true]}/>
            <meshPhysicalMaterial 
                color= {0xbbffff}
                envMap = {texture}
                envMapIntensity={1}
                metalness= {0.00}
                roughness= {0.20}
                ior= {2}
                transmission= {1} // use material.transmission for glass materials
                // specularIntensity= {10}
                // specularColor= {0xff0000}
                opacity= {0.8}
                side= {DoubleSide}
                transparent= {true}
                thickness={10.5}
            />
        </mesh>
       </>
    )
}