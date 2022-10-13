import { IonPage } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import SpinIcon from '../../components/icons/SpinIcon/SpinIcon';
import BottomFixedContainer from '../../components/layout/BottomFixedContainer/BottomFixedContainer';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import { WheelSegment } from '../../models/wheelSegment';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import { LoyaltyProgram } from '../../models/loyaltyProgram';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import { appConfig } from '../../constants/appConfig';
import { contractsAbi } from '../../constants/contractsAbis';
import useSearchParams from '../../hooks/useSearchParams';
import useLoyaltyPrograms from '../../hooks/useLoyaltyPrograms';
import usePlayGame from '../../hooks/usePlayGame';
import usePrize from '../../hooks/usePrize';
import useDialog from '../../hooks/useDialog';
import PrimaryAccordion, { AccordionItemData } from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import useServerPagination from '../../hooks/useServerPagination';
import { ProgramFilter } from '../../models/data/filter';
import PrimarySelect, { SelectOption } from '../../components/inputs/PrimarySelect/PrimarySelect';


const Spinner: React.FC = () => {
    const search = useSearchParams();
    const { fetchProgram, fetchAllPrograms } = useLoyaltyPrograms();
    const { play, isPlaying, setIsPlaying } = usePlayGame();
    const { fetchPrizes, isLoadingPrizes } = usePrize();
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [spinWheel, setSpinWheel] = useState(false);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('')
    var loyaltyProgramId = search.get('program_id')
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>({} as LoyaltyProgram)

    const { data: programs } = useServerPagination<LoyaltyProgram, ProgramFilter>({
        getData: fetchAllPrograms as any
    })
console.log("programs", programs)
    const { addListener } = useBlockchainContractExecution();

    const { showModal: showSpinCondition } = useDialog({
        id: 'spinConditionModal',
        component: <SpinCondition setSpinWheel={setSpinWheel} dismiss={dismiss} />
    });

    const { showModal: showSuccessModal } = useDialog({
        id: 'spinSuccessModal',
        component: <SpinSuccess dismiss={dismiss} text={`You just won ${getSelectedPrize()?.text}`} />,
        onDismiss: () => {
            setSpinWheel(false)
            setSelectedPrizeId('')
            setIsPlaying(false)
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

    function getLoyaltyProgram() {
        if (!loyaltyProgramId) return;
        fetchProgram(loyaltyProgramId ?? '')
            .then(program => {
                if (program) setLoyaltyProgram(program);
            })
    }

    function getPrizes() {
        if (Object.keys(loyaltyProgram).length === 0) return
        fetchPrizes(loyaltyProgram?.loyaltyCurrency?.id)
            .then(prizes => {
                if (prizes) setWheelSegments(prizes)
            })
    }

    function listenerCallBack(id: any) {
        console.log("listening to event id =", id)
        // add condition that checks if the event belongs to the desired player_address
        // if(result.player_address === walletAddress) setSelectedPrizeId(id)
        // else console.log("error")
        setSelectedPrizeId(id)
    }

    function getSelectedPrize() {
        return wheelSegments.find(item => item.id === selectedPrizeId)
    }

    const programsOpts = useMemo(() => {
        if (programs.length !== 0) {
            return programs.map((item) => {
                return new SelectOption( item.loyaltyCurrency.shortName, item.loyaltyCurrency.id)
            })
        }
        return []
    }, [programs])

    const prizesOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item) => {
                return new AccordionItemData(item.id, item.text, item.text)
            })
        }
        return []
    }, [wheelSegments])

    useEffect(() => {
        getPrizes()
    }, [loyaltyProgram])

    useEffect(() => {
        getLoyaltyProgram()
    }, [loyaltyProgramId])

    useEffect(() => {
        if (spinWheel && (Object.keys(loyaltyProgram).length !== 0)) {
            addListener(appConfig.gozoGameContract, contractsAbi.game, 'prizeSelected', listenerCallBack)
            play(loyaltyProgram?.brand?.key ?? '')
        }
    }, [spinWheel])

    return (
        <IonPage>
            <PrimaryContainer>
                <div className='flex-row-container'>
                    <PrimarySelect
                        required
                        name="selectProgram"
                        placeholder="Select Loyalty Program"
                        type='action-sheet'
                        // value={}
                        options={programsOpts}
                        // onChange={} 
                        />
                    <PrimaryButton
                        customStyles='flex-row-1'
                        onClick={handleSpinClick}
                        size='m'
                        disabled={spinWheel}
                    >
                        spin!
                    </PrimaryButton>
                </div>


                <div className={`${styles.wheelWrapper} ion-padding-vertical`}>
                    <FortuneWheel spinDuration={0.3} data={wheelSegments} spin={spinWheel} selectedPrizeId={selectedPrizeId} onStopSpinning={handleStopWheelSpinning} />
                </div>

                <BottomFixedContainer>
                    <PrimaryAccordion accordionItemData={prizesOpts} />
                </BottomFixedContainer>
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
