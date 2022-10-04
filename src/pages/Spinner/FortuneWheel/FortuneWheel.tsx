import styles from './fortuneWheel.module.scss';
import { WheelData } from '../../../models/wheelData';
import { useEffect } from 'react';
import { Winwheel } from '../WinWheelLibrary/Winwheel';
import { ellipsisTruncate } from '../../../helpers/managment/string';

interface Props {
  data: WheelData[],
  spin: boolean,
  selectedPrizeId: string,
  onStopSpinning: () => void,
  spinDuration?: number

}

const FortuneWheel: React.FC<Props> = ({ data, spin, selectedPrizeId, onStopSpinning, spinDuration }) => {

  const myWheel: any = new Winwheel({

    // 'outerRadius'       : 200,               // Set outer radius so wheel fits inside the background.
    // 'drawText'          : true,              // Code drawn text can be used with segment images.
    // 'textFontSize'      : 16,
    // 'textOrientation'   : 'curved',
    'textAlignment': 'inner',
    // 'textMargin'        : 90,
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
    'textFontSize': 12,
    'textMargin': 6,

    // 'outerRadius' : 146,    // Use these three properties to
    // 'centerX'     : 200,    // correctly position the wheel
    // 'centerY'     : 201,    // over the background.

    'outerRadius': 140,    // Use these three properties to
    'centerX': 150,    // correctly position the wheel
    'centerY': 187,    // over the background.
    'lineWidth': 2,

    // 'textAlignment' : 'center',
    // 'centerY'         : 230,
    // 'outerRadius'     : 170,
    'innerRadius': 20,             // The larger the inner radius, the bigger the
    // 'textFontSize'    : 14,             // hollow space inside the wheel.
    // 'textMargin'      : 0,
    // 'textFontFamily'  : 'Courier',
    // 'textOrientation' : 'vertical', // Make text vertial so goes down from the outside of wheel.
    // 'textOrientation' : 'curved',  
    // [
    //     {'fillStyle' : '#eae56f', 'text' : 'Prize One'},
    //     {'fillStyle' : '#89f26e', 'text' : 'Prize Two'},
    //     {'fillStyle' : '#7de6ef', 'text' : 'Prize Three'},
    //     {'fillStyle' : '#e7706f', 'text' : 'Prize Four'}
    // ],

    // 'drawMode'          : 'segmentImage',
    // 'textOverflow': 'ellipsis',
    // 'responsive': true, // This wheel is responsive!

    // 'drawMode'          : 'image',   // drawMode must be set to image.
    // 'drawText'          : true,      // Need to set this true if want code-drawn text on image wheels.

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


  function getOptimizeData() {
    let trasformedData: WheelData[] = structuredClone(data)
    trasformedData = trasformedData.map((item: WheelData) => {
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
    const selectedSegment = myWheel.segments.find((item: WheelData) => item?.id === selectedPrizeId)
    if (myWheel?.animation && selectedSegment) myWheel.animation.stopAngle = randomIntFromInterval(selectedSegment.startAngle, selectedSegment.endAngle);
    // May as well start the spin from here.
    myWheel.startAnimation();
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



  useEffect(() => {
    if (spin && Object.keys(myWheel).length !== 0 && selectedPrizeId) calculatePrize()
  }, [spin, selectedPrizeId])

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
    <div className={styles.myCanvas} style={{ backgroundImage: `url('assets/image/wheel_back.png')` }} >
      <canvas
        id="myCanvas"
        width="300"
        height="350"
      />
    </div>
  )
}

export default FortuneWheel;
