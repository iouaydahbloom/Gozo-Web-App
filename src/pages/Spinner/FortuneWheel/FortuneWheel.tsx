import styles from './fortuneWheel.module.scss';
import { WheelSegment } from '../../../models/wheelSegment';
import { useContext, useEffect } from 'react';
import { Winwheel } from '../WinWheelLibrary/Winwheel';
import { ellipsisTruncate } from '../../../helpers/managment/string';
import { WheelSettingsContext } from '../../../providers/WheelSettingsProvider/wheelSettingsContext';

interface Props {
  data: WheelSegment[],
  spin: boolean,
  selectedPrizeId: string,
  onStopSpinning: () => void,
  spinDuration?: number,
  logoAtCenter?: string,
  onClick?: () => any
}

var myWheel: any

const FortuneWheel: React.FC<Props> = ({
  data,
  spin,
  selectedPrizeId,
  onStopSpinning,
  spinDuration,
  logoAtCenter,
  onClick
}) => {
  // const [isSpinning, setIsSpinning] = useState(false)
  // const spinner = useRef<Winwheel>();

  const { isMuted } = useContext(WheelSettingsContext);

  useEffect(() => {
    myWheel = new Winwheel({

      'drawText': true,              // Code drawn text can be used with segment images.
      'textAlignment': 'center',
      'textFontFamily': 'Monda',
      // 'textStrokeStyle'   : 'black',
      // 'textLineWidth'     : 3,
      'textFillStyle': 'white',
      // 'drawMode'          : 'segmentImage',
      // 'drawMode'     : 'image',    // drawMode must be set to image.
      // 'imageDirection': "N",
      // 'imageOverlay': true,
      'canvasId': 'canvas',
      'numSegments': data.length,
      'segments': getOptimizeData(),
      'textFontSize': 16,
      'textMargin': 6,

      'outerRadius': 170,    // Use these three properties to
      'centerX': 200,    // correctly position the wheel
      'centerY': 200,    // over the background.

      // 'outerRadius': 140,    // Use these three properties to
      // 'centerX': 150,    // correctly position the wheel
      // 'centerY': 187,    // over the background.
      'lineWidth': 2,
      'strokeStyle': "#fff",
      'fillStyle': "#000",

      'innerRadius': 35,             // The larger the inner radius, the bigger the
      // hollow space inside the wheel.
      // 'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
      // 'textOrientation' : 'curved',  
      // [
      //     {'fillStyle' : '#eae56f', 'text' : 'Prize One'},
      //     {'fillStyle' : '#89f26e', 'text' : 'Prize Two'},
      //     {'fillStyle' : '#7de6ef', 'text' : 'Prize Three'},
      //     {'fillStyle' : '#e7706f', 'text' : 'Prize Four'}
      // ],
      // 'responsive': true, // This wheel is responsive!
      'animation':
      {
        'type': 'spinToStop',
        'duration': 10,
        'spins': 5,
        // 'callbackAfter': drawTriangle,
        'callbackFinished': callbackFinished,  // Function to call whent the spinning has stopped.
        'callbackSound': playSound,   // Called when the tick sound is to be played.
        // 'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound.
      },
      // 'pins' :                // Turn pins on.
      // {
      //     // 'number'     : data.length,
      //     // 'number': 18
      //     // 'fillStyle'  : 'silver',
      //     // 'outerRadius': 4,
      //     // 'responsive': true,
      // }
    });

  }, [data, isMuted])


  function getOptimizeData() {
    // let canvas = document.getElementById('canvas') as HTMLCanvasElement;
    // let ctx = canvas.getContext('2d');

    // // Create radial gradient (this works best with the roundness of the wheel)
    // // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createRadialGradient
    // // Many values should be the centre of the canvas. If the canvas is square can just use the height / 2.
    // // The remaining values are the radius of the starting circle then the radius of the ending circle.
    // let canvasCenter = canvas.height / 2;
    // // x0,y0,r0,x1,y1,r1
    // let radGradient = ctx && ctx.createRadialGradient(canvasCenter, canvasCenter, 35, canvasCenter, canvasCenter, 170);

    let trasformedData: WheelSegment[] = data.map(a => ({ ...a } as WheelSegment))
    trasformedData = trasformedData.map((item: WheelSegment) => {
      // // Add the colour stops - 0.0 should be the first, 1.0 the last, others in between.
      // radGradient && radGradient.addColorStop(0, item.fillStyle ?? '');
      // // radGradient && radGradient.addColorStop(1, "red");
      // radGradient && radGradient.addColorStop(1, item.textFillStyle ?? '');
      // item.fillStyle = radGradient as any
      // // console.log("item", item)
      // // console.log("radGradient", radGradient)
      item.text = ellipsisTruncate(item.text, 10)
      return item
    })

    return trasformedData
  }

  function randomIntFromInterval(min: number, max: number) { // interval between min + 1 and max - 1
    return Math.floor(Math.random() * (max - min - 2) + (min + 1))
  }

  function setStopAngle(min: number, max: number) {
    return min + (max - min) / 2
  }


  function calculatePrize() {
    // Important thing is to set the stopAngle of the animation before stating the spin.
    const selectedSegment = myWheel.segments.find((item: WheelSegment) => item?.id === selectedPrizeId)
    if (myWheel?.animation && selectedSegment) myWheel.animation.stopAngle = randomIntFromInterval(selectedSegment.startAngle, selectedSegment.endAngle);
    // May as well start the spin from here.
    myWheel.startAnimation();
    // setIsSpinning(true)
  }

  // Loads the tick audio sound in to an audio object.
  let audio = new Audio('/assets/audio/tick.mp3');

  // This function is called when the sound is to be played.
  function playSound() {
    audio.muted = isMuted;
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
  }

  // Called when the animation has finished.
  function callbackFinished() {
    onStopSpinning()
    winAnimation()
    // setIsSpinning(false)
    // resetWheel()
  }

  // This function called after the spin animation has stopped.
  function winAnimation() {

    // Get the number of the winning segment.
    let winningSegmentNumber = myWheel.getIndicatedSegmentNumber();

    // // Loop and set fillStyle of all segments to gray.
    // for (let x = 1; x < myWheel.segments.length; x++) {
    //   myWheel.segments[x].fillStyle = 'gray';
    // }

    // Make the winning one yellow.
    myWheel.segments[winningSegmentNumber].lineWidth = '6';

    // Call draw function to render changes.
    myWheel.draw();
  }

  function resetWheel() {
    myWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
    myWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
    myWheel.draw();                // Call draw to render changes to the wheel.
  }

  // // Create new image object in memory.
  // let loadedImg = new Image();


  // useEffect(() => {
  // // Create callback to execute once the image has finished loading.
  // loadedImg.onload = function()
  // {
  //     myWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
  //     myWheel.draw();                    // Also call draw function to render the wheel.
  // }
  // myWheel.segments.forEach((segment:any)=> {
  //   // console.log("segment", segment)
  //   // // Set the image source, once complete this will trigger the onLoad callback (above).
  // if(segment) loadedImg.src = segment.image;
  // })


  // }, [])





  useEffect(() => {
    if (spin && Object.keys(myWheel).length !== 0 && selectedPrizeId) {
      calculatePrize()
    }
  }, [spin, selectedPrizeId])

  // useEffect(() => {
  //     if(spin) calculatePrize()
  //   }, [spin])






  // // useEffect(() => {
  //               // Create new image object in memory.
  //               let loadedImg = new Image();

  //               // Create callback to execute once the image has finished loading.
  //               loadedImg.onload = function()
  //               {
  //                   myWheel.wheelImage = loadedImg;    // Make wheelImage equal the loaded image object.
  //                   myWheel.draw();                    // Also call draw function to render the wheel.
  //               }

  //               // Set the image source, once complete this will trigger the onLoad callback (above).
  //               loadedImg.src = 'assets/image/planes.png';
  // // }, [])


  // return ( 
  return (
    <div className={styles.canvasContainer}
      style={{ backgroundImage: `url('assets/image/wheel-background.png')` }}
    >
      {logoAtCenter &&
        <img
          alt=''
          className={styles.logo}
          src={logoAtCenter}
          width="70"
          height="70"
          onClick={onClick}
        />
      }
      <img
        // className={`${styles.iconPin} ${isSpinning ? styles.pinShaking : ''}`}
        className={`${styles.iconPin}`}
        alt=''
        src="assets/image/wheel-marker.svg"
        width="50"
        height="50"
      />
      {/* <img
            className={`${styles.iconSpin}`}
            src="assets/image/Eclipse-1s-200px.svg"
            width="50"
            height="50"
          /> */}
      <canvas
        id="canvas"
        width="400"
        height="400"
        onClick={onClick}
      />
    </div>
  )
}

export default FortuneWheel;
