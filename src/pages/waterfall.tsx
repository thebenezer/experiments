import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReactDOM from 'react-dom'
import WaterfallCanvas from '../components/scenes/WaterfallCanvas'
import GlassUI from '../components/UI/GlassUI';

const Waterfall: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Glass</title>
        <meta name="description" content="Glass" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlassUI></GlassUI>
      <WaterfallCanvas></WaterfallCanvas>
      <footer>
      </footer>
    </div>
  )
}

export default Waterfall
