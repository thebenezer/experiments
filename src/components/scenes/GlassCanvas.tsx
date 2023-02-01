import { Canvas } from '@react-three/fiber';
import { Perf } from "r3f-perf";

import River from '../GlassExtras/River';
import MyCamera from '../GlassExtras/MyCamera';
import { ScrollControls } from '@react-three/drei';
import { Suspense } from 'react';
import Loader from '../GlassExtras/Loader';
// @ts-ignore
import Sfx from '../GlassExtras/Sfx';
import styles from '../../styles/Home.module.css'

export default function GlassCanvas() {
    return (
        <>
            <Sfx />
            <Canvas
            className={styles.canvas}
                shadows
            >
                <Loader />
                <ScrollControls pages={3} damping={1} eps={0.0000001} style={{ zIndex: 1 }}>
                    <MyCamera></MyCamera>
                </ScrollControls>
                <color attach="background" args={[0xfefefe]} />
                <fogExp2 attach={"fog"} args={[0xfefefe, 0.0042]}></fogExp2>
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
                />
                <Suspense fallback={null}>
                    <River></River>
                </Suspense>

                {/* <Perf position='bottom-left'></Perf> */}
            </Canvas>
        </>
    );
}