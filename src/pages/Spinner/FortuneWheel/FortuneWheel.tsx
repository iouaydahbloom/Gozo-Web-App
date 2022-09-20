import styles from './fortuneWheel.module.scss';
import { Wheel } from 'react-custom-roulette'
import { WheelData } from '../../../models/wheelData';



interface Props {
  data: WheelData[],
  spin: boolean,
  winningOptionIndex: number,
  onStopSpinning: () => void,
  spinDuration?: number

}

const FortuneWheel: React.FC<Props> = ({ data, spin, winningOptionIndex, onStopSpinning, spinDuration }) => {
  return (
    <Wheel
      mustStartSpinning={spin}
      prizeNumber={winningOptionIndex}
      data={data}
      backgroundColors={['#3e3e3e', '#df3428']}
      textColors={['#ffffff']}
      onStopSpinning={onStopSpinning}
      spinDuration={spinDuration}

    />

  )
}

export default FortuneWheel;
