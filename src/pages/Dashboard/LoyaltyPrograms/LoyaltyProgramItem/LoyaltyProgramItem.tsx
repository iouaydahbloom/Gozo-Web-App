import { IonCheckbox, IonIcon } from '@ionic/react';
import { banOutline } from 'ionicons/icons';
import React from 'react';
import PrimaryCheckbox from '../../../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import { UserLoyaltyProgram } from '../../../../models/loyaltyProgram';
import styles from './loyaltyProgramItem.module.scss';

interface Props {
    loyaltyProgram: UserLoyaltyProgram,
    onSelection?: (selected: boolean) => void
}

const LoyaltyProgramItem: React.FC<Props> = ({ loyaltyProgram, onSelection }) => {

    function spin() {
        console.log('spinning');
    }

    return (
        <div className={styles.container}>
            <div className={styles.dataContainer}>
                <PrimaryCheckbox onChange={onSelection} />
                <div>
                    <PrimaryTypography color='dark' isBold size='l'>Middle East</PrimaryTypography>
                    <PrimaryTypography color='dark' customClassName={styles.middleRow}>3 pts</PrimaryTypography>
                    <PrimaryTypography color='dark'>Valid until 27 August 2022</PrimaryTypography>
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.spinAction} onClick={spin}>
                    <div className={styles.spinIcon}>
                        <img src='assets/icon/Spin1.svg' />
                        <PrimaryTypography color='dark'>Spin</PrimaryTypography>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoyaltyProgramItem;