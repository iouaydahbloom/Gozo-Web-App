import {
    IonButton,
    IonButtons,
    IonHeader,
    IonIcon,
    IonPage,
    IonToolbar,
    useIonViewWillEnter,
    useIonViewWillLeave
} from '@ionic/react';
import {useCallback, useEffect, useMemo, useState} from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import {WheelSegment} from '../../models/wheelSegment';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import {modalController} from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import {LoyaltyProgram, UserLoyaltyProgram} from '../../models/loyaltyProgram';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import useSearchParams from '../../hooks/useSearchParams';
import useLoyaltyPrograms from '../../hooks/loyaltyProgram/useLoyaltyPrograms';
import usePlayGame from '../../hooks/usePlayGame';
import usePrize from '../../hooks/prize/usePrize';
import useDialog from '../../hooks/useDialog';
import PrimaryAccordion, {AccordionItem} from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import ProgramSelection, {ProgramSelectOption} from './ProgramSelection/ProgramSelection';
import useMemberShip from '../../hooks/membership/useMembership';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import ParticlesLoader from '../../components/sections/ParticlesLoader/ParticlesLoader';
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import {informationCircleOutline} from 'ionicons/icons';
import PrimaryPopover from '../../components/popovers/PrimaryPopover/PrimaryPopover';
import {useDapp} from '../../providers/DappProvider/DappProvider';
import useMessagesInterval from '../../hooks/useMessagesInterval';
import {useHistory} from 'react-router';

interface IPrize {
    prizeId: string,
    gameToken: string
}

