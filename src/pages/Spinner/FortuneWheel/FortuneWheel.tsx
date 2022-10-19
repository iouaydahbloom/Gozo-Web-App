import styles from './fortuneWheel.module.scss';
import { WheelSegment } from '../../../models/wheelSegment';
import { useEffect, useRef, useState } from 'react';
import { Winwheel } from '../WinWheelLibrary/Winwheel';
import { ellipsisTruncate } from '../../../helpers/managment/string';

interface Props {
  data: WheelSegment[],
  spin: boolean,
  selectedPrizeId: string,
  onStopSpinning: () => void,
  spinDuration?: number,
  logoAtCenter?: string
}

const FortuneWheel: React.FC<Props> = ({ data, spin, selectedPrizeId, onStopSpinning, spinDuration, logoAtCenter }) => {
  const [isSpinning, setIsSpinning] = useState(false)
  const spinner = useRef<Winwheel>();

  var myWheel: any
  useEffect(() => {


  myWheel = new Winwheel({

    'drawText'          : true,              // Code drawn text can be used with segment images.
    'textAlignment': 'center',
    'textFontFamily': 'monospace',
    // 'textStrokeStyle'   : 'black',
    // 'textLineWidth'     : 3,
    'textFillStyle': 'white',
    // 'drawMode'          : 'segmentImage',
    // 'drawMode'     : 'image',    // drawMode must be set to image.
    // 'imageDirection': "N",
    // 'imageOverlay': true,
    'canvasId': 'myCanvas',
    'numSegments': data.length,
    'segments': getOptimizeData(),
    'textFontSize': 14, 
    'textMargin': 6,

    'outerRadius': 170,    // Use these three properties to
    'centerX': 230,    // correctly position the wheel
    'centerY': 230,    // over the background.

    // 'outerRadius': 140,    // Use these three properties to
    // 'centerX': 150,    // correctly position the wheel
    // 'centerY': 187,    // over the background.
    'lineWidth': 2,
    'strokeStyle': "#fff",

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
      'callbackAfter': drawTriangle,
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

})


  function getOptimizeData() {
    let trasformedData: WheelSegment[] = structuredClone(data)
    trasformedData = trasformedData.map((item: WheelSegment) => {
      item.text = ellipsisTruncate(item.text, 13)
      return item
    })

    return trasformedData
  }

  function randomIntFromInterval(min: number, max: number) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }


  function calculatePrize() {
    // Important thing is to set the stopAngle of the animation before stating the spin.
    const selectedSegment = myWheel.segments.find((item: WheelSegment) => item?.id === selectedPrizeId)
    if (myWheel?.animation && selectedSegment) myWheel.animation.stopAngle = randomIntFromInterval(selectedSegment.startAngle, selectedSegment.endAngle);
    // May as well start the spin from here.
    myWheel.startAnimation();
    setIsSpinning(true)
  }

  function drawTriangle() {
    // console.log("myWheel", myWheel)
    //     // Get the canvas context the wheel uses.
    //     let ctx = myWheel.ctx;
    //     // Set fill colour.
    //     ctx.lineWidth   = 2;
    //     ctx.strokeStyle = 'white';
    //     ctx.fillStyle = 'white';
    //     ctx.beginPath();
    //     ctx.moveTo(180, 10);
    //     ctx.lineTo(220, 10);
    //     ctx.lineTo(200, 42);
    //     ctx.lineTo(180, 10);               // Complete the path by stroking (draw lines).
    //     ctx.fill();                   // Then fill.
  }

  // Loads the tick audio sound in to an audio object.
  let audio = new Audio('/assets/audio/tick.mp3');

  // This function is called when the sound is to be played.
  function playSound() {
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
  }

  // Called when the animation has finished.
  function callbackFinished() {
    onStopSpinning()
    setIsSpinning(false)
    resetWheel()
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





  // useEffect(() => {
  //   if (spin && Object.keys(myWheel).length !== 0 && selectedPrizeId) calculatePrize()
  // }, [spin, selectedPrizeId])

  useEffect(() => {
      if(spin) calculatePrize()
    }, [spin])






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
    // <div className={styles.myCanvas} style={{ backgroundImage: `url('assets/image/wheel_back.png')` }} >
    <div className={styles.canvasContainer} >
      {logoAtCenter &&
      // <IonAvatar>
            <img
            className={styles.logo}
            src={logoAtCenter}
            width="70"
            height="70"
          />
      // </IonAvatar>
}
      <img
        className={`${styles.iconPin} ${isSpinning ? styles.pinShaking : ''}`}
        src="assets/image/wheel-marker.svg"
        width="50"
        height="50"
      />
      <canvas
        id="myCanvas"
        width="460"
        height="460"
      />
    </div>
  )
}

export default FortuneWheel;
