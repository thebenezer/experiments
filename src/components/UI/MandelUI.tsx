import React, { useEffect, useState } from "react";
import styles from '../../styles/mbrot.module.css';
// import togglePauseMenu from "./TogglePause";


const MandelUI = () => {

    const [showInventory, setShowInventory] = useState<boolean>(false);
    const reirectLogin = () => {
        // sounds.uiClick?.play();
        setTimeout(() => {
            // Simulate an HTTP redirect:
            window.location.replace("/login");
        }, 500);
    };
    return (
        <>
            <header className={styles.header}>
                <h1>Mandelbrot</h1>
                <nav>
                    <ul>
                        <li>=</li>
                    </ul>
                </nav>
            </header>
        </>
    );
};

export default MandelUI;
