import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Box, Cone, meshBounds, OrbitControls, PerspectiveCamera, Tetrahedron, useTexture } from '@react-three/drei';
import { TextureLoader, Vector2, Mesh, RepeatWrapping, MeshPhongMaterial } from 'three';
import { Perf } from "r3f-perf";
import { useRef } from 'react';

function River(){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
    const mandelbrotShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
          },
          vertexShader: `
            varying vec2 UV;
            uniform float u_time;
            void main(){
                // Elevation
                float elevation = sin(position.y * 1.) *
                0.5;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x+elevation,position.yz,0.1);
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
        <mesh ref={planeRef} rotation={[-Math.PI/2,0,0]} position={[0,0.05,.10]}>
            <planeGeometry args={[1,10,10,100]}/>
            <shaderMaterial attach="material" args={[mandelbrotShader]}/>
        </mesh>
        </>
    )
}

function Waterfall(){
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
   
    const mandelbrotShader ={
        uniforms: {
            u_time: { type:'f', value: 0 },
            // iResolution: { type: Vector2, value: new Vector2(size.width, size.height) },
            tex: { type:'t', value: texture },
          },
          vertexShader: `
            varying vec2 UV;
            uniform float u_time;
            void main(){
                // Elevation
                // float elevation = sin(position.y * 1.) * 0.5;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,0.1);
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
        <mesh ref={planeRef} position={[4.8,-49.95,50.1]} frustumCulled={false}>
            <planeGeometry args={[1,10,10,100]}/>
            <shaderMaterial attach="material" args={[mandelbrotShader]}/>
        </mesh>
        </>
    )
}

export default function MyCanvas() {

    
    return(
        <>
            <Canvas shadows>
                <ambientLight intensity={0.1} />
                <directionalLight color={0xfefefe} position={[10, 10, 5]} castShadow />
                {/* <PerspectiveCamera makeDefault/> */}
                <OrbitControls></OrbitControls>
                <River></River>
                <Waterfall></Waterfall>
                <Box args={[100,100,100]} position={[0,-50,0]} material={new MeshPhongMaterial()} receiveShadow={true}></Box>
                <Cone args={[20,30]} position={[30,15,-15]} material={new MeshPhongMaterial()} castShadow={true}></Cone>
                <Perf></Perf>
            </Canvas>
        </>
    )
}