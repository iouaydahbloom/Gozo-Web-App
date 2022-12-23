import { IonAvatar, IonIcon, IonItem, IonLabel, IonSpinner, IonText } from '@ionic/react';
import { ellipse } from 'ionicons/icons';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import PrimaryCheckbox from '../../../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import { AppRoutes } from '../../../../constants/appRoutes';
import useMemberShip from '../../../../hooks/useMembership';
import { UserLoyaltyProgram } from '../../../../models/loyaltyProgram';
import styles from './loyaltyProgramItem.module.scss';

interface Props {
    loyaltyProgram: UserLoyaltyProgram,
    onSelection?: (selected: boolean, program: UserLoyaltyProgram) => void,
    isSelectable?: boolean
}

const LoyaltyProgramItem: React.FC<Props> = ({ loyaltyProgram, onSelection, isSelectable = false }) => {
    const { push } = useHistory();

    const [isSelected, setIsSelected] = useState(false);
    const { membership, isLoading: isLoadingMembership } = useMemberShip(loyaltyProgram?.currency.loyaltyCurrency);

    function spin() {
        push({ pathname: AppRoutes.spinner, search: `?program_id=${loyaltyProgram?.currency.programId}` })
    }

    return (
        <div className={styles.container}>
            <div className={styles.dataContainer}>
                {isSelectable &&
                    <div className={styles.selectionContainer}>
                        <PrimaryCheckbox value={isSelected} onChange={(selected) => {
                            setIsSelected(selected);
                            onSelection && onSelection(selected, loyaltyProgram)
                        }} />
                    </div>
                }
                <div className={`ellipsis ${styles.startSlot}`}>
                    <div className={styles.id}>
                        <IonAvatar slot="start" className={styles.logo}>
                            <img alt='' src={loyaltyProgram.currency.programLogo ? loyaltyProgram.currency.programLogo : "assets/image/image-placeholder.svg"} />
                        </IonAvatar>
                        <div className={styles.mainInfo}>
                            <IonLabel color='light'>
                                <PrimaryTypography color='light' isBlock={false} isBold size='m'>{loyaltyProgram.currency.loyaltyCurrencyName}</PrimaryTypography>
                            </IonLabel>
                            <IonLabel className={styles.status}>
                                {
                                    isLoadingMembership ?
                                        <IonSpinner color='light' className={styles.loader} />
                                        :
                                        membership ?
                                            <>
                                                <IonIcon icon={ellipse} color="success" />
                                                <PrimaryTypography color='success' customClassName='ellipsis' size='m'>Connected</PrimaryTypography>
                                            </>
                                            :
                                            <>
                                                <IonIcon icon={ellipse} color="danger" />
                                                <PrimaryTypography color='danger' customClassName='ellipsis' size='m'>Disconnected</PrimaryTypography>
                                            </>
                                }
                            </IonLabel>
                        </div>

                    </div >
                    <div className={styles.detailWrapper}>
                        <IonLabel className={styles.balanceRow}>
                            <IonText color='medium-light'>Bal.</IonText>
                            <PrimaryTypography color='light' customClassName='ellipsis' size='m'>{membership?.balance} Units</PrimaryTypography>
                        </IonLabel>
                        <IonLabel className={styles.spinInfoRow}>
                            {
                                loyaltyProgram.redemption ?
                                    <>
                                        <IonText color='medium-light'>Cost to Spin:</IonText>
                                        <PrimaryTypography color='light' customClassName='ellipsis' size='m'>
                                            {loyaltyProgram.redemption?.spinCost ? loyaltyProgram.redemption?.spinCost : 0} Units
                                        </PrimaryTypography>
                                    </>
                                    :
                                    <PrimaryTypography color='medium-light' customClassName='ellipsis' size='m'>
                                        *This program does not offer spinning
                                    </PrimaryTypography>
                            }
                        </IonLabel>
                    </div>
                </div>

                <div>
                    {
                        loyaltyProgram.redemption &&
                        <div className={styles.spinAction} onClick={loyaltyProgram.redemption?.isSufficient ? spin : () => { }}>
                            <div className={styles.actionItem}>
                                {loyaltyProgram.redemption?.isSufficient ?
                                    <>
                                        <IonIcon
                                            color="light"
                                            size="large"
                                            icon='assets/icon/Spin1.svg' />
                                        <PrimaryTypography color='light'>Spin</PrimaryTypography>
                                    </>
                                    :
                                    <>
                                        <IonIcon
                                            color="slightly-light"
                                            size="large"
                                            icon='assets/icon/no-credit-icon.svg'
                                            className={styles.noCredits} />
                                        <PrimaryTypography isBlock={false} color='slightly-light'>Not enough credits</PrimaryTypography>
                                    </>
                                }
                            </div>
                        </div>
                    }
                </div>

            </div>
        </div>
    )
}

export default LoyaltyProgramItem;