import { IonButton, IonButtons, IonHeader, IonIcon, IonPage, IonToolbar, useIonViewWillEnter, useIonViewWillLeave } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import { WheelSegment } from '../../models/wheelSegment';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import { LoyaltyProgram, UserLoyaltyProgram } from '../../models/loyaltyProgram';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import { appConfig } from '../../constants/appConfig';
import { contractsAbi } from '../../constants/contractsAbis';
import useSearchParams from '../../hooks/useSearchParams';
import useLoyaltyPrograms from '../../hooks/useLoyaltyPrograms';
import usePlayGame from '../../hooks/usePlayGame';
import usePrize from '../../hooks/usePrize';
import useDialog from '../../hooks/useDialog';
import PrimaryAccordion, { AccordionItemData } from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import ProgramSelection, { ProgramSelectOption } from './ProgramSelection/ProgramSelection';
import useAssets from '../../hooks/useAssets';
import useMemberShip from '../../hooks/useMembership';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import ParticlesLoader from '../../components/sections/ParticlesLoader/ParticlesLoader';
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import useToast from '../../hooks/useToast';
import { informationCircleOutline } from 'ionicons/icons';
import PrimaryPopover from '../../components/popovers/PrimaryPopover/PrimaryPopover';
import { useDapp } from '../../providers/DappProvider/DappProvider';
import useMessagesInterval from '../../hooks/useMessagesInterval';

