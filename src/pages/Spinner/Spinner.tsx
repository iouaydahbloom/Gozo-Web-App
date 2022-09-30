import { IonPage, useIonViewDidLeave, useIonViewWillEnter } from '@ionic/react';
import { useEffect, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import SpinIcon from '../../components/icons/SpinIcon/SpinIcon';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import useModal from '../../hooks/useModal';
import { WheelData } from '../../models/wheelData';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import useCloud from '../../hooks/useCloud';
import { cloudFunctionName } from '../../moralis/cloudFunctionName';
import { useHistory, useLocation } from 'react-router';
import { UserLoyaltyProgram } from '../../models/loyaltyProgram';
import { WheelDataDTO } from '../../dto/wheelDataDTO';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import { appConfig } from '../../constants/appConfig';
import { contractsAbi } from '../../constants/contractsAbis';
import { useDapp } from '../../providers/DappProvider/DappProvider';

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

// const data: any[] = [
//     {option: `Free Spin!`, id: '1', style: { backgroundColor: 'green', textColor: 'white', fontSize: '12px' }},
//     {option:'Cheese & Wine', id:'2', style: { backgroundColor: 'red', textColor: 'white', display: 'none' }},
//     {option:'1 Night Hotel', id:'3', style: { backgroundColor: 'blue', textColor: 'white' }},
//     {option:'Free Spin!', id:'4',style: { backgroundColor: 'purple', textColor: 'white' }},
//     {option:'Nothing here!', id:'5', style:{ backgroundColor: 'brown', textColor: 'white' }},
//     {option:'Paris Tickets', id:'6', style:{ backgroundColor: 'yellow', textColor: 'white' }},
//     {option:'Free Spin!', id:'7',  style:{ backgroundColor: 'white', textColor: 'black' }},
//     {option:'Nothing here!', id:'8',style: { backgroundColor: 'grey', textColor: 'white' }},
// ]

// const data: any[] = [
//     // {image: '/assets/image/jane.png', text: `Free Spin!`, id: '1', fillStyle : 'green', style: { backgroundColor: 'green', textColor: 'white', fontSize: '12px' }},
//     // {image: '/assets/image/tom.png', text:'Cheese & Wine', id:'2', fillStyle : 'red',style: { backgroundColor: 'red', textColor: 'white', display: 'none' }},
//     // {image: '/assets/image/mary.png', text:'1 Night Hotel', id:'3', fillStyle : 'blue',style: { backgroundColor: 'blue', textColor: 'white' }},
//     // {image: '/assets/image/alex.png', text:'Free Spin!', id:'4', fillStyle : 'purple',style: { backgroundColor: 'purple', textColor: 'white' }},
//     { image: '/assets/image/sarah.png', text: 'Nothing here!', id: '5', fillStyle: 'brown', style: { backgroundColor: 'brown', textColor: 'white' } },
//     { image: '/assets/image/bruce.png', text: 'Paris Tickets', textOverflow: 'ellipsis', backgroundColor: 'green', id: '6', fillStyle: 'yellow', style: { backgroundColor: 'yellow', textColor: 'white' } },
//     { image: '/assets/image/rose.png', text: 'Free Spin!', id: '7', fillStyle: 'aqua', style: { backgroundColor: 'white', textColor: 'black' } },
//     { image: '/assets/image/steve.png', text: 'Nothing here!', id: '8', fillStyle: 'grey', style: { backgroundColor: 'grey', textColor: 'white' } },
// ]

const Spinner: React.FC = () => {
    const {replace, location: {state}} = useHistory()
    // console.log("history", history)
    // const { state } = useLocation()
    // const loyaltyCurrency = location.state as UserLoyaltyProgram ?? {} as UserLoyaltyProgram
    const [wheelData, setWheelData] = useState<WheelData[]>([]);
    const [spinWheel, setSpinWheel] = useState(false);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('')
    const [triggeredPlay, setTriggeredPlay] = useState(false)
    const { walletAddress } = useDapp();
    const [loyaltyCurrency, setLoyaltyCurrency] = useState<UserLoyaltyProgram>({} as UserLoyaltyProgram)

    const { run } = useCloud();

    const { initListener } = useBlockchainContractExecution({
        contractAddress: appConfig.gozoGameContract,
        abi: contractsAbi.game,
        funct: '',
        params: []
    });

    const { showModal: showSpinCondition } = useModal({
        title: '',
        component: SpinCondition,
        componentProps: { setSpinWheel, dismiss },
        id: 'spinConditionModal',
        comp: <SpinCondition setSpinWheel={setSpinWheel} dismiss={dismiss} />
    });

    const { showModal: showSuccessModal } = useModal({
        title: '',
        component: SpinSuccess,
        componentProps: { dismiss, text: `You just won ${getSelectedPrize()?.text}` },
        id: 'spinSuccessModal',
        onDismiss: () => {
            setSpinWheel(false)
            setSelectedPrizeId('')
            setTriggeredPlay(false)
        }
    });

    function dismiss() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    const handleSpinClick = () => {
        showSpinCondition()
    }

    const handleStopWheelSpinning = () => {
        showSuccessModal()
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


    function play() {
        if (Object.keys(loyaltyCurrency).length === 0 && !walletAddress) return;
        run(cloudFunctionName.playWithSuperPoints,
            { 
                loyalty_currency: loyaltyCurrency.currency.loyaltyCurrency,
                player_address: walletAddress
             },
            () => true,
            true)
            .then(result => {
                if (result.isSuccess && result.data) setTriggeredPlay(result.data)
            })
    }

    function listenerCallBack(id: string) {
        console.log("the returned id is ", id)
        // add condition that checks if the event belongs to the desired player_address
        // if(result.player_address === walletAddress) setSelectedPrizeId(id)
        // else console.log("error")
        setSelectedPrizeId(id)
    }

    function getSelectedPrize() {
        return wheelData.find(item => item.id === selectedPrizeId)
    }


    useIonViewWillEnter(() => {
        console.log("state", state)
        setLoyaltyCurrency(state as UserLoyaltyProgram ?? {} as UserLoyaltyProgram)
     })

     useIonViewDidLeave(() => {
        replace({state: ''})
        // console.log("history from did leave", history)
     })

    useEffect(() => {
        if(spinWheel) play()
    }, [spinWheel])
    
    useEffect(() => {
        if(!!loyaltyCurrency) fetchPrizes()
    }, [loyaltyCurrency])

    useEffect(() => {
        if(triggeredPlay) initListener('prizeSelected', listenerCallBack)
    }, [triggeredPlay])

    return (
        <IonPage>
            <PrimaryContainer className='ion-text-center'>
                <SpinIcon color="primary" size="large" />
                {/* <IonIcon src={""}/> */}

                <PrimaryTypography
                    size='l'
                >
                    Spin with {loyaltyCurrency?.currency ? loyaltyCurrency?.currency?.companyName : 'GOZO'}
                </PrimaryTypography>

                <div className={`${styles.wheelWrapper} ion-padding-vertical`}>
                    <FortuneWheel spinDuration={0.3} data={wheelData} spin={spinWheel} selectedPrizeId={selectedPrizeId} onStopSpinning={handleStopWheelSpinning} />
                </div>

                <PrimaryButton 
                    onClick={handleSpinClick} 
                    size='m' 
                    expand='block'
                    disabled={spinWheel}
                    >
                    spin!
                </PrimaryButton>

                <BottomFixedContainer>

                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
