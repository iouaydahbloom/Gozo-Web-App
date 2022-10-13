import { IonAvatar, IonIcon, IonItem, IonLabel, IonText } from '@ionic/react';
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
                    <PrimaryCheckbox value={isSelected} onChange={(selected) => {
                        setIsSelected(selected);
                        onSelection && onSelection(selected, loyaltyProgram)
                    }} />
                }
                <IonItem>
                    <IonAvatar slot="start">
                        <img alt="program logo" src={loyaltyProgram.currency.programLogo} />
                    </IonAvatar>
                    <IonLabel>
                        <IonLabel>
                            <PrimaryTypography color='light' isBold size='m'>{loyaltyProgram.currency.loyaltyCurrencyName}</PrimaryTypography>
                        </IonLabel>
                        <IonLabel>
                            <PrimaryTypography color='light' size='m' customClassName={styles.middleRow}><IonText color='medium-light'>Balance:</IonText> {membership?.balance} Miles</PrimaryTypography>
                        </IonLabel>
                        <IonLabel>
                            <PrimaryTypography color='light' size='m'><IonText color='medium-light'>Cost to Spin:</IonText> test points</PrimaryTypography>
                        </IonLabel>
                        <IonLabel>
                            <PrimaryTypography color='light' size='m'>{membership?.state}</PrimaryTypography>
                        </IonLabel>
                    </IonLabel>
                </IonItem >
                {loyaltyProgram.currency.isRedemption &&
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