const Spinner: React.FC = () => {
    const search = useSearchParams();
    const { fetchProgram, defaultProgram, loadingProgram } = useLoyaltyPrograms();
    const { getUserLoyaltyPrograms, loadingMyLoyaltyPrograms } = useAssets();
    const { play, setIsPlaying, isPlaying } = usePlayGame();
    const { fetchPrizes, isLoadingPrizes } = usePrize();
    const id = search.get('program_id')
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('')
    const [loyaltyProgramId, setLoyaltyProgramId] = useState<string>('')
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>()
    const { membership, fetchMembership } = useMemberShip(loyaltyProgram?.loyaltyCurrency?.id);
    const [myLoyaltyPrograms, setMyLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([])
    const { presentInfo } = useToast(5000);
    const { addListener } = useBlockchainContractExecution();
    const [prizesExpired, setPrizesExpired] = useState(false)
    const prizeInfo = "Spin now, list of prizes is reserved for 3 mins, if spinned after 3 mins the list of prizes might be different";
    const { walletAddress } = useDapp();
    var displayMessages = [
        "Blockchain Node Connection. in Progress",
        "Creating Transparent Winning Algorithm",
        "Prizes Being Generated",
        "Spin Wheel Powering Up..."
    ];
    const { currentMessage, start, stop } = useMessagesInterval(displayMessages)

    const getMySelectedProgram = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0 && !!loyaltyProgram) {
            return myLoyaltyPrograms.find((program) => program.currency.loyaltyCurrency === loyaltyProgram.loyaltyCurrency.id)
        }
        return
    }, [myLoyaltyPrograms, loyaltyProgram])

    const selectedPrize = useMemo(() => {
        return wheelSegments && wheelSegments.find(item => item.id === selectedPrizeId)
    }, [wheelSegments, selectedPrizeId])


    const { showModal: showSpinCondition } = useDialog({
        id: 'spinConditionModal',
        component: <SpinCondition
            cost={getMySelectedProgram?.redemption?.spinCost}
            onSuccess={handlePlaying}
            dismiss={dismissSpinCondition} />
    });

    const { showModal: showSuccessModal } = useDialog({
        id: 'spinSuccessModal',
        component: <SpinSuccess
            dismiss={dismissSpinSuccess}
            prize={selectedPrize?.text}
        />,
        customClass: styles.spinSuccessModal,
        onDismiss: () => {
            setIsPlaying(false);
            setSelectedPrizeId('');
            getPrizes()
            fetchMembership();
        }
    });

    function dismissSpinCondition() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    function dismissSpinSuccess() {
        modalController.dismiss(null, undefined, "spinSuccessModal");
    }

    function getLoyaltyProgram() {
        fetchProgram(loyaltyProgramId ?? '')
            .then(program => {
                if (program) setLoyaltyProgram(program);
            })
    }

    function getPrizes() {
        if (!loyaltyProgram) return
        fetchPrizes(loyaltyProgram.brand?.key ?? '')
            .then(prizes => {
                if (prizes) {
                    setWheelSegments(prizes)
                    setPrizesExpired(false)
                    // wait for 3 minutes
                    setTimeout(() => setPrizesExpired(true), 180000);
                    presentInfo(prizeInfo)
                }
            })
    }

    function listenerCallBack(id: any, amount: any, playerAddress: string, gameToken: string) {
        // console.log("listening to event prizeSelected with id: ${0}, amount: ${1}, playerAddress: ${2}, gameToken: ${3}", id, amount, playerAddress, gameToken);
        console.log("listening to event prizeSelected with id:", id)
        if (playerAddress.toLocaleLowerCase() == walletAddress?.toLocaleLowerCase()) {
            stop()
            setSelectedPrizeId(id)
        }
    }

    function getMyPrograms() {
        getUserLoyaltyPrograms()
            .then(programs => {
                if (defaultProgram) programs.push(defaultProgram)
                setMyLoyaltyPrograms(programs);
            })
    }

    async function handlePlaying() {
        start()
        if (prizesExpired) await getPrizes()
        await play(loyaltyProgram?.brand?.key ?? '', loyaltyProgram?.partnerId ?? '');
    }

    const programsOpts: ProgramSelectOption[] = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0) {
            var programs = [...myLoyaltyPrograms]
            programs = programs.filter((program) => program.currency.isRedemption)
            return programs.map((loyaltyProgram) => {
                return new ProgramSelectOption(loyaltyProgram?.currency?.loyaltyCurrencyName, loyaltyProgram?.currency?.loyaltyCurrency, loyaltyProgram?.currency?.programLogo)
            })

        }
        return []
    }, [myLoyaltyPrograms])

    const prizesOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item) => {
                return new AccordionItemData(item.id, item.description, item.description, item.image as string)
            })
        }
        return []
    }, [wheelSegments])

    const wheelSegmentsOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item, index) => {
                if (index % 2) item.fillStyle = loyaltyProgram?.brand?.color2
                else item.fillStyle = loyaltyProgram?.brand?.color1
                return item
            })
        }
        return []
    }, [wheelSegments, loyaltyProgram])

    const handleSelectedValue = (name: string) => {
        const lp = myLoyaltyPrograms.find(item => item?.currency?.loyaltyCurrencyName === name)
        if (lp) setLoyaltyProgramId(lp?.currency?.programId)
    }

    useEffect(() => {
        if (selectedPrizeId) {
            stop();
        }
    }, [selectedPrizeId])

    useEffect(() => {
        if (!isPlaying) {
            stop();
        }
    }, [isPlaying])


    useIonViewWillEnter(() => {
        addListener(
            appConfig.gozoGameContract,
            contractsAbi.game,
            'prizeSelected',
            listenerCallBack
        );

        id ? setLoyaltyProgramId(id) : setLoyaltyProgramId("");
    }, [id])

    useIonViewWillLeave(() => {
        setIsPlaying(false)
    })

    useEffect(() => {
        getMyPrograms();
    }, [])

    useEffect(() => {
        getPrizes()
    }, [loyaltyProgram])

    useEffect(() => {
        getLoyaltyProgram()
    }, [loyaltyProgramId])

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className={styles.headerToolbar}>
                    <div className='flex-row-container ion-padding-horizontal'>
                        <ProgramSelection
                            options={programsOpts}
                            selectedBalance={membership?.balance ?? 0}
                            selectedValue={loyaltyProgram?.loyaltyCurrency?.shortName ?? ''}
                            setSelectedValue={handleSelectedValue} />
                        <PrimaryButton
                            customStyles='flex-row-1'
                            onClick={showSpinCondition}
                            size='m'
                            disabled={isPlaying}>
                            spin!
                        </PrimaryButton>
                    </div>
                </IonToolbar>
            </IonHeader>
            <PrimaryContainer className={styles.accordionContent}>
                {(!loadingProgram && !isLoadingPrizes && !loadingMyLoyaltyPrograms) ?
                    <>
                        <div className={`${styles.wheelWrapper}`}>
                            {
                                isPlaying && !selectedPrizeId ?
                                    <div className={styles.loaderWrapper}>
                                        <ParticlesLoader />
                                        <PrimaryTypography
                                            customClassName={styles.loaderOverlay}>
                                            {currentMessage}
                                        </PrimaryTypography>
                                    </div>
                                    :
                                    <FortuneWheel
                                        logoAtCenter={loyaltyProgram?.brand?.logo}
                                        spinDuration={0.3} data={wheelSegmentsOpts}
                                        spin={isPlaying}
                                        selectedPrizeId={selectedPrizeId}
                                        onStopSpinning={() => {
                                            setTimeout(() => showSuccessModal(), 1000);
                                        }} />
                            }
                        </div>
                        <div className={styles.accordionHeaderwrapper}>
                            <PrimaryTypography
                                customClassName={styles.accordionHeader}
                                isBold
                                size='m'
                                color='light'>
                                Available Prizes
                            </PrimaryTypography>
                            <IonButtons>
                                <IonButton id="hover-trigger">
                                    <IonIcon color="light" icon={informationCircleOutline} />
                                </IonButton>
                            </IonButtons>
                            <PrimaryPopover id="hover-trigger" content={prizeInfo} />
                        </div>
                        <PrimaryAccordion accordionItemData={prizesOpts} />
                    </>
                    : <PageLoader />
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
