import { Html, useProgress} from '@react-three/drei';
import styles from '../GlassExtras/loader.module.css'
import styles2 from '../../styles/glass.module.css'
import { useEffect, useLayoutEffect, useRef } from 'react';
import { gsap } from "gsap";
import { TextPlugin } from "gsap/dist/TextPlugin";
import { usePageNavStore } from './usePageNavStore';

// import projectState from "../../../public/waterfallAssets/Waterfall.theatre-project-state(2).json"

// const mainSheet = getProject('GlassProject',{state:projectState}).sheet('Glass');

// const mainSheet = getProject('GlassProject').sheet('Glass');

export default function Loader() {
    const { progress} = useProgress()

    const ref = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const subRef=useRef(null);
    const {mainSheet} = usePageNavStore();

    const updateEnterSite = usePageNavStore(state => state.updateEnterSite)
    const updatePage = usePageNavStore(state => state.updatePage)
    
    const closeLoader =()=>{
        updateEnterSite();
        if(!ref.current) return;
            ref.current.style.display ="none";
        const logo = document.getElementsByClassName(styles2.logo).item(0);
        var x = window.matchMedia("(max-device-width: 900px)");
        if (x.matches) { // If media query matches
            // @ts-ignore
            logo.style.left = "40px";
            // @ts-ignore
            logo.style.top = "30px";
        } else {
            // @ts-ignore
            logo.style.left = "105px";
            // @ts-ignore
            logo.style.top = "55px";
        }

        // @ts-ignore
        logo.style.transform = "scale(1) translate(0%,0%)";
        mainSheet.sequence.play({range:[0,4],rate:0.5}).then(()=>{
            updatePage(1);
        });
    }

    useLayoutEffect(()=>{
        if(!containerRef.current || !buttonRef.current) return;
        if(progress == 100){
            containerRef.current.style.backgroundColor="#fefefe00";
            buttonRef.current.classList.add(styles.border);
            setTimeout(()=>{
                if(!buttonRef.current) return;
                    buttonRef.current.style.paddingTop="10px";
                    buttonRef.current.style.paddingBottom="5px";
                    buttonRef.current.style.paddingRight=buttonRef.current.style.paddingLeft="30px";
                },1000)
        }
    },[progress,containerRef,buttonRef])

    useEffect(()=>{
        if(!subRef.current) return;
        gsap.registerPlugin(TextPlugin);
        let tl = gsap.timeline({repeat: -1,repeatDelay:0.5});
        tl.to(subRef.current, {duration: 1,delay:0.5,text:{value:"webgl"}});
        tl.to(subRef.current, {duration: 1,delay:0.5,text:{value:"threejs"}});
        tl.to(subRef.current, {duration: 1,delay:0.5,text:{value:"glsl"}});
    },[subRef.current])

    return (
        <Html ref={ref} center style={{position:'fixed',top:"50%", left:"50%",width:"100vw",height:"100vh",color:"#fefefe",fontSize:"20px", zIndex:2}}>
            <div className={styles.sub}>
                <p>A&nbsp;</p><p ref={subRef}></p><p>&nbsp;Experiment</p>
            </div>
            <div ref={containerRef} className={styles.container}>
                <div style={{margin:"auto"}}>
                    {progress!=100 && <div style={{textAlign:'center'}}>
                        {progress.toFixed(0)}%
                    </div>}
                    {progress==100 && <p ref={buttonRef} className={styles.border} onClick={closeLoader}>
                        Enter
                    </p>}
                </div>
            </div>
        </Html>
    );
  }