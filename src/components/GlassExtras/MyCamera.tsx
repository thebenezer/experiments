import { Box, PerspectiveCamera } from "@react-three/drei";
import { editable as e, SheetProvider } from '@theatre/r3f';
import studio from "@theatre/studio";
import { useEffect, useState, useRef, useMemo, useLayoutEffect } from "react";
import extension from '@theatre/r3f/dist/extension';
import { getProject, onChange} from "@theatre/core";
import { useFrame, useThree } from "@react-three/fiber";
import { Camera, Object3D} from "three";
import { useScroll } from "@react-three/drei";


// Theatre.js project sheet
const mainSheet = getProject('GlassProject').sheet('Glass');

export default function MyCamera() {
    const groupRef = useRef<Object3D>(null);
    const camRef = useRef<Camera>(null);
    const scroll = useScroll();
    const mySequence = mainSheet.sequence;

    useLayoutEffect(()=>{
        // scroll.el.firstElementChild?.classList.add("scroll")
        // scroll.el.classList.add("scroll")
    },[scroll.el])


    // Move camera based on pointer position
    const {camera,size} = useThree()
    const [cursor] = useState({x:0,y:0});
    const target = {x:0,y:0}
    const range = 0.0001;

    useFrame((state,delta)=>{
        target.x = ( 1 - cursor.x ) * range;
        target.y = ( 1 - cursor.y ) * range; 
        // replace delta with any multiplier to change the lerp speed
        // camera.rotation.x += delta * ( target.y - camera.rotation.x );
        // camera.rotation.y += delta * ( target.x - camera.rotation.y );
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
    let isSeqPlaying = false;
    
    useEffect(() => {
        if (!theatreInit) {
            // theatreInit = true
            studio.initialize();
            studio.extend(extension);
            studio.ui.hide();
            setTheatreInit(true);
              
        }
    }, [theatreInit]);
    onChange(mySequence.pointer.playing, (playing) => {
        isSeqPlaying=playing;
    }) 

    //************ Handle scrolling page by page ************//

    let currentPage=0;
    const doScroll = (dir:number)=>{
        if(isSeqPlaying)return;
        let lr=0,ur=0;
        if(dir>0 && currentPage<3){
            currentPage+=1
            if(currentPage==1){
                lr=0,ur=4;
            } else if(currentPage==2){
                lr=4,ur=8;
            } else{
                lr=8,ur=12;
            }
            mySequence.play({range: [lr, ur]}).then(()=>{
                scroll.delta=0;
            });
        }
        else if(dir<0 && currentPage>0){
            currentPage-=1
            if(currentPage==0){
                lr=0,ur=4;
            } else if(currentPage==1){
                lr=4,ur=8;
            } else{
                lr=8,ur=12;
            }
            scroll.delta=0;
            mySequence.play({range: [lr,ur],direction: "reverse"}).then(()=>{
                scroll.delta=0;
            });
        }
        console.log(currentPage)
    }
    let dir = 0
    let prevScroll = 0;
    
    useFrame(()=>{
        // if(studio.ui.isHidden)
            // mainSheet.sequence.position = scroll.offset * 15
        if(!dir && !isSeqPlaying && scroll.delta>0.0005){
            
            if((prevScroll-scroll.offset)<0){
                dir=1
            }
            else if((prevScroll-scroll.offset)>0) {
                dir=-1
            }
            doScroll(dir);
        }
        else{
            dir = 0;
        }
        if(isSeqPlaying){
            scroll.el.scrollTop=scroll.el.scrollHeight/2
        }
        prevScroll=scroll.offset;

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