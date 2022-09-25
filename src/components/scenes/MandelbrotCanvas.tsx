import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Box, Circle, Cone, meshBounds, OrbitControls, OrbitControlsProps, PerspectiveCamera, Tetrahedron, useTexture } from '@react-three/drei';
import { Vector2, Mesh, RepeatWrapping, MeshPhongMaterial, ShaderMaterial, Vector3, MirroredRepeatWrapping, ACESFilmicToneMapping, FloatType } from 'three';
import { Perf } from "r3f-perf";
import { useEffect, useRef } from 'react';
import MandelbrotShader from "../shaders/MandelbrotShader";
import gsap from 'gsap';

function calculateAspectScale(width: number, height: number): Vector2 {
    const aspect = width / height;
    const scale = new Vector2(1., 1.);
    if (aspect > 1.0) {
        scale.y /= aspect;
    } else {
        scale.x *= aspect;
    }
    return scale;
}

interface MandelbrotProps {
    MandelbrotPosition: Vector3;
    MandelbrotRotation?: Vector3;
}

function MandelbrotPlane({
    MandelbrotPosition,
    MandelbrotRotation = new Vector3(0, 0, 0),
}: MandelbrotProps) {
    const texture = useTexture("./peter-burroughs-tilingwater.jpg");
    texture.wrapS = texture.wrapT = RepeatWrapping;
    const planeRef = useRef<Mesh>(null);
    const { size, mouse } = useThree();
    const keyCodes = new Set();

    const mandelShader = {
        uniforms: {
            u_time: { type: 'f', value: 0 },
            u_maxIter: { type: 'f', value: 1 },
            tex: { type: 't', value: texture },
            u_scale: { type: Vector2, value: calculateAspectScale(size.width, size.height) },
            u_pos: { type: Vector2, value: new Vector2(0.0, 0.0) },
        },
        vertexShader: MandelbrotShader.vertex,
        fragmentShader: MandelbrotShader.fragment
    };

    gsap.to(mandelShader.uniforms.u_maxIter,{value:50,duration:5.5,ease:"ease-out",delay:0.5})
    // gsap.to(mandelShader.uniforms.u_scale.value,{x:100,duration:5.5,ease:"ease-out",delay:0.5})
    // gsap.to(mandelShader.uniforms.u_scale.value,{y:100,duration:5.5,ease:"ease-out",delay:0.5})

    const scale = new Vector2(mandelShader.uniforms.u_scale.value.x, mandelShader.uniforms.u_scale.value.y);
    const pos = new Vector2(mandelShader.uniforms.u_pos.value.x, mandelShader.uniforms.u_pos.value.y);
    const smoothPos = new Vector2();
    const smoothScale = new Vector2();

    useEffect(() => {
        if (!planeRef.current) return;
        //@ts-ignore
        planeRef.current.material.uniforms.u_scale.value = calculateAspectScale(size.width, size.height);
    }, [size]);

    const onKeyDown = (e: any) => {
        keyCodes.add(e.code);
    };
    const onKeyUp = (e: any) => {
        keyCodes.delete(e.code);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    function handleInputs() {

        if (keyCodes.has('KeyZ')) {
            scale.multiplyScalar(0.99);
            // mandelShader.uniforms.u_maxIter.value *= 1.005;
        } else if (keyCodes.has("KeyX")) {
            scale.multiplyScalar(1.01);
            // mandelShader.uniforms.u_maxIter.value /= 1.008;
        }

        if (keyCodes.has("KeyW") || keyCodes.has("ArrowUp")) {
            pos.y += 0.01 * scale.x;
        } else if (keyCodes.has("KeyS") || keyCodes.has("ArrowDown")) {
            pos.y -= 0.01 * scale.x;
        }

        if (keyCodes.has("KeyA") || keyCodes.has("ArrowLeft")) {
            pos.x -= 0.01 * scale.x;
        } else if (keyCodes.has("KeyD") || keyCodes.has("ArrowRight")) {
            pos.x += 0.01 * scale.x;
        }
    }

    function updateShader() {
        handleInputs();
        smoothPos.lerp(pos, 0.02);
        smoothScale.lerp(scale, 0.02);
        mandelShader.uniforms.u_scale.value = smoothScale;
        mandelShader.uniforms.u_pos.value = smoothPos;
    }

    useFrame((state) => {
        if (!planeRef.current) return;
        // smootPos.lerp(planeRef.current.material.uniforms.u_pos.value,0.03)
        // mandelShader.uniforms.u_time.value = state.clock.getElapsedTime();
        updateShader();
    });

    return (
        <>
            <mesh ref={planeRef} rotation={[MandelbrotRotation.x, MandelbrotRotation.y, MandelbrotRotation.z]} position={MandelbrotPosition} frustumCulled={false}>
                <planeGeometry args={[10, 10, 1, 1]} />
                <shaderMaterial attach="material" args={[mandelShader]} />
            </mesh>
        </>
    );
}

export default function MyCanvas() {

    //@ts-ignore
    const orbitControlsRef = useRef<OrbitControls>(null);


    useEffect(() => {
        if (!orbitControlsRef.current) return;
        orbitControlsRef.current.enabled = true;
    });

    return (
        <>
            <Canvas
                shadows
                camera={{ fov: 60, position: [0, 0, 20] }}
                style={{
                    zIndex: 0,
                    position: "absolute",
                    top: 0,
                }}
                gl={{
                    logarithmicDepthBuffer: true,
                    powerPreference: "high-performance",
                    antialias: false,
                    toneMapping: ACESFilmicToneMapping,
                    toneMappingExposure: 1,
                    alpha: false,
                }}
            >
                <ambientLight intensity={0.1} />
                <directionalLight
                    color={0xfefefe}
                    position={[10, 10, 5]}
                    castShadow
                    shadow-mapSize-height={512}
                    shadow-mapSize-width={512}
                    shadow-camera-near={0}
                    shadow-camera-far={500}
                    shadow-camera-left={-200}
                    shadow-camera-right={200}
                    shadow-camera-top={200}
                    shadow-camera-bottom={-200}
                />
                <OrbitControls
                    ref={orbitControlsRef}
                    enableDamping={true}
                    dampingFactor={0.04}
                // maxDistance={250}
                // maxPolarAngle={Math.PI/1.8}
                // minPolarAngle={Math.PI/5}
                />
                <MandelbrotPlane MandelbrotPosition={new Vector3(0, 0, 0)} ></MandelbrotPlane>

                <Perf
                    trackCPU={false}
                    className={"perfContainer"}
                    position={"bottom-right"}
                />
            </Canvas>
        </>
    );
}