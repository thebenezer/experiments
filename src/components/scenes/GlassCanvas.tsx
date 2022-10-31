import { Canvas } from '@react-three/fiber'
import { Vector3 } from 'three';
import { Perf } from "r3f-perf";

import Mountain from '../GlassExtras/Mountain';
import Grass from '../GlassExtras/Grass';
import Plateau from '../GlassExtras/Plateau';
import Waterfall from '../GlassExtras/Waterfall';
import Lake from '../GlassExtras/Lake';
import River from '../GlassExtras/River';
import MyCamera from '../GlassExtras/MyCamera';
import Crystal from '../GlassExtras/Crystal';

export default function GlassCanvas() {
    return(
        <>
            <Canvas 
                shadows
            >
                    <MyCamera></MyCamera>
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
                    />
                    {/* <Crystal></Crystal> */}
                    <River theRiverPosition={new Vector3(0,0,0)}></River>
                    <Lake></Lake>
                    <Grass></Grass>
                    <Plateau></Plateau>
                    <Mountain MountainPosition={new Vector3(60,35,-85)} MountainRadius={60} MountainHeight={80}></Mountain>
                    <Mountain MountainPosition={new Vector3(30,10,0)} MountainRadius={20} MountainHeight={30}></Mountain>
                    <Mountain MountainPosition={new Vector3(-60,10,-85)} MountainRadius={60} MountainHeight={80}></Mountain>
                    <Mountain MountainPosition={new Vector3(-50,15,-10)} MountainRadius={60} MountainHeight={80}></Mountain>
                    
                    <Mountain MountainPosition={new Vector3(-80,35,-180)} MountainRadius={60} MountainHeight={80}></Mountain>
                    <Mountain MountainPosition={new Vector3(90,35,-150)} MountainRadius={60} MountainHeight={90}></Mountain>
                    <Mountain MountainPosition={new Vector3(-2,0,-150)} MountainRadius={20} MountainHeight={20}></Mountain>
                    <Mountain MountainPosition={new Vector3(20,35,-270)} MountainRadius={100} MountainHeight={140}></Mountain>
                    
                    <Mountain MountainPosition={new Vector3(200,35,-300)} MountainRadius={60} MountainHeight={80}></Mountain>
                    <Mountain MountainPosition={new Vector3(-150,35,-250)} MountainRadius={60} MountainHeight={90}></Mountain>
                    <Mountain MountainPosition={new Vector3(-150,5,-100)} MountainRadius={60} MountainHeight={80}></Mountain>
                    <Mountain MountainPosition={new Vector3(150,35,-50)} MountainRadius={60} MountainHeight={80}></Mountain>
                <Perf
                position='bottom-left'></Perf>
            </Canvas>
        </>
    )
}