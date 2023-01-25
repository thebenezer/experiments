import { Box, PerspectiveCamera } from "@react-three/drei";
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from "@theatre/studio";
import { useEffect, useState, useRef, useMemo } from "react";
import extension from '@theatre/r3f/dist/extension';
import { getProject} from "@theatre/core";
import { useFrame, useThree } from "@react-three/fiber";
import { Camera, Object3D} from "three";
import { useScroll } from "@react-three/drei";


// Theatre.js project sheet
const mainSheet = getProject('GlassProject').sheet('Glass');

export default function MyCamera() {
    const groupRef = useRef<Object3D>(null);
    const camRef = useRef<Camera>(null);
    const scroll = useScroll();

    const {camera,size} = useThree()
    const [cursor] = useState({x:0,y:0});
    const target = {x:0,y:0}
    const range = 0.0004;

    useFrame((state,delta)=>{
        target.x = ( 1 - cursor.x ) * range;
        target.y = ( 1 - cursor.y ) * range; 
        // replace delta with any multiplier to change the lerp speed
        camera.rotation.x += delta * ( target.y - camera.rotation.x );
        camera.rotation.y += delta * ( target.x - camera.rotation.y );
    })

    useMemo(()=>{
        // ON MOUSE MOVE TO GET CAMERA POSITION
        document.addEventListener('mousemove', (event) => {
            cursor.x = (event.clientX) - size.width * 0.5;
            cursor.y = (event.clientY) -size.height * 0.5;
        }, false)
    },[size.height, size.width])


    //************ INITIALIZE THEATRE.JS ************//

    const [theatreInit, setTheatreInit] = useState(false);
    useEffect(() => {
        if (!theatreInit) {
            // theatreInit = true
            studio.initialize();
            studio.extend(extension);
            studio.ui.hide();
            setTheatreInit(true);
            console.log(mainSheet,studio)

        }
    }, [theatreInit]);

    const [theatreObjectInit, setTheatreObjectInit] = useState(false);

    // let Theatre_orbitCont: any = null;
    // const theatreConfig = {
    //     enabled: types.boolean(true),
    //     target: {
    //         x: types.number(0),
    //         y: types.number(0),
    //         z: types.number(0),
    //     },
    // };
    // useEffect(() => {
    //     if (!theatreObjectInit && mainSheet !== null) {
    //         // eslint-disable-next-line react-hooks/exhaustive-deps
    //         Theatre_orbitCont = mainSheet.object("OrbitControls", theatreConfig);
    //         setTheatreObjectInit(true);
    //     }
    // }, [theatreObjectInit, mainSheet]);

    // useEffect(() => {
    //     if (Theatre_orbitCont !== null) {
    //         Theatre_orbitCont.onValuesChange((values: any) => {
    //             if (orbitControlsRef.current) {
    //                 // orbitControlsRef.current.enabled = values.enabled;
    //             }
    //         });
    //     }
    // }, [Theatre_orbitCont]);

    useFrame(()=>{
        // console.log(scroll.offset)
        // mainSheet.sequence.position = scroll.offset * 15
        // console.log(mainSheet.sequence.pointer.length)
    })

    return (
        <>
            <SheetProvider sheet={mainSheet}>
                {/* @ts-ignore */}
                <e.group theatreKey="CamGroup" ref={groupRef} position={[0,0,0]}>
                    <PerspectiveCamera
                        ref={camRef}
                        // theatreKey="NewCamera"
                        makeDefault
                        position={[0, 0, 0]}
                        fov={45}
                    ></PerspectiveCamera>
                    <Box position={[0,0,0]}>
                        <meshBasicMaterial color={0xff0000}></meshBasicMaterial>
                    </Box>
                </e.group>
            </SheetProvider>
        </>
    );

}