import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from '../../styles/glass.module.css';
import {
    AiOutlineSound,
    AiFillSound,
    AiFillMail,
} from "react-icons/ai";
import { BsChevronCompactDown, BsChevronCompactUp } from "react-icons/bs";
import { FaGithubAlt, FaTwitter } from "react-icons/fa";
import { IconContext } from "react-icons";
import { gsap } from "gsap";
import { usePageNavStore } from "../GlassExtras/usePageNavStore";

import useSound from 'use-sound';
import { onChange } from "@theatre/core";
// import boopSfx from './waterfallAssets/CalmAndPeaceful.mp3';


const GlassUI = () => {

    const navContainerRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showScroll, setShowScroll] = useState(false);
    const [waterfallIsPlaying, setWaterfallIsPlaying] = useState(false);

    const { mainSheet, page, enterSite, soundOn, setSoundOn } = usePageNavStore();
    const headerRef = useRef<HTMLHeadingElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const firstPageRef = useRef<HTMLHeadingElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const logoRef = useRef(null);

    onChange(mainSheet.sequence.pointer.playing, (playing) => {
        if(showScroll==playing)
            setShowScroll(!playing)
    })
    useEffect(()=>{
        if(!scrollRef.current)return;
        if(showScroll){
            scrollRef.current.style.opacity = "1"
        }else{
            scrollRef.current.style.opacity = "0"

        }
    },[showScroll])


    const [playHover] = useSound(
        './waterfallAssets/pop-up-on.mp3',
        { volume: 0.5 }
    );
    const [playClick] = useSound(
        './waterfallAssets/pop-down.mp3',
        { volume: 0.5 }
    );
    const [playMusic,{stop:stopMusic}] = useSound(
        './waterfallAssets/CalmAndPeaceful.mp3',
        { 
            volume: 0.3,
            loop:true
        }
    );
    const [playRiver,{stop:stopRiver}] = useSound(
        './waterfallAssets/River.mp3',
        { 
            volume: 0.3,
            loop:true
        }
    );
    const [playWaterfall,{stop:stopWaterfall,sound:waterfallSound}] = useSound(
        './waterfallAssets/WaterfallSmall.mp3',
        { 
            volume: 0,
            loop:true
        }
    );

    let t1 = gsap.timeline({ repeat: 0 });
    let t2 = gsap.timeline({ repeat: 0 });
    let t3 = gsap.timeline({ repeat: 0 });
    let t4 = gsap.timeline({ repeat: 0 });
    useEffect(() => {
        if (!firstPageRef.current) return;
        t1.to(firstPageRef.current, { duration: 1, text: { value: " " } });
        t1.to(firstPageRef.current, { duration: 2, delay: 0.5, text: { value: "An Experiment to Create A<br>Dynamic River and Waterfall Shader" } });
        t2.to(firstPageRef.current, { duration: 2, text: { value: " " } });
        t2.to(firstPageRef.current, { duration: 1, delay: 0.5, text: { value: "One Geometry. One Shader." } });
        t3.to(firstPageRef.current, { duration: 2, text: { value: " " } });
        t3.to(firstPageRef.current, { duration: 1, delay: 0.5, text: { value: "Animated Camera with Theatre.js" } });
        t4.to(firstPageRef.current, { duration: 2, text: { value: " " } });
        t4.to(firstPageRef.current, { duration: 1, delay: 0.5, text: { value: "Waterfall Shader with Foam" } });
        t1.pause(); t2.pause(); t3.pause(); t4.pause();

    }, [t1, t2, t3, t4, firstPageRef]);


    useEffect(() => {
        if (!firstPageRef.current) return;
        gsap.delayedCall(0, () => {
            if (page == 1) {
                t1.play();
            } else if (page == 2) {
                t2.play();
            } else if (page == 3) {
                t3.play();
            } else if (page == 4) {
                t4.play();
            }
            if(waterfallSound){
                if (page == 4 && !waterfallIsPlaying) {
                    waterfallSound.fade(0,0.1,2000);
                    setWaterfallIsPlaying(true)
                } else if(page==3 && waterfallIsPlaying) {
                    waterfallSound.fade(0.1,0,2000);
                    setWaterfallIsPlaying(false)
                }
            }
        });
    }, [page]);


    const toggleMenu = () => {
        playClick();
        if (!navContainerRef.current) return;
        if (isMenuOpen) {
            gsap.to(navContainerRef.current, { xPercent: 0, duration: 0.25 });
        } else {
            gsap.to(navContainerRef.current, { xPercent: -100, duration: 0.25 });
        }
        setIsMenuOpen(!isMenuOpen);
    };
    const [firstPlay, setfirstPlay] = useState(true);


    useMemo(() => {
        if (enterSite && firstPlay) {
            playClick();
            playMusic();
            playRiver();
            playWaterfall();
            setfirstPlay(false);
        }
    }, [enterSite]);
    const toggleSound = () => {
        playClick();
        if (soundOn) {
            stopMusic();
            stopRiver();
            stopWaterfall();
        }
        else {
            playMusic();
            playRiver();
            playWaterfall();
        }
        setSoundOn(!soundOn);
    };
    // Watch for fullscreenchange
    useEffect(() => {
        function onFullscreenChange() {
            setIsFullscreen(Boolean(document.fullscreenElement));
        }
        document.addEventListener("fullscreenchange", onFullscreenChange);

        return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
    }, []);

    const toggleAbout = () => {
        console.log("hi")
        if (!aboutRef.current) return;
        console.log("helloo")
        playClick();
        if (aboutRef.current.style.display == "none") {
            aboutRef.current.style.display = "flex";
            setTimeout(() => {
                // @ts-ignore
                aboutRef.current.style.opacity = "1";
            }, 300);
        } else {
            aboutRef.current.style.opacity = "0";
            setTimeout(() => {
                // @ts-ignore
                aboutRef.current.style.display = "none";
            }, 300);
        }
    };
    return (
        <>
            <h1 ref={logoRef} className={styles.logo} onMouseEnter={() => { playHover(); }}>Glass</h1>

            {enterSite && <>
                <div className={styles.hamburger} onClick={toggleMenu}>
                    <span className={styles.line1}></span>
                    <span className={styles.line2}></span>
                    <span className={styles.line3}></span>
                    <span className={styles.line4}></span>
                </div>
                <div className={styles.soundToggle} onMouseEnter={() => { playHover(); }} onClick={toggleSound}>
                    <IconContext.Provider value={{ className: styles.soundOn, style: { display: soundOn ? "none" : "block" } }}>
                        <AiOutlineSound />
                    </IconContext.Provider>
                    <IconContext.Provider value={{ className: styles.soundOff, style: { display: !soundOn ? "none" : "block" } }}>
                        <AiFillSound />
                    </IconContext.Provider>
                </div>
                <nav className={styles.navContainer} ref={navContainerRef}>

                    <ul className={styles.navList}>
                        <li><a style={{cursor:"pointer"}} onClick={toggleAbout} onMouseEnter={() => { playHover(); }}>about</a></li>
                        <li><a href="../" onMouseEnter={() => { playHover(); }}>experiments</a></li>
                        <li><a href="https://www.thebenezer.com" onMouseEnter={() => { playHover(); }}>portfolio</a></li>
                        <li>
                            <ul className={styles.navSocial}>
                                <li onMouseEnter={() => { playHover(); }}>
                                    <a target={"blank"} href="https://github.com/thebenezer"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaGithubAlt />
                                    </IconContext.Provider></a>
                                </li>
                                <li onMouseEnter={() => { playHover(); }}>
                                    <a target={"blank"} href="https://twitter.com/th_ebenezer"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaTwitter />
                                    </IconContext.Provider></a>
                                </li>
                                <li onMouseEnter={() => { playHover(); }}>
                                    <a target={"blank"} href="mailto: thebenezer.mail@gmail.com"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <AiFillMail />
                                    </IconContext.Provider></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div ref={scrollRef} className={styles.scrollDirectionContainer}>
                    <div className={styles.arrowUp}>{page > 1 ? <BsChevronCompactUp /> : " "}</div>
                    <div>Scroll</div>
                    <div className={styles.arrowDown}>{page != 4 ? <BsChevronCompactDown /> : <p>&nbsp;</p>}</div>
                </div>
                <div ref={aboutRef} className={styles.about} style={{ display: "none" }} onClick={toggleAbout}>
                    <div>
                        An experiment to create a river & waterfall shader turned out to become a mini project.<br></br><br></br>Scroll to explore.
                    </div>
                </div>
                <header ref={headerRef} className={styles.header}>
                    <h2 ref={firstPageRef} style={{ display: "block" }}></h2>
                </header>
            </>}
        </>
    );
};

export default GlassUI;
