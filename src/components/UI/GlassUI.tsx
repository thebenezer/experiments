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

const GlassUI = () => {

    const navContainerRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const logoRef = useRef(null);

    const { page, enterSite, soundOn, setSoundOn } = usePageNavStore();
    const headerRef = useRef<HTMLHeadingElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const firstPageRef = useRef<HTMLHeadingElement>(null);

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
            // console.log(page,waterfall)

            if (page == 4 && !waterfall?.isPlaying) {
                waterfall?.play();
                // console.log("hi")
            } else {
                if (waterfall?.isPlaying) waterfall.pause();
            }
        });
    }, [page]);


    const toggleMenu = () => {
        if (!uiClick?.isPlaying) uiClick?.play();
        if (!navContainerRef.current) return;
        if (isMenuOpen) {
            gsap.to(navContainerRef.current, { xPercent: 0, duration: 0.25 });
        } else {
            gsap.to(navContainerRef.current, { xPercent: -100, duration: 0.25 });
        }
        setIsMenuOpen(!isMenuOpen);
    };
    const { music, river, uiClick, waterfall, soundListener } = usePageNavStore();
    const [firstPlay, setfirstPlay] = useState(true);
    useMemo(() => {
        if (enterSite && firstPlay) {
            gsap.delayedCall(1, () => {
                if (uiClick && !uiClick.isPlaying) {
                    uiClick.setVolume(1);
                    uiClick.play();
                }
                if (music && river && waterfall) {
                    music.setVolume(0.3);
                    river.setVolume(0.3);
                    waterfall.setVolume(0.1);
                    if (!music.isPlaying) music.play();
                    if (!river.isPlaying) river.play();
                    setfirstPlay(false);
                }
            });
        }
    }, [enterSite, music, waterfall]);
    const toggleSound = () => {
        if (!soundListener) return;
        if (soundOn) {
            soundListener.setMasterVolume(1);
        }
        else {
            setTimeout(() => {
                soundListener.setMasterVolume(0);
            }, 300);
        }
        uiClick?.play();
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
        if (!aboutRef.current) return;
        if (!uiClick?.isPlaying) uiClick?.play();
        if (aboutRef.current.style.display == "none") {
            aboutRef.current.style.display = "flex";
            setTimeout(() => {
                // @ts-ignore
                aboutRef.current.style.opacity = "1";
            }, 300);
        } else {
            aboutRef.current.style.display = "none";
        }
    };
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
                <div className={styles.soundToggle} onClick={toggleSound}>
                    <IconContext.Provider value={{ className: styles.soundOn, style: { display: !soundOn ? "none" : "block" } }}>
                        <AiOutlineSound />
                    </IconContext.Provider>
                    <IconContext.Provider value={{ className: styles.soundOff, style: { display: soundOn ? "none" : "block" } }}>
                        <AiFillSound />
                    </IconContext.Provider>
                </div>
                <nav className={styles.navContainer} ref={navContainerRef}>

                    <ul className={styles.navList}>
                        <li><a onClick={toggleAbout} onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>about</a></li>
                        <li><a href="../" onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>experiments</a></li>
                        <li><a href="https://www.thebenezer.com" onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>portfolio</a></li>
                        <li>
                            <ul className={styles.navSocial}>
                                <li onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>
                                    <a target={"blank"} href="https://github.com/thebenezer"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaGithubAlt />
                                    </IconContext.Provider></a>
                                </li>
                                <li onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>
                                    <a target={"blank"} href="https://twitter.com/th_ebenezer"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <FaTwitter />
                                    </IconContext.Provider></a>
                                </li>
                                <li onMouseEnter={() => { if (!uiClick?.isPlaying) uiClick?.play(); }}>
                                    <a target={"blank"} href="mailto: thebenezer.mail@gmail.com"><IconContext.Provider value={{ className: styles.gitIcon }}>
                                        <AiFillMail />
                                    </IconContext.Provider></a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </>}
            <div ref={aboutRef} className={styles.about} onClick={toggleAbout}>
                <div>
                    An experiment to create a river & waterfall shader turned out to become a mini project.<br></br><br></br>Scroll to explore.
                </div>
            </div>
            <header ref={headerRef} className={styles.header}>
                <h2 ref={firstPageRef} style={{ display: "block" }}></h2>
            </header>
            <div className={styles.scrollDirectionContainer}>
                <div>{page != 1 ? <BsChevronCompactUp /> : " "}</div>
                <div>Scroll</div>
                <div>{page != 4 ? <BsChevronCompactDown /> : " "}</div>
            </div>
        </>
    );
};

export default GlassUI;
