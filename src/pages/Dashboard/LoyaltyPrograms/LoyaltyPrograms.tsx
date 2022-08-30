import { useEffect, useState } from 'react'
import { UserLoyaltyProgram, UserLoyaltyProgramCurrency } from '../../../models/loyaltyProgram';
import useMemberShip from '../../../hooks/useMembership';
import useAssets from '../../../hooks/useAssets';
import PrimaryButton from '../../../components/buttons/PrimaryButton/PrimaryButton';
import { IonIcon, useIonModal } from '@ionic/react';
import LoyaltyProgramsManager from './LoyaltyProgramsManager/LoyaltyProgramsManager';
import PrimaryTypography from '../../../components/typography/PrimaryTypography/PrimaryTypography';
import PrimaryButtonsGroup from '../../../components/buttons/PrimaryButtonsGroup/PrimaryButtonsGroup';
import { addOutline, swapHorizontalOutline, trashOutline } from "ionicons/icons";
import styles from './loyaltyPrograms.module.scss';
import LoyaltyProgramItem from './LoyaltyProgramItem/LoyaltyProgramItem';

const LoyaltyPrograms = () => {
    const [selectedProgram, setSelectedProgram] = useState<UserLoyaltyProgram>();
    const { getUserLoyaltyPrograms } = useAssets();
    const [loyaltyPrograms, setLoyaltyPrograms] = useState<UserLoyaltyProgram[]>([]);
    const { membership } = useMemberShip(selectedProgram?.currency.loyaltyCurrency);
    const [showManager] = useIonModal(LoyaltyProgramsManager);

    useEffect(() => {
        if (membership) alert(`${membership.loyaltyCurrency} Balance: ${membership.balance}`);
    }, [membership]);

    useEffect(() => {
        getUserLoyaltyPrograms()
            .then(programs => {
                setLoyaltyPrograms(programs);
            })
        // setLoyaltyPrograms([
        //     new UserLoyaltyProgram(new UserLoyaltyProgramCurrency('', '', '', new Date(), 1, '', ''), 0, [], new Date(), 1, 2),
        //     new UserLoyaltyProgram(new UserLoyaltyProgramCurrency('', '', '', new Date(), 1, '', ''), 0, [], new Date(), 1, 2),
        //     new UserLoyaltyProgram(new UserLoyaltyProgramCurrency('', '', '', new Date(), 1, '', ''), 0, [], new Date(), 1, 2)
        // ]);
    }, [])

    function showUpdate() {
        showManager({ initialBreakpoint: 0.90, breakpoints: [0, 0.25, 0.65, 0.90] })
    }

    const NoProgramsContainer = () => {
        return (
            <div className={styles.noDataContainer}>
                <PrimaryTypography customClassName={styles.center}>You have no loyalty programs added here yet</PrimaryTypography>
                <br /><br />
                <PrimaryButton onClick={showUpdate} size='m' expand='block'>
                    <IonIcon icon={addOutline} />
                    add loyalty programs
                </PrimaryButton>
            </div>
        )
    }

    return (
        <div className={`${styles.container} ${loyaltyPrograms.length == 0 ? styles.empty : ''}`}>
            {
                loyaltyPrograms.length > 0 ?
                    <>
                        <div className={styles.actions}>
                            <PrimaryButtonsGroup
                                buttons={[
                                    { title: 'Add', icon: <IonIcon icon={addOutline} />, onClick: showUpdate },
                                    { title: 'Swap', icon: <IonIcon icon={swapHorizontalOutline} />, onClick: () => null },
                                    { title: 'Remove', icon: <IonIcon icon={trashOutline} />, onClick: () => null }
                                ]}
                            />
                        </div>
                        {loyaltyPrograms.map((lp, index) => (
                            <LoyaltyProgramItem
                                key={index}
                                loyaltyProgram={lp} />
                        ))}
                    </> :
                    <NoProgramsContainer />
            }
        </div>
    )
}

export default LoyaltyPrograms;