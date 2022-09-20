import { IonIcon, IonPage } from '@ionic/react';
import { useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import GozoIcon from '../../components/icons/GozoIcon/GozoIcon';
import SpinIcon from '../../components/icons/SpinIcon/SpinIcon';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useModal from '../../hooks/useModal';
import useTabMenuHidder from '../../hooks/useTabMenuHidder';
import { WheelData } from '../../models/wheelData';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';

const data: WheelData[] = [
    new WheelData('Free Spin!', { backgroundColor: 'green', textColor: 'white' }),
    new WheelData('Cheese & Wine', { backgroundColor: 'red', textColor: 'white' }),
    new WheelData('1 Night Hotel', { backgroundColor: 'blue', textColor: 'white' }),
    new WheelData('Free Spin!', { backgroundColor: 'purple', textColor: 'white' }),
    new WheelData('Nothing here!', { backgroundColor: 'brown', textColor: 'white' }),
    new WheelData('Paris Tickets', { backgroundColor: 'yellow', textColor: 'white' }),
    new WheelData('Free Spin!', { backgroundColor: 'white', textColor: 'black' }),
    new WheelData('Nothing here!', { backgroundColor: 'grey', textColor: 'white' }),
]

const Spinner: React.FC = () => {
    const [wheelData, setWheelData] = useState<WheelData[]>(data);
    const [spinWheel, setSpinWheel] = useState(false);
    const [wheelDataItemIndex, setWheelDataItemIndex] = useState(0);
    const { showModal: showSpinCondition } = useModal({
        title: '',
        component: SpinCondition,
        componentProps: { setSpinWheel, dismiss },
        id: 'spinConditionModal',
        onDismiss: () => {

        }
    });
    const { showModal: showSuccessModal } = useModal({
        title: '',
        component: SpinSuccess,
        componentProps: { dismiss, text: '' },
        id: 'spinSuccessModal',
        onDismiss: () => {

        }
    });

    function dismiss() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    const handleSpinClick = () => {
        // const newPrizeNumber = Math.floor(Math.random() * data.length)
        // setPrizeNumber(newPrizeNumber)
        showSpinCondition()
        // setSpinWheel(true)
    }

    const handleStopWheelSpinning = () => {
        showSuccessModal()
        setSpinWheel(false)
    }

    return (
        <IonPage>
            <PrimaryContainer className='ion-text-center'>
                <SpinIcon color="primary" size="large"/>
                {/* <IonIcon src={""}/> */}

                <PrimaryTypography
                    size='l'
                    >
                    Spin with Air France
                </PrimaryTypography>

                <div className={`${styles.wheelWrapper} ion-padding-vertical`}>
                    <FortuneWheel data={wheelData} spin={spinWheel} winningOptionIndex={wheelDataItemIndex} onStopSpinning={handleStopWheelSpinning} />
                </div>

                <PrimaryButton onClick={handleSpinClick} size='m' expand='block'>
                    spin!
                </PrimaryButton>

                <BottomFixedContainer>

                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
