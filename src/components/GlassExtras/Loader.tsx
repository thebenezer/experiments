import { Html, useProgress} from '@react-three/drei';

export default function Loader() {
    const styles = {
        container: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: '#171717',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'opacity 300ms ease',
          zIndex: 1000
        },
        inner: {
          width: 100,
          height: 3,
          background: '#272727',
          textAlign: 'center'
        },
        bar: {
          height: 3,
          width: '100%',
          background: 'white',
          transition: 'transform 200ms',
          transformOrigin: 'left center'
        },
        data: {
          display: 'inline-block',
          position: 'relative',
          fontVariantNumeric: 'tabular-nums',
          marginTop: '0.8em',
          color: '#f0f0f0',
          fontSize: '0.6em',
          fontFamily: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", "Helvetica Neue", Helvetica, Arial, Roboto, Ubuntu, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"`,
          whiteSpace: 'nowrap'
        }
      };
    const { progress, item, loaded, total } = useProgress()
    // console.log( progress, item, loaded, total)

    return (
        <Html center style={{position:'fixed',bottom:"-50%", left:"50%",width:"100vw",height:"100vh",color:"White",fontSize:"20px", zIndex:4,backgroundColor:"black",display:"flex"}}>
            <div style={{margin:"auto"}}>
                {Math.round(progress)} % loaded
            </div>
        </Html>
    );
  }