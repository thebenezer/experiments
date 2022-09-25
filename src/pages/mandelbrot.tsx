import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

import ReactDOM from 'react-dom';
import MandelbrotCanvas from '../components/scenes/MandelbrotCanvas';
import MandelUI from '../components/UI/MandelUI';

const Mandelbrot: NextPage = () => {
  return (
    <>
      <Head>
        <title>Mandelbrot</title>
        <meta name="description" content="Mandelbrot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MandelUI></MandelUI>
      <MandelbrotCanvas></MandelbrotCanvas>
      <footer>
      </footer>
    </>
  );
};

export default Mandelbrot;
