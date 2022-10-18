import { IonAvatar, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
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
    const { membership } = useMemberShip(loyaltyProgram?.currency.loyaltyCurrency);

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
                <IonItem>
                    <IonAvatar slot="start">
                        <img className={styles.logo} src={loyaltyProgram.currency.programLogo ? loyaltyProgram.currency.programLogo : "assets/image/image-placeholder.svg"} />
                    </IonAvatar>
                    <IonLabel>
                        <IonLabel >
                            <PrimaryTypography color='light' isBold size='m'>{loyaltyProgram.currency.loyaltyCurrencyName}</PrimaryTypography>
                        </IonLabel>
                        <IonLabel className={styles.balanceRow}>
                            <IonText color='medium-light'>Balance:</IonText>
                            <PrimaryTypography color='light' size='m'>{membership?.balance} Miles</PrimaryTypography>
                        </IonLabel>
                        <IonLabel className={styles.costRow}>
                            <IonText color='medium-light'>Cost to Spin:</IonText>
                            <PrimaryTypography color='light' size='m'>{loyaltyProgram.redemption?.spinCost ? loyaltyProgram.redemption?.spinCost : 0} Units</PrimaryTypography>
                        </IonLabel>
                        <IonLabel className={styles.status}>
                            {membership ?
                                <>
                                    <IonIcon icon={ellipse} color="success" />
                                    <PrimaryTypography color='success' size='m'>Connected</PrimaryTypography>
                                </>
                                :
                                <>
                                    <IonIcon icon={ellipse} color="danger" />
                                    <PrimaryTypography color='danger' size='m'>Disconnected</PrimaryTypography>
                                </>

                            }

                        </IonLabel>
                    </IonLabel>
                </IonItem >
                {loyaltyProgram.redemption?.isSufficient &&
                    <div>
                        <div className={styles.spinAction} onClick={spin}>
                            <div className={styles.spinIcon}>
                                <IonIcon color="light" size="large" icon='assets/icon/Spin1.svg' />
                                <PrimaryTypography color='light'>Spin</PrimaryTypography>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default LoyaltyProgramItem;