const Spinner: React.FC = () => {

    const history = useHistory()
    const search = useSearchParams();
    var id = search ? search.get('program_id') : '';
    const [loyaltyProgramId, setLoyaltyProgramId] = useState<string>(id ?? '');
    const {
        fetchProgram,
        defaultProgram,
        loadingProgram,
        loadingMyLoyaltyPrograms,
        fetchMyLoyaltyPrograms
    } = useLoyaltyPrograms({
        programId: loyaltyProgramId
    });
    const {play, setIsPlaying, isPlaying} = usePlayGame();
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [gameToken, setGameToken] = useState('');
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('');
    const [returnedPrize, setReturnedPrize] = useState<IPrize>();
    const [loyaltyProgram, setLoyaltyProgram] = useState<LoyaltyProgram>();
    const {fetchMembership} = useMemberShip(loyaltyProgram?.loyaltyCurrency?.id);
    const [myLoyaltyPrograms, setMyLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const {addListener} = useBlockchainContractExecution();
    const [prizesExpired, setPrizesExpired] = useState(false);
    const prizeInfo = "Spin now, list of prizes is reserved for 3 mins, if spinned after 3 mins the list of prizes might be different";
    const {walletAddress} = useDapp();
    var displayMessages = [
        "Blockchain Node Connection. in Progress",
        "Creating Transparent Winning Algorithm",
        "Prizes Being Generated",
        "Spin Wheel Powering Up..."
    ];
    const {currentMessage, start, stop} = useMessagesInterval(displayMessages);
    const {gameContractAddress, gameContractAbi} = useDapp();
    const [isPlayingReady, setIsPlayingReady] = useState(false);
    const {
        prizes,
        fetchPrizes,
        unReservePrizes,
        isLoadingPrizes
    } = usePrize({loyaltyCurrency: loyaltyProgram?.brand?.key});

    const getMySelectedProgram = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0 && !!loyaltyProgram) {
            return myLoyaltyPrograms.find((program) => program.currency.loyaltyCurrency === loyaltyProgram.loyaltyCurrency.id)
        }
        return
    }, [myLoyaltyPrograms, loyaltyProgram])

    const selectedPrize = useMemo(() => {
        return wheelSegments && wheelSegments.find(item => item.id === selectedPrizeId)
    }, [wheelSegments, selectedPrizeId])

    const {showModal: showSpinCondition} = useDialog({
        id: 'spinConditionModal',
        component: <SpinCondition
            cost={getMySelectedProgram?.redemption?.spinCost}
            onSuccess={handlePlaying}
            dismiss={dismissSpinCondition}/>
    });

    const {showModal: showSuccessModal} = useDialog({
        id: 'spinSuccessModal',
        component: <SpinSuccess
            dismiss={dismissSpinSuccess}
            prize={selectedPrize?.text}
        />,
        customClass: styles.spinSuccessModal,
        onDismiss: () => {
            setIsPlayingReady(false);
            setIsPlaying(false);
            setSelectedPrizeId('');
            getPrizes();
            fetchMembership();
            setReturnedPrize(undefined);
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
        setWheelSegments([])
        //return fetchPrizes(loyaltyProgram.brand?.key ?? '')
        return fetchPrizes()
        // .then(groupedPrizes => {
        //     if (groupedPrizes) {
        //         const segments = WheelSegment.toWheelSegment(groupedPrizes.prizes);
        //         setWheelSegments(segments);
        //         setGameToken(groupedPrizes.gameToken);
        //         setPrizesExpired(false);
        //         setTimeout(() => setPrizesExpired(true), 120000);
        //     }
        // })
    }

    useEffect(() => {
        if (!prizes) return;

        const segments = WheelSegment.toWheelSegment(prizes.prizes);
        setWheelSegments(segments);
        setGameToken(prizes.gameToken);
        setPrizesExpired(false);
        setTimeout(() => setPrizesExpired(true), 120000);
    }, [prizes])

    function listenerCallBack(id: any, amount: any, playerAddress: string, gameToken: string) {
        if (playerAddress.toLocaleLowerCase() === walletAddress?.toLocaleLowerCase()) {
            const prize: IPrize = {
                prizeId: id,
                gameToken: gameToken
            }
            stop()
            setReturnedPrize(prize)
        }
    }

    function getMyPrograms() {
        fetchMyLoyaltyPrograms()
            .then(programs => {
                programs.push(defaultProgram as UserLoyaltyProgram)
                setMyLoyaltyPrograms(programs);
            })
    }

    async function handlePlaying() {
        start();
        if (prizesExpired) await getPrizes();
        await play(loyaltyProgram?.brand?.key ?? '', loyaltyProgram?.partnerId ?? '', gameToken);
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
                return new AccordionItem(item.id, item.description, item.description, item.image as string)
            })
        }
        return []
    }, [wheelSegments])

    const wheelSegmentsOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item, index) => {
                if (index % 2) {
                    item.fillStyle = loyaltyProgram?.brand?.color2;
                    item.textFillStyle = loyaltyProgram?.brand?.color1;
                } else {
                    item.fillStyle = loyaltyProgram?.brand?.color1
                    item.textFillStyle = loyaltyProgram?.brand?.color2;
                }
                return item
            })
        }
        return []
    }, [wheelSegments, loyaltyProgram])

    const handleSelectedValue = (name: string) => {
        const lp = myLoyaltyPrograms.find(item => item?.currency?.loyaltyCurrencyName === name)
        if (lp) {
            setIsPlayingReady(false);
            history.replace({search: (new URLSearchParams({program_id: lp?.currency?.programId})).toString()});
            setLoyaltyProgramId(lp.currency?.programId)
        }
    }

    const onRefresh = useCallback((): Promise<any> => {
        setIsPlayingReady(false);
        return Promise.all([
            getLoyaltyProgram(),
            defaultProgram && getMyPrograms(),
        ])
    }, [loyaltyProgramId])

    useEffect(() => {
        if (returnedPrize && returnedPrize.gameToken === gameToken) {
            setSelectedPrizeId(returnedPrize.prizeId)
        }
    }, [returnedPrize])

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
        setIsPlayingReady(false);
        addListener(
            gameContractAddress,
            gameContractAbi,
            'prizeSelected',
            listenerCallBack
        );

        const currentLoyaltyProgramId = id ?? '';
        if (defaultProgram) getMyPrograms();
        if (loyaltyProgram && currentLoyaltyProgramId === loyaltyProgramId) getPrizes();

        setLoyaltyProgramId(currentLoyaltyProgramId);
    }, [id, defaultProgram, loyaltyProgram])

    useIonViewWillLeave(() => {
        unReservePrizes(gameToken);
        setIsPlaying(false);
    }, [gameToken])

    useEffect(() => {
        if (gameToken) unReservePrizes(gameToken)
        getPrizes();
    }, [loyaltyProgram])

    useEffect(() => {
        getLoyaltyProgram();
    }, [loyaltyProgramId])

    useEffect(() => {
        if (!isLoadingPrizes) {
            setIsPlayingReady(true);
        }
    }, [isLoadingPrizes])

    return (
        <IonPage>
            <IonHeader className='ion-no-border'>
                <IonToolbar className={styles.headerToolbar}>
                    <div className='flex-row-container ion-padding-horizontal'>
                        <ProgramSelection
                            options={programsOpts}
                            selectedValue={loyaltyProgram?.loyaltyCurrency?.shortName ?? ''}
                            onValueChange={handleSelectedValue}/>
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
            <PrimaryContainer className={styles.container} isRefreshable onRefresh={onRefresh}>
                {
                    isPlayingReady ?
                        <>
                            <div className={`${styles.wheelWrapper}`}>
                                {
                                    isPlaying && !selectedPrizeId ?
                                        <div className={styles.loaderWrapper}>
                                            <ParticlesLoader/>
                                            <PrimaryTypography
                                                customClassName={styles.loaderOverlay}>
                                                {currentMessage}
                                            </PrimaryTypography>
                                        </div>
                                        :
                                        <FortuneWheel
                                            logoAtCenter={loyaltyProgram?.brand?.logo}
                                            spinDuration={0.3}
                                            data={wheelSegmentsOpts}
                                            spin={isPlaying}
                                            selectedPrizeId={selectedPrizeId}
                                            onClick={showSpinCondition}
                                            onStopSpinning={() => {
                                                setTimeout(() => showSuccessModal(), 1000);
                                            }}/>
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
                                        <IonIcon color="light" icon={informationCircleOutline}/>
                                    </IonButton>
                                </IonButtons>
                                <PrimaryPopover id="hover-trigger" content={prizeInfo}/>
                            </div>
                            <PrimaryAccordion accordionItem={prizesOpts}/>
                        </>
                        : <PageLoader/>
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
