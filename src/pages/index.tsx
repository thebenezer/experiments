import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReactDOM from 'react-dom'
import { Canvas } from '@react-three/fiber'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Experiments</title>
        <meta name="description" content="Experiments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Canvas className={styles.canvas}>
        <ambientLight intensity={0.1} />
        <directionalLight color="red" position={[0, 0, 5]} />
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>

      <footer>
      </footer>
    </div>
  )
}

export default Home
