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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PrimaryButton from '../../components/buttons/PrimaryButton/PrimaryButton';
import PrimaryContainer from '../../components/layout/PrimaryContainer/PrimaryContainer';
import { WheelSegment } from '../../models/wheelSegment';
import FortuneWheel from './FortuneWheel/FortuneWheel';
import SpinCondition from './SpinConditionModal/SpinCondition';
import styles from './spinner.module.scss';
import { modalController } from '@ionic/core';
import SpinSuccess from './SpinSuccessModal/SpinSuccess';
import useBlockchainContractExecution from '../../hooks/useBlockchainContractExecution';
import useSearchParams from '../../hooks/useSearchParams';
import useLoyaltyPrograms from '../../hooks/loyaltyProgram/useLoyaltyPrograms';
import usePlayGame from '../../hooks/usePlayGame';
import useGamePrizes from '../../hooks/gamePrizes/useGamePrizes';
import useDialog from '../../hooks/useDialog';
import PrimaryAccordion, { AccordionItem } from '../../components/accordions/PrimaryAccordion/PrimaryAccordion';
import ProgramSelection, { ProgramSelectOption } from './ProgramSelection/ProgramSelection';
import PrimaryTypography from '../../components/typography/PrimaryTypography/PrimaryTypography';
import ParticlesLoader from '../../components/sections/ParticlesLoader/ParticlesLoader';
import PageLoader from '../../components/loaders/PageLoader/PageLoader';
import { informationCircleOutline } from 'ionicons/icons';
import PrimaryPopover from '../../components/popovers/PrimaryPopover/PrimaryPopover';
import { useDapp } from '../../providers/DappProvider/DappProvider';
import useMessagesInterval from '../../hooks/useMessagesInterval';
import { useHistory } from 'react-router';
import useDataQueryInvalidation from "../../hooks/queryCaching/useDataQueryInvalidation";
import { rewardsQueriesIdentity } from "../../hooks/reward/rewardQueriesIdentity";
import SecondarySelect, { SelectOption } from "../../components/inputs/SecondarySelect/SecondarySelect";
import TertiaryHeader from '../../components/headers/TertiaryHeader/TertiaryHeader';

interface IPrize {
    prizeId: string,
    gameToken: string
}

const spinCountOptions = [
    new SelectOption("x1", '1'),
    new SelectOption("x3", '3'),
    new SelectOption("x5", '5'),
    new SelectOption("x10", '10')
]

const audio = new Audio('/assets/audio/clapping.wav');

