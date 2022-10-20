import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReactDOM from 'react-dom'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Experiments</title>
        <meta name="description" content="Experiments" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ul>
          <li><a href="./mandelbrot">mandelbrot</a></li>
          <li><a href="./glass">waterfall</a></li>
        </ul>
      </div>
      <footer>
      </footer>
    </div>
  )
}

export default Home