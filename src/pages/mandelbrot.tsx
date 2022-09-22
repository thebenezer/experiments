import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/mbrot.module.css'

import ReactDOM from 'react-dom'
import MandelbrotCanvas from '../components/scenes/MandelbrotCanvas';

const Mandelbrot: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mandelbrot</title>
        <meta name="description" content="Mandelbrot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className={styles.header}>
        <h1>Mandelbrot</h1>
        <nav>
          <ul>
            <li>=</li>
          </ul>
        </nav>
      </header>
      <MandelbrotCanvas></MandelbrotCanvas>
      <footer>
      </footer>
    </>
  )
}

export default Mandelbrot