const Spinner: React.FC = () => {

    const history = useHistory()
    const search = useSearchParams();
    const id = search ? search.get('program_id') : '';
    const [loyaltyProgramId, setLoyaltyProgramId] = useState<string>(id ?? '');
    const {
        fetchProgram,
        defaultProgram,
        loadingProgram,
        fetchMyLoyaltyPrograms,
        myPrograms,
        program: loyaltyProgram
    } = useLoyaltyPrograms({
        programId: loyaltyProgramId
    });

    const [spinCount, setSpinCount] = useState('1');

    const {
        prizes,
        fetchPrizes,
        numberOfPrizes: spinCredits,
        uncollectedPrizesCount: uncollectedCreditsCount,
        collectedPrizes: collectedCredits,
        gameToken,
        unReservePrizes,
        isLoadingPrizes,
        prizesExpired
    } = useGamePrizes({ loyaltyCurrency: loyaltyProgram?.brand?.key });

    const { play, preWonPrizeId, isSubmitting, playingError } = usePlayGame({
        loyaltyCurrency: loyaltyProgram?.loyaltyCurrency.id,
        gameToken: gameToken,
        brand: loyaltyProgram?.brand?.key ?? '',
        numberOfSpins: parseInt(spinCount),
        uncollectedCreditsCount
    });
    const [wheelSegments, setWheelSegments] = useState<WheelSegment[]>([]);
    const [selectedPrizeId, setSelectedPrizeId] = useState<string>('');
    const [returnedPrize, setReturnedPrize] = useState<IPrize>();
    const myLoyaltyPrograms = useMemo(() => {
        return defaultProgram ? [...myPrograms, defaultProgram] : [...myPrograms];
    }, [defaultProgram, myPrograms]);
    const { addListener } = useBlockchainContractExecution();

    const prizeInfo = "Spin now, list of prizes is reserved for 3 minutes, if spun after 3 minutes the list of prizes might be different";
    const { walletAddress } = useDapp();
    const displayMessages = [
        "Blockchain Node Connection. in Progress",
        "Creating Transparent Winning Algorithm",
        "Prizes Being Generated",
        "Spin Wheel Powering Up..."
    ];
    const { currentMessage, start, stop } = useMessagesInterval(displayMessages);
    const { gameContractAddress, gameContractAbi } = useDapp();
    const [isPlaying, setIsPlaying] = useState(false);
    const { invalidate } = useDataQueryInvalidation();

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
            cost={getMySelectedProgram?.redemption?.spinCost ? getMySelectedProgram?.redemption?.spinCost * parseInt(spinCount) : 0}
            spins={spinCount}
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
            getPrizes();
            setReturnedPrize(undefined);
            audio.pause();
        }
    });

    function dismissSpinCondition() {
        modalController.dismiss(null, undefined, "spinConditionModal");
    }

    function dismissSpinSuccess() {
        modalController.dismiss(null, undefined, "spinSuccessModal");
    }

    function getPrizes() {
        if (!loyaltyProgram) return;
        return fetchPrizes();
    }

    function listenerCallBack(ids: string[], amounts: any[], playerAddress: string, gameToken: string) {
        if (playerAddress.toLocaleLowerCase() === walletAddress?.toLocaleLowerCase()) {
            const prize: IPrize = {
                prizeId: ids?.length !== 0 ? ids[0] : '',
                gameToken: gameToken
            }
            stop();
            setReturnedPrize(prize);
            invalidate(rewardsQueriesIdentity.reward);
        }
    }

    async function handlePlaying() {
        start();
        if(prizesExpired) await getPrizes();
        await play();
    }

    const programsOpts: ProgramSelectOption[] = useMemo(() => {
        if (myLoyaltyPrograms.length !== 0) {
            let programs = myLoyaltyPrograms.filter((program) => program.currency.isRedemption)
            return programs.map((loyaltyProgram) => {
                return new ProgramSelectOption(
                    loyaltyProgram?.currency?.loyaltyCurrencyName,
                    loyaltyProgram?.currency?.loyaltyCurrency,
                    loyaltyProgram?.currency?.programLogo
                )
            })

        }
        return []
    }, [myLoyaltyPrograms])

    const prizesOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item) => {
                return new AccordionItem(item.id, item.label ?? item.description, item.description, item.image as string)
            })
        }
        return []
    }, [wheelSegments])

    const wheelSegmentsOpts = useMemo(() => {
        if (wheelSegments.length !== 0) {
            return wheelSegments.map((item) => {
                item.colors = loyaltyProgram?.brand?.colors;
                item.textFillStyle = '#fff';
                return item
            })
        }
        return []
    }, [wheelSegments, loyaltyProgram])

    const handleSelectedValue = (name: string) => {
        const lp = myLoyaltyPrograms.find(item => item?.currency?.loyaltyCurrencyName === name)
        if (lp) {
            history.replace({ search: (new URLSearchParams({ program_id: lp?.currency?.programId })).toString() });
            setLoyaltyProgramId(lp.currency?.programId)
        }
    }

    const onRefresh = useCallback((): Promise<any> => {
        return Promise.all([
            fetchProgram(),
            fetchMyLoyaltyPrograms(),
            fetchPrizes()
        ])
    }, [loyaltyProgramId])


    useEffect(() => {
        if (returnedPrize && returnedPrize.gameToken === gameToken) {
            setSelectedPrizeId(returnedPrize.prizeId)
        }
    }, [returnedPrize])

    useEffect(() => {
        if (preWonPrizeId) {
            setSelectedPrizeId(preWonPrizeId)
            invalidate(rewardsQueriesIdentity.reward);
        }
    }, [preWonPrizeId])

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

    useEffect(() => {
        if (!prizes) return;
        const segments = WheelSegment.toWheelSegment(prizes);
        setWheelSegments(segments);
    }, [prizes])

    useEffect(() => {
        unReservePrizes()
        getPrizes();
    }, [loyaltyProgram?.loyaltyCurrency])

    useEffect(() => {
        if (isSubmitting) setIsPlaying(true);
    }, [isSubmitting])

    useEffect(() => {
        if (playingError) setIsPlaying(false);
    }, [playingError])

    useIonViewWillEnter(() => {
        addListener(
            gameContractAddress,
            gameContractAbi,
            'prizesSelected',
            listenerCallBack
        );

        const currentLoyaltyProgramId = id ?? '';
        if (loyaltyProgram && currentLoyaltyProgramId === loyaltyProgramId) getPrizes();

        setLoyaltyProgramId(currentLoyaltyProgramId);
    }, [id, defaultProgram, loyaltyProgram])

    useIonViewWillLeave(() => {
        if (!isPlaying) unReservePrizes();
        setIsPlaying(false);
    }, [gameToken, isPlaying])

    return (
        <IonPage>
            <TertiaryHeader title='Spin x10 - get 2 free spins' className='ion-text-center' />
            <IonHeader className='ion-no-border'>
                <IonToolbar className={styles.headerToolbar}>
                    <div className='flex-row-container ion-padding-horizontal'>
                        <ProgramSelection
                            options={programsOpts}
                            selectedValue={loyaltyProgram?.loyaltyCurrency?.shortName ?? ''}
                            onValueChange={handleSelectedValue} />
                        <PrimaryButton
                            customStyles={`${!uncollectedCreditsCount && !spinCredits && styles.spinButton} flex-row-1`}
                            onClick={uncollectedCreditsCount ? handlePlaying : showSpinCondition}
                            size='m'
                            disabled={isPlaying}>
                            {uncollectedCreditsCount && spinCredits ?
                                `spin! ${collectedCredits && collectedCredits + 1} of ${spinCredits}`
                                :
                                'spin!'}
                        </PrimaryButton>
                        {!uncollectedCreditsCount && !spinCredits &&
                            <SecondarySelect
                                required
                                disabled={isPlaying}
                                type="popover"
                                className={`${styles.spinSelect} flex-row-1`}
                                placeholder='multiple select'
                                name="spinCount"
                                onChange={(value) => setSpinCount(value.detail.value)}
                                value={spinCount}
                                options={spinCountOptions}
                            />
                        }
                    </div>
                </IonToolbar>
            </IonHeader>
            <PrimaryContainer className={styles.container} isRefreshable onRefresh={onRefresh}>
                {
                    !isLoadingPrizes && !loadingProgram ?
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
                                            spinDuration={0.3}
                                            data={wheelSegmentsOpts}
                                            spin={isPlaying}
                                            selectedPrizeId={selectedPrizeId}
                                            onClick={uncollectedCreditsCount ? handlePlaying : showSpinCondition}
                                            onStopSpinning={() => {
                                                setTimeout(() => {
                                                    showSuccessModal();
                                                    audio.play();
                                                }, 1000);
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
                            <PrimaryAccordion accordionItem={prizesOpts} />
                        </>
                        : <PageLoader />
                }
            </PrimaryContainer>
        </IonPage>
    )
}

export default Spinner;
