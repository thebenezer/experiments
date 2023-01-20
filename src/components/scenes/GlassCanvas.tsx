import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three';
import { Perf } from "r3f-perf";

import River from '../GlassExtras/River';
import MyCamera from '../GlassExtras/MyCamera';
import { Loader, ScrollControls } from '@react-three/drei';
import styles from '../styles/Home.module.css'

export default function GlassCanvas() {
    return(
        <>
            <Canvas 
                shadows
            >
                <ScrollControls pages={3} damping={1} style={{scrollbarWidth:"none"}}>
                    <MyCamera></MyCamera>
                </ScrollControls>
                <color attach="background" args={[0xfefefe]} />
                    <fogExp2 attach={"fog"} args={[0xfefefe,0.0042]}></fogExp2>
                    <ambientLight intensity={0.1} />
                    <directionalLight 
                        color={0xffffff}
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
                        // intensity={0.5}
                    />
                    <River theRiverPosition={new Vector3(0,0,0)}></River>
                
                <Perf
                position='bottom-left'></Perf>
            </Canvas>
            <Loader/>
        </>
    )
}