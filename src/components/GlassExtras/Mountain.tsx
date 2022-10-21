import { Color, DoubleSide, Vector3 } from "three";


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

    return(
        <>
        <mesh position={MountainPosition}>
            <coneGeometry args={[MountainRadius,MountainHeight,,,true]}/>
            <meshPhysicalMaterial 
                color= {0xffffff}
                metalness= {0}
                roughness= {0.6}
                ior= {2}
                transmission= {1} // use material.transmission for glass materials
                specularIntensity= {10}
                specularColor= {0xff0000}
                opacity= {0.8}
                // side= {DoubleSide}
                transparent= {true}
                thickness={2.5}
            />
        </mesh>
       </>
    )
}