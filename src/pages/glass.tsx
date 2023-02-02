import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import ReactDOM from 'react-dom';
import GlassCanvas from '../components/scenes/GlassCanvas';
import GlassUI from '../components/UI/GlassUI';

const Glass: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Glass</title>
        <meta name="description" content="Glass" />
        <link rel="icon" href="/favicon.ico" />
        
        <meta itemProp="name" content="Ebenezer - Experiment"></meta>
        <meta itemProp="description" content="River and Waterfall Shader built with three.js and theatre.js."></meta>
        <meta itemProp="image" content="/waterfallAssets/Social.webp"></meta>

        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:title" content="Ebenezer - Experiment"></meta>
        <meta name="twitter:description" content="River and Waterfall Shader built with three.js and theatre.js."></meta>
        <meta name="twitter:image" content="/waterfallAssets/Social.webp"></meta>

        <meta property="og:site_name" content="Ebenezer - Experiment"></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:url" content="https://thebenezer.com"></meta>
        <meta property="og:title" content="Ebenezer - Experiment"></meta>
        <meta property="og:description" content="River and Waterfall Shader built with three.js and theatre.js."></meta>
        <meta property="og:image" content="/waterfallAssets/Social.webp"></meta>
      </Head>
      <GlassUI></GlassUI>
      <GlassCanvas></GlassCanvas>
      <footer>
      </footer>
    </div>
  );
};

export default Glass;
