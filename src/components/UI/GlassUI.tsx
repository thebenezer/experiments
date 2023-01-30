import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from '../../styles/glass.module.css';
import {
    AiOutlineFullscreen,
    AiOutlineFullscreenExit,
    AiOutlineSound,
    AiFillSound,
    AiFillMail,
} from "react-icons/ai";
import { FaGithubAlt, FaTwitter } from "react-icons/fa";
import { IconContext } from "react-icons";
import { useProgress } from "@react-three/drei";
import { gsap } from "gsap";
import { useEnterSiteStore } from "../GlassExtras/enterSiteHook"; 



const GlassUI = () => {

    const navContainerRef = useRef<HTMLElement>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const logoRef=useRef(null);
    const { progress} = useProgress();

    const enterSite = useEnterSiteStore(state => state.enterSite)

    useEffect(()=>{
        // console.log("hi",enterSite)
    },[enterSite])
    
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
                    <IconContext.Provider value={{ className: styles.soundOn, style: { display: isSoundOn ? "none" : "block" }}}>
                        <AiOutlineSound onClick={toggleSound} />
                    </IconContext.Provider>
                    <IconContext.Provider value={{ className: styles.soundOff, style: { display: isSoundOn ? "block" : "none" } }}>
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
            <header className={styles.header}>

            </header>
        </>
    );
};

export default GlassUI;
