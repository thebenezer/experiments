import { RoundedBox, useTexture} from '@react-three/drei';
import { Color, DoubleSide, MeshPhysicalMaterial, MirroredRepeatWrapping } from 'three';

export default function Plateau(){
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