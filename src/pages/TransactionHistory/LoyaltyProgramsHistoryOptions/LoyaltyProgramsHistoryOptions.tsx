import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import React from 'react';
import PageLoader from '../../../components/loaders/PageLoader/PageLoader';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import { UserLoyaltyProgram } from '../../../models/loyaltyProgram';
import styles from './loyaltyProgramsHistoryOptions.module.scss';

interface Props {
    loading: boolean,
    loyaltyPrograms?: UserLoyaltyProgram[],
    onLoyaltyProgramSelected?: (loyaltyProgram: UserLoyaltyProgram) => void
}

const LoyaltyProgramsHistoryOptions: React.FC<Props> = ({ loading, loyaltyPrograms = [], onLoyaltyProgramSelected }) => {
    return (
        <>
            {
                loading ?
                    <PageLoader /> :
                    <IonGrid>
                        {loyaltyPrograms.map((lp, index) => (
                            <IonRow
                                key={index}
                                className={styles.item}
                                onClick={() => onLoyaltyProgramSelected && onLoyaltyProgramSelected(lp)}>
                                <IonCol size='9'>
                                    <div className={styles.id}>
                                        <img alt='' src={lp.currency.programLogo} className={styles.logo} />
                                        <div className={styles.text}>
                                            <PrimaryTypography isBold>{lp.currency.loyaltyCurrencyName}</PrimaryTypography>
                                            <PrimaryTypography size='s'>Transactions</PrimaryTypography>
                                        </div>
                                    </div>
                                </IonCol>

                                <IonCol size='3'>
                                    <PrimaryTypography customClassName={styles.go}>
                                        <IonIcon icon={chevronForwardOutline} className={styles.icon} />
                                    </PrimaryTypography>
                                </IonCol>
                            </IonRow>
                        ))}
                    </IonGrid>
            }
        </>
    )
}

export default LoyaltyProgramsHistoryOptions