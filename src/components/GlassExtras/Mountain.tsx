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
    const mountKey = 'mountain'+MountainPosition.z
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
       </>
    )
}