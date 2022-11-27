import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from "@theatre/studio";
import { useEffect, useState, useRef } from "react";
import extension from '@theatre/r3f/dist/extension';
import { getProject, types } from "@theatre/core";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion } from "three";


// our Theatre.js project sheet
const mainSheet = getProject('GlassProject').sheet('Glass');

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera');

export default function MyCamera() {
    //@ts-ignore
    const orbitControlsRef = useRef<OrbitControls>(null);

    useEffect(() => {
        if (!orbitControlsRef.current) return;
        orbitControlsRef.current.enabled = true;
    });

    const { camera } = useThree();
    const cameraQuat = new Quaternion();

    //************ INITIALIZE THEATRE.JS ************//

    const [theatreInit, setTheatreInit] = useState(false);
    useEffect(() => {
        if (!theatreInit) {
            // theatreInit = true
            studio.initialize();
            studio.extend(extension);
            studio.ui.hide();
            setTheatreInit(true);
        }
    }, [theatreInit]);

    const [theatreObjectInit, setTheatreObjectInit] = useState(false);

    let Theatre_orbitCont: any = null;
    const theatreConfig = {
        enabled: types.boolean(true),
        target: {
            x: types.number(0),
            y: types.number(0),
            z: types.number(0),
        },
    };
    useEffect(() => {
        if (!theatreObjectInit && mainSheet !== null) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            Theatre_orbitCont = mainSheet.object("OrbitControls", theatreConfig);
            setTheatreObjectInit(true);
        }
    }, [theatreObjectInit, mainSheet]);

    useEffect(() => {
        if (Theatre_orbitCont !== null) {
            Theatre_orbitCont.onValuesChange((values: any) => {
                if (orbitControlsRef.current) {
                    orbitControlsRef.current.enabled = values.enabled;
                }
            });
        }
    }, [Theatre_orbitCont]);

    useFrame(() => {
        if (orbitControlsRef.current && !orbitControlsRef.current.enabled) {
            camera.getWorldQuaternion(cameraQuat);
            camera.setRotationFromQuaternion(cameraQuat);
        }
    });

    return (
        <>
            <SheetProvider sheet={mainSheet}>
                <EditableCamera
                    theatreKey="NewCamera"
                    makeDefault
                    position={[0, 30, 170]}
                    fov={45}
                ></EditableCamera>
            </SheetProvider>
            <OrbitControls
                ref={orbitControlsRef}
                enableDamping={true}
                dampingFactor={0.04}
                enablePan={false}
                enableZoom={false}
            />
        </>
    );

}