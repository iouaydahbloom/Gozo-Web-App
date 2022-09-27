import styles from './fortuneWheel.module.scss';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from '../../../models/wheelData';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { useEffect } from 'react';
import { Winwheel } from './Winwheel';
import { ellipsisTruncate } from '../../../helpers/managment/string';
// import WheelComponent from 'react-wheel-of-prizes'
// import 'react-wheel-of-prizes/dist/index.css'
// import Winwheel from "winwheel"
// const Winwheel = require('./Winwheel.js')
// import { TweenMax } from "gsap";

interface Props {
  data: WheelData[],
  spin: boolean,
  winningOptionIndex: number,
  onStopSpinning: () => void,
  spinDuration?: number

}

const FortuneWheel: React.FC<Props> = ({ data, spin, winningOptionIndex, onStopSpinning, spinDuration }) => {
  // console.log("TweenMax", TweenMax)
  // const segments = [
  //   'better luck next time2 better luck next time',
  //   'won 701',
  //   'won 10',
  //   'better luck next time1 better luck next time',
  //   'won 2',
  //   'won uber pass',
  //   'better luck next time3 better luck next time',
  //   'won a voucher'
  // ]
  // const segColors = [
  //   '#EE4040',
  //   '#F0CF50',
  //   '#815CD1',
  //   '#3DA5E0',
  //   '#34A24F',
  //   '#F9AA1F',
  //   '#EC3F3F',
  //   '#FF9000'
  // ]
  // // const onFinished = (winner) => {
  // //   console.log(winner)
  // // }
  // return (
  //   <WheelComponent
  //     segments={segments}
  //     segColors={segColors}
  //     winningSegment='won 10'
  //     onFinished={() => {}}
  //     primaryColor='black'
  //     contrastColor='white'
  //     buttonText='Spin'
  //     isOnlyOnce={false}
  //     size={190}
  //     upDuration={1000}
  //     downDuration={10000}
  //     fontFamily='Arial'
  //   />
// console.log("data", data)




  // // var myWheel = {} as 
// useEffect(() => {

  // Winwheel.animation = new Animation();


  const myWheel: any = new Winwheel({

    // 'outerRadius'       : 200,               // Set outer radius so wheel fits inside the background.
    // 'drawText'          : true,              // Code drawn text can be used with segment images.
    // 'textFontSize'      : 16,
    // 'textOrientation'   : 'curved',
    'textAlignment'     : 'inner',
    // 'textMargin'        : 90,
    'textFontFamily'    : 'monospace',
    // 'textStrokeStyle'   : 'black',
    // 'textLineWidth'     : 3,
    'textFillStyle'     : 'white',
    // 'drawMode'          : 'segmentImage',
    // 'drawMode'     : 'image',    // drawMode must be set to image.
    // 'imageDirection': "N",
    // 'imageOverlay': true,
    'canvasId': 'myCanvas',
    'numSegments'    : data.length,
    'segments'       : getOptimizeData(),
    'textFontSize' : 12,
    'textMargin'   : 6,

    // 'outerRadius' : 146,    // Use these three properties to
    // 'centerX'     : 200,    // correctly position the wheel
    // 'centerY'     : 201,    // over the background.

    'outerRadius' : 140,    // Use these three properties to
    'centerX'     : 150,    // correctly position the wheel
    'centerY'     : 187,    // over the background.
    'lineWidth'   : 2,

    // 'textAlignment' : 'center',
    // 'centerY'         : 230,
    // 'outerRadius'     : 170,
    'innerRadius'     : 20,             // The larger the inner radius, the bigger the
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

    'animation' :
    {
        'type'     : 'spinToStop',
        'duration' : 10,
        'spins'    : 5,
        'callbackAfter' : drawTriangle,
        'callbackFinished' : alertPrize,  // Function to call whent the spinning has stopped.
        'callbackSound'    : playSound,   // Called when the tick sound is to be played.
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
// myWheel.startAnimation()
// console.log("myWheel", myWheel)
// }, [])

function getOptimizeData() {
  return data.map((item) => {
    item.text = ellipsisTruncate(item.text, 13)
    return item
  })
}

function randomIntFromInterval(min:number, max:number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


function calculatePrize()
{
    // This formula always makes the wheel stop somewhere inside prize 3 at least
    // 1 degree away from the start and end edges of the segment.
    // let stopAt = (71 + Math.floor((Math.random() * 43)))
// console.log("myWheel.animation", myWheel.animation)
    // Important thing is to set the stopAngle of the animation before stating the spin.
const selectedSegment = myWheel.segments[1]
// const selectedSegment = myWheel.segments[winningOptionIndex]
// console.log("selectedSegment", selectedSegment)
    if (myWheel?.animation) myWheel.animation.stopAngle = randomIntFromInterval(selectedSegment.startAngle, selectedSegment.endAngle);
    // console.log("myWheel", myWheel)
    // May as well start the spin from here.
    myWheel.startAnimation();
}

// console.log("randomIntFromInterval", randomIntFromInterval(0, 45))

function drawTriangle()
{
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
//   function drawTriangle()
// {
//     tx.strokeStyle = '#000000';     // Set line colour.
//     tx.fillStyle   = 'aqua';        // Set fill colour.
//     tx.lineWidth   = 2;
//     tx.beginPath();                 // Begin path.
//     tx.moveTo(175, 20);             // Move to initial position.
//     tx.lineTo(235, 20);             // Draw lines to make the shape.
//     tx.lineTo(205, 80);
//     tx.lineTo(176, 20);
//     tx.stroke();                    // Complete the path by stroking (draw lines).
//     tx.fill();                      // Then fill with colour.
// }

            // Loads the tick audio sound in to an audio object.
            let audio = new Audio('/assets/audio/tick.mp3');
 
            // This function is called when the sound is to be played.
            function playSound()
            {
              // console.log("entered audio")
                // Stop and rewind the sound if it already happens to be playing.
                audio.pause();
                audio.currentTime = 0;
 
                // Play the sound.
                audio.play();
            }
 
            // Called when the animation has finished.
            function alertPrize(indicatedSegment: any)
            {
              console.log("indicatedSegment", indicatedSegment)
                // Display different message if win/lose/backrupt.
                if (indicatedSegment.text == 'LOOSE TURN') {
                    alert('Sorry but you loose a turn.');
                } else if (indicatedSegment.text == 'BANKRUPT') {
                    alert('Oh no, you have gone BANKRUPT!');
                } else {
                    alert("You have won " + indicatedSegment.text);
                }
                resetWheel()
                // myWheel.clearCanvas();
            }

            function resetWheel()
            {
                myWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                myWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                myWheel.draw();                // Call draw to render changes to the wheel.
                onStopSpinning()

                // document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
                // document.getElementById('pw2').className = "";
                // document.getElementById('pw3').className = "";

                // wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
            }

// function callbackFinished() {
//   console.log("entered finished")
// }

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


 


// console.log("myWheel", myWheel)

  useEffect(() => {
    if (spin && Object.keys(myWheel).length !== 0) calculatePrize()
  }, [spin])
  
// useEffect(() => {
//   drawTriangle();
// }, [])


// return ( 
  return ( 
    <div className={styles.myCanvas} style={{ backgroundImage: `url('assets/image/wheel_back.png')` }} >
  <canvas 
    id="myCanvas" 
    width="300" 
    height="350" 
    />
</div>
    // <Wheel
    //   mustStartSpinning={spin}
    //   prizeNumber={winningOptionIndex}
    //   data={data}
    //   backgroundColors={['#3e3e3e', '#df3428']}
    //   textColors={['#ffffff']}
    //   onStopSpinning={onStopSpinning}
    //   spinDuration={spinDuration}
    //   // textDistance={100}
    //   // perpendicularText={true}
    //   // fontSize={12}

    // />

  )
}

export default FortuneWheel;
