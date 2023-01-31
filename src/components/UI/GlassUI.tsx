import React, { useEffect, useRef, useState } from "react";
import styles from '../../styles/glass.module.css';
import {
    AiOutlineSound,
    AiFillSound,
    AiFillMail,
} from "react-icons/ai";
import { FaGithubAlt, FaTwitter } from "react-icons/fa";
import { IconContext } from "react-icons";
import { gsap } from "gsap";
import { usePageNavStore } from "../GlassExtras/usePageNavStore";

const GlassUI = () => {

    const navContainerRef = useRef<HTMLElement>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const logoRef=useRef(null);

    const enterSite = usePageNavStore(state => state.enterSite)
    const page = usePageNavStore(state => state.page);
    const headerRef=useRef<HTMLHeadingElement>(null);
    const firstPageRef=useRef<HTMLHeadingElement>(null);

    let t1 = gsap.timeline({repeat: 0});
    let t2 = gsap.timeline({repeat: 0});
    let t3 = gsap.timeline({repeat: 0});
    let t4 = gsap.timeline({repeat: 0});
    useEffect(()=>{
        if(!firstPageRef.current) return;
        t1.to(firstPageRef.current, {duration: 0.1,text:{value:" "}});
        t1.to(firstPageRef.current, {duration: 2,delay:0.5,text:{value:"An Experiment to Create A<br>Dynamic River and Waterfall Shader"}});
        t2.to(firstPageRef.current, {duration: 2,text:{value:" "}});
        t2.to(firstPageRef.current, {duration: 1,delay:0.5,text:{value:"One Geometry. One Shader."}});
        t3.to(firstPageRef.current, {duration: 2,text:{value:" "}});
        t3.to(firstPageRef.current, {duration: 1,delay:0.5,text:{value:"Animated Camera with Theatre.js"}});
        t4.to(firstPageRef.current, {duration: 2,text:{value:" "}});
        t4.to(firstPageRef.current, {duration: 1,delay:0.5,text:{value:"Waterfall Shader with Foam"}});
        t1.pause();t2.pause();t3.pause();t4.pause();

    },[t1, t2, t3, t4,firstPageRef])

    
    useEffect(()=>{
        if(!firstPageRef.current) return;
        gsap.delayedCall(0,()=>{
            if(page==1){
                t1.play();
            }else if(page==2){
                t2.play()
            }else if(page==3){
                t3.play()
            }else if(page==4){
                t4.play()
            }
        });
    },[page])

    
    const toggleMenu = () => {
        if(!navContainerRef.current) return;
        if(isMenuOpen){
            gsap.to(navContainerRef.current, {xPercent: 0, duration: 0.25})
        }else{
            gsap.to(navContainerRef.current, {xPercent: -100, duration: 0.25})
        }
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleSound = () => {
        if(isSoundOn){}
        setIsSoundOn(!isSoundOn);
    };

    // Watch for fullscreenchange
    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }
        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    return (
        <>
            <h1 ref={logoRef} className={styles.logo}>Glass</h1>
            
            {enterSite && <>
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <span className={styles.line1}></span>
                    <span className={styles.line2}></span>
                    <span className={styles.line3}></span>
                    <span className={styles.line4}></span>
                </div>
                <div className={styles.soundToggle}>
                    <IconContext.Provider value={{ className: styles.soundOn, style: { display: isSoundOn ? "block" : "none" }}}>
                        <AiOutlineSound onClick={toggleSound} style={{}}/>
                    </IconContext.Provider>
                    <IconContext.Provider value={{ className: styles.soundOff, style: { display: isSoundOn ? "none" : "block" } }}>
                        <AiFillSound onClick={toggleSound} />
                    </IconContext.Provider>
                </div>
                <nav className={styles.navContainer} ref={navContainerRef}>

                    <ul className={styles.navList}>
                        <li><a href="https://www.thebenezer.com">about</a></li>
                        <li><a href="https://www.thebenezer.com">experiments</a></li>
                        <li><a href="https://www.thebenezer.com">portfolio</a></li>
                        <li>
                            <ul className={styles.navSocial}>
                                <li>
                                    <a target={"blank"} href="https://www.thebenezer.com"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaGithubAlt />
                                    </IconContext.Provider></a>
                                </li>
                                <li>
                                    <a target={"blank"} href="https://www.thebenezer.com"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaTwitter />
                                    </IconContext.Provider></a>
                                </li>
                                <li>
                                    <a target={"blank"} href="https://www.thebenezer.com"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <AiFillMail />
                                    </IconContext.Provider></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </>}
            <header ref={headerRef} className={styles.header}>
                {/* <h2 ref={secondPageRef} style={{display:"block"}}></h2> */}
                <h2 ref={firstPageRef} style={{display:"block"}}>&nbsp;</h2>
            </header>
        </>
    );
};

export default GlassUI;
