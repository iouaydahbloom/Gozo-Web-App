import styles from './fortuneWheel.module.scss';
import {WheelSegment} from '../../../models/wheelSegment';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Winwheel} from '../WinWheelLibrary/Winwheel';
import {ellipsisTruncate} from '../../../helpers/managment/string';
import {WheelSettingsContext} from '../../../providers/WheelSettingsProvider/wheelSettingsContext';
import {Howl, Howler} from 'howler';

interface Props {
    data: WheelSegment[],
    spin: boolean,
    selectedPrizeId: string,
    onStopSpinning: () => void,
    spinDuration?: number,
    logoAtCenter?: string,
    onClick?: () => any
}

var myWheel: any;
const audio = new Howl({
    src: ['/assets/audio/tick.mp3']
});

const FortuneWheel: React.FC<Props> = ({
                                           data,
                                           spin,
                                           selectedPrizeId,
                                           onStopSpinning,
                                           spinDuration,
                                           logoAtCenter,
                                           onClick
                                       }) => {
    const [isSpinning, setIsSpinning] = useState(false)

    const {isMuted} = useContext(WheelSettingsContext);

    useEffect(() => {
        myWheel = new Winwheel({
            'drawText': true,              // Code drawn text can be used with segment images.
            'textAlignment': 'center',
            'textFontFamily': 'Monda',
            'textFillStyle': 'white',
            'canvasId': 'canvas',
            'numSegments': data.length,
            'segments': getOptimizeData(),
            'textFontSize': 16,
            'textMargin': 6,
            'outerRadius': 170,    // Use these three properties to
            'centerX': 200,    // correctly position the wheel
            'centerY': 195,    // over the background.
            'lineWidth': 2,
            'strokeStyle': "#fff",
            'fillStyle': "#000",
            'rotationAngle': 4,
            'innerRadius': 35,             // The larger the inner radius, the bigger the hollow space inside the wheel.
            'animation':
                {
                    'type': 'spinToStop',
                    'duration': 10,
                    'spins': 5,
                    'callbackFinished': callbackFinished,  // Function to call when the spinning has stopped.
                    'callbackSound': playSound,   // Called when the tick sound is to be played.
                    'soundTrigger': 'pin'        // Specify pins are to trigger the sound.
                },
            'pins':                // Turn pins on.
                {
                    'number': data.length,
                    'fillStyle': 'yellow',
                    'outerRadius': 5,
                    'lineWidth': 4,
                    'margin': 0,
                    'strokeStyle': 'orange'
                }
        });

    }, [data, isMuted])

    function getOptimizeData() {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d');

        let canvasCenter = canvas.height / 2;

        let trasformedData: WheelSegment[] = data.map(a => ({...a} as WheelSegment))
        trasformedData = trasformedData.map((item: WheelSegment, index) => {
            let radGradient = ctx && ctx.createRadialGradient(canvasCenter, canvasCenter, 0, canvasCenter, canvasCenter, 170);
            if (index % 2) {
                radGradient && radGradient.addColorStop(0, item.colors ? item.colors[0] ? item.colors[0] : '#76F4C3' : '#76F4C3');
                radGradient && radGradient.addColorStop(1, item.colors ? item.colors[1] ? item.colors[1] : '#5465FF' : '#5465FF');
                item.fillStyle = radGradient as any
            } else {
                radGradient && radGradient.addColorStop(0, item.colors ? item.colors[2] ? item.colors[2] : '#0F1D4C' : '#0F1D4C');
                radGradient && radGradient.addColorStop(1, item.colors ? item.colors[3] ? item.colors[3] : '#0F1D4C' : '#0F1D4C');
                item.fillStyle = radGradient as any
            }

            item.text = ellipsisTruncate(item.text, 10)
            return item
        })

        return trasformedData
    }

    function randomIntFromInterval(min: number, max: number) {
        let value = Math.floor(Math.random() * (max - min - 4) + (min + 3))
        if (value > (((max - min) / 2) - 3) && value < (((max - min) / 2) + 3)) {
            value = value - 6
        }
        return value
    }

    function calculatePrize() {
        // Important thing is to set the stopAngle of the animation before stating the spin.
        const selectedSegment = myWheel.segments.find((item: WheelSegment) => item?.id === selectedPrizeId)
        if (myWheel?.animation && selectedSegment) myWheel.animation.stopAngle = randomIntFromInterval(selectedSegment.startAngle, selectedSegment.endAngle);
        // May as well start the spin from here.
        myWheel.startAnimation();
    }

    // This function is called when the sound is to be played.
    const playSound = useCallback(async () => {
        setIsSpinning(true);
        audio.stop();
        audio.mute(isMuted);
        audio.play();
    }, [audio])

    // Called when the animation has finished.
    function callbackFinished() {
        onStopSpinning()
        winAnimation()
    }

    // This function called after the spin animation has stopped.
    function winAnimation() {
        // Get the number of the winning segment.
        let winningSegmentNumber = myWheel.getIndicatedSegmentNumber();
        myWheel.segments[winningSegmentNumber].lineWidth = '6';
        // Call draw function to render changes.
        myWheel.draw();
    }

    function resetWheel() {
        myWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
        myWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
        myWheel.draw();                // Call draw to render changes to the wheel.
    }

    useEffect(() => {
        myWheel = new Winwheel({
            'drawText': true,              // Code drawn text can be used with segment images.
            'textAlignment': 'center',
            'textFontFamily': 'Monda',
            'textFillStyle': 'white',
            'canvasId': 'canvas',
            'numSegments': data.length,
            'segments': getOptimizeData(),
            'textFontSize': 16,
            'textMargin': 6,
            'outerRadius': 170,    // Use these three properties to
            'centerX': 200,    // correctly position the wheel
            'centerY': 195,    // over the background.
            'lineWidth': 2,
            'strokeStyle': "#fff",
            'fillStyle': "#000",
            'rotationAngle': 4,
            'innerRadius': 35,             // The larger the inner radius, the bigger the hollow space inside the wheel.
            'animation':
                {
                    'type': 'spinToStop',
                    'duration': 10,
                    'spins': 5,
                    'callbackFinished': callbackFinished,  // Function to call when the spinning has stopped.
                    'callbackSound': playSound,   // Called when the tick sound is to be played.
                    'soundTrigger': 'pin'        // Specify pins are to trigger the sound.
                },
            'pins':                // Turn pins on.
                {
                    'number': 16,
                    'fillStyle': 'yellow',
                    'outerRadius': 5,
                    'lineWidth': 4,
                    'margin': 0,
                    'strokeStyle': 'orange'
                }
        });
    }, [data, isMuted])

    useEffect(() => {
        if (spin && Object.keys(myWheel).length !== 0 && selectedPrizeId) {
            calculatePrize()
        }
    }, [spin, selectedPrizeId])

    useEffect(() => {
        if (isSpinning) setIsSpinning(false)
    }, [isSpinning])

    return (
        <div className={styles.canvasContainer}
             style={{backgroundImage: `url('assets/image/wheel-background.png')`}}>
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
                className={`${styles.iconPin} ${isSpinning ? styles.pinShaking : styles.pinShaking1}`}
                alt=''
                src="assets/image/updatedpin.svg"
                width="50"
                height="50"
            />
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
