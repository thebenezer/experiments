import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { editable as e,SheetProvider } from '@theatre/r3f'
import studio from "@theatre/studio";
import { useEffect, useState, useRef } from "react";
import extension from '@theatre/r3f/dist/extension'
import { getProject } from "@theatre/core";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion } from "three";


// our Theatre.js project sheet
const demoSheet = getProject('GlassProject').sheet('Glass');

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera')

export default function MyCamera(){
    //@ts-ignore
    const orbitControlsRef = useRef<OrbitControls>(null);

    useEffect(()=>{
        if(!orbitControlsRef.current) return;
        orbitControlsRef.current.enabled = true
    })
    
    const {camera} = useThree()
    const cameraQuat=new Quaternion()

    useFrame(()=>{
        camera.getWorldQuaternion(cameraQuat)
        camera.setRotationFromQuaternion(cameraQuat)
    })

    const [theatreInit, setTheatreInit] = useState(false);
    useEffect(() => {
        if (!theatreInit ) {
            // theatreInit = true
            studio.initialize();
            studio.extend(extension);
            setTheatreInit(true);
        }
    }, [theatreInit])

    
    return(
        <>
            <SheetProvider sheet={demoSheet}>
                <EditableCamera
                theatreKey="NewCamera"
                makeDefault
                position={[0, 30, 170]}
                fov={75}
                ></EditableCamera>
            </SheetProvider>
            <OrbitControls 
                ref={orbitControlsRef} 
                enableDamping={true} 
                dampingFactor={0.04} 
            />
        </>
    )

}