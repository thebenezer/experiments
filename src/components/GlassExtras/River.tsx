import { useGLTF, useTexture} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { BufferGeometry, Color, DoubleSide, Group, Material, Mesh, MeshPhongMaterial, MeshPhysicalMaterial, Object3D, RepeatWrapping, ShaderMaterial, UniformsLib, UniformsUtils, Vector2, Vector3 } from "three";
import WaterfallShader from "../shaders/WaterfallShader";
import LakeShader from "../shaders/LakeShader";


export default function River(){

    const riverRef = useRef<Group>(null)
    const model = useGLTF("./models/glass2.glb");
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


    const mountainMat = new MeshPhysicalMaterial({
        color: 0xbbffff,
        metalness: 0.00,
        roughness: 0.50,
        ior: 2,
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
        color: 0xaa1100,
        metalness: 0.00,
        roughness: 0.00,
        ior: 2.2,
        reflectivity:1,
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
        emissive: 0xffffff,
        emissiveIntensity:5
    })

    const crystalMovement={
        rotation:0,
        updown:0
    }

    let crystal: Mesh<BufferGeometry, Material | Material[]>;
    let crystalOutline: Mesh<BufferGeometry, Material | Material[]>;
    
    useMemo(()=>{
        model.scene.scale.set(15,15,15)
        model.scene.position.setY(0)
        model.scene.position.setZ(50.5)
        model.scene.traverse((object)=>{
            if(object.name.includes("Cone") || object.name.includes("Icosphere")){
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
                crystal = (object as Mesh)
            }else if(object.name == "CrystalOutline"){
                (object as Mesh).frustumCulled = true;
                (object as Mesh).material =glowMat;
                crystalOutline = (object as Mesh)
            }else if(object.name == "TheRiver"){
                (object as Mesh).frustumCulled = false;
                (object as Mesh).material =riverMat;
            }
        })
    },[model]);
    const frequency = 1, amplitude = 0.001, rotSpeed = 0.003;
    useFrame((state,delta)=>{
        const elTime = state.clock.getElapsedTime();
        // Update river shader
        riverMat.uniforms.u_time.value = elTime;
        lakeMat.uniforms.u_time.value = elTime;
        // Rotate crystal
        crystal.rotation.y+=rotSpeed;
        crystalOutline.rotation.y+=rotSpeed;
        crystal.position.y+=Math.sin(elTime*frequency)*amplitude;
        crystalOutline.position.y+=Math.sin(elTime*frequency)*amplitude;
    })

    return(
        <Suspense fallback={null}>
            <primitive ref={riverRef} object={model.scene}/>
        </Suspense>
    )
}
useGLTF.preload('./models/glass1.glb');
useTexture.preload('./textures/peter-burroughs-tilingwater.jpg')
