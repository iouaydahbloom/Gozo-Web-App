import { IonIcon, IonPage, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
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
import useCloud from '../../hooks/useCloud';
import { cloudFunctionName } from '../../moralis/cloudFunctionName';
import { useLocation } from 'react-router';
import { UserLoyaltyProgram } from '../../models/loyaltyProgram';
import { WheelDataDTO } from '../../dto/wheelDataDTO';

// const data: WheelData[] = [
//     new WheelData(`Free Spin!`, '1', { backgroundColor: 'green', textColor: 'white' }),
//     new WheelData('Cheese & Wine', '2', { backgroundColor: 'red', textColor: 'white' }),
//     new WheelData('1 Night Hotel', '3', { backgroundColor: 'blue', textColor: 'white' }),
//     new WheelData('Free Spin!', '4', { backgroundColor: 'purple', textColor: 'white' }),
//     new WheelData('Nothing here!', '5', { backgroundColor: 'brown', textColor: 'white' }),
//     new WheelData('Paris Tickets', '6', { backgroundColor: 'yellow', textColor: 'white' }),
//     new WheelData('Free Spin!', '7',  { backgroundColor: 'white', textColor: 'black' }),
//     new WheelData('Nothing here!', '8', { backgroundColor: 'grey', textColor: 'white' }),
// ]

const Spinner: React.FC = () => {
    const location = useLocation()
    // const currencyId = location.state as string ?? ''
    // console.log("currencyId", currencyId)
    const loyaltyCurrency = location.state as UserLoyaltyProgram ?? {} as UserLoyaltyProgram
    // console.log("loyaltyCurrency", loyaltyCurrency)
    const [wheelData, setWheelData] = useState<WheelData[]>([]);
    const [spinWheel, setSpinWheel] = useState(false);
    const [wheelDataItemIndex, setWheelDataItemIndex] = useState(0);

    const { run } = useCloud();
    // const { isInitialized } = useMoralis();
    // const { isAuthenticated } = useAuthentication();

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

    function fetchPrizes() {
        if (Object.keys(loyaltyCurrency).length === 0) return;
        run(cloudFunctionName.groupedPrize,
            { loyalty_currency: loyaltyCurrency.currency.loyaltyCurrency },
            (result: WheelDataDTO[]) => WheelData.getFromDTO(result),
            true)
            .then(result => {
                if (result.isSuccess) setWheelData(result.data)
            })
    }

    useIonViewWillEnter(() => {
        fetchPrizes()
    }, [])
    

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
                    <FortuneWheel spinDuration={0.3} data={wheelData} spin={spinWheel} winningOptionIndex={wheelDataItemIndex} onStopSpinning={handleStopWheelSpinning} />
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
