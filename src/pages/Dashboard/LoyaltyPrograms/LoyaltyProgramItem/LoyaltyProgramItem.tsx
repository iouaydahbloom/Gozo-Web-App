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
    displayCheckbox?: boolean
}

const LoyaltyProgramItem: React.FC<Props> = ({ loyaltyProgram, onSelection, displayCheckbox=false }) => {
    const { push } = useHistory();

    const [isSelected, setIsSelected] = useState(false);
    const { membership } = useMemberShip(loyaltyProgram?.currency.loyaltyCurrency);

    function spin() {
        push({ pathname: AppRoutes.spinner, search: `?program_id=${loyaltyProgram?.currency.programId}` })
    }

    return (
        <div className={styles.container}>
            <div className={styles.dataContainer}>
                {displayCheckbox &&
                    <PrimaryCheckbox value={isSelected} onChange={(selected) => {
                        setIsSelected(selected);
                        onSelection && onSelection(selected, loyaltyProgram)
                    }} />
                }

                <div>
                    <PrimaryTypography color='dark' isBold size='m'>{loyaltyProgram.currency.loyaltyCurrencyName}</PrimaryTypography>
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