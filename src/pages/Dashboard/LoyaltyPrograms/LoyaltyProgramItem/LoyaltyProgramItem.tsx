import React, { useState } from 'react';
import PrimaryCheckbox from '../../../../components/inputs/PrimaryCheckbox/PrimaryCheckbox';
import PrimaryTypography from '../../../../components/typography/PrimaryTypography/PrimaryTypography';
import useMemberShip from '../../../../hooks/useMembership';
import { UserLoyaltyProgram } from '../../../../models/loyaltyProgram';
import styles from './loyaltyProgramItem.module.scss';

interface Props {
    loyaltyProgram: UserLoyaltyProgram,
    onSelection?: (selected: boolean, program: UserLoyaltyProgram) => void
}

const LoyaltyProgramItem: React.FC<Props> = ({ loyaltyProgram, onSelection }) => {

    const [isSelected, setIsSelected] = useState(false);
    const { membership } = useMemberShip(loyaltyProgram?.currency.loyaltyCurrency);

    function spin() {
        console.log('spinning');
    }

    return (
        <div className={styles.container}>
            <div className={styles.dataContainer}>
                <PrimaryCheckbox value={isSelected} onChange={(selected) => {
                    setIsSelected(selected);
                    onSelection && onSelection(selected, loyaltyProgram)
                }} />
                <div>
                    <PrimaryTypography color='dark' isBold size='l'>{loyaltyProgram.currency.loyaltyCurrencyName}</PrimaryTypography>
                    <PrimaryTypography color='dark' customClassName={styles.middleRow}>{membership?.balance} pts</PrimaryTypography>
                    <PrimaryTypography color='dark'>{membership?.state}</PrimaryTypography>